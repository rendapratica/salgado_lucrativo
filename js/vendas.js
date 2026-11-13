/* vendas.js — vendas concluídas e encomendas pendentes (nunca vende mais do que existe no estoque) */
(function () {
  'use strict';
  const { icon, esc, money, int, signed, $, $$, handleError } = SL.ui;
  let products = [], items = [], editingId = null, editingOld = null, status = 'concluida', completing = null;
  const FILTERS = [['mes', 'Mês atual'], ['hoje', 'Hoje'], ['7d', 'Últimos 7 dias'], ['30d', 'Últimos 30 dias'], ['ano', 'Ano atual'], ['todos', 'Tudo']];
  const prodById = (id) => products.find((p) => p.id === Number(id));
  const kindOf = () => ($('#f-kind').value === 'frozen' ? 'frozen' : 'ready');
  const stockOf = (p, kind) => (kind === 'frozen' ? p.stockFrozen : p.stockReady);

  // Estoque que pode ser vendido agora (ao editar uma venda concluída, ela devolve suas unidades)
  function available(p) {
    const k = kindOf();
    return stockOf(p, k) + (editingOld && editingOld.status !== 'encomenda' && editingOld.productId === p.id && editingOld.stockKind === k ? editingOld.qty : 0);
  }
  const needsStock = () => status === 'concluida';

  function fillProducts(selected) {
    $('#f-product').innerHTML = '<option value="">Escolha o produto…</option>' + products.map((p) => {
      const av = available(p), dis = needsStock() && av <= 0 && String(p.id) !== String(selected);
      return '<option value="' + p.id + '"' + (String(p.id) === String(selected) ? ' selected' : '') + (dis ? ' disabled' : '') + '>' + esc(p.name) + (needsStock() ? (av <= 0 ? ' (sem estoque)' : ' — ' + av + ' disp.') : '') + '</option>';
    }).join('');
    stockNow();
  }
  function stockNow() {
    const p = prodById($('#f-product').value);
    $('#stock-now').textContent = p ? 'Prontos: ' + int(p.stockReady) + ' · Congelados: ' + int(p.stockFrozen) + ' · preço cadastrado: ' + money(p.price) + ' / ' + p.unit : '';
  }
  function applyStatus() {
    $$('#status button').forEach((b) => b.classList.toggle('on', b.dataset.s === status));
    const enc = status === 'encomenda';
    $('#deliv-field').hidden = !enc;
    $('#date-label').textContent = enc ? 'Data do pedido' : 'Data da venda';
    $('#pay-field').querySelector('label').innerHTML = enc ? 'Forma de pagamento <span class="opt">(opcional)</span>' : 'Forma de pagamento';
    $('#status-hint').textContent = enc ? 'A encomenda fica pendente: não desconta estoque nem conta no faturamento até você concluir a entrega.' : 'A venda desconta do estoque e entra no faturamento agora.';
    $('#btn-save').innerHTML = icon('check') + (editingId ? ' Salvar alterações' : enc ? ' Registrar encomenda' : ' Registrar venda');
    fillProducts($('#f-product').value); updateLive();
  }
  function updateLive() {
    const qty = SL.num.parseIntStrict($('#f-qty').value), price = SL.num.parseMoney($('#f-price').value), p = prodById($('#f-product').value);
    if (qty >= 1 && price > 0) {
      const total = SL.num.round2(qty * price), cost = p ? (editingOld && editingOld.productId === p.id ? editingOld.unitCost : p.cost) : 0, profit = total - qty * cost;
      const over = p && needsStock() && qty > available(p);
      $('#live').innerHTML = '<div><b>' + money(total) + '</b><span>Valor total</span></div>' + (p ? '<div><b class="' + (profit >= 0 ? 'pos' : 'neg') + '">' + money(profit) + '</b><span>Resultado estimado</span></div>' : '') +
        (over ? '<div><b class="neg">Acima do estoque</b><span>Máximo: ' + int(available(p)) + ' un.</span></div>' : '');
    } else $('#live').innerHTML = '<span>Informe quantidade e valor para ver o total e o resultado estimado.</span>';
  }

  function resetForm() {
    editingId = null; editingOld = null; status = 'concluida';
    const form = $('#form'); form.reset(); SL.ui.showErrors(form, {});
    $('#f-date').value = SL.dates.today(); $('#f-date').max = SL.dates.today(); $('#f-deliv').min = SL.dates.today();
    $('#f-payment').innerHTML = SL.ui.options(SL.PAYMENTS, 'Pix', 'Escolha…');
    $('#status-row').hidden = false;
    $('#form-title').textContent = 'Registrar venda'; $('#edit-pill').hidden = true; $('#btn-cancel').hidden = true;
    applyStatus();
  }

  const range = () => { const f = $('#flt').value; return f === 'todos' ? { from: '', to: '' } : SL.calc.presetRange(f); };
  const sortDesc = (a, b) => (b.date + String(b.id).padStart(9, '0')).localeCompare(a.date + String(a.id).padStart(9, '0'));

  function renderOrders() {
    const list = items.filter((x) => x.status === 'encomenda').sort((a, b) => (a.deliveryDate || '').localeCompare(b.deliveryDate || ''));
    $('#orders-sec').hidden = !list.length;
    const today = SL.dates.today();
    $('#orders').innerHTML = '<div class="table-wrap"><table class="stack"><thead><tr><th>Entrega</th><th>Cliente</th><th>Produto</th><th class="num">Qtd.</th><th class="num">Total</th><th></th></tr></thead><tbody>' +
      list.map((x) => {
        const late = x.deliveryDate < today, tag = x.deliveryDate === today ? '<span class="pill warn">Hoje</span>' : late ? '<span class="pill bad">Atrasada</span>' : '';
        return '<tr><td data-label="Entrega">' + SL.dates.br(x.deliveryDate) + ' ' + tag + '</td><td data-label="Cliente">' + (esc(x.customer) || '<span class="muted">—</span>') + (x.notes ? '<br><span class="small muted">' + esc(x.notes) + '</span>' : '') + '</td><td data-label="Produto">' + SL.ui.mini({ name: x.productName }) + '<b>' + esc(x.productName) + '</b></td><td class="num" data-label="Qtd.">' + int(x.qty) + '</td><td class="num" data-label="Total"><b>' + money(x.total) + '</b></td>' +
          '<td class="actions"><button class="btn sm gold" type="button" data-done="' + x.id + '">' + icon('check') + ' Concluir</button> <button class="btn sm" type="button" data-edit="' + x.id + '">' + icon('edit') + '</button> <button class="btn sm danger" type="button" data-del="' + x.id + '" aria-label="Excluir encomenda">' + icon('trash') + '</button></td></tr>';
      }).join('') + '</tbody></table></div>';
  }

  function renderList() {
    const r = range(), pay = $('#flt-pay').value;
    const list = items.filter((x) => x.status !== 'encomenda' && SL.calc.inRange(x.date, r.from, r.to) && (!pay || x.payment === pay)).sort(sortDesc);
    const total = list.reduce((a, x) => a + x.total, 0), units = list.reduce((a, x) => a + x.qty, 0), profit = list.reduce((a, x) => a + x.profit, 0);
    $('#summary').innerHTML = SL.ui.stat('Faturamento', money(total), { icon: 'dollar', tone: 'gold', note: list.length + ' venda(s)' }) + SL.ui.stat('Salgados vendidos', int(units), { icon: 'tag' }) +
      SL.ui.stat('Resultado estimado', money(profit), { icon: 'trend', tone: profit >= 0 ? 'green' : 'red', note: 'vendas − custo dos salgados' }) + SL.ui.stat('Ticket médio', money(list.length ? total / list.length : 0), { icon: 'coins', tone: 'dark' });
    if (!list.length) { $('#list').innerHTML = SL.ui.emptyState('Nenhuma venda neste filtro', products.length ? 'Registre sua primeira venda acima.' : 'Cadastre um produto e registre uma produção para começar a vender.', { art: 'coxinha' }); return; }
    $('#list').innerHTML = '<div class="table-wrap"><table class="stack"><thead><tr><th>Data</th><th>Produto / cliente</th><th class="num">Qtd.</th><th class="num">Unitário</th><th class="num">Total</th><th class="num">Resultado</th><th>Pagamento</th><th></th></tr></thead><tbody>' +
      list.map((x) => '<tr><td data-label="Data">' + SL.dates.br(x.date) + '</td><td data-label="Produto">' + SL.ui.mini({ name: x.productName }) + '<b>' + esc(x.productName) + '</b>' + (x.customer ? '<br><span class="small muted">' + esc(x.customer) + '</span>' : '') + (x.notes ? '<br><span class="small muted">' + esc(x.notes) + '</span>' : '') + '</td><td class="num" data-label="Qtd.">' + int(x.qty) + '</td><td class="num" data-label="Unitário">' + money(x.unitPrice) + '</td><td class="num" data-label="Total"><b>' + money(x.total) + '</b></td><td class="num" data-label="Resultado">' + signed(x.profit) + '</td><td data-label="Pagamento"><span class="pill">' + esc(x.payment) + '</span></td>' +
        '<td class="actions"><button class="btn sm" type="button" data-edit="' + x.id + '">' + icon('edit') + ' Editar</button> <button class="btn sm danger" type="button" data-del="' + x.id + '" aria-label="Excluir venda">' + icon('trash') + '</button></td></tr>').join('') +
      '</tbody><tfoot><tr><td></td><td>Total</td><td class="num" data-label="Qtd.">' + int(units) + '</td><td></td><td class="num" data-label="Total">' + money(total) + '</td><td class="num" data-label="Resultado">' + money(profit) + '</td><td></td><td></td></tr></tfoot></table></div>';
  }

  async function load() {
    const [p, i] = await Promise.all([SL.db.getAll('products'), SL.db.getAll('sales')]);
    products = p.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')); items = i;
    const none = !products.length;
    $('#no-products').hidden = !none; $('#form').hidden = none;
    if (none) $('#no-products').innerHTML = SL.ui.emptyState('Cadastre um produto primeiro', 'Para registrar vendas você precisa ter produtos com estoque.', { href: 'produtos.html', label: 'Cadastrar produto', art: 'mix' });
    fillProducts($('#f-product').value); renderOrders(); renderList();
  }

  async function submit(e) {
    e.preventDefault();
    const form = $('#form'), btn = $('#btn-save'); btn.disabled = true;
    try {
      const d = SL.ui.formData(form); d.status = status;
      if (editingId) await SL.ops.updateSale(editingId, d);
      else if ((await SL.ui.tryForce((o) => SL.ops.registerSale(d, o))) === undefined) return;
      SL.ui.toast(editingId ? 'Registro atualizado e estoque ajustado.' : status === 'encomenda' ? 'Encomenda registrada.' : 'Venda registrada. Estoque atualizado!', 'ok');
      resetForm(); await load();
    } catch (err) { handleError(err, form); await load(); } finally { btn.disabled = false; }
  }

  function startEdit(id) {
    const x = items.find((i) => i.id === id); if (!x) return;
    editingId = id; editingOld = x; status = x.status === 'encomenda' ? 'encomenda' : 'concluida';
    const form = $('#form'); SL.ui.showErrors(form, {});
    $('#f-payment').innerHTML = SL.ui.options(SL.PAYMENTS, x.payment, 'Escolha…');
    SL.ui.fillForm(form, { qty: x.qty, unitPrice: SL.ui.moneyStr(x.unitPrice), date: x.date, payment: x.payment, notes: x.notes, customer: x.customer, stockKind: x.stockKind, deliveryDate: x.deliveryDate });
    $('#status-row').hidden = true;
    $('#form-title').textContent = status === 'encomenda' ? 'Editar encomenda' : 'Editar venda'; $('#edit-pill').hidden = false; $('#btn-cancel').hidden = false;
    applyStatus(); fillProducts(x.productId); $('#f-product').value = x.productId; stockNow(); updateLive();
    $('#form-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function remove(id) {
    const x = items.find((i) => i.id === id); if (!x) return;
    const enc = x.status === 'encomenda';
    const ok = await SL.ui.confirm({ title: enc ? 'Excluir esta encomenda?' : 'Excluir esta venda?', message: enc ? 'O pedido de ' + x.qty + ' un. de "' + x.productName + '" será cancelado. O estoque não muda.' : x.qty + ' un. de "' + x.productName + '" (' + money(x.total) + ') voltam para o estoque e o faturamento será reduzido. Esta ação não pode ser desfeita.', confirmText: enc ? 'Excluir encomenda' : 'Excluir venda' });
    if (!ok) return;
    try { await SL.ops.deleteSale(id); SL.ui.toast(enc ? 'Encomenda excluída.' : 'Venda excluída. As unidades voltaram ao estoque.', 'ok'); await load(); } catch (err) { handleError(err); }
  }

  function openComplete(id) {
    const x = items.find((i) => i.id === id); if (!x) return;
    completing = x; const form = $('#form-complete'); SL.ui.showErrors(form, {});
    $('#dc-info').innerHTML = '<b>' + int(x.qty) + ' × ' + esc(x.productName) + '</b> — ' + money(x.total) + (x.customer ? ' para ' + esc(x.customer) : '') + '. Ao concluir, as unidades saem do estoque e o valor entra no faturamento.';
    $('#c-date').value = SL.dates.today(); $('#c-date').max = SL.dates.today();
    $('#c-pay').innerHTML = SL.ui.options(SL.PAYMENTS, x.payment || 'Pix', 'Escolha…'); $('#c-kind').value = x.stockKind;
    SL.ui.openDialog($('#dlg-complete'));
  }
  async function submitComplete(e) {
    e.preventDefault();
    const form = $('#form-complete'), btn = $('#dc-save'); btn.disabled = true;
    try {
      await SL.ops.completeOrder(completing.id, SL.ui.formData(form));
      SL.ui.closeDialog($('#dlg-complete')); SL.ui.toast('Encomenda concluída. Estoque e faturamento atualizados!', 'ok'); await load();
    } catch (err) { handleError(err, form); } finally { btn.disabled = false; }
  }

  SL.ui.boot(async function () {
    $$('[data-close]').forEach((b) => { if (b.classList.contains('icon-only')) b.innerHTML = icon('x'); });
    $('#flt').innerHTML = SL.ui.options(FILTERS, 'mes');
    $('#flt-pay').innerHTML = SL.ui.options(SL.PAYMENTS, '', 'Todos os pagamentos');
    $('#form').addEventListener('submit', submit);
    $('#form-complete').addEventListener('submit', submitComplete);
    $('#btn-cancel').addEventListener('click', resetForm);
    $('#status').addEventListener('click', (e) => { const b = e.target.closest('[data-s]'); if (!b) return; status = b.dataset.s; applyStatus(); });
    $('#f-product').addEventListener('change', () => {
      const p = prodById($('#f-product').value);
      if (p && !editingId) $('#f-price').value = SL.ui.moneyStr(p.price); // sugere o preço cadastrado
      stockNow(); updateLive();
    });
    $('#f-kind').addEventListener('change', () => { fillProducts($('#f-product').value); updateLive(); });
    ['#f-qty', '#f-price'].forEach((s) => $(s).addEventListener('input', updateLive));
    ['#flt', '#flt-pay'].forEach((s) => $(s).addEventListener('change', renderList));
    $('#content').addEventListener('click', (e) => {
      const ed = e.target.closest('[data-edit]'), dl = e.target.closest('[data-del]'), dn = e.target.closest('[data-done]');
      if (ed) startEdit(Number(ed.dataset.edit)); if (dl) remove(Number(dl.dataset.del)); if (dn) openComplete(Number(dn.dataset.done));
    });
    resetForm(); await load();
  });
})();
