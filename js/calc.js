/* calc.js — funções puras: datas, números, resumos financeiros, estoque, calculadora de preços e CSV.
   Não depende do navegador, o que permite testar tudo em Node. */
(function (global) {
  'use strict';
  const SL = (global.SL = global.SL || {});

  /* ---------- Números ---------- */
  const num = {
    round2(x) { return Math.round((Number(x) + Number.EPSILON) * 100) / 100; },
    round4(x) { return Math.round((Number(x) + Number.EPSILON) * 10000) / 10000; },
    // Aceita "12,50", "1.234,56", "R$ 10", 10 → number (ou NaN)
    parseMoney(v) {
      if (typeof v === 'number') return Number.isFinite(v) ? v : NaN;
      let s = String(v == null ? '' : v).trim().replace(/R\$\s?/i, '').replace(/\s/g, '');
      if (s === '') return NaN;
      if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) s = s.replace(/\./g, '').replace(',', '.');
      else if (s.indexOf(',') !== -1) s = s.replace(',', '.');
      if (!/^-?\d+(\.\d+)?$/.test(s)) return NaN;
      return Number(s);
    },
    parseIntStrict(v) {
      const s = String(v == null ? '' : v).trim();
      if (!/^\d+$/.test(s)) return NaN;
      return Number(s);
    },
  };

  /* ---------- Datas (sempre 'AAAA-MM-DD', fuso local) ---------- */
  const pad = (n) => String(n).padStart(2, '0');
  const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const dates = {
    fmt(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); },
    parse(s) { const p = s.split('-').map(Number); return new Date(p[0], p[1] - 1, p[2]); },
    today(now) { return dates.fmt(now || new Date()); },
    isValid(s) {
      if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
      return dates.fmt(dates.parse(s)) === s;
    },
    addDays(s, n) { const d = dates.parse(s); d.setDate(d.getDate() + n); return dates.fmt(d); },
    startOfWeek(s) { const d = dates.parse(s); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return dates.fmt(d); },
    startOfMonth(s) { return s.slice(0, 8) + '01'; },
    endOfMonth(s) { const d = dates.parse(s); return dates.fmt(new Date(d.getFullYear(), d.getMonth() + 1, 0)); },
    startOfYear(s) { return s.slice(0, 4) + '-01-01'; },
    br(s) { return s ? s.slice(8, 10) + '/' + s.slice(5, 7) + '/' + s.slice(0, 4) : ''; },
    short(s) { return s.slice(8, 10) + '/' + s.slice(5, 7); },
    monthLabel(key) { return MESES[Number(key.slice(5, 7)) - 1] + '/' + key.slice(2, 4); },
    diffDays(a, b) { return Math.round((dates.parse(b) - dates.parse(a)) / 86400000); },
  };

  const PRESETS = [
    ['hoje', 'Hoje'], ['7d', 'Últimos 7 dias'], ['30d', 'Últimos 30 dias'],
    ['mes', 'Mês atual'], ['ano', 'Ano atual'], ['custom', 'Período personalizado'],
  ];
  function presetRange(name, today) {
    today = today || dates.today();
    switch (name) {
      case 'hoje': return { from: today, to: today };
      case '7d': return { from: dates.addDays(today, -6), to: today };
      case '30d': return { from: dates.addDays(today, -29), to: today };
      case 'mes': return { from: dates.startOfMonth(today), to: today };
      case 'ano': return { from: dates.startOfYear(today), to: today };
      default: return null;
    }
  }
  const inRange = (d, from, to) => (!from || d >= from) && (!to || d <= to);

  /* ---------- Vendas: concluídas × encomendas pendentes ----------
     Só a venda concluída entra em faturamento, lucro e estoque. */
  const isDone = (s) => s.status !== 'encomenda';

  /* ---------- Resumo financeiro ----------
     faturamento     = soma das vendas concluídas
     lucro bruto     = faturamento − custo dos salgados vendidos (custo unitário gravado na venda)
     lucro estimado  = faturamento − despesas do período */
  function summarize(data, from, to) {
    const sales = (data.sales || []).filter((s) => isDone(s) && inRange(s.date, from, to));
    const prods = (data.productions || []).filter((s) => inRange(s.date, from, to));
    const exps = (data.expenses || []).filter((s) => inRange(s.date, from, to));
    const orders = (data.sales || []).filter((s) => !isDone(s));
    let revenue = 0, cogs = 0, unitsSold = 0, produced = 0, productionCost = 0, expenses = 0;
    sales.forEach((s) => { revenue += s.total; cogs += s.qty * (s.unitCost || 0); unitsSold += s.qty; });
    prods.forEach((p) => { produced += p.qty; productionCost += p.totalCost || 0; });
    exps.forEach((e) => { expenses += e.amount; });
    revenue = num.round2(revenue); cogs = num.round2(cogs); expenses = num.round2(expenses);
    return {
      revenue, cogs, grossProfit: num.round2(revenue - cogs),
      expenses, estimatedProfit: num.round2(revenue - expenses),
      unitsSold, produced, productionCost: num.round2(productionCost),
      salesCount: sales.length, ticket: sales.length ? num.round2(revenue / sales.length) : 0,
      pendingOrders: orders.length, pendingValue: num.round2(orders.reduce((a, s) => a + s.total, 0)),
    };
  }

  /* Séries para os gráficos: gran = 'day' | 'week' | 'month' */
  function bucketKey(date, gran) {
    if (gran === 'week') return dates.startOfWeek(date);
    if (gran === 'month') return date.slice(0, 7);
    return date;
  }
  function series(data, gran, from, to) {
    const keys = [];
    for (let d = from; d <= to; d = dates.addDays(d, 1)) {
      const k = bucketKey(d, gran);
      if (keys[keys.length - 1] !== k) keys.push(k);
    }
    const rev = {}, exp = {};
    keys.forEach((k) => { rev[k] = 0; exp[k] = 0; });
    (data.sales || []).forEach((s) => { if (isDone(s) && inRange(s.date, from, to)) rev[bucketKey(s.date, gran)] += s.total; });
    (data.expenses || []).forEach((e) => { if (inRange(e.date, from, to)) exp[bucketKey(e.date, gran)] += e.amount; });
    const labels = keys.map((k) => gran === 'month' ? dates.monthLabel(k) : gran === 'week' ? 'Sem ' + dates.short(k) : dates.short(k));
    return { keys, labels, revenue: keys.map((k) => num.round2(rev[k])), expenses: keys.map((k) => num.round2(exp[k])) };
  }

  function topProducts(sales, from, to, limit) {
    const map = new Map();
    sales.filter((s) => isDone(s) && inRange(s.date, from, to)).forEach((s) => {
      const key = s.productId != null ? 'p' + s.productId : 'n' + s.productName;
      const cur = map.get(key) || { name: s.productName, qty: 0, revenue: 0, profit: 0 };
      cur.name = s.productName; cur.qty += s.qty; cur.revenue += s.total; cur.profit += s.profit || 0;
      map.set(key, cur);
    });
    const list = Array.from(map.values()).map((x) => ({ name: x.name, qty: x.qty, revenue: num.round2(x.revenue), profit: num.round2(x.profit) }));
    list.sort((a, b) => b.qty - a.qty || b.revenue - a.revenue);
    return limit ? list.slice(0, limit) : list;
  }
  function mostProfitable(sales, from, to, limit) {
    const list = topProducts(sales, from, to, 0);
    list.sort((a, b) => b.profit - a.profit || b.qty - a.qty);
    return limit ? list.slice(0, limit) : list;
  }

  function expensesByCategory(expenses, from, to) {
    const map = {};
    expenses.filter((e) => inRange(e.date, from, to)).forEach((e) => { map[e.category] = (map[e.category] || 0) + e.amount; });
    return Object.keys(map).map((k) => ({ category: k, amount: num.round2(map[k]) })).sort((a, b) => b.amount - a.amount);
  }
  function salesByPayment(sales, from, to) {
    const map = {};
    sales.filter((s) => isDone(s) && inRange(s.date, from, to)).forEach((s) => { map[s.payment] = (map[s.payment] || 0) + s.total; });
    return Object.keys(map).map((k) => ({ payment: k, amount: num.round2(map[k]) })).sort((a, b) => b.amount - a.amount);
  }

  /* ---------- Estoque ---------- */
  const stockTotal = (p) => (p.stockReady || 0) + (p.stockFrozen || 0);
  const lowStock = (products) => products.filter((p) => p.minStock > 0 && stockTotal(p) <= p.minStock)
    .sort((a, b) => stockTotal(a) - stockTotal(b));

  // Lotes derivados do histórico (FIFO): as saídas consomem as entradas mais antigas primeiro.
  function batches(moves, productId, kind) {
    const mine = moves.filter((m) => m.productId === productId && m.kind === kind)
      .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.id - b.id));
    let out = mine.filter((m) => m.delta < 0).reduce((a, m) => a - m.delta, 0);
    const res = [];
    mine.filter((m) => m.delta > 0).forEach((m) => {
      const used = Math.min(out, m.delta); out -= used;
      const left = m.delta - used;
      if (left > 0) res.push({ moveId: m.id, date: m.date, expiry: m.expiry || '', qty: left, kind });
    });
    return res;
  }
  // Lotes com validade vencida (days < 0) ou vencendo em até `warnDays` dias.
  function expiryAlerts(moves, products, today, warnDays) {
    const res = [];
    products.forEach((p) => {
      ['ready', 'frozen'].forEach((kind) => {
        batches(moves, p.id, kind).forEach((b) => {
          if (!b.expiry) return;
          const days = dates.diffDays(today, b.expiry);
          if (days <= warnDays) res.push({ productId: p.id, productName: p.name, kind, qty: b.qty, expiry: b.expiry, days });
        });
      });
    });
    return res.sort((a, b) => a.days - b.days);
  }
  // Confere se o saldo de cada produto bate com a soma do histórico. Retorna lista de problemas.
  function stockProblems(products, moves) {
    const sum = {};
    moves.forEach((m) => { const k = m.productId + ':' + m.kind; sum[k] = (sum[k] || 0) + m.delta; });
    const bad = [];
    products.forEach((p) => {
      if ((sum[p.id + ':ready'] || 0) !== (p.stockReady || 0)) bad.push(p.name + ' (prontos)');
      if ((sum[p.id + ':frozen'] || 0) !== (p.stockFrozen || 0)) bad.push(p.name + ' (congelados)');
    });
    return bad;
  }

  /* ---------- Custo por ingrediente ----------
     Converte para uma base (g, ml ou un) e calcula quanto custa a quantidade usada. */
  const UNITS = {
    g: { base: 'g', f: 1, label: 'g' }, kg: { base: 'g', f: 1000, label: 'kg' },
    ml: { base: 'ml', f: 1, label: 'ml' }, l: { base: 'ml', f: 1000, label: 'litro' },
    un: { base: 'un', f: 1, label: 'unidade' }, dz: { base: 'un', f: 12, label: 'dúzia' },
  };
  function ingredientCost(line) {
    const errors = {};
    const used = num.parseMoney(line.qty), packQty = num.parseMoney(line.packQty), price = num.parseMoney(line.packPrice);
    const uu = UNITS[line.unit], pu = UNITS[line.packUnit];
    if (!(used > 0)) errors.qty = 'Informe a quantidade usada.';
    if (!(packQty > 0)) errors.packQty = 'Informe a quantidade da embalagem comprada.';
    if (!(price >= 0)) errors.packPrice = 'Informe o preço pago.';
    if (!uu || !pu) errors.unit = 'Escolha a unidade.';
    else if (uu.base !== pu.base) errors.unit = 'Unidades incompatíveis (ex.: não dá para converter g em litro).';
    if (Object.keys(errors).length) return { ok: false, errors };
    const cost = (used * uu.f) / (packQty * pu.f) * price;
    return { ok: true, cost: num.round2(cost) };
  }
  function ingredientsTotal(lines) {
    let total = 0; const errors = [];
    lines.forEach((l, i) => { const r = ingredientCost(l); if (r.ok) total += r.cost; else errors[i] = r.errors; });
    return { total: num.round2(total), errors };
  }

  /* ---------- Calculadora de preços ----------
     modo 'margin': margem sobre o preço de venda (preço = custo ÷ (1 − margem))
     modo 'markup': acréscimo sobre o custo     (preço = custo × (1 + margem)) */
  function priceCalc(i) {
    const errors = {};
    const qty = num.parseIntStrict(i.qty);
    const ingredients = num.parseMoney(i.ingredients);
    const optional = (v) => (v === '' || v == null ? 0 : num.parseMoney(v));
    const packaging = optional(i.packaging), other = optional(i.other), planned = optional(i.plannedPrice);
    const margin = num.parseMoney(i.margin);
    const mode = i.mode === 'markup' ? 'markup' : 'margin';
    if (!(qty >= 1)) errors.qty = 'Informe quantos salgados a receita rende (número inteiro, mínimo 1).';
    if (!(ingredients >= 0)) errors.ingredients = 'Informe o custo dos ingredientes (pode ser 0).';
    if (Number.isNaN(packaging) || packaging < 0) errors.packaging = 'Valor inválido.';
    if (Number.isNaN(other) || other < 0) errors.other = 'Valor inválido.';
    if (Number.isNaN(planned) || planned < 0) errors.plannedPrice = 'Valor inválido.';
    if (!(margin >= 0)) errors.margin = 'Informe a margem desejada (0 ou mais).';
    else if (mode === 'margin' && margin >= 100) errors.margin = 'A margem sobre o preço precisa ser menor que 100%.';
    else if (margin > 1000) errors.margin = 'Margem muito alta. Confira o valor.';
    if (!errors.qty && !errors.ingredients && !errors.packaging && !errors.other && ingredients + packaging + other <= 0) {
      errors.ingredients = 'O custo total precisa ser maior que zero.';
    }
    if (Object.keys(errors).length) return { ok: false, errors };

    const totalCost = ingredients + packaging + other;
    const unitCost = totalCost / qty;
    const raw = mode === 'margin' ? unitCost / (1 - margin / 100) : unitCost * (1 + margin / 100);
    const recommended = Math.ceil(raw * 100 - 1e-9) / 100;
    const rounded = Math.ceil(recommended * 10 - 1e-9) / 10;
    const price = planned > 0 ? planned : recommended;
    const profitUnit = price - unitCost;
    const revenue = price * qty;
    return {
      ok: true, qty, totalCost: num.round2(totalCost), unitCost: num.round2(unitCost), unitCostExact: num.round4(unitCost),
      recommended: num.round2(recommended), rounded: num.round2(rounded), price: num.round2(price),
      usingPlanned: planned > 0, mode, margin,
      profitUnit: num.round2(profitUnit),
      marginReal: price > 0 ? num.round2((profitUnit / price) * 100) : 0,
      markupReal: unitCost > 0 ? num.round2((profitUnit / unitCost) * 100) : 0,
      revenue: num.round2(revenue),
      grossProfit: num.round2(revenue - (ingredients + packaging)),
      estimatedProfit: num.round2(revenue - totalCost),
      ingredients: num.round2(ingredients), packaging: num.round2(packaging), other: num.round2(other),
    };
  }

  /* ---------- CSV (padrão brasileiro: ; e vírgula decimal; BOM é adicionado no download) ---------- */
  function csvCell(v) {
    if (v == null) return '';
    if (typeof v === 'number') return String(v).replace('.', ',');
    let s = String(v);
    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; // evita injeção de fórmulas no Excel
    if (/[";\n\r]/.test(s)) s = '"' + s.replace(/"/g, '""') + '"';
    return s;
  }
  function toCSV(headers, rows) {
    return [headers].concat(rows).map((r) => r.map(csvCell).join(';')).join('\r\n');
  }

  SL.num = num; SL.dates = dates; SL.PRESETS = PRESETS; SL.UNITS = UNITS;
  SL.calc = {
    presetRange, inRange, isDone, summarize, series, topProducts, mostProfitable, expensesByCategory, salesByPayment,
    stockTotal, lowStock, batches, expiryAlerts, stockProblems, ingredientCost, ingredientsTotal, priceCalc, toCSV, csvCell,
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
