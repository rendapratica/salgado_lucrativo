/* produtos.js — cadastro, edição e exclusão de produtos */
(function () {
  'use strict';
  const { icon, esc, money, int, pct, $, $$, handleError } = SL.ui;
  let products = [], editingId = null, photo = '';

  const total = SL.calc.stockTotal;
  const stockBadge = (p) => {
    const t = total(p);
    if (t === 0) return '<span class="pill bad">Sem estoque</span>';
    if (p.minStock > 0 && t <= p.minStock) return '<span class="pill warn">Estoque baixo: ' + int(t) + '</span>';
    return '<span class="pill ok">' + int(t) + ' em estoque</span>';
  };
  const marginOf = (p) => (p.price > 0 ? ((p.price - p.cost) / p.price) * 100 : 0);

  async function load() { products = (await SL.db.getAll('products')).sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')); render(); }

  function render() {
    const q = $('#q').value.trim().toLowerCase(), cat = $('#cat').value;
    const list = products.filter((p) => (!cat || p.category === cat) && (!q || (p.name + ' ' + p.description).toLowerCase().indexOf(q) !== -1));
    const units = products.reduce((a, p) => a + total(p), 0), value = products.reduce((a, p) => a + total(p) * p.cost, 0), sale = products.reduce((a, p) => a + total(p) * p.price, 0);
    $('#summary').innerHTML = SL.ui.stat('Produtos cadastrados', int(products.length), { icon: 'box' }) + SL.ui.stat('Salgados em estoque', int(units), { icon: 'layers', tone: 'dark' }) +
      SL.ui.stat('Valor do estoque', money(sale), { icon: 'coins', tone: 'gold', note: 'a preço de venda · custo ' + money(value) });
    if (!products.length) { $('#list').innerHTML = SL.ui.emptyState('Nenhum produto ainda', 'Cadastre seus salgados para registrar produção e vendas.', { art: 'mix' }); return; }
    if (!list.length) { $('#list').innerHTML = SL.ui.emptyState('Nada encontrado', 'Tente outra busca ou categoria.', { art: 'mix' }); return; }
    $('#list').innerHTML = '<div class="cards-grid">' + list.map((p) =>
      '<article class="tile"><div class="thumb">' + SL.ui.thumb(p, SL.artForCategory(p.category)) + '<span class="badge">' + stockBadge(p) + '</span></div>' +
      '<div class="body"><div class="row between" style="gap:6px"><span class="pill gold">' + esc(p.category) + '</span><span class="small muted" title="Margem de lucro">' + pct(marginOf(p)) + ' margem</span></div>' +
      '<h3>' + esc(p.name) + '</h3>' + (p.description ? '<p class="small muted" style="margin:0">' + esc(p.description) + '</p>' : '') +
      '<div class="meta"><span class="price">' + money(p.price) + ' <span class="small muted" style="font-weight:400">/ ' + esc(p.unit) + '</span></span><span>custo ' + money(p.cost) + '</span></div>' +
      '<div class="meta small muted"><span>' + icon('flame') + ' ' + int(p.stockReady) + ' prontos</span><span>' + icon('snow') + ' ' + int(p.stockFrozen) + ' congelados</span></div>' +
      '<div class="foot"><button class="btn sm" type="button" data-edit="' + p.id + '">' + icon('edit') + '<span>Editar</span></button><button class="btn sm danger" type="button" data-del="' + p.id + '" aria-label="Excluir ' + esc(p.name) + '">' + icon('trash') + '<span>Excluir</span></button></div></div></article>').join('') + '</div>';
  }

  function setPhoto(v) {
    photo = v || '';
    $('#preview').innerHTML = photo ? '<img src="' + esc(photo) + '" alt="Prévia da foto">' : 'Sem foto';
    $('#photo-clear').hidden = !photo;
  }
  function updateLive() {
    const price = SL.num.parseMoney($('#f-price').value), cost = SL.num.parseMoney($('#f-cost').value);
    if (price > 0 && cost >= 0) {
      const profit = price - cost;
      $('#live').innerHTML = '<div><b class="' + (profit >= 0 ? 'pos' : 'neg') + '">' + money(profit) + '</b><span>Lucro por unidade de venda</span></div><div><b>' + pct((profit / price) * 100) + '</b><span>Margem sobre o preço</span></div>';
    } else $('#live').innerHTML = '<span>Preencha preço e custo para ver o lucro.</span>';
  }

  function openForm(p, prefill) {
    editingId = p ? p.id : null;
    const form = $('#form');
    SL.ui.showErrors(form, {});
    form.reset();
    $('#dlg-title').textContent = p ? 'Editar produto' : 'Novo produto';
    SL.ui.fillForm(form, p ? { name: p.name, category: p.category, unit: p.unit, description: p.description, price: SL.ui.moneyStr(p.price), cost: SL.ui.moneyStr(p.cost), minStock: p.minStock }
      : Object.assign({ unit: 'unidade', minStock: 0, stockReady: 0, stockFrozen: 0 }, prefill || {}));
    $('#ini-ready').hidden = $('#ini-frozen').hidden = !!p;
    $('#stock-hint').textContent = p ? 'O estoque não é editado aqui: use Produção, Vendas ou a página Estoque (entradas e ajustes), assim o histórico fica certo.' : 'Quanto você já tem hoje. Fica registrado como "estoque inicial" no histórico.';
    setPhoto(p ? p.photo : '');
    updateLive();
    SL.ui.openDialog($('#dlg'));
    setTimeout(() => $('#f-name').focus(), 50);
  }

  async function save(e) {
    e.preventDefault();
    const form = $('#form'), btn = $('#btn-save');
    btn.disabled = true;
    try {
      const d = SL.ui.formData(form); d.photo = photo;
      await SL.ops.saveProduct(d, editingId);
      SL.ui.closeDialog($('#dlg'));
      SL.ui.toast(editingId ? 'Produto atualizado.' : 'Produto cadastrado.', 'ok');
      await load();
    } catch (err) { handleError(err, form); } finally { btn.disabled = false; }
  }

  async function remove(id) {
    const p = products.find((x) => x.id === id); if (!p) return;
    const ok = await SL.ui.confirm({ title: 'Excluir "' + p.name + '"?', message: 'O produto e o histórico de estoque dele (' + total(p) + ' un. em estoque) serão apagados. As vendas e produções já registradas continuam nos relatórios. Esta ação não pode ser desfeita.', confirmText: 'Excluir produto' });
    if (!ok) return;
    try { await SL.ops.deleteProduct(id); SL.ui.toast('Produto excluído.', 'ok'); await load(); } catch (err) { handleError(err); }
  }

  async function fromRecipe(id) {
    let r = SL.RECIPES.find((x) => x.id === id);
    if (!r && /^\d+$/.test(id)) r = await SL.db.get('recipes', Number(id));
    if (!r) return;
    openForm(null, { name: r.name, category: r.category, description: 'Receita: ' + r.name + '.', price: SL.ui.moneyStr(r.suggestedPrice) });
    if (r.photo) setPhoto(r.photo);
  }

  SL.ui.boot(async function () {
    $('#cat').innerHTML = SL.ui.options(SL.CATEGORIES, '', 'Todas as categorias');
    $('#f-category').innerHTML = SL.ui.options(SL.CATEGORIES, '', 'Escolha…');
    $('#f-unit').innerHTML = SL.ui.options(SL.UNITS_SALE, 'unidade');
    $('#btn-new').innerHTML = icon('plus') + ' Novo produto';
    $('#photo-label').innerHTML = icon('camera') + ' Escolher foto';
    // Exemplo do campo "Nome do produto": sorteia um salgado de um dos tipos da biblioteca de receitas
    // (Coxinha, Pastel, Empada, Esfiha, Quibe…) em vez de ficar sempre "Coxinha".
    const byType = {};
    (SL.RECIPES || []).forEach((r) => { (byType[r.category] = byType[r.category] || []).push(r.name); });
    const types = Object.keys(byType).filter((t) => t !== 'Outros');
    if (types.length) {
      const names = byType[types[Math.floor(Math.random() * types.length)]];
      $('#f-name').placeholder = 'Ex.: ' + names[Math.floor(Math.random() * names.length)];
    }
    $$('[data-close]').forEach((b) => { if (b.classList.contains('icon-only')) b.innerHTML = icon('x'); });
    $('#q').addEventListener('input', SL.ui.debounce(render, 150)); $('#cat').addEventListener('change', render);
    $('#btn-new').addEventListener('click', () => openForm(null));
    $('#form').addEventListener('submit', save);
    ['#f-price', '#f-cost'].forEach((s) => $(s).addEventListener('input', updateLive));
    $('#photo-clear').addEventListener('click', () => setPhoto(''));
    $('#f-photo').addEventListener('change', async (e) => {
      const file = e.target.files[0]; if (!file) return;
      try { setPhoto(await SL.ui.readImage(file, 720)); } catch (err) { handleError(err); } finally { e.target.value = ''; }
    });
    $('#list').addEventListener('click', (e) => {
      const ed = e.target.closest('[data-edit]'), dl = e.target.closest('[data-del]');
      if (ed) openForm(products.find((p) => p.id === Number(ed.dataset.edit)));
      if (dl) remove(Number(dl.dataset.del));
    });
    await load();
    const rid = new URLSearchParams(location.search).get('de-receita');
    if (rid) { history.replaceState(null, '', 'produtos.html'); await fromRecipe(rid); }
  });
})();
