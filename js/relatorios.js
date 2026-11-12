/* relatorios.js — filtros (período, produto, categoria), resumo, mais vendidos/lucrativos, evolução e CSV */
(function () {
  'use strict';
  const { icon, esc, money, int, signed, $, $$ } = SL.ui;
  let data, full, range = null, gran = 'day';

  // Aplica os filtros de produto e categoria a todos os dados
  function filtered() {
    const pid = $('#r-prod').value, cat = $('#r-cat').value;
    const byProd = new Map(full.products.map((p) => [p.id, p]));
    const ok = (x) => (!pid || x.productId === Number(pid)) && (!cat || (byProd.get(x.productId) || {}).category === cat);
    return { products: full.products, sales: full.sales.filter(ok), productions: full.productions.filter(ok), expenses: full.expenses, stock: full.stock.filter(ok) };
  }
  const inR = (x) => SL.calc.inRange(x.date, range.from, range.to);
  const asc = (a, b) => a.date.localeCompare(b.date) || a.id - b.id;
  const rows = {
    vendas: () => data.sales.filter((x) => x.status !== 'encomenda' && inR(x)).sort(asc),
    encomendas: () => data.sales.filter((x) => x.status === 'encomenda').sort((a, b) => a.deliveryDate.localeCompare(b.deliveryDate)),
    producao: () => data.productions.filter(inR).sort(asc),
    despesas: () => data.expenses.filter(inR).sort(asc),
    estoque: () => data.stock.filter(inR).sort(asc),
  };

  function barList(list, valueOf, label) {
    const max = list.length ? Math.max.apply(null, list.map(valueOf).concat([1])) : 1;
    return '<div class="bars">' + list.map((t, i) => '<div class="bar-row"><span><span class="rank">' + (i + 1) + '</span>' + esc(t.name) + '</span><div class="bar-track"><div class="bar-fill" style="width:' + Math.max(5, (Math.max(valueOf(t), 0) / max) * 100) + '%"></div></div><b>' + label(t) + '</b></div>').join('') + '</div>';
  }

  function render() {
    range = SL.ui.readPeriod('r', $('#period-row'));
    if (!range || range.error) { $('#period-msg').innerHTML = range ? '<div class="alert bad">' + icon('alert') + '<span>' + esc(range.error) + '</span></div>' : ''; $('#report').hidden = true; return; }
    $('#period-msg').innerHTML = '<p class="muted small" style="margin:0">Período: ' + SL.dates.br(range.from) + ' até ' + SL.dates.br(range.to) + '</p>';
    $('#report').hidden = false; data = filtered();
    const s = SL.calc.summarize(data, range.from, range.to);
    $('#cards').innerHTML =
      SL.ui.stat('Total vendido', money(s.revenue), { icon: 'dollar', tone: 'gold', note: s.salesCount + ' venda(s) · ' + int(s.unitsSold) + ' salgados' }) +
      SL.ui.stat('Total produzido', int(s.produced), { icon: 'flame', note: 'custo ' + money(s.productionCost) }) +
      SL.ui.stat('Total de despesas', money(s.expenses), { icon: 'wallet', tone: 'red', note: ($('#r-prod').value || $('#r-cat').value) ? 'despesas não dependem do filtro de produto' : '' }) +
      SL.ui.stat('Lucro estimado', money(s.estimatedProfit), { icon: 'trend', tone: s.estimatedProfit >= 0 ? 'green' : 'red', note: 'faturamento − despesas · lucro bruto ' + money(s.grossProfit) });
    SL.charts.revenue('ch-rev', SL.calc.series(data, gran, range.from, range.to), true);

    const top = SL.calc.topProducts(data.sales, range.from, range.to, 8);
    $('#top').innerHTML = top.length ? barList(top, (t) => t.qty, (t) => int(t.qty) + ' un.') + '<p class="muted small" style="margin-top:12px">Ordenados pela quantidade vendida.</p>' : '<p class="muted center" style="padding:30px 0">Sem vendas neste período.</p>';
    const prof = SL.calc.mostProfitable(data.sales, range.from, range.to, 8);
    $('#profit').innerHTML = prof.length ? barList(prof, (t) => t.profit, (t) => money(t.profit)) + '<p class="muted small" style="margin-top:12px">Lucro bruto = vendas − custo dos salgados vendidos.</p>' : '<p class="muted center" style="padding:24px 0">Sem vendas neste período.</p>';

    const sales = rows.vendas().reverse();
    $('#sales-list').innerHTML = sales.length ? '<div class="table-wrap"><table class="stack"><thead><tr><th>Data</th><th>Produto</th><th>Cliente</th><th class="num">Qtd.</th><th class="num">Total</th><th class="num">Resultado</th><th>Pagamento</th></tr></thead><tbody>' +
      sales.slice(0, 500).map((x) => '<tr><td data-label="Data">' + SL.dates.br(x.date) + '</td><td data-label="Produto">' + esc(x.productName) + '</td><td data-label="Cliente">' + (esc(x.customer) || '—') + '</td><td class="num" data-label="Qtd.">' + int(x.qty) + '</td><td class="num" data-label="Total">' + money(x.total) + '</td><td class="num" data-label="Resultado">' + signed(x.profit) + '</td><td data-label="Pagamento">' + esc(x.payment) + '</td></tr>').join('') +
      '</tbody></table></div>' + (sales.length > 200 ? '<p class="muted small">Mostrando as 200 vendas mais recentes. O CSV traz todas.</p>' : '') : '<p class="muted center" style="padding:24px 0">Sem vendas neste período.</p>';
  }

  const kindName = (k) => (k === 'frozen' ? 'Congelado' : 'Pronto');
  function exportCSV(kind) {
    if (!range || range.error) { SL.ui.toast('Escolha um período válido antes de exportar.', 'err'); return; }
    const tag = range.from + '_a_' + range.to, dl = SL.ui.downloadCSV;
    if (kind === 'resumo') {
      const s = SL.calc.summarize(data, range.from, range.to), top = SL.calc.topProducts(data.sales, range.from, range.to);
      const body = [['Período', SL.dates.br(range.from) + ' a ' + SL.dates.br(range.to)], ['Total vendido (R$)', s.revenue], ['Vendas (quantidade)', s.salesCount], ['Salgados vendidos', s.unitsSold], ['Salgados produzidos', s.produced], ['Custo da produção (R$)', s.productionCost], ['Custo dos salgados vendidos (R$)', s.cogs], ['Lucro bruto (R$)', s.grossProfit], ['Total de despesas (R$)', s.expenses], ['Lucro estimado (R$)', s.estimatedProfit], ['Encomendas pendentes', s.pendingOrders], ['', ''], ['Produto', 'Quantidade / Faturamento (R$) / Lucro bruto (R$)']]
        .concat(top.map((t) => [t.name, t.qty + ' un. / ' + String(t.revenue).replace('.', ',') + ' / ' + String(t.profit).replace('.', ',')]));
      dl('resumo_' + tag + '.csv', ['Indicador', 'Valor'], body);
    } else if (kind === 'vendas') {
      dl('vendas_' + tag + '.csv', ['Data', 'Produto', 'Cliente', 'Quantidade', 'Valor unitário (R$)', 'Total (R$)', 'Custo unitário (R$)', 'Resultado estimado (R$)', 'Pagamento', 'Observações'], rows.vendas().map((x) => [SL.dates.br(x.date), x.productName, x.customer, x.qty, x.unitPrice, x.total, x.unitCost, x.profit, x.payment, x.notes]));
    } else if (kind === 'encomendas') {
      dl('encomendas_pendentes.csv', ['Pedido em', 'Entrega', 'Produto', 'Cliente', 'Quantidade', 'Valor unitário (R$)', 'Total (R$)', 'Observações'], rows.encomendas().map((x) => [SL.dates.br(x.date), SL.dates.br(x.deliveryDate), x.productName, x.customer, x.qty, x.unitPrice, x.total, x.notes]));
    } else if (kind === 'producao') {
      dl('producao_' + tag + '.csv', ['Data', 'Produto', 'Quantidade', 'Estoque', 'Ingredientes (R$)', 'Embalagens (R$)', 'Outros custos (R$)', 'Custo total (R$)', 'Custo unitário (R$)', 'Validade'], rows.producao().map((x) => [SL.dates.br(x.date), x.productName, x.qty, kindName(x.kind), x.ingredientsCost, x.packagingCost, x.otherCost, x.totalCost, SL.num.round2(x.totalCost / x.qty), x.expiry ? SL.dates.br(x.expiry) : '']));
    } else if (kind === 'estoque') {
      dl('movimentacoes_estoque_' + tag + '.csv', ['Data', 'Produto', 'Tipo', 'Estoque', 'Quantidade', 'Motivo', 'Validade'], rows.estoque().map((x) => [SL.dates.br(x.date), x.productName, x.type, kindName(x.kind), x.delta, x.reason, x.expiry ? SL.dates.br(x.expiry) : '']));
    } else {
      dl('despesas_' + tag + '.csv', ['Data', 'Descrição', 'Categoria', 'Valor (R$)', 'Observação'], rows.despesas().map((x) => [SL.dates.br(x.date), x.description, x.category, x.amount, x.notes]));
    }
    SL.ui.toast('Arquivo CSV gerado. Confira a pasta de downloads.', 'ok');
  }

  SL.ui.boot(async function () {
    full = await SL.db.loadAll();
    $('#period-row').innerHTML = SL.ui.periodPicker('r');
    $('#r-prod').innerHTML = SL.ui.options(full.products.slice().sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')).map((p) => [p.id, p.name]), '', 'Todos os produtos');
    $('#r-cat').innerHTML = SL.ui.options(SL.CATEGORIES, '', 'Todas as categorias');
    const labels = { resumo: 'Resumo', vendas: 'Vendas', encomendas: 'Encomendas pendentes', producao: 'Produção', despesas: 'Despesas', estoque: 'Movimentações de estoque' };
    $$('[data-exp]').forEach((b) => { b.innerHTML = icon('download') + ' ' + labels[b.dataset.exp]; });
    $('#r-p').value = '30d';
    $('#r-p').addEventListener('change', () => {
      if ($('#r-p').value === 'custom' && !$('#r-f').value) { const r = SL.calc.presetRange('30d'); $('#r-f').value = r.from; $('#r-t').value = r.to; }
      render();
    });
    ['#r-f', '#r-t', '#r-prod', '#r-cat'].forEach((s) => $(s).addEventListener('change', render));
    $('#gran').addEventListener('click', (e) => {
      const b = e.target.closest('button[data-g]'); if (!b) return;
      gran = b.dataset.g; $$('#gran button').forEach((x) => x.classList.toggle('on', x === b)); render();
    });
    $('#content').addEventListener('click', (e) => { const b = e.target.closest('[data-exp]'); if (b) exportCSV(b.dataset.exp); });
    render();
  });
})();
