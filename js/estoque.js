/* estoque.js — saldos (pronto × congelado), alertas, lotes com validade e histórico de movimentações */
(function () {
  'use strict';
  const { icon, esc, money, int, $, $$, handleError } = SL.ui;
  const TYPES = [['', 'Todos os tipos'], ['entrada', 'Entradas'], ['saida', 'Saídas'], ['ajuste', 'Ajustes'], ['conversao', 'Pronto ↔ congelado']];
  const PERIODS = [['30d', 'Últimos 30 dias'], ['7d', 'Últimos 7 dias'], ['mes', 'Mês atual'], ['ano', 'Ano atual'], ['todos', 'Tudo']];
  const TYPE_PILL = { entrada: '<span class="pill ok">Entrada</span>', saida: '<span class="pill bad">Saída</span>', ajuste: '<span class="pill warn">Ajuste</span>', conversao: '<span class="pill">Conversão</span>' };
  let products = [], moves = [], settings = SL.DEFAULT_SETTINGS, mode = 'entry';
  const total = SL.calc.stockTotal;
  const prodById = (id) => products.find((p) => p.id === Number(id));

  function renderAlerts() {
    const today = SL.dates.today(), low = SL.calc.lowStock(products), exp = SL.calc.expiryAlerts(moves, products, today, settings.expiryWarnDays);
    let h = '';
    if (low.length) h += '<div class="alert warn">' + icon('alert') + '<div><b>Estoque baixo:</b> ' + low.map((p) => esc(p.name) + ' (' + int(total(p)) + ')').join(', ') + '. <a href="producao.html">Registrar produção</a></div></div>';
    if (exp.length) h += '<div class="alert bad">' + icon('clock') + '<div><b>Validade:</b> ' + exp.slice(0, 6).map((a) => esc(a.productName) + ' — ' + int(a.qty) + ' ' + (a.kind === 'frozen' ? 'congelados' : 'prontos') + ' (' + (a.days < 0 ? 'venceu há ' + (-a.days) + ' d' : a.days === 0 ? 'vence hoje' : 'vence em ' + a.days + ' d') + ')').join('; ') + (exp.length > 6 ? ' e mais ' + (exp.length - 6) + '.' : '') + '</div></div>';
    $('#alerts').innerHTML = h;
  }
  function renderSummary() {
    const ready = products.reduce((a, p) => a + p.stockReady, 0), frozen = products.reduce((a, p) => a + p.stockFrozen, 0);
    const cost = products.reduce((a, p) => a + total(p) * p.cost, 0), sale = products.reduce((a, p) => a + total(p) * p.price, 0);
    $('#summary').innerHTML = SL.ui.stat('Prontos para vender', int(ready), { icon: 'flame', tone: 'gold' }) + SL.ui.stat('Congelados', int(frozen), { icon: 'snow', tone: 'dark' }) +
      SL.ui.stat('Valor a custo', money(cost), { icon: 'coins' }) + SL.ui.stat('Valor a preço de venda', money(sale), { icon: 'dollar', tone: 'green' });
  }
  function renderBalances() {
    if (!products.length) { $('#balances').innerHTML = SL.ui.emptyState('Nenhum produto cadastrado', 'Cadastre produtos para controlar o estoque.', { href: 'produtos.html', label: 'Cadastrar produto', art: 'mix' }); return; }
    $('#balances').innerHTML = '<div class="table-wrap"><table class="stack"><thead><tr><th>Produto</th><th class="num">Prontos</th><th class="num">Congelados</th><th class="num">Total</th><th class="num">Mínimo</th><th>Situação</th></tr></thead><tbody>' +
      products.map((p) => { const t = total(p), low = p.minStock > 0 && t <= p.minStock;
        return '<tr><td data-label="Produto"><b>' + esc(p.name) + '</b><br><span class="small muted">' + esc(p.category) + ' · ' + esc(p.unit) + '</span></td><td class="num" data-label="Prontos">' + int(p.stockReady) + '</td><td class="num" data-label="Congelados">' + int(p.stockFrozen) + '</td><td class="num" data-label="Total"><b>' + int(t) + '</b></td><td class="num" data-label="Mínimo">' + (p.minStock ? int(p.minStock) : '—') + '</td><td data-label="Situação">' + (t === 0 ? '<span class="pill bad">Sem estoque</span>' : low ? '<span class="pill warn">Estoque baixo</span>' : '<span class="pill ok">OK</span>') + '</td></tr>'; }).join('') + '</tbody></table></div>';
  }
  function renderBatches() {
    const rows = [];
    products.forEach((p) => ['ready', 'frozen'].forEach((k) => SL.calc.batches(moves, p.id, k).forEach((b) => { if (b.expiry) rows.push({ p, b }); })));
    rows.sort((a, b) => a.b.expiry.localeCompare(b.b.expiry));
    $('#batch-card').hidden = !rows.length;
    const today = SL.dates.today();
    $('#batches').innerHTML = '<div class="table-wrap"><table class="stack"><thead><tr><th>Produto</th><th>Estoque</th><th>Entrada</th><th>Validade</th><th class="num">Restam</th></tr></thead><tbody>' + rows.map((r) => {
      const d = SL.dates.diffDays(today, r.b.expiry), tag = d < 0 ? '<span class="pill bad">Vencido</span>' : d <= settings.expiryWarnDays ? '<span class="pill warn">' + (d === 0 ? 'Vence hoje' : 'Vence em ' + d + ' d') + '</span>' : '';
      return '<tr><td data-label="Produto"><b>' + esc(r.p.name) + '</b></td><td data-label="Estoque">' + (r.b.kind === 'frozen' ? 'Congelado' : 'Pronto') + '</td><td data-label="Entrada">' + SL.dates.br(r.b.date) + '</td><td data-label="Validade">' + SL.dates.br(r.b.expiry) + ' ' + tag + '</td><td class="num" data-label="Restam">' + int(r.b.qty) + '</td></tr>'; }).join('') + '</tbody></table></div>';
  }
  function renderMoves() {
    const pid = $('#flt-prod').value, type = $('#flt-type').value, per = $('#flt-per').value, r = per === 'todos' ? { from: '', to: '' } : SL.calc.presetRange(per);
    const list = moves.filter((m) => (!pid || m.productId === Number(pid)) && (!type || m.type === type) && SL.calc.inRange(m.date, r.from, r.to)).sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id).slice(0, 300);
    if (!list.length) { $('#moves').innerHTML = '<p class="muted center" style="padding:24px 0">Nenhuma movimentação neste filtro.</p>'; return; }
    $('#moves').innerHTML = '<div class="table-wrap"><table class="stack"><thead><tr><th>Data</th><th>Produto</th><th>Tipo</th><th>Estoque</th><th class="num">Qtd.</th><th>Motivo</th></tr></thead><tbody>' + list.map((m) =>
      '<tr><td data-label="Data">' + SL.dates.br(m.date) + '</td><td data-label="Produto"><b>' + esc(m.productName) + '</b></td><td data-label="Tipo">' + TYPE_PILL[m.type] + '</td><td data-label="Estoque">' + (m.kind === 'frozen' ? 'Congelado' : 'Pronto') + '</td><td class="num" data-label="Qtd."><span class="' + (m.delta > 0 ? 'pos' : 'neg') + '">' + (m.delta > 0 ? '+' : '') + int(m.delta) + '</span></td><td data-label="Motivo">' + esc(m.reason) + (m.expiry ? ' <span class="small muted">(val. ' + SL.dates.br(m.expiry) + ')</span>' : '') + '</td></tr>').join('') + '</tbody></table></div>' +
      (list.length === 300 ? '<p class="muted small center">Mostrando as 300 movimentações mais recentes. Use os filtros para refinar.</p>' : '');
  }

  async function load() {
    const [d, s] = await Promise.all([SL.db.loadAll(), SL.db.settings()]);
    products = d.products.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')); moves = d.stock; settings = s;
    const cur = $('#flt-prod').value;
    $('#flt-prod').innerHTML = SL.ui.options(products.map((p) => [p.id, p.name]), cur, 'Todos os produtos');
    renderAlerts(); renderSummary(); renderBalances(); renderBatches(); renderMoves();
  }

  const CFG = {
    entry: { title: 'Entrada de estoque', help: 'Use para somar salgados que não vieram de uma produção registrada (compra pronta, devolução, doação).', kind: 'Entra como', qty: 'Quantidade', reason: 'Motivo (opcional)', exp: true, nw: false },
    convert: { title: 'Pronto ↔ congelado', help: 'Mova salgados entre os estoques, por exemplo ao descongelar para vender ou ao congelar a sobra do dia.', kind: 'Mover de', qty: 'Quantidade a mover', reason: null, exp: false, nw: false },
    adjust: { title: 'Ajuste manual', help: 'Informe a quantidade REAL que você contou. O sistema calcula a diferença e guarda o motivo no histórico.', kind: 'Estoque', qty: null, reason: 'Motivo do ajuste', exp: false, nw: true },
  };
  function openDlg(m) {
    mode = m; const c = CFG[m], form = $('#form'); form.reset(); SL.ui.showErrors(form, {});
    $('#dlg-title').textContent = c.title; $('#dlg-help').textContent = c.help; $('#kind-label').textContent = c.kind;
    $('#qty-f').hidden = c.nw; $('#new-f').hidden = !c.nw; $('#exp-f').hidden = !c.exp; $('#reason-f').hidden = !c.reason;
    if (c.qty) $('#qty-label').textContent = c.qty; if (c.reason) $('#reason-label').textContent = c.reason;
    if (m === 'convert') $('#f-kind').innerHTML = '<option value="ready">Pronto → congelado</option><option value="frozen">Congelado → pronto</option>';
    else $('#f-kind').innerHTML = '<option value="ready">Pronto</option><option value="frozen">Congelado</option>';
    $('#f-product').innerHTML = SL.ui.options(products.map((p) => [p.id, p.name]), '', 'Escolha o produto…');
    $('#f-date').value = SL.dates.today(); $('#f-date').max = SL.dates.today(); $('#now').textContent = '';
    SL.ui.openDialog($('#dlg'));
  }
  function showNow() {
    const p = prodById($('#f-product').value);
    $('#now').textContent = p ? 'Hoje: ' + int(p.stockReady) + ' prontos · ' + int(p.stockFrozen) + ' congelados' : '';
  }
  async function submit(e) {
    e.preventDefault();
    const form = $('#form'), btn = $('#btn-save'); btn.disabled = true;
    try {
      const d = SL.ui.formData(form);
      if (mode === 'entry') await SL.ops.stockEntry(d);
      else if (mode === 'convert') { d.from = d.kind; await SL.ops.stockConvert(d); }
      else await SL.ops.stockAdjust(d);
      SL.ui.closeDialog($('#dlg')); SL.ui.toast('Estoque atualizado.', 'ok'); await load();
    } catch (err) { handleError(err, form); } finally { btn.disabled = false; }
  }

  SL.ui.boot(async function () {
    $('#btn-entry').innerHTML = icon('plus') + ' Entrada'; $('#btn-convert').innerHTML = icon('snow') + ' Pronto ↔ congelado'; $('#btn-adjust').innerHTML = icon('edit') + ' Ajustar';
    $$('[data-close]').forEach((b) => { if (b.classList.contains('icon-only')) b.innerHTML = icon('x'); });
    $('#flt-type').innerHTML = SL.ui.options(TYPES, ''); $('#flt-per').innerHTML = SL.ui.options(PERIODS, '30d');
    ['#flt-prod', '#flt-type', '#flt-per'].forEach((s) => $(s).addEventListener('change', renderMoves));
    $('#btn-entry').addEventListener('click', () => openDlg('entry')); $('#btn-convert').addEventListener('click', () => openDlg('convert')); $('#btn-adjust').addEventListener('click', () => openDlg('adjust'));
    $('#f-product').addEventListener('change', showNow);
    $('#form').addEventListener('submit', submit);
    await load();
  });
})();
