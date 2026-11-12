const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
require(path.join(__dirname, '../js/calc.js'));
require(path.join(__dirname, '../js/database.js'));
require(path.join(__dirname, '../js/recipes-data.js'));
const SL = globalThis.SL;
test('biblioteca tem 50+ receitas completas e únicas', () => {
  assert.ok(SL.RECIPES.length >= 50);
  const ids = new Set(), names = new Set();
  SL.RECIPES.forEach((r) => {
    assert.ok(!ids.has(r.id) && !names.has(r.name), 'duplicada: ' + r.name); ids.add(r.id); names.add(r.name);
    assert.ok(SL.CATEGORIES.includes(r.category), r.name + ': categoria');
    assert.ok(SL.DIFFICULTY.includes(r.difficulty), r.name + ': dificuldade');
    assert.ok(r.estimatedCost > 0 && r.suggestedPrice > 0, r.name + ': custo/preço');
    assert.ok(r.ingredients.length >= 4 && r.steps.length >= 3, r.name + ': ingredientes/passos');
    assert.ok(r.yield && r.time && r.freezing.length > 40 && r.storage, r.name + ': campos');
    assert.ok(SL.validate.recipe(Object.assign({}, r, { photo: '' })).ok, r.name + ' não passa na validação');
  });
  assert.equal(new Set(SL.RECIPES.map((r) => r.category)).size, 11);
});
