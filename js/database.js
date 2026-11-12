/* database.js — IndexedDB, validações, operações de negócio (estoque consistente com histórico),
   backup/restauração e modo demonstração.
   Depende de calc.js. Todos os dados principais ficam no IndexedDB (não no localStorage). */
(function (global) {
  'use strict';
  const SL = (global.SL = global.SL || {});
  const { num, dates } = SL;

  /* ---------- Constantes ---------- */
  SL.CATEGORIES = ['Coxinhas', 'Pastéis', 'Empadas', 'Esfihas', 'Quibes', 'Risoles', 'Enroladinhos', 'Folhados', 'Pães e assados', 'Mini salgados', 'Outros'];
  SL.UNITS_SALE = ['unidade', 'cento', 'porção', 'caixa', 'pacote', 'bandeja', 'dúzia', 'kg'];
  SL.PAYMENTS = ['Pix', 'Dinheiro', 'Cartão de débito', 'Cartão de crédito', 'Transferência'];
  SL.EXPENSE_CATEGORIES = ['Ingredientes', 'Carnes e recheios', 'Farinhas e massas', 'Queijos e laticínios', 'Óleo e gordura', 'Embalagens', 'Gás', 'Energia', 'Transporte', 'Marketing', 'Equipamentos', 'Taxas e maquininha', 'Mão de obra', 'Outras despesas'];
  SL.KINDS = { ready: 'Pronto', frozen: 'Congelado' };
  SL.MOVE_TYPES = ['entrada', 'saida', 'ajuste', 'conversao'];
  SL.DIFFICULTY = ['Fácil', 'Médio', 'Difícil'];
  const STORES = ['products', 'productions', 'sales', 'expenses', 'stock', 'settings', 'recipes'];
  SL.STORE_LABELS = { products: 'Produtos', productions: 'Produção', sales: 'Vendas', expenses: 'Despesas', stock: 'Estoque (movimentações)', recipes: 'Receitas próprias', settings: 'Configurações' };
  const DB_VERSION = 1;
  const MAX_PHOTO = 2 * 1024 * 1024; // caracteres do data URL
  const DUP_WINDOW = 2 * 60 * 1000; // registros idênticos em até 2 min pedem confirmação
  SL.DEFAULT_SETTINGS = { expiryWarnDays: 3, businessName: '' };

  /* ---------- Erros ---------- */
  class SLError extends Error { constructor(msg) { super(msg); this.name = 'SLError'; } }
  class ValidationError extends Error {
    constructor(errors) { super('Dados inválidos'); this.name = 'ValidationError'; this.errors = errors; }
  }
  class DuplicateError extends Error { constructor(msg) { super(msg); this.name = 'DuplicateError'; } }
  SL.SLError = SLError; SL.ValidationError = ValidationError; SL.DuplicateError = DuplicateError;

  /* ---------- Modo (real × demonstração): bancos separados ---------- */
  let memMode = 'real';
  SL.mode = {
    get() { try { return localStorage.getItem('sl_mode') === 'demo' ? 'demo' : 'real'; } catch (e) { return memMode; } },
    set(m) { memMode = m === 'demo' ? 'demo' : 'real'; try { localStorage.setItem('sl_mode', memMode); } catch (e) { /* ignorar */ } },
    isDemo() { return SL.mode.get() === 'demo'; },
  };

  /* ---------- Conexão ---------- */
  let dbPromise = null, dbName = null;
  function open() {
    const name = SL.mode.isDemo() ? 'salgado-lucrativo-demo' : 'salgado-lucrativo';
    if (dbPromise && dbName === name) return dbPromise;
    dbName = name;
    dbPromise = new Promise((resolve, reject) => {
      if (!global.indexedDB) { reject(new SLError('Seu navegador não suporta armazenamento local (IndexedDB). Use um navegador atualizado e fora do modo anônimo.')); return; }
      const req = global.indexedDB.open(name, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains('products')) db.createObjectStore('products', { keyPath: 'id', autoIncrement: true });
        ['productions', 'sales', 'expenses'].forEach((s) => {
          if (!db.objectStoreNames.contains(s)) db.createObjectStore(s, { keyPath: 'id', autoIncrement: true }).createIndex('date', 'date');
        });
        if (!db.objectStoreNames.contains('stock')) {
          const st = db.createObjectStore('stock', { keyPath: 'id', autoIncrement: true });
          st.createIndex('date', 'date'); st.createIndex('productId', 'productId'); st.createIndex('ref', ['refType', 'refId']);
        }
        if (!db.objectStoreNames.contains('settings')) db.createObjectStore('settings', { keyPath: 'key' });
        if (!db.objectStoreNames.contains('recipes')) db.createObjectStore('recipes', { keyPath: 'id', autoIncrement: true });
      };
      req.onsuccess = () => {
        const db = req.result;
        db.onversionchange = () => { db.close(); dbPromise = null; };
        resolve(db);
      };
      req.onerror = () => reject(req.error || new SLError('Falha ao abrir o banco de dados.'));
      req.onblocked = () => reject(new SLError('Feche as outras abas do sistema e tente novamente.'));
    });
    dbPromise.catch(() => { dbPromise = null; });
    return dbPromise;
  }

  const p = (r) => new Promise((res, rej) => { r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });

  // Executa `work` dentro de UMA transação; qualquer erro desfaz tudo (atomicidade do estoque).
  function run(storeNames, mode, work) {
    return open().then((db) => new Promise((resolve, reject) => {
      let tx;
      try { tx = db.transaction(storeNames, mode); } catch (e) { reject(e); return; }
      let result, failure = null;
      tx.oncomplete = () => resolve(result);
      tx.onabort = () => reject(failure || tx.error || new SLError('Operação cancelada.'));
      tx.onerror = () => { if (!failure) failure = tx.error; };
      const st = {};
      storeNames.forEach((n) => { st[n] = tx.objectStore(n); });
      Promise.resolve().then(() => work(st)).then((r) => { result = r; })
        .catch((err) => { failure = err; try { tx.abort(); } catch (_) { /* já finalizada */ } });
    }));
  }

  SL.db = {
    open, run, p,
    getAll: (s) => run([s], 'readonly', (st) => p(st[s].getAll())),
    get: (s, k) => run([s], 'readonly', (st) => p(st[s].get(k))),
    put: (s, o) => run([s], 'readwrite', (st) => p(st[s].put(o))),
    delete: (s, k) => run([s], 'readwrite', (st) => p(st[s].delete(k))),
    clear: (s) => run([s], 'readwrite', (st) => p(st[s].clear())),
    count: (s) => run([s], 'readonly', (st) => p(st[s].count())),
    async getSetting(key, def) { const r = await SL.db.get('settings', key); return r ? r.value : def; },
    setSetting(key, value) { return SL.db.put('settings', { key, value }); },
    async settings() {
      const rows = await SL.db.getAll('settings'); const o = Object.assign({}, SL.DEFAULT_SETTINGS);
      rows.forEach((r) => { if (r.key in SL.DEFAULT_SETTINGS) o[r.key] = r.value; });
      return o;
    },
    async loadAll() {
      const names = ['products', 'productions', 'sales', 'expenses', 'stock'];
      const res = await Promise.all(names.map((s) => SL.db.getAll(s)));
      const out = {}; names.forEach((n, i) => { out[n] = res[i]; });
      return out;
    },
    close() { if (dbPromise) { dbPromise.then((d) => d.close()).catch(() => {}); dbPromise = null; } },
  };

  /* ---------- Validação ---------- */
  const str = (v) => String(v == null ? '' : v).trim();
  const isPhoto = (v) => typeof v === 'string' && /^data:image\/(jpeg|png|webp|gif);base64,/.test(v) && v.length <= MAX_PHOTO;
  const result = (errors, value) => ({ ok: Object.keys(errors).length === 0, errors, value });
  const intOrZero = (v) => num.parseIntStrict(v === '' || v == null ? 0 : v);
  const pickKind = (v) => (v === 'frozen' ? 'frozen' : 'ready');
  const checkDate = (e, key, v, label, allowFuture) => {
    if (!dates.isValid(v)) e[key] = 'Informe uma data válida.';
    else if (!allowFuture && v > dates.today()) e[key] = 'A data ' + label + ' não pode ser futura.';
  };
  const checkExpiry = (e, v, base) => {
    if (!v) return;
    if (!dates.isValid(v)) e.expiry = 'Data de validade inválida.';
    else if (base && v < base) e.expiry = 'A validade não pode ser anterior à data de entrada.';
  };

  const validate = {
    product(i, creating) {
      const e = {}, name = str(i.name), desc = str(i.description);
      const price = num.parseMoney(i.price), cost = num.parseMoney(i.cost);
      const minStock = intOrZero(i.minStock), ready = intOrZero(i.stockReady), frozen = intOrZero(i.stockFrozen);
      if (name.length < 2 || name.length > 80) e.name = 'Informe o nome do produto (2 a 80 letras).';
      if (SL.CATEGORIES.indexOf(str(i.category)) === -1) e.category = 'Escolha uma categoria.';
      if (SL.UNITS_SALE.indexOf(str(i.unit)) === -1) e.unit = 'Escolha a unidade de venda.';
      if (desc.length > 300) e.description = 'A descrição pode ter no máximo 300 caracteres.';
      if (!(price > 0)) e.price = 'Informe o preço de venda (maior que zero).';
      else if (price > 100000) e.price = 'Valor muito alto. Confira o preço.';
      if (!(cost >= 0)) e.cost = 'Informe o custo de produção (pode ser 0).';
      else if (cost > 100000) e.cost = 'Valor muito alto. Confira o custo.';
      if (Number.isNaN(minStock) || minStock > 1000000) e.minStock = 'Use um número inteiro, 0 ou mais.';
      if (creating) {
        if (Number.isNaN(ready) || ready > 1000000) e.stockReady = 'Use um número inteiro, 0 ou mais.';
        if (Number.isNaN(frozen) || frozen > 1000000) e.stockFrozen = 'Use um número inteiro, 0 ou mais.';
      }
      if (i.photo && !isPhoto(i.photo)) e.photo = 'Foto inválida. Use JPG, PNG ou WEBP.';
      return result(e, { name, category: str(i.category), unit: str(i.unit), description: desc, price: num.round2(price), cost: num.round2(cost), minStock, stockReady: ready, stockFrozen: frozen, photo: i.photo || '' });
    },
    production(i) {
      const e = {}, qty = num.parseIntStrict(i.qty), productId = Number(i.productId);
      const ing = num.parseMoney(i.ingredientsCost === '' || i.ingredientsCost == null ? 0 : i.ingredientsCost);
      const pack = num.parseMoney(i.packagingCost === '' || i.packagingCost == null ? 0 : i.packagingCost);
      const other = num.parseMoney(i.otherCost === '' || i.otherCost == null ? 0 : i.otherCost);
      if (!Number.isInteger(productId) || productId <= 0) e.productId = 'Escolha o produto.';
      if (!(qty >= 1)) e.qty = 'Informe a quantidade (número inteiro, mínimo 1).';
      else if (qty > 1000000) e.qty = 'Quantidade muito alta.';
      checkDate(e, 'date', i.date, 'de produção');
      if (!(ing >= 0)) e.ingredientsCost = 'Valor inválido.';
      if (!(pack >= 0)) e.packagingCost = 'Valor inválido.';
      if (!(other >= 0)) e.otherCost = 'Valor inválido.';
      checkExpiry(e, str(i.expiry), i.date);
      const notes = str(i.notes); if (notes.length > 200) e.notes = 'No máximo 200 caracteres.';
      const total = (ing || 0) + (pack || 0) + (other || 0);
      return result(e, { productId, qty, date: i.date, kind: pickKind(i.kind), ingredientsCost: num.round2(ing), packagingCost: num.round2(pack), otherCost: num.round2(other), totalCost: num.round2(total), expiry: str(i.expiry), notes, updateCost: !!i.updateCost });
    },
    sale(i) {
      const e = {}, qty = num.parseIntStrict(i.qty), unitPrice = num.parseMoney(i.unitPrice), productId = Number(i.productId);
      const status = i.status === 'encomenda' ? 'encomenda' : 'concluida';
      if (!Number.isInteger(productId) || productId <= 0) e.productId = 'Escolha o produto vendido.';
      if (!(qty >= 1)) e.qty = 'Informe a quantidade (número inteiro, mínimo 1).';
      else if (qty > 1000000) e.qty = 'Quantidade muito alta.';
      if (!(unitPrice > 0)) e.unitPrice = 'Informe o valor unitário (maior que zero).';
      checkDate(e, 'date', i.date, status === 'encomenda' ? 'do pedido' : 'da venda');
      const payment = str(i.payment);
      if (status === 'concluida' && SL.PAYMENTS.indexOf(payment) === -1) e.payment = 'Escolha a forma de pagamento.';
      if (status === 'encomenda' && payment && SL.PAYMENTS.indexOf(payment) === -1) e.payment = 'Forma de pagamento inválida.';
      const customer = str(i.customer); if (customer.length > 80) e.customer = 'No máximo 80 caracteres.';
      const notes = str(i.notes); if (notes.length > 200) e.notes = 'As observações podem ter no máximo 200 caracteres.';
      const delivery = str(i.deliveryDate);
      if (status === 'encomenda') {
        if (!delivery) e.deliveryDate = 'Informe a data de entrega.';
        else if (!dates.isValid(delivery)) e.deliveryDate = 'Data de entrega inválida.';
      }
      return result(e, { productId, qty, unitPrice: num.round2(unitPrice), date: i.date, payment, customer, notes, status, stockKind: pickKind(i.stockKind), deliveryDate: status === 'encomenda' ? delivery : '' });
    },
    expense(i) {
      const e = {}, desc = str(i.description), amount = num.parseMoney(i.amount), notes = str(i.notes);
      if (desc.length < 2 || desc.length > 100) e.description = 'Descreva a despesa (2 a 100 letras).';
      if (SL.EXPENSE_CATEGORIES.indexOf(str(i.category)) === -1) e.category = 'Escolha uma categoria.';
      if (!(amount > 0)) e.amount = 'Informe o valor (maior que zero).';
      else if (amount > 10000000) e.amount = 'Valor muito alto. Confira.';
      checkDate(e, 'date', i.date, '');
      if (notes.length > 200) e.notes = 'No máximo 200 caracteres.';
      return result(e, { description: desc, category: str(i.category), amount: num.round2(amount), date: i.date, notes });
    },
    entry(i) { // entrada manual de estoque
      const e = {}, qty = num.parseIntStrict(i.qty), productId = Number(i.productId);
      if (!Number.isInteger(productId) || productId <= 0) e.productId = 'Escolha o produto.';
      if (!(qty >= 1) || qty > 1000000) e.qty = 'Informe a quantidade (inteiro, mínimo 1).';
      checkDate(e, 'date', i.date, '');
      checkExpiry(e, str(i.expiry), i.date);
      const reason = str(i.reason); if (reason.length > 120) e.reason = 'No máximo 120 caracteres.';
      return result(e, { productId, qty, kind: pickKind(i.kind), date: i.date, expiry: str(i.expiry), reason });
    },
    adjust(i) { // ajuste manual: informa a quantidade real contada
      const e = {}, newQty = num.parseIntStrict(i.newQty), productId = Number(i.productId), reason = str(i.reason);
      if (!Number.isInteger(productId) || productId <= 0) e.productId = 'Escolha o produto.';
      if (Number.isNaN(newQty) || newQty > 1000000) e.newQty = 'Informe a quantidade real (inteiro, 0 ou mais).';
      if (reason.length < 3 || reason.length > 120) e.reason = 'Explique o motivo (ex.: perda, sobra, contagem).';
      checkDate(e, 'date', i.date, '');
      return result(e, { productId, newQty, kind: pickKind(i.kind), date: i.date, reason });
    },
    convert(i) { // pronto ↔ congelado
      const e = {}, qty = num.parseIntStrict(i.qty), productId = Number(i.productId);
      if (!Number.isInteger(productId) || productId <= 0) e.productId = 'Escolha o produto.';
      if (!(qty >= 1) || qty > 1000000) e.qty = 'Informe a quantidade (inteiro, mínimo 1).';
      checkDate(e, 'date', i.date, '');
      const from = pickKind(i.from);
      return result(e, { productId, qty, from, to: from === 'ready' ? 'frozen' : 'ready', date: i.date });
    },
    settings(i) {
      const e = {}, days = num.parseIntStrict(i.expiryWarnDays), name = str(i.businessName);
      if (!(days >= 0) || days > 60) e.expiryWarnDays = 'Use um número de 0 a 60 dias.';
      if (name.length > 60) e.businessName = 'No máximo 60 caracteres.';
      return result(e, { expiryWarnDays: days, businessName: name });
    },
    recipe(i) {
      const e = {}, name = str(i.name);
      const lines = (t) => String(t || '').split('\n').map((x) => x.trim()).filter(Boolean);
      const ingredients = Array.isArray(i.ingredients) ? i.ingredients.map(str).filter(Boolean) : lines(i.ingredients);
      const steps = Array.isArray(i.steps) ? i.steps.map(str).filter(Boolean) : lines(i.steps);
      const price = i.suggestedPrice === '' || i.suggestedPrice == null ? 0 : num.parseMoney(i.suggestedPrice);
      const cost = i.estimatedCost === '' || i.estimatedCost == null ? 0 : num.parseMoney(i.estimatedCost);
      if (name.length < 2 || name.length > 80) e.name = 'Informe o nome da receita (2 a 80 letras).';
      if (SL.CATEGORIES.indexOf(str(i.category)) === -1) e.category = 'Escolha uma categoria.';
      if (!ingredients.length) e.ingredients = 'Liste os ingredientes, um por linha.';
      if (!steps.length) e.steps = 'Descreva o modo de preparo, um passo por linha.';
      if (!str(i.yield)) e.yield = 'Informe o rendimento (ex.: 30 unidades).';
      if (!str(i.time)) e.time = 'Informe o tempo de preparo (ex.: 40 min).';
      if (SL.DIFFICULTY.indexOf(str(i.difficulty)) === -1) e.difficulty = 'Escolha a dificuldade.';
      if (Number.isNaN(price) || price < 0) e.suggestedPrice = 'Valor inválido.';
      if (Number.isNaN(cost) || cost < 0) e.estimatedCost = 'Valor inválido.';
      if (i.photo && !isPhoto(i.photo)) e.photo = 'Foto inválida. Use JPG, PNG ou WEBP.';
      return result(e, {
        name, category: str(i.category), ingredients, steps, yield: str(i.yield).slice(0, 60), time: str(i.time).slice(0, 60),
        difficulty: str(i.difficulty), estimatedCost: num.round2(cost || 0), suggestedPrice: num.round2(price || 0),
        freezing: str(i.freezing).slice(0, 400), storage: str(i.storage).slice(0, 400), photo: i.photo || '',
      });
    },
  };
  SL.validate = validate;
  const fail = (v) => { if (!v.ok) throw new ValidationError(v.errors); return v.value; };

  /* ---------- Estoque: toda alteração de saldo passa por aqui e gera uma movimentação ---------- */
  const field = (kind) => (kind === 'frozen' ? 'stockFrozen' : 'stockReady');
  const needProd = async (st, id) => {
    const prod = await p(st.products.get(id));
    if (!prod) throw new SLError('Produto não encontrado. Ele pode ter sido excluído.');
    return prod;
  };
  // Aplica `delta` ao saldo (nunca negativo) e grava a movimentação.
  async function postMove(st, m) {
    const prod = await needProd(st, m.productId);
    const f = field(m.kind), next = prod[f] + m.delta;
    if (next < 0) {
      throw new SLError('O estoque ' + (m.kind === 'frozen' ? 'congelado' : 'pronto') + ' de "' + prod.name + '" ficaria negativo. Disponível agora: ' + prod[f] + '.');
    }
    prod[f] = next; prod.updatedAt = Date.now();
    await p(st.products.put(prod));
    const rec = { productId: prod.id, productName: prod.name, kind: m.kind, type: m.type, delta: m.delta, date: m.date, expiry: m.expiry || '', reason: m.reason || '', refType: m.refType || 'manual', refId: m.refId == null ? null : m.refId, createdAt: Date.now() };
    rec.id = await p(st.stock.add(rec));
    return rec;
  }
  // Desfaz todas as movimentações ligadas a um registro (produção/venda), devolvendo o saldo.
  async function undoRefs(st, refType, refId, lenient) {
    const moves = await p(st.stock.index('ref').getAll([refType, refId]));
    // desfaz primeiro as saídas (devolvem estoque), depois as entradas (podem falhar se já vendidas)
    moves.sort((a, b) => a.delta - b.delta);
    for (const m of moves) {
      const prod = await p(st.products.get(m.productId));
      if (prod) {
        const f = field(m.kind), next = prod[f] - m.delta;
        if (next < 0 && !lenient) throw new SLError('Não é possível desfazer: o estoque ' + (m.kind === 'frozen' ? 'congelado' : 'pronto') + ' de "' + prod.name + '" ficaria negativo (disponível ' + prod[f] + ').');
        prod[f] = next; prod.updatedAt = Date.now();
        await p(st.products.put(prod));
      }
      await p(st.stock.delete(m.id));
    }
    return moves;
  }
  // Confere (no fim de uma operação) que nenhum saldo do produto ficou negativo.
  async function assertBalances(st, ids) {
    for (const id of ids) {
      const prod = await p(st.products.get(id));
      if (!prod) continue;
      ['ready', 'frozen'].forEach((k) => {
        if (prod[field(k)] < 0) throw new SLError('Não é possível alterar: o estoque ' + (k === 'frozen' ? 'congelado' : 'pronto') + ' de "' + prod.name + '" ficaria negativo (já foi vendido).');
      });
    }
  }
  const recent = (list, test) => list.some((r) => Date.now() - (r.createdAt || 0) < DUP_WINDOW && test(r));
  const dupGuard = (list, test, msg, opts) => { if (!(opts && opts.force) && recent(list, test)) throw new DuplicateError(msg); };

  /* ---------- Operações de negócio ---------- */
  const ops = (SL.ops = {});
  const sameName = (a, b) => a.trim().toLowerCase() === b.trim().toLowerCase();

  // Produtos
  ops.saveProduct = async function (input, id) {
    const v = fail(validate.product(input, !id));
    return run(['products', 'stock'], 'readwrite', async (st) => {
      const all = await p(st.products.getAll());
      if (all.some((x) => x.id !== Number(id) && sameName(x.name, v.name))) throw new ValidationError({ name: 'Já existe um produto com esse nome.' });
      let rec;
      if (id) {
        const old = await p(st.products.get(Number(id)));
        if (!old) throw new SLError('Produto não encontrado.');
        rec = Object.assign({}, old, v, { id: old.id, stockReady: old.stockReady, stockFrozen: old.stockFrozen, updatedAt: Date.now() });
        rec.id = await p(st.products.put(rec));
      } else {
        const ini = { ready: v.stockReady, frozen: v.stockFrozen };
        rec = Object.assign({}, v, { stockReady: 0, stockFrozen: 0, createdAt: Date.now(), updatedAt: Date.now() });
        rec.id = await p(st.products.put(rec));
        for (const k of ['ready', 'frozen']) {
          if (ini[k] > 0) await postMove(st, { productId: rec.id, kind: k, type: 'ajuste', delta: ini[k], date: dates.today(), reason: 'Estoque inicial' });
        }
        rec = await p(st.products.get(rec.id));
      }
      return rec;
    });
  };
  ops.applyPricing = async function (id, cost, price) {
    const c = num.parseMoney(cost), pr = num.parseMoney(price);
    if (!(c >= 0) || !(pr > 0)) throw new SLError('Valores inválidos para aplicar ao produto.');
    return run(['products'], 'readwrite', async (st) => {
      const prod = await needProd(st, Number(id));
      prod.cost = num.round2(c); prod.price = num.round2(pr); prod.updatedAt = Date.now();
      await p(st.products.put(prod));
      return prod;
    });
  };
  ops.deleteProduct = (id) => run(['products', 'stock', 'sales'], 'readwrite', async (st) => {
    id = Number(id);
    const sales = await p(st.sales.getAll());
    if (sales.some((s) => s.productId === id && s.status === 'encomenda')) throw new SLError('Esse produto tem encomendas pendentes. Conclua ou exclua os pedidos antes de apagá-lo.');
    const moves = await p(st.stock.index('productId').getAll(id));
    for (const m of moves) await p(st.stock.delete(m.id));
    await p(st.products.delete(id));
  });

  // Produção: soma ao estoque (pronto ou congelado)
  async function postProductionMove(st, rec, prod) {
    await postMove(st, { productId: prod.id, kind: rec.kind, type: 'entrada', delta: rec.qty, date: rec.date, expiry: rec.expiry, reason: 'Produção', refType: 'production', refId: rec.id });
  }
  function buildProduction(v, prod) {
    return { productId: v.productId, productName: prod.name, qty: v.qty, date: v.date, kind: v.kind, ingredientsCost: v.ingredientsCost, packagingCost: v.packagingCost, otherCost: v.otherCost, totalCost: v.totalCost, unitCost: num.round4(v.totalCost / v.qty), expiry: v.expiry, notes: v.notes };
  }
  ops.registerProduction = async function (input, opts) {
    const v = fail(validate.production(input));
    return run(['products', 'productions', 'stock'], 'readwrite', async (st) => {
      const prod = await needProd(st, v.productId);
      dupGuard(await p(st.productions.getAll()), (r) => r.productId === v.productId && r.qty === v.qty && r.date === v.date && r.totalCost === v.totalCost && r.kind === v.kind,
        'Parece que essa produção já foi registrada agora há pouco.', opts);
      const rec = Object.assign(buildProduction(v, prod), { costUpdated: false, createdAt: Date.now() });
      rec.id = await p(st.productions.add(rec));
      await postProductionMove(st, rec, prod);
      if (v.updateCost && v.totalCost > 0) {
        const cur = await p(st.products.get(prod.id));
        cur.cost = num.round2(v.totalCost / v.qty); await p(st.products.put(cur));
        rec.costUpdated = true; await p(st.productions.put(rec));
      }
      return rec;
    });
  };
  ops.updateProduction = async function (id, input) {
    const v = fail(validate.production(input));
    return run(['products', 'productions', 'stock'], 'readwrite', async (st) => {
      const old = await p(st.productions.get(Number(id)));
      if (!old) throw new SLError('Registro de produção não encontrado.');
      await undoRefs(st, 'production', old.id, true);
      const prod = await needProd(st, v.productId);
      const rec = Object.assign({}, old, buildProduction(v, prod), { id: old.id });
      await p(st.productions.put(rec));
      await postProductionMove(st, rec, prod);
      await assertBalances(st, [old.productId, v.productId]);
      return rec;
    });
  };
  ops.deleteProduction = (id) => run(['products', 'productions', 'stock'], 'readwrite', async (st) => {
    const old = await p(st.productions.get(Number(id)));
    if (!old) throw new SLError('Registro de produção não encontrado.');
    await undoRefs(st, 'production', old.id);
    await p(st.productions.delete(old.id));
  });

  // Vendas: concluídas baixam o estoque; encomendas pendentes não mexem em nada até serem concluídas
  function buildSale(v, prod, keepCost) {
    const total = num.round2(v.qty * v.unitPrice);
    const unitCost = keepCost != null ? keepCost : prod.cost;
    return { productId: v.productId, productName: prod.name, qty: v.qty, unitPrice: v.unitPrice, total, unitCost, profit: num.round2(total - v.qty * unitCost), date: v.date, payment: v.payment, customer: v.customer, status: v.status, stockKind: v.stockKind, deliveryDate: v.deliveryDate, notes: v.notes };
  }
  async function postSaleMove(st, rec) {
    try {
      await postMove(st, { productId: rec.productId, kind: rec.stockKind, type: 'saida', delta: -rec.qty, date: rec.date, reason: 'Venda' + (rec.customer ? ' — ' + rec.customer : ''), refType: 'sale', refId: rec.id });
    } catch (err) {
      if (err.name === 'SLError' && /negativo/.test(err.message)) {
        const prod = await p(st.products.get(rec.productId));
        const have = prod ? prod[field(rec.stockKind)] : 0;
        throw new SLError('Estoque insuficiente de "' + rec.productName + '" (' + (rec.stockKind === 'frozen' ? 'congelado' : 'pronto') + '): disponível ' + have + ', pedido ' + rec.qty + '.');
      }
      throw err;
    }
  }
  ops.registerSale = async function (input, opts) {
    const v = fail(validate.sale(input));
    return run(['products', 'sales', 'stock'], 'readwrite', async (st) => {
      const prod = await needProd(st, v.productId);
      dupGuard(await p(st.sales.getAll()), (r) => r.productId === v.productId && r.qty === v.qty && r.date === v.date && r.unitPrice === v.unitPrice && r.status === v.status && (r.customer || '') === v.customer,
        'Parece que essa ' + (v.status === 'encomenda' ? 'encomenda' : 'venda') + ' já foi registrada agora há pouco.', opts);
      const rec = Object.assign(buildSale(v, prod), { createdAt: Date.now() });
      rec.id = await p(st.sales.add(rec));
      if (rec.status === 'concluida') await postSaleMove(st, rec);
      return rec;
    });
  };
  ops.updateSale = async function (id, input) {
    const v = fail(validate.sale(Object.assign({}, input)));
    return run(['products', 'sales', 'stock'], 'readwrite', async (st) => {
      const old = await p(st.sales.get(Number(id)));
      if (!old) throw new SLError('Venda não encontrada.');
      v.status = old.status === 'encomenda' ? 'encomenda' : 'concluida'; // o status só muda por "concluir encomenda"
      if (v.status === 'concluida' && SL.PAYMENTS.indexOf(v.payment) === -1) throw new ValidationError({ payment: 'Escolha a forma de pagamento.' });
      if (old.status !== 'encomenda') await undoRefs(st, 'sale', old.id);
      const prod = await needProd(st, v.productId);
      const rec = Object.assign({}, old, buildSale(v, prod, v.productId === old.productId ? old.unitCost : null), { id: old.id });
      await p(st.sales.put(rec));
      if (rec.status === 'concluida') await postSaleMove(st, rec);
      return rec;
    });
  };
  ops.completeOrder = async function (id, input) {
    return run(['products', 'sales', 'stock'], 'readwrite', async (st) => {
      const old = await p(st.sales.get(Number(id)));
      if (!old) throw new SLError('Encomenda não encontrada.');
      if (old.status !== 'encomenda') throw new SLError('Esse pedido já foi concluído.');
      const date = (input && input.date) || dates.today();
      const payment = str(input && input.payment) || old.payment;
      const kind = pickKind((input && input.stockKind) || old.stockKind);
      const e = {};
      checkDate(e, 'date', date, 'da venda');
      if (SL.PAYMENTS.indexOf(payment) === -1) e.payment = 'Escolha a forma de pagamento.';
      if (Object.keys(e).length) throw new ValidationError(e);
      const prod = await needProd(st, old.productId);
      const rec = Object.assign({}, old, { status: 'concluida', date, payment, stockKind: kind, deliveryDate: '', unitCost: prod.cost, completedAt: Date.now() });
      rec.profit = num.round2(rec.total - rec.qty * rec.unitCost);
      await p(st.sales.put(rec));
      await postSaleMove(st, rec);
      return rec;
    });
  };
  ops.deleteSale = (id) => run(['products', 'sales', 'stock'], 'readwrite', async (st) => {
    const old = await p(st.sales.get(Number(id)));
    if (!old) throw new SLError('Venda não encontrada.');
    if (old.status !== 'encomenda') await undoRefs(st, 'sale', old.id); // devolve ao estoque
    await p(st.sales.delete(old.id));
  });

  // Estoque manual
  ops.stockEntry = async function (input) {
    const v = fail(validate.entry(input));
    return run(['products', 'stock'], 'readwrite', (st) => postMove(st, { productId: v.productId, kind: v.kind, type: 'entrada', delta: v.qty, date: v.date, expiry: v.expiry, reason: v.reason || 'Entrada manual' }));
  };
  ops.stockAdjust = async function (input) {
    const v = fail(validate.adjust(input));
    return run(['products', 'stock'], 'readwrite', async (st) => {
      const prod = await needProd(st, v.productId);
      const delta = v.newQty - prod[field(v.kind)];
      if (delta === 0) throw new SLError('A quantidade informada já é a do sistema. Nada a ajustar.');
      return postMove(st, { productId: v.productId, kind: v.kind, type: 'ajuste', delta, date: v.date, reason: v.reason });
    });
  };
  ops.stockConvert = async function (input) {
    const v = fail(validate.convert(input));
    return run(['products', 'stock'], 'readwrite', async (st) => {
      await postMove(st, { productId: v.productId, kind: v.from, type: 'conversao', delta: -v.qty, date: v.date, reason: v.from === 'ready' ? 'Enviado ao congelador' : 'Descongelado/pronto para venda' });
      await postMove(st, { productId: v.productId, kind: v.to, type: 'conversao', delta: v.qty, date: v.date, reason: v.from === 'ready' ? 'Enviado ao congelador' : 'Descongelado/pronto para venda' });
    });
  };

  // Despesas
  ops.saveExpense = async function (input, id, opts) {
    const v = fail(validate.expense(input));
    return run(['expenses'], 'readwrite', async (st) => {
      let rec;
      if (id) {
        const old = await p(st.expenses.get(Number(id)));
        if (!old) throw new SLError('Despesa não encontrada.');
        rec = Object.assign({}, old, v);
      } else {
        dupGuard(await p(st.expenses.getAll()), (r) => r.description === v.description && r.amount === v.amount && r.date === v.date, 'Parece que essa despesa já foi registrada agora há pouco.', opts);
        rec = Object.assign({}, v, { createdAt: Date.now() });
      }
      rec.id = await p(st.expenses.put(rec));
      return rec;
    });
  };
  ops.deleteExpense = (id) => SL.db.delete('expenses', Number(id));

  // Receitas cadastradas pelo usuário
  ops.saveRecipe = async function (input, id) {
    const v = fail(validate.recipe(input));
    return run(['recipes'], 'readwrite', async (st) => {
      const all = await p(st.recipes.getAll());
      if (all.some((x) => x.id !== Number(id) && sameName(x.name, v.name))) throw new ValidationError({ name: 'Você já tem uma receita com esse nome.' });
      let rec;
      if (id) {
        const old = await p(st.recipes.get(Number(id)));
        if (!old) throw new SLError('Receita não encontrada.');
        rec = Object.assign({}, old, v);
      } else rec = Object.assign({}, v, { createdAt: Date.now() });
      rec.id = await p(st.recipes.put(rec));
      return rec;
    });
  };
  ops.deleteRecipe = (id) => SL.db.delete('recipes', Number(id));

  ops.saveSettings = async function (input) {
    const v = fail(validate.settings(input));
    await run(['settings'], 'readwrite', async (st) => { for (const k of Object.keys(v)) await p(st.settings.put({ key: k, value: v[k] })); });
    return v;
  };

  /* ---------- Backup e restauração ---------- */
  const backup = (SL.backup = {});
  backup.build = async function () {
    const data = {};
    for (const s of STORES) data[s] = await SL.db.getAll(s);
    return { app: 'salgado-lucrativo', version: 1, exportedAt: new Date().toISOString(), mode: SL.mode.get(), data };
  };

  const isObj = (x) => x && typeof x === 'object' && !Array.isArray(x);
  const okId = (x) => Number.isInteger(x) && x > 0;
  const finite = (x) => typeof x === 'number' && Number.isFinite(x);
  const ts = (x) => (finite(x) ? x : Date.now());
  const oneOf = (list, v, d) => (list.indexOf(v) >= 0 ? v : d);
  const dateOr = (v) => (dates.isValid(v) ? v : '');
  const sanitizers = {
    products(r) {
      if (!isObj(r) || !okId(r.id) || typeof r.name !== 'string' || !finite(r.price) || !finite(r.cost) || !Number.isInteger(r.stockReady) || r.stockReady < 0 || !Number.isInteger(r.stockFrozen) || r.stockFrozen < 0) return null;
      return { id: r.id, name: r.name.slice(0, 80), category: oneOf(SL.CATEGORIES, r.category, 'Outros'), unit: oneOf(SL.UNITS_SALE, r.unit, 'unidade'), description: String(r.description || '').slice(0, 300), price: r.price, cost: r.cost, minStock: Number.isInteger(r.minStock) && r.minStock >= 0 ? r.minStock : 0, stockReady: r.stockReady, stockFrozen: r.stockFrozen, photo: isPhoto(r.photo) ? r.photo : '', createdAt: ts(r.createdAt), updatedAt: ts(r.updatedAt) };
    },
    productions(r) {
      if (!isObj(r) || !okId(r.id) || !okId(r.productId) || !Number.isInteger(r.qty) || r.qty < 1 || !dates.isValid(r.date) || !finite(r.totalCost)) return null;
      return { id: r.id, productId: r.productId, productName: String(r.productName || '').slice(0, 80), qty: r.qty, date: r.date, kind: pickKind(r.kind), ingredientsCost: finite(r.ingredientsCost) ? r.ingredientsCost : r.totalCost, packagingCost: finite(r.packagingCost) ? r.packagingCost : 0, otherCost: finite(r.otherCost) ? r.otherCost : 0, totalCost: r.totalCost, unitCost: finite(r.unitCost) ? r.unitCost : num.round4(r.totalCost / r.qty), expiry: dateOr(r.expiry), notes: String(r.notes || '').slice(0, 200), costUpdated: !!r.costUpdated, createdAt: ts(r.createdAt) };
    },
    sales(r) {
      if (!isObj(r) || !okId(r.id) || !okId(r.productId) || !Number.isInteger(r.qty) || r.qty < 1 || !dates.isValid(r.date) || !finite(r.unitPrice) || !finite(r.total) || !finite(r.unitCost) || !finite(r.profit)) return null;
      const status = r.status === 'encomenda' ? 'encomenda' : 'concluida';
      return { id: r.id, productId: r.productId, productName: String(r.productName || '').slice(0, 80), qty: r.qty, unitPrice: r.unitPrice, total: r.total, unitCost: r.unitCost, profit: r.profit, date: r.date, payment: oneOf(SL.PAYMENTS, r.payment, status === 'encomenda' ? '' : 'Pix'), customer: String(r.customer || '').slice(0, 80), status, stockKind: pickKind(r.stockKind), deliveryDate: dateOr(r.deliveryDate), notes: String(r.notes || '').slice(0, 200), createdAt: ts(r.createdAt) };
    },
    expenses(r) {
      if (!isObj(r) || !okId(r.id) || typeof r.description !== 'string' || !finite(r.amount) || r.amount <= 0 || !dates.isValid(r.date)) return null;
      return { id: r.id, description: r.description.slice(0, 100), category: oneOf(SL.EXPENSE_CATEGORIES, r.category, 'Outras despesas'), amount: r.amount, date: r.date, notes: String(r.notes || '').slice(0, 200), createdAt: ts(r.createdAt) };
    },
    stock(r) {
      if (!isObj(r) || !okId(r.id) || !okId(r.productId) || !Number.isInteger(r.delta) || r.delta === 0 || !dates.isValid(r.date) || SL.MOVE_TYPES.indexOf(r.type) === -1) return null;
      return { id: r.id, productId: r.productId, productName: String(r.productName || '').slice(0, 80), kind: pickKind(r.kind), type: r.type, delta: r.delta, date: r.date, expiry: dateOr(r.expiry), reason: String(r.reason || '').slice(0, 120), refType: ['production', 'sale', 'manual'].indexOf(r.refType) >= 0 ? r.refType : 'manual', refId: Number.isInteger(r.refId) ? r.refId : null, createdAt: ts(r.createdAt) };
    },
    settings(r) {
      if (!isObj(r) || typeof r.key !== 'string' || !r.key || r.key.length > 60) return null;
      const t = typeof r.value;
      if (!(r.value === null || t === 'string' || t === 'number' || t === 'boolean')) return null;
      return { key: r.key, value: r.value };
    },
    recipes(r) {
      if (!isObj(r) || !okId(r.id) || typeof r.name !== 'string') return null;
      const arr = (a) => (Array.isArray(a) ? a.map((x) => String(x).slice(0, 300)).slice(0, 80) : []);
      return { id: r.id, name: r.name.slice(0, 80), category: oneOf(SL.CATEGORIES, r.category, 'Outros'), ingredients: arr(r.ingredients), steps: arr(r.steps), yield: String(r.yield || '').slice(0, 60), time: String(r.time || '').slice(0, 60), difficulty: oneOf(SL.DIFFICULTY, r.difficulty, 'Fácil'), estimatedCost: finite(r.estimatedCost) ? r.estimatedCost : 0, suggestedPrice: finite(r.suggestedPrice) ? r.suggestedPrice : 0, freezing: String(r.freezing || '').slice(0, 400), storage: String(r.storage || '').slice(0, 400), photo: isPhoto(r.photo) ? r.photo : '', createdAt: ts(r.createdAt) };
    },
  };

  // Lê e valida o texto de um arquivo de backup. Lança SLError com mensagem clara se estiver inválido.
  backup.parse = function (text) {
    let obj;
    try { obj = JSON.parse(text); } catch (e) { throw new SLError('Esse arquivo não é um backup válido (JSON ilegível).'); }
    if (!isObj(obj) || obj.app !== 'salgado-lucrativo' || !isObj(obj.data)) throw new SLError('Esse arquivo não parece ser um backup do Salgado Lucrativo.');
    if (obj.version !== 1) throw new SLError('Versão de backup não suportada.');
    const clean = {};
    for (const s of STORES) {
      const list = obj.data[s];
      if (list === undefined && (s === 'recipes' || s === 'settings')) { clean[s] = []; continue; }
      if (!Array.isArray(list)) throw new SLError('Backup incompleto: faltam dados de "' + SL.STORE_LABELS[s] + '".');
      clean[s] = [];
      const seen = new Set();
      for (let i = 0; i < list.length; i++) {
        const r = sanitizers[s](list[i]);
        if (!r) throw new SLError('Backup corrompido: registro ' + (i + 1) + ' de "' + SL.STORE_LABELS[s] + '" é inválido. Nada foi alterado.');
        const key = s === 'settings' ? r.key : r.id;
        if (seen.has(key)) throw new SLError('Backup corrompido: registros duplicados em "' + SL.STORE_LABELS[s] + '". Nada foi alterado.');
        seen.add(key); clean[s].push(r);
      }
    }
    const bad = SL.calc.stockProblems(clean.products, clean.stock);
    if (bad.length) throw new SLError('Backup inconsistente: o estoque não bate com o histórico de movimentações (' + bad.slice(0, 3).join(', ') + '). Nada foi alterado.');
    return { exportedAt: obj.exportedAt, mode: obj.mode, data: clean };
  };
  backup.counts = (parsed) => {
    const o = {}; STORES.forEach((s) => { o[s] = parsed.data[s].length; }); return o;
  };

  // Substitui TODOS os dados atuais pelos do backup, de forma atômica.
  backup.restore = async function (parsed) {
    await run(STORES, 'readwrite', async (st) => {
      for (const s of STORES) {
        await p(st[s].clear());
        for (const r of parsed.data[s]) await p(st[s].put(r));
      }
    });
  };
  backup.wipe = () => run(STORES, 'readwrite', async (st) => { for (const s of STORES) await p(st[s].clear()); });
  SL.STORES = STORES;

  /* ---------- Modo demonstração (banco separado; nunca mistura com os dados reais) ---------- */
  SL.demo = {
    async seed() {
      let a = 20261111;
      const rnd = () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
      const ri = (lo, hi) => lo + Math.floor(rnd() * (hi - lo + 1));
      const now = Date.now();
      const defs = [
        ['Coxinha de frango', 'Coxinhas', 'Massa macia com frango temperado e catupiry.', 5.5, 1.6],
        ['Pastel de carne', 'Pastéis', 'Pastel de feira, massa sequinha e crocante.', 7, 2.3],
        ['Empada de frango', 'Empadas', 'Massa amanteigada e recheio cremoso.', 6, 1.9],
        ['Esfiha de carne', 'Esfihas', 'Aberta, com carne temperada e limão.', 5, 1.5],
        ['Quibe de carne', 'Quibes', 'Trigo, hortelã e carne moída.', 5.5, 1.7],
        ['Risole de presunto e queijo', 'Risoles', 'Empanado e crocante por fora.', 5.5, 1.6],
        ['Enroladinho de salsicha', 'Enroladinhos', 'Massa fofinha e salsicha.', 4.5, 1.2],
        ['Pão de queijo', 'Pães e assados', 'Mineirinho, quentinho e elástico.', 3.5, 0.9],
        ['Mini coxinha (cento)', 'Mini salgados', 'Cento de mini coxinhas para festa.', 95, 31],
        ['Folhado de queijo', 'Folhados', 'Massa folhada com queijo derretido.', 6.5, 2.1],
      ];
      const products = defs.map((x, i) => ({ id: i + 1, name: x[0], category: x[1], unit: x[0].indexOf('cento') >= 0 ? 'cento' : 'unidade', description: x[2], price: x[3], cost: x[4], minStock: x[0].indexOf('cento') >= 0 ? 0 : 20, stockReady: 0, stockFrozen: 0, photo: '', createdAt: now, updatedAt: now }));
      const productions = [], sales = [], expenses = [], stock = [];
      const move = (prod, kind, type, delta, date, reason, refType, refId, expiry) => {
        prod[kind === 'frozen' ? 'stockFrozen' : 'stockReady'] += delta;
        stock.push({ id: stock.length + 1, productId: prod.id, productName: prod.name, kind, type, delta, date, expiry: expiry || '', reason, refType: refType || 'manual', refId: refId == null ? null : refId, createdAt: now });
      };
      const produce = (prod, qty, date, kind, expiry) => {
        const ing = num.round2(qty * prod.cost * 0.72), pack = num.round2(qty * prod.cost * 0.18), other = num.round2(qty * prod.cost * 0.1);
        const total = num.round2(ing + pack + other);
        const rec = { id: productions.length + 1, productId: prod.id, productName: prod.name, qty, date, kind, ingredientsCost: ing, packagingCost: pack, otherCost: other, totalCost: total, unitCost: num.round4(total / qty), expiry: expiry || '', notes: '', costUpdated: false, createdAt: now };
        productions.push(rec);
        move(prod, kind, 'entrada', qty, date, 'Produção', 'production', rec.id, expiry);
      };
      const today = dates.today();
      const bigBatch = (prod) => (prod.unit === 'cento' ? 1 : ri(4, 9) * 10);
      for (let off = 80; off >= 0; off--) {
        const day = dates.addDays(today, -off);
        const dow = dates.parse(day).getDay();
        if (dow === 1 || dow === 4 || off % 9 === 0) {
          const prod = products[ri(0, products.length - 1)], frozen = rnd() < 0.6;
          produce(prod, bigBatch(prod), day, frozen ? 'frozen' : 'ready', frozen ? dates.addDays(day, 90) : dates.addDays(day, 3));
        }
        if (dow !== 0 || rnd() > 0.5) {
          const n = ri(1, 4) + (dow === 5 || dow === 6 ? 2 : 0);
          for (let k = 0; k < n; k++) {
            const prod = products[ri(0, products.length - 1)];
            const qty = prod.unit === 'cento' ? 1 : ri(3, 20);
            if (prod.stockReady < qty) { // assa/frita o que estava no congelador
              const mv = Math.min(prod.stockFrozen, qty - prod.stockReady + (prod.unit === 'cento' ? 0 : 10));
              if (mv > 0) { move(prod, 'frozen', 'conversao', -mv, day, 'Descongelado/pronto para venda'); move(prod, 'ready', 'conversao', mv, day, 'Descongelado/pronto para venda'); }
            }
            if (prod.stockReady < qty) continue;
            const total = num.round2(qty * prod.price);
            const rec = { id: sales.length + 1, productId: prod.id, productName: prod.name, qty, unitPrice: prod.price, total, unitCost: prod.cost, profit: num.round2(total - qty * prod.cost), date: day, payment: SL.PAYMENTS[ri(0, 4)], customer: rnd() < 0.3 ? ['Dona Marta', 'Lanchonete Sol', 'Carlos', 'Aniversário da Bia', 'Escritório JM'][ri(0, 4)] : '', status: 'concluida', stockKind: 'ready', deliveryDate: '', notes: '', createdAt: now };
            sales.push(rec);
            move(prod, 'ready', 'saida', -qty, day, 'Venda' + (rec.customer ? ' — ' + rec.customer : ''), 'sale', rec.id);
          }
        }
        if (dow === 2) {
          const cats = ['Ingredientes', 'Carnes e recheios', 'Farinhas e massas', 'Queijos e laticínios', 'Óleo e gordura', 'Embalagens'];
          const c = cats[ri(0, cats.length - 1)];
          expenses.push({ id: expenses.length + 1, description: 'Compra: ' + c.toLowerCase(), category: c, amount: num.round2(ri(6000, 22000) / 100), date: day, notes: '', createdAt: now });
        }
        if (dates.parse(day).getDate() === 5) {
          expenses.push({ id: expenses.length + 1, description: 'Conta de energia', category: 'Energia', amount: num.round2(ri(11000, 19000) / 100), date: day, notes: 'Fornos e freezer', createdAt: now });
          expenses.push({ id: expenses.length + 1, description: 'Botijão de gás', category: 'Gás', amount: 125, date: day, notes: '', createdAt: now });
        }
      }
      // Reposição final: estoque saudável em quase tudo (o último produto fica baixo para mostrar o alerta)
      const low = products[products.length - 1];
      products.forEach((prod) => {
        if (prod === low) return;
        const total = prod.stockReady + prod.stockFrozen;
        if (prod.stockReady < 15 && prod.unit !== 'cento') produce(prod, ri(3, 5) * 10, today, 'ready', dates.addDays(today, 3));
        else if (total < 1 && prod.unit === 'cento') produce(prod, 2, today, 'frozen', dates.addDays(today, 90));
      });
      if (low.stockFrozen > 0) move(low, 'frozen', 'ajuste', -low.stockFrozen, today, 'Contagem do freezer');
      if (low.stockReady > 6) move(low, 'ready', 'ajuste', 6 - low.stockReady, today, 'Perda / contagem');
      else if (low.stockReady < 6) move(low, 'ready', 'ajuste', 6 - low.stockReady, today, 'Contagem');
      // Um lote perto do vencimento para demonstrar o alerta de validade
      produce(products[3], 12, dates.addDays(today, -1), 'ready', dates.addDays(today, 1));
      // Encomendas pendentes (não afetam estoque nem faturamento até serem concluídas)
      [[0, 60, 'Festa da Júlia', 2], [4, 30, 'Escritório JM', 4], [8, 1, 'Buffet Sabor & Cia', 6]].forEach((o) => {
        const prod = products[o[0]], total = num.round2(o[1] * prod.price);
        sales.push({ id: sales.length + 1, productId: prod.id, productName: prod.name, qty: o[1], unitPrice: prod.price, total, unitCost: prod.cost, profit: num.round2(total - o[1] * prod.cost), date: today, payment: '', customer: o[2], status: 'encomenda', stockKind: 'ready', deliveryDate: dates.addDays(today, o[3]), notes: 'Entrega combinada por WhatsApp', createdAt: now });
      });
      await run(STORES, 'readwrite', async (st) => {
        for (const s of STORES) await p(st[s].clear());
        for (const r of products) await p(st.products.put(r));
        for (const r of productions) await p(st.productions.put(r));
        for (const r of sales) await p(st.sales.put(r));
        for (const r of expenses) await p(st.expenses.put(r));
        for (const r of stock) await p(st.stock.put(r));
        await p(st.settings.put({ key: 'seeded', value: true }));
      });
    },
    async ensure() { if (SL.mode.isDemo() && !(await SL.db.getSetting('seeded', false))) await SL.demo.seed(); },
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
