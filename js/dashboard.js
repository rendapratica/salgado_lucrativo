/* dashboard.js — painel principal: indicadores, período, gráficos e estoque */
(function () {
  'use strict';
  const { icon, esc, money, int, pct, $, $$ } = SL.ui;
  let data, gran = 'day', range = null;

  function topCards() {
    const t = SL.dates.today();
    const day = SL.calc.summarize(data, t, t), week = SL.calc.summarize(data, SL.dates.startOfWeek(t), t), month = SL.calc.summarize(data, SL.dates.startOfMonth(t), t);
    $('#top-cards').innerHTML =
      SL.ui.stat('Faturamento do dia', money(day.revenue), { icon: 'cart', tone: 'feature', note: day.salesCount + ' venda(s) · ' + int(day.unitsSold) + ' salgados' }) +
      SL.ui.stat('Faturamento da semana', money(week.revenue), { icon: 'calendar', tone: 'gold', note: 'desde segunda-feira · ' + week.salesCount + ' venda(s)' }) +
      SL.ui.stat('Faturamento do mês', money(month.revenue), { icon: 'trend', tone: 'gold', note: month.salesCount + ' venda(s) · ticket médio ' + money(month.ticket) });
  }

  // Cartões do período escolhido. Devolve false se o período for inválido.
  function periodCards() {
    const r = range;
    if (!r || r.error) {
      $('#period-msg').innerHTML = r ? '<div class="alert bad">' + icon('alert') + '<span>' + esc(r.error) + '</span></div>' : '';
      $('#period-cards').innerHTML = '';
      return false;
    }
    $('#period-msg').innerHTML = '<p class="muted small" style="margin-top:-6px">De ' + SL.dates.br(r.from) + ' até ' + SL.dates.br(r.to) + '</p>';
    const s = SL.calc.summarize(data, r.from, r.to), stock = data.products.reduce((a, p) => a + SL.calc.stockTotal(p), 0);
    $('#period-cards').innerHTML =
      SL.ui.stat('Faturamento', money(s.revenue), { icon: 'dollar', tone: 'gold', note: 'tudo o que você vendeu' }) +
      SL.ui.stat('Lucro bruto', money(s.grossProfit), { icon: 'tag', tone: s.grossProfit >= 0 ? 'green' : 'red', note: 'faturamento − custo dos salgados vendidos' }) +
      SL.ui.stat('Total de despesas', money(s.expenses), { icon: 'wallet', tone: 'red', note: 'compras e gastos lançados' }) +
      SL.ui.stat('Lucro estimado', money(s.estimatedProfit), { icon: 'trend', tone: s.estimatedProfit >= 0 ? 'green' : 'red', note: 'faturamento − despesas' + (s.revenue > 0 ? ' · ' + pct((s.estimatedProfit / s.revenue) * 100) : '') }) +
      SL.ui.stat('Salgados produzidos', int(s.produced), { icon: 'cake', note: 'custo da produção ' + money(s.productionCost) }) +
      SL.ui.stat('Salgados vendidos', int(s.unitsSold), { icon: 'cart', note: s.salesCount + ' venda(s)' }) +
      SL.ui.stat('Ticket médio', money(s.ticket), { icon: 'coins', note: 'valor médio por venda' }) +
      SL.ui.stat('Estoque disponível', int(stock), { icon: 'box', tone: 'dark', note: 'agora, em ' + data.products.length + ' produto(s)' }) +
      SL.ui.stat('Encomendas pendentes', int(s.pendingOrders), { icon: 'clock', tone: 'feature', note: s.pendingOrders ? money(s.pendingValue) + ' a receber' : 'nenhuma por entregar' });
    return true;
  }

  function charts() {
    const r = range; if (!r || r.error) return;
    SL.charts.revenue('ch-rev', SL.calc.series(data, gran, r.from, r.to), true);
    const top = SL.calc.topProducts(data.sales, r.from, r.to, 6);
    $('#top-empty').hidden = top.length > 0;
    $('#ch-top').parentNode.hidden = top.length === 0;
    if (top.length) SL.charts.doughnut('ch-top', top.map((x) => x.name), top.map((x) => x.qty));
    const ex = SL.calc.expensesByCategory(data.expenses, r.from, r.to);
    $('#exp-empty').hidden = ex.length > 0; $('#ch-exp').parentNode.hidden = ex.length === 0;
    if (ex.length) SL.charts.moneyDoughnut('ch-exp', ex.map((x) => x.category), ex.map((x) => x.amount));
    const pay = SL.calc.salesByPayment(data.sales, r.from, r.to);
    $('#pay-empty').hidden = pay.length > 0; $('#ch-pay').parentNode.hidden = pay.length === 0;
    if (pay.length) SL.charts.moneyDoughnut('ch-pay', pay.map((x) => x.payment), pay.map((x) => x.amount));
  }

  function stock() {
    const T = SL.calc.stockTotal;
    const list = data.products.slice().sort((a, b) => T(a) - T(b) || a.name.localeCompare(b.name, 'pt-BR'));
    if (!list.length) { $('#stock').innerHTML = SL.ui.emptyState('Nenhum produto cadastrado', 'Cadastre seus salgados para acompanhar o estoque.', { href: 'produtos.html', label: 'Cadastrar produto', art: 'mix' }); return; }
    const total = list.reduce((a, p) => a + T(p), 0), value = list.reduce((a, p) => a + T(p) * p.price, 0);
    const max = Math.max.apply(null, list.map(T).concat([1]));
    const isLow = (p) => p.minStock > 0 && T(p) <= p.minStock;
    $('#stock').innerHTML = '<p class="muted" style="margin-top:-6px"><b>' + int(total) + '</b> salgados em estoque, que valem <b>' + money(value) + '</b> a preço de venda.</p><div class="bars">' +
      list.map((p) => '<div class="bar-row"><span>' + esc(p.name) + '</span><div class="bar-track"><div class="bar-fill" style="width:' + Math.max(T(p) ? 3 : 0, (T(p) / max) * 100) + '%;' + (isLow(p) || !T(p) ? 'background:linear-gradient(90deg,#e8731a,#b3372f)' : '') + '"></div></div><b>' + int(T(p)) + (T(p) === 0 ? ' · esgotado' : isLow(p) ? ' · baixo' : '') + '<span class="small muted" style="font-weight:400"> (' + int(p.stockReady) + ' pr. / ' + int(p.stockFrozen) + ' cg.)</span></b></div>').join('') + '</div>';
  }

  async function alerts() {
    const out = [];
    const last = await SL.db.getSetting('lastBackupAt', null);
    if (!SL.mode.isDemo() && data.products.length && (!last || Date.now() - last > 30 * 86400000)) {
      out.push('<div class="alert">' + icon('shield') + '<div><b>Faça um backup.</b> ' + (last ? 'O último foi há mais de 30 dias. ' : 'Você ainda não fez nenhum. ') + 'Seus dados ficam só neste aparelho. <a href="backup.html">Salvar backup agora</a>.</div></div>');
    }
    const settings = await SL.db.settings(), today = SL.dates.today();
    const low = SL.calc.lowStock(data.products);
    if (low.length) out.push('<div class="alert warn">' + icon('alert') + '<div><b>Estoque baixo:</b> ' + low.slice(0, 4).map((p) => esc(p.name) + ' (' + int(SL.calc.stockTotal(p)) + ')').join(', ') + (low.length > 4 ? '…' : '') + '. <a href="producao.html">Registrar produção</a></div></div>');
    const exp = SL.calc.expiryAlerts(data.stock, data.products, today, settings.expiryWarnDays);
    if (exp.length) out.push('<div class="alert bad">' + icon('clock') + '<div><b>Validade:</b> ' + exp.slice(0, 3).map((a) => esc(a.productName) + ' (' + int(a.qty) + ' un., ' + (a.days < 0 ? 'vencido' : a.days === 0 ? 'vence hoje' : 'vence em ' + a.days + ' d') + ')').join('; ') + '. <a href="estoque.html">Ver lotes</a></div></div>');
    const due = data.sales.filter((s) => s.status === 'encomenda' && s.deliveryDate <= SL.dates.addDays(today, 1));
    if (due.length) out.push('<div class="alert">' + icon('cart') + '<div><b>' + due.length + (due.length === 1 ? ' encomenda' : ' encomendas') + ' para hoje/amanhã ou atrasada(s).</b> <a href="vendas.html">Ver encomendas</a></div></div>');
    $('#alerts').innerHTML = out.length ? '<div class="grid" style="margin-bottom:20px">' + out.join('') + '</div>' : '';
  }

  function refresh() {
    range = SL.ui.readPeriod('d', $('#period-row'));
    if (periodCards()) charts();
  }

  SL.ui.boot(async function () {
    data = await SL.db.loadAll();
    $('#period-row').innerHTML = SL.ui.periodPicker('d') + '<button class="btn" type="button" id="apply" hidden>Aplicar</button>';
    topCards(); await alerts(); stock(); refresh();

    $('#d-p').addEventListener('change', () => {
      const custom = $('#d-p').value === 'custom';
      $('#apply').hidden = !custom;
      if (custom && !$('#d-f').value) { const r = SL.calc.presetRange('30d'); $('#d-f').value = r.from; $('#d-t').value = r.to; }
      refresh();
    });
    ['#d-f', '#d-t'].forEach((s) => $(s).addEventListener('change', refresh));
    $('#apply').addEventListener('click', refresh);
    $('#gran').addEventListener('click', (e) => {
      const b = e.target.closest('button[data-g]'); if (!b) return;
      gran = b.dataset.g;
      $$('#gran button').forEach((x) => x.classList.toggle('on', x === b));
      charts();
    });
  });
})();
