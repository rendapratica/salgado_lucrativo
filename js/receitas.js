/* receitas.js — biblioteca de receitas (embutidas + cadastradas pelo usuário) */
(function () {
  'use strict';
  const { icon, esc, money, $, $$, handleError } = SL.ui;
  let mine = [], all = [], cat = '', editingId = null, photo = '';

  const builtin = () => SL.RECIPES.map((r) => Object.assign({}, r, { key: 'b:' + r.id, own: false, art: r.art || SL.artForCategory(r.category) }));
  const owned = () => mine.map((r) => Object.assign({}, r, { key: 'u:' + r.id, own: true, art: SL.artForCategory(r.category) }));
  const find = (key) => all.find((r) => r.key === key || (r.own ? String(r.id) === key : r.id === key));

  function renderSlots() {
    const total = SL.RECIPE_SLOTS, used = all.length;
    $('#slots-card').innerHTML = '<div class="row between"><div><b>' + used + ' de ' + total + ' receitas</b> <span class="muted small">na sua biblioteca</span></div><span class="muted small">' + (used >= total ? 'Biblioteca completa!' : 'Faltam ' + (total - used) + ' para as ' + total + ' receitas') + '</span></div>' +
      '<div class="slots" aria-hidden="true">' + Array.from({ length: total }, (_, i) => '<i class="' + (i < used ? 'on' : '') + '"></i>').join('') + '</div>';
  }

  function renderChips() {
    const counts = {}; all.forEach((r) => { counts[r.category] = (counts[r.category] || 0) + 1; });
    const cats = SL.CATEGORIES.filter((c) => counts[c]);
    $('#chips').innerHTML = '<button type="button" class="chip ' + (!cat ? 'on' : '') + '" data-cat="">Todas (' + all.length + ')</button>' + cats.map((c) => '<button type="button" class="chip ' + (cat === c ? 'on' : '') + '" data-cat="' + esc(c) + '">' + esc(c) + ' (' + counts[c] + ')</button>').join('');
  }

  function renderList() {
    const q = $('#q').value.trim().toLowerCase();
    const list = all.filter((r) => (!cat || r.category === cat) && (!q || (r.name + ' ' + r.ingredients.join(' ')).toLowerCase().indexOf(q) !== -1));
    if (!list.length) { $('#list').innerHTML = SL.ui.emptyState('Nenhuma receita encontrada', 'Tente outra busca ou categoria.', { art: 'mix' }); return; }
    $('#list').innerHTML = '<div class="cards-grid">' + list.map((r) =>
      '<button class="tile" type="button" data-open="' + esc(r.key) + '" aria-label="Abrir receita ' + esc(r.name) + '"><div class="thumb">' + SL.ui.thumb(r, r.art) + '<span class="badge"><span class="pill gold">' + esc(r.category) + '</span></span>' + (r.own ? '<span class="badge r"><span class="pill">Minha</span></span>' : '') + '</div>' +
      '<div class="body"><h3>' + esc(r.name) + '</h3><div class="meta"><span>' + icon('clock') + ' ' + esc(r.time.split(' + ')[0]) + '</span><span>' + esc(r.yield.split(' (')[0]) + '</span><span class="pill">' + esc(r.difficulty || 'Fácil') + '</span></div>' +
      (r.suggestedPrice > 0 ? '<div class="price">' + money(r.suggestedPrice) + ' <span class="small muted" style="font-family:var(--font-body);font-weight:400">sugestão / un.</span></div>' : '') + '</div></button>').join('') + '</div>';
  }

  function view(key) {
    const r = find(key); if (!r) return;
    $('#v-title').textContent = r.name;
    $('#v-body').innerHTML =
      '<div class="recipe-hero">' + SL.ui.thumb(r, r.art) + '</div>' +
      '<div class="facts"><div class="fact"><span>Categoria</span><b>' + esc(r.category) + '</b></div><div class="fact"><span>Rendimento</span><b>' + esc(r.yield) + '</b></div><div class="fact"><span>Tempo de preparo</span><b>' + esc(r.time) + '</b></div>' +
      '<div class="fact"><span>Dificuldade</span><b>' + esc(r.difficulty || 'Fácil') + '</b></div><div class="fact"><span>Custo estimado</span><b>' + (r.estimatedCost > 0 ? money(r.estimatedCost) + ' <span class="small muted">(receita toda)</span>' : '—') + '</b></div>' +
      '<div class="fact"><span>Sugestão de venda</span><b>' + (r.suggestedPrice > 0 ? money(r.suggestedPrice) + ' / un.' : '—') + '</b></div></div>' +
      '<div class="recipe-cols"><div><h3>Ingredientes</h3><ul class="ingredients">' + r.ingredients.map((i) => '<li>' + esc(i) + '</li>').join('') + '</ul></div>' +
      '<div><h3>Modo de preparo</h3><ol class="steps">' + r.steps.map((s) => '<li>' + esc(s) + '</li>').join('') + '</ol></div></div>' +
      (r.freezing ? '<div class="alert section" style="margin-top:20px">' + icon('snow') + '<div><b>Como congelar:</b> ' + esc(r.freezing) + '</div></div>' : '') +
      (r.storage ? '<div class="alert ok section" style="margin-top:12px">' + icon('info') + '<div><b>Conservação:</b> ' + esc(r.storage) + '</div></div>' : '') +
      '<div class="form-actions" style="margin-top:20px"><a class="btn gold" href="produtos.html?de-receita=' + encodeURIComponent(r.own ? r.id : r.id) + '">' + icon('box') + ' Criar produto com esta receita</a><a class="btn" href="calculadora.html">' + icon('calc') + ' Calcular o preço</a>' +
      (r.own ? '<button class="btn" type="button" data-edit="' + r.id + '">' + icon('edit') + ' Editar</button><button class="btn danger" type="button" data-del="' + r.id + '">' + icon('trash') + ' Excluir</button>' : '') +
      '<button class="btn ghost" type="button" onclick="window.print()">Imprimir</button></div>';
    SL.ui.openDialog($('#dlg-view'));
  }

  function setPhoto(v) { photo = v || ''; $('#preview').innerHTML = photo ? '<img src="' + esc(photo) + '" alt="Prévia da foto">' : 'Sem foto'; $('#photo-clear').hidden = !photo; }

  function openForm(r) {
    editingId = r ? r.id : null;
    const form = $('#form'); form.reset(); SL.ui.showErrors(form, {});
    $('#f-title').textContent = r ? 'Editar receita' : 'Nova receita';
    if (r) SL.ui.fillForm(form, { name: r.name, category: r.category, yield: r.yield, time: r.time, suggestedPrice: SL.ui.moneyStr(r.suggestedPrice), difficulty: r.difficulty, estimatedCost: SL.ui.moneyStr(r.estimatedCost), freezing: r.freezing, ingredients: r.ingredients.join('\n'), steps: r.steps.join('\n'), storage: r.storage });
    setPhoto(r ? r.photo : '');
    SL.ui.closeDialog($('#dlg-view')); SL.ui.openDialog($('#dlg-form'));
    setTimeout(() => $('#r-name').focus(), 50);
  }

  async function save(e) {
    e.preventDefault();
    const form = $('#form'), btn = $('#btn-save'); btn.disabled = true;
    try {
      const d = SL.ui.formData(form); d.photo = photo;
      await SL.ops.saveRecipe(d, editingId);
      SL.ui.closeDialog($('#dlg-form')); SL.ui.toast(editingId ? 'Receita atualizada.' : 'Receita cadastrada.', 'ok'); await load();
    } catch (err) { handleError(err, form); } finally { btn.disabled = false; }
  }

  async function remove(id) {
    const r = mine.find((x) => x.id === Number(id)); if (!r) return;
    const ok = await SL.ui.confirm({ title: 'Excluir "' + r.name + '"?', message: 'A receita será removida da sua biblioteca. Esta ação não pode ser desfeita.', confirmText: 'Excluir receita' });
    if (!ok) return;
    try { await SL.ops.deleteRecipe(r.id); SL.ui.closeDialog($('#dlg-view')); SL.ui.toast('Receita excluída.', 'ok'); await load(); } catch (err) { handleError(err); }
  }

  async function load() {
    mine = (await SL.db.getAll('recipes')).sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    all = builtin().concat(owned());
    renderSlots(); renderChips(); renderList();
  }

  SL.ui.boot(async function () {
    $('#btn-new').innerHTML = icon('plus') + ' Nova receita';
    $('#photo-label').innerHTML = icon('camera') + ' Escolher foto';
    $$('[data-close]').forEach((b) => { if (b.classList.contains('icon-only')) b.innerHTML = icon('x'); });
    $('#r-category').innerHTML = SL.ui.options(SL.CATEGORIES, '', 'Escolha…'); $('#r-diff').innerHTML = SL.ui.options(SL.DIFFICULTY, '', 'Escolha…');
    $('#q').addEventListener('input', SL.ui.debounce(renderList, 150));
    $('#chips').addEventListener('click', (e) => { const b = e.target.closest('[data-cat]'); if (!b) return; cat = b.dataset.cat; renderChips(); renderList(); });
    $('#btn-new').addEventListener('click', () => openForm(null));
    $('#form').addEventListener('submit', save);
    $('#photo-clear').addEventListener('click', () => setPhoto(''));
    $('#r-photo').addEventListener('change', async (e) => {
      const f = e.target.files[0]; if (!f) return;
      try { setPhoto(await SL.ui.readImage(f, 900)); } catch (err) { handleError(err); } finally { e.target.value = ''; }
    });
    $('#list').addEventListener('click', (e) => { const b = e.target.closest('[data-open]'); if (b) view(b.dataset.open); });
    $('#v-body').addEventListener('click', (e) => {
      const ed = e.target.closest('[data-edit]'), dl = e.target.closest('[data-del]');
      if (ed) openForm(mine.find((x) => x.id === Number(ed.dataset.edit))); if (dl) remove(dl.dataset.del);
    });
    await load();
    const want = new URLSearchParams(location.search).get('r');
    if (want) view(want);
  });
})();
