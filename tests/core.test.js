/* Testes do núcleo (Node 18+): npm i fake-indexeddb && node --test tests/ */
const test = require('node:test');
const assert = require('node:assert/strict');
require('fake-indexeddb/auto');
const path = require('path');
require(path.join(__dirname, '../js/calc.js'));
require(path.join(__dirname, '../js/database.js'));
const SL = globalThis.SL;
const { calc, dates, num } = SL;
const today = dates.today();

async function fresh() {
  SL.db.close();
  await new Promise((r) => { const q = indexedDB.deleteDatabase('salgado-lucrativo'); q.onsuccess = q.onerror = q.onblocked = () => r(); });
  await SL.db.open();
}
const prodIn = (o) => Object.assign({ name: 'Coxinha', category: 'Coxinhas', unit: 'unidade', price: '5,50', cost: '1,60', minStock: '10' }, o || {});
async function invariant() {
  const d = await SL.db.loadAll();
  assert.deepEqual(calc.stockProblems(d.products, d.stock), []);
  d.products.forEach((p) => { assert.ok(p.stockReady >= 0 && p.stockFrozen >= 0); });
  return d;
}
const prodRec = (productId, o) => Object.assign({ productId, qty: '50', date: today, kind: 'ready', ingredientsCost: '50', packagingCost: '10', otherCost: '5' }, o || {});

test('números e datas', () => {
  assert.equal(num.parseMoney('1.234,56'), 1234.56);
  assert.equal(num.parseMoney('R$ 10'), 10);
  assert.ok(Number.isNaN(num.parseMoney('abc')));
  assert.ok(Number.isNaN(num.parseIntStrict('1,5')));
  assert.equal(dates.addDays('2026-03-01', -1), '2026-02-28');
  assert.equal(dates.isValid('2026-02-30'), false);
});

test('custo por ingrediente converte unidades', () => {
  assert.equal(calc.ingredientCost({ qty: '250', unit: 'g', packQty: '1', packUnit: 'kg', packPrice: '30' }).cost, 7.5);
  assert.equal(calc.ingredientCost({ qty: '500', unit: 'ml', packQty: '1', packUnit: 'l', packPrice: '8' }).cost, 4);
  assert.equal(calc.ingredientCost({ qty: '6', unit: 'un', packQty: '1', packUnit: 'dz', packPrice: '12' }).cost, 6);
  assert.equal(calc.ingredientCost({ qty: '1', unit: 'g', packQty: '1', packUnit: 'l', packPrice: '5' }).ok, false);
  assert.equal(calc.ingredientsTotal([{ qty: '250', unit: 'g', packQty: '1', packUnit: 'kg', packPrice: '30' }, { qty: '2', unit: 'un', packQty: '12', packUnit: 'un', packPrice: '12' }]).total, 9.5);
});

test('calculadora: margem × markup', () => {
  const m = calc.priceCalc({ ingredients: '40', packaging: '8', other: '2', qty: '25', margin: '50', mode: 'margin' });
  assert.equal(m.unitCost, 2); assert.equal(m.recommended, 4); assert.equal(m.marginReal, 50); assert.equal(m.markupReal, 100);
  const k = calc.priceCalc({ ingredients: '40', packaging: '8', other: '2', qty: '25', margin: '50', mode: 'markup' });
  assert.equal(k.recommended, 3); assert.equal(k.marginReal, 33.33);
  assert.equal(calc.priceCalc({ ingredients: '10', qty: '0', margin: '30' }).ok, false);
  assert.equal(calc.priceCalc({ ingredients: '10', qty: '5', margin: '100', mode: 'margin' }).ok, false);
});

test('produto: validação, nome único e estoque inicial com histórico', async () => {
  await fresh();
  await assert.rejects(SL.ops.saveProduct({ name: '', price: '0' }), (e) => !!(e.name === 'ValidationError' && e.errors.name && e.errors.price && e.errors.unit));
  const p = await SL.ops.saveProduct(prodIn({ stockReady: '20', stockFrozen: '30' }));
  assert.equal(p.stockReady, 20); assert.equal(p.stockFrozen, 30);
  const d = await invariant(); assert.equal(d.stock.length, 2);
  await assert.rejects(SL.ops.saveProduct(prodIn({ name: ' coxinha ' })), (e) => !!(e.errors && e.errors.name));
  // edição não altera saldo
  const e2 = await SL.ops.saveProduct(prodIn({ price: '6', stockReady: '999' }), p.id);
  assert.equal(e2.stockReady, 20); assert.equal(e2.price, 6);
});

test('produção soma ao estoque (pronto/congelado) e gera movimento', async () => {
  await fresh();
  const p = await SL.ops.saveProduct(prodIn());
  const r = await SL.ops.registerProduction(prodRec(p.id, { qty: '40', kind: 'frozen', expiry: dates.addDays(today, 90) }));
  assert.equal(r.totalCost, 65); assert.equal(r.unitCost, 1.625);
  let d = await invariant();
  assert.equal(d.products[0].stockFrozen, 40); assert.equal(d.products[0].stockReady, 0);
  await assert.rejects(SL.ops.registerProduction(prodRec(p.id, { qty: '40', kind: 'frozen' })), (e) => !!(e.name === 'DuplicateError'));
  await SL.ops.registerProduction(prodRec(p.id, { qty: '40', kind: 'frozen' }), { force: true });
  d = await invariant(); assert.equal(d.products[0].stockFrozen, 80);
  await assert.rejects(SL.ops.registerProduction(prodRec(p.id, { date: dates.addDays(today, 1) })), (e) => !!(e.errors.date));
  await assert.rejects(SL.ops.registerProduction(prodRec(p.id, { expiry: dates.addDays(today, -1) })), (e) => !!(e.errors.expiry));
});

test('atualizar custo do produto a partir da produção', async () => {
  await fresh();
  const p = await SL.ops.saveProduct(prodIn());
  await SL.ops.registerProduction(prodRec(p.id, { qty: '65', updateCost: true }));
  const d = await invariant(); assert.equal(d.products[0].cost, 1);
});

test('venda: baixa estoque, bloqueia acima do estoque e restaura ao excluir', async () => {
  await fresh();
  const p = await SL.ops.saveProduct(prodIn());
  await SL.ops.registerProduction(prodRec(p.id, { qty: '10' }));
  const s = await SL.ops.registerSale({ productId: p.id, qty: '4', unitPrice: '5,50', date: today, payment: 'Pix', customer: 'Ana' });
  assert.equal(s.total, 22); assert.equal(s.profit, 15.6); assert.equal(s.status, 'concluida');
  let d = await invariant(); assert.equal(d.products[0].stockReady, 6);
  await assert.rejects(SL.ops.registerSale({ productId: p.id, qty: '7', unitPrice: '5', date: today, payment: 'Pix' }), /Estoque insuficiente/);
  d = await invariant(); assert.equal(d.products[0].stockReady, 6); assert.equal(d.sales.length, 1); // nada ficou pela metade
  await SL.ops.updateSale(s.id, { productId: p.id, qty: '6', unitPrice: '5,50', date: today, payment: 'Dinheiro', customer: 'Ana' });
  d = await invariant(); assert.equal(d.products[0].stockReady, 4);
  await assert.rejects(SL.ops.updateSale(s.id, { productId: p.id, qty: '11', unitPrice: '5', date: today, payment: 'Pix' }), /insuficiente/);
  d = await invariant(); assert.equal(d.products[0].stockReady, 4); assert.equal(d.sales[0].qty, 6);
  await SL.ops.deleteSale(s.id);
  d = await invariant(); assert.equal(d.products[0].stockReady, 10); assert.equal(d.sales.length, 0);
  await assert.rejects(SL.ops.registerSale({ productId: p.id, qty: '1', unitPrice: '5', date: today, payment: 'Cheque' }), (e) => !!(e.errors.payment));
});

test('venda de congelado usa só o estoque congelado', async () => {
  await fresh();
  const p = await SL.ops.saveProduct(prodIn({ stockReady: '5', stockFrozen: '20' }));
  await assert.rejects(SL.ops.registerSale({ productId: p.id, qty: '8', unitPrice: '5', date: today, payment: 'Pix' }), /Estoque insuficiente/);
  await SL.ops.registerSale({ productId: p.id, qty: '8', unitPrice: '5', date: today, payment: 'Pix', stockKind: 'frozen' });
  const d = await invariant(); assert.equal(d.products[0].stockFrozen, 12); assert.equal(d.products[0].stockReady, 5);
});

test('encomenda pendente não mexe em estoque nem faturamento até concluir', async () => {
  await fresh();
  const p = await SL.ops.saveProduct(prodIn({ stockReady: '30' }));
  const o = await SL.ops.registerSale({ productId: p.id, qty: '20', unitPrice: '5', date: today, status: 'encomenda', deliveryDate: dates.addDays(today, 3), customer: 'Festa' });
  let d = await invariant();
  assert.equal(d.products[0].stockReady, 30); assert.equal(calc.summarize(d, today, today).revenue, 0); assert.equal(calc.summarize(d).pendingOrders, 1);
  await assert.rejects(SL.ops.registerSale({ productId: p.id, qty: '20', unitPrice: '5', date: today, status: 'encomenda' }), (e) => !!(e.errors.deliveryDate));
  await assert.rejects(SL.ops.deleteProduct(p.id), /encomendas pendentes/);
  await SL.ops.completeOrder(o.id, { payment: 'Pix' });
  d = await invariant();
  assert.equal(d.products[0].stockReady, 10); assert.equal(calc.summarize(d, today, today).revenue, 100); assert.equal(calc.summarize(d).pendingOrders, 0);
  await assert.rejects(SL.ops.completeOrder(o.id, { payment: 'Pix' }), /já foi concluído/);
  // concluir sem estoque falha e mantém pendente
  const o2 = await SL.ops.registerSale({ productId: p.id, qty: '50', unitPrice: '5', date: today, status: 'encomenda', deliveryDate: today });
  await assert.rejects(SL.ops.completeOrder(o2.id, { payment: 'Pix' }), /insuficiente/);
  d = await invariant(); assert.equal(d.sales.find((s) => s.id === o2.id).status, 'encomenda');
  await SL.ops.deleteSale(o2.id); // excluir pendente não altera estoque
  d = await invariant(); assert.equal(d.products[0].stockReady, 10);
});

test('editar/excluir produção reverte o estoque e respeita saldo', async () => {
  await fresh();
  const p = await SL.ops.saveProduct(prodIn());
  const r = await SL.ops.registerProduction(prodRec(p.id, { qty: '30' }));
  await SL.ops.registerSale({ productId: p.id, qty: '25', unitPrice: '5', date: today, payment: 'Pix' });
  await assert.rejects(SL.ops.deleteProduction(r.id), /negativo/);
  await assert.rejects(SL.ops.updateProduction(r.id, prodRec(p.id, { qty: '20' })), /negativo/);
  let d = await invariant(); assert.equal(d.products[0].stockReady, 5); assert.equal(d.productions[0].qty, 30);
  await SL.ops.updateProduction(r.id, prodRec(p.id, { qty: '40' })); // aumentar é permitido
  d = await invariant(); assert.equal(d.products[0].stockReady, 15);
  await SL.ops.deleteProduction((await SL.db.getAll('productions'))[0].id).catch((e) => assert.match(e.message, /negativo/));
});

test('entrada, ajuste e conversão manuais', async () => {
  await fresh();
  const p = await SL.ops.saveProduct(prodIn());
  await SL.ops.stockEntry({ productId: p.id, qty: '30', kind: 'frozen', date: today, expiry: dates.addDays(today, 60), reason: 'Compra pronta' });
  await SL.ops.stockConvert({ productId: p.id, from: 'frozen', qty: '10', date: today });
  let d = await invariant(); assert.equal(d.products[0].stockFrozen, 20); assert.equal(d.products[0].stockReady, 10);
  await assert.rejects(SL.ops.stockConvert({ productId: p.id, from: 'ready', qty: '11', date: today }), /negativo/);
  d = await invariant(); assert.equal(d.products[0].stockReady, 10);
  await SL.ops.stockAdjust({ productId: p.id, kind: 'ready', newQty: '7', reason: 'Perda na fritura', date: today });
  d = await invariant(); assert.equal(d.products[0].stockReady, 7);
  await assert.rejects(SL.ops.stockAdjust({ productId: p.id, kind: 'ready', newQty: '7', reason: 'igual', date: today }), /Nada a ajustar/);
  await assert.rejects(SL.ops.stockAdjust({ productId: p.id, kind: 'ready', newQty: '-3', reason: 'x', date: today }), (e) => !!(e.errors.newQty && e.errors.reason));
  assert.equal(calc.lowStock(d.products).length, 0); // total 27 > mínimo 10
  await SL.ops.stockAdjust({ productId: p.id, kind: 'frozen', newQty: '2', reason: 'Queda de energia', date: today });
  d = await invariant(); assert.equal(calc.lowStock(d.products).length, 1);
});

test('lotes FIFO e alertas de validade', async () => {
  await fresh();
  const p = await SL.ops.saveProduct(prodIn());
  await SL.ops.stockEntry({ productId: p.id, qty: '10', kind: 'ready', date: dates.addDays(today, -5), expiry: dates.addDays(today, 1) });
  await SL.ops.stockEntry({ productId: p.id, qty: '10', kind: 'ready', date: dates.addDays(today, -1), expiry: dates.addDays(today, 20) });
  await SL.ops.registerSale({ productId: p.id, qty: '4', unitPrice: '5', date: today, payment: 'Pix' });
  const d = await invariant();
  const b = calc.batches(d.stock, p.id, 'ready');
  assert.deepEqual(b.map((x) => x.qty), [6, 10]);
  const al = calc.expiryAlerts(d.stock, d.products, today, 3);
  assert.equal(al.length, 1); assert.equal(al[0].qty, 6); assert.equal(al[0].days, 1);
});

test('despesas: validação, observação e duplicidade', async () => {
  await fresh();
  const e = { description: 'Farinha', category: 'Farinhas e massas', amount: '45,90', date: today, notes: 'Saco 25kg' };
  const r = await SL.ops.saveExpense(e);
  assert.equal(r.amount, 45.9); assert.equal(r.notes, 'Saco 25kg');
  await assert.rejects(SL.ops.saveExpense(e), (x) => !!(x.name === 'DuplicateError'));
  await SL.ops.saveExpense(e, null, { force: true });
  await assert.rejects(SL.ops.saveExpense({ description: 'x', category: 'Foo', amount: '0', date: 'x' }), (x) => !!(x.errors.category && x.errors.amount && x.errors.date));
  assert.equal(SL.EXPENSE_CATEGORIES.length, 14); assert.equal(SL.CATEGORIES.length, 11); assert.equal(SL.PAYMENTS.length, 5);
});

test('resumo financeiro e relatórios', async () => {
  const data = {
    sales: [
      { productId: 1, productName: 'A', qty: 10, total: 100, unitCost: 3, profit: 70, date: '2026-05-10', payment: 'Pix', status: 'concluida' },
      { productId: 2, productName: 'B', qty: 5, total: 50, unitCost: 2, profit: 40, date: '2026-05-11', payment: 'Dinheiro', status: 'concluida' },
      { productId: 2, productName: 'B', qty: 99, total: 999, unitCost: 2, profit: 800, date: '2026-05-11', payment: '', status: 'encomenda' },
    ],
    productions: [{ qty: 20, totalCost: 40, date: '2026-05-10' }], expenses: [{ amount: 30, category: 'Gás', date: '2026-05-11' }],
  };
  const s = calc.summarize(data, '2026-05-01', '2026-05-31');
  assert.equal(s.revenue, 150); assert.equal(s.cogs, 40); assert.equal(s.grossProfit, 110); assert.equal(s.estimatedProfit, 120); assert.equal(s.pendingValue, 999);
  assert.equal(calc.topProducts(data.sales, '2026-05-01', '2026-05-31', 5)[0].name, 'A');
  assert.equal(calc.mostProfitable(data.sales, '2026-05-01', '2026-05-31', 5)[0].name, 'A');
  assert.equal(calc.salesByPayment(data.sales).length, 2);
  const sr = calc.series(data, 'day', '2026-05-09', '2026-05-12'); assert.deepEqual(sr.revenue, [0, 100, 50, 0]);
  assert.equal(calc.csvCell('=1+1'), "'=1+1"); assert.equal(calc.csvCell(1.5), '1,5'); assert.equal(calc.csvCell('a;b'), '"a;b"');
});

test('backup: gera, valida, restaura de forma atômica e rejeita arquivos ruins', async () => {
  await fresh();
  const p = await SL.ops.saveProduct(prodIn());
  await SL.ops.registerProduction(prodRec(p.id, { qty: '30', expiry: dates.addDays(today, 3) }));
  await SL.ops.registerSale({ productId: p.id, qty: '5', unitPrice: '5', date: today, payment: 'Pix' });
  await SL.ops.saveExpense({ description: 'Gás', category: 'Gás', amount: '120', date: today });
  await SL.ops.saveSettings({ expiryWarnDays: '5', businessName: 'Salgados da Ana' });
  const b = JSON.parse(JSON.stringify(await SL.backup.build()));
  assert.deepEqual(Object.keys(b.data).sort(), [...SL.STORES].sort());
  const parsed = SL.backup.parse(JSON.stringify(b));
  assert.equal(SL.backup.counts(parsed).stock, 2);
  await fresh(); await SL.backup.restore(parsed);
  const d = await invariant(); assert.equal(d.products[0].stockReady, 25); assert.equal((await SL.db.settings()).expiryWarnDays, 5);
  assert.throws(() => SL.backup.parse('não é json'), /ilegível/);
  assert.throws(() => SL.backup.parse(JSON.stringify({ app: 'doce-lucrativo', version: 1, data: {} })), /Salgado Lucrativo/);
  const bad = JSON.parse(JSON.stringify(b)); bad.data.sales[0].qty = 'x';
  assert.throws(() => SL.backup.parse(JSON.stringify(bad)), /corrompido/);
  const incons = JSON.parse(JSON.stringify(b)); incons.data.products[0].stockReady = 999;
  assert.throws(() => SL.backup.parse(JSON.stringify(incons)), /inconsistente/);
  const dup = JSON.parse(JSON.stringify(b)); dup.data.expenses.push(dup.data.expenses[0]);
  assert.throws(() => SL.backup.parse(JSON.stringify(dup)), /duplicados/);
  const miss = JSON.parse(JSON.stringify(b)); delete miss.data.stock;
  assert.throws(() => SL.backup.parse(JSON.stringify(miss)), /incompleto/);
});

test('excluir produto remove o histórico de estoque dele', async () => {
  await fresh();
  const p = await SL.ops.saveProduct(prodIn({ stockReady: '5' }));
  const q = await SL.ops.saveProduct(prodIn({ name: 'Pastel', stockReady: '7' }));
  await SL.ops.deleteProduct(p.id);
  const d = await invariant(); assert.equal(d.products.length, 1); assert.equal(d.stock.length, 1); assert.equal(d.stock[0].productId, q.id);
});

test('modo demonstração gera dados consistentes em banco separado', async () => {
  SL.mode.set('demo');
  SL.db.close();
  await new Promise((r) => { const q = indexedDB.deleteDatabase('salgado-lucrativo-demo'); q.onsuccess = q.onerror = q.onblocked = () => r(); });
  await SL.demo.ensure();
  const d = await invariant();
  assert.ok(d.products.length >= 10 && d.sales.length > 100 && d.stock.length > 100);
  assert.ok(d.sales.some((s) => s.status === 'encomenda'));
  assert.ok(calc.lowStock(d.products).length >= 1, 'deve haver alerta de estoque baixo');
  assert.ok(calc.expiryAlerts(d.stock, d.products, today, 3).length >= 1, 'deve haver alerta de validade');
  const s = calc.summarize(d, dates.addDays(today, -29), today);
  assert.ok(s.revenue > 0 && s.grossProfit > 0);
  SL.mode.set('real'); await fresh();
  assert.equal(await SL.db.count('products'), 0, 'dados reais não foram tocados');
  SL.db.close();
});
