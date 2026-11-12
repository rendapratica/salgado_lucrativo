/* Teste ponta a ponta no navegador. Uso: node tests/e2e.playwright.js [pasta-de-screenshots]
   Requer: npm i playwright (e um navegador instalado) */
const { chromium, devices } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), SHOTS = process.argv[2] || '';
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]); if (p === '/') p = '/index.html';
  const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT) || !fs.existsSync(f)) { res.writeHead(404); res.end('nf'); return; }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
});
let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('  ✗ ' + m); } else console.log('  ✓ ' + m); };

(async () => {
  await new Promise((r) => server.listen(0, r));
  const base = 'http://127.0.0.1:' + server.address().port + '/';
  const browser = await chromium.launch();
  const PAGES = ['index', 'dashboard', 'produtos', 'producao', 'vendas', 'estoque', 'despesas', 'calculadora', 'relatorios', 'receitas', 'backup'];

  for (const [label, opts] of [['desktop', { viewport: { width: 1360, height: 900 } }], ['celular', Object.assign({}, devices['iPhone 13'])]]) {
    console.log('\n== ' + label + ' — modo demonstração ==');
    const ctx = await browser.newContext(Object.assign({ acceptDownloads: true }, opts));
    const errors = []; ctx.on('page', (pg) => { pg.on('pageerror', (e) => errors.push(pg.url() + ' ' + e.message)); pg.on('console', (m) => { if (m.type() === 'error') errors.push(pg.url() + ' ' + m.text()); }); });
    const page = await ctx.newPage();
    await page.goto(base + 'index.html'); await page.evaluate(() => localStorage.setItem('sl_mode', 'demo'));
    for (const name of PAGES) {
      await page.goto(base + name + '.html'); await page.waitForSelector('.topbar', { timeout: 15000 }); await page.waitForTimeout(700);
      const ov = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      ok(ov <= 1, name + ': sem rolagem horizontal (' + ov + 'px)');
      const bad = await page.$('.alert.bad'); const txt = bad ? await bad.innerText() : '';
      ok(!/Não foi possível carregar/.test(txt), name + ': carregou sem erro');
      if (SHOTS) { fs.mkdirSync(SHOTS, { recursive: true }); await page.screenshot({ path: path.join(SHOTS, label + '-' + name + '.png'), fullPage: name !== 'index' ? true : false }); }
    }
    // painel: 9 indicadores + 4 gráficos
    await page.goto(base + 'dashboard.html'); await page.waitForTimeout(900);
    ok((await page.$$('#period-cards .stat')).length === 9 && (await page.$$('#top-cards .stat')).length === 3, 'painel: indicadores do período (9) e do dia/semana/mês (3)');
    ok((await page.$$('canvas')).length === 4, 'painel: 4 gráficos');
    ok(await page.$('#alerts .alert'), 'painel: alertas (estoque baixo/validade/encomendas)');
    // receitas
    await page.goto(base + 'receitas.html'); await page.waitForTimeout(500);
    ok((await page.$$('.tile')).length >= 50, 'receitas: 50+ cartões');
    await page.click('.tile'); await page.waitForSelector('#dlg-view[open]'); ok((await page.innerText('#v-body')).includes('Como congelar'), 'receita: mostra instrução de congelamento');
    await ctx.close();
  }

  console.log('\n== desktop — fluxo real (banco vazio) ==');
  const ctx = await browser.newContext({ viewport: { width: 1360, height: 900 }, acceptDownloads: true });
  const errors = []; const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  const go = async (n) => { await page.goto(base + n + '.html'); await page.waitForSelector('.topbar'); await page.waitForTimeout(300); };
  const clearToasts = () => page.evaluate(() => document.querySelectorAll('.toast').forEach((e) => e.remove()));
  const toast = async () => { await page.waitForSelector('.toast'); await page.waitForTimeout(300); const t = await page.innerText('.toasts'); await page.evaluate(() => document.querySelectorAll('.toast').forEach((e) => e.remove())); return t; };

  await go('produtos'); await page.click('#btn-new');
  await page.fill('#f-name', 'Coxinha de frango'); await page.selectOption('#f-category', 'Coxinhas'); await page.fill('#f-price', '5,50'); await page.fill('#f-cost', '1,60'); await page.fill('#f-min', '10'); await page.fill('#f-ready', '12'); await page.fill('#f-frozen', '20');
  await page.click('#btn-save'); ok(/cadastrado/.test(await toast()), 'produto cadastrado');
  await page.click('#btn-new'); await page.fill('#f-name', 'coxinha de frango'); await page.selectOption('#f-category', 'Coxinhas'); await page.fill('#f-price', '5'); await page.fill('#f-cost', '1'); await page.click('#btn-save'); await page.waitForTimeout(400);
  ok((await page.innerText('#form')).includes('Já existe um produto'), 'nome duplicado bloqueado'); await page.click('#dlg [data-close]'); await clearToasts();

  await go('producao'); await page.selectOption('#f-product', { index: 1 }); await page.fill('#f-qty', '30'); await page.selectOption('#f-kind', 'frozen'); await page.fill('#f-ing', '30'); await page.fill('#f-pack', '8'); await page.fill('#f-other', '4');
  ok((await page.innerText('#live')).includes('1,40'), 'produção: custo por unidade ao vivo (R$ 1,40)');
  await page.click('#btn-save'); ok(/registrada/.test(await toast()), 'produção registrada');
  await page.selectOption('#f-product', { index: 1 }); await page.fill('#f-qty', '30'); await page.selectOption('#f-kind', 'frozen'); await page.fill('#f-ing', '30'); await page.fill('#f-pack', '8'); await page.fill('#f-other', '4'); await page.click('#btn-save');
  await page.waitForSelector('dialog.confirm[open]'); ok((await page.innerText('dialog.confirm')).includes('já foi registrada'), 'produção repetida pede confirmação'); await page.click('dialog.confirm [data-r="0"]');

  await go('vendas'); await page.selectOption('#f-product', { index: 1 }); await page.fill('#f-qty', '20'); await page.click('#btn-save');
  await page.waitForTimeout(400); ok(/insuficiente|acima/i.test(await page.innerText('body')), 'venda acima do estoque pronto é bloqueada'); await clearToasts();
  await page.fill('#f-qty', '5'); await page.fill('#f-customer', 'Ana'); await page.click('#btn-save'); ok(/Venda registrada/.test(await toast()), 'venda registrada');
  await page.click('#status [data-s="encomenda"]'); await page.selectOption('#f-product', { index: 1 }); await page.fill('#f-qty', '50'); await page.fill('#f-price', '5,00');
  await page.fill('#f-deliv', new Date(Date.now() + 3 * 864e5).toISOString().slice(0, 10)); await page.click('#btn-save'); ok(/Encomenda registrada/.test(await toast()), 'encomenda registrada sem checar estoque');
  ok(await page.isVisible('#orders-sec'), 'encomenda aparece em pendentes');
  await page.click('[data-done]'); await page.waitForSelector('#dlg-complete[open]'); await page.selectOption('#c-pay', 'Pix'); await page.click('#dc-save');
  ok(/insuficiente/.test(await toast()), 'concluir encomenda sem estoque é bloqueado');
  await page.click('#dlg-complete [data-close]');

  await go('estoque'); ok((await page.innerText('#summary')).includes('7') , 'estoque: prontos = 7 após a venda');
  await page.click('#btn-convert'); await page.selectOption('#f-product', { index: 1 }); await page.selectOption('#f-kind', 'frozen'); await page.fill('#f-qty', '15'); await page.click('#btn-save'); ok(/atualizado/.test(await toast()), 'conversão congelado → pronto');
  await page.click('#btn-adjust'); await page.selectOption('#f-product', { index: 1 }); await page.fill('#f-new', '20'); await page.fill('#f-reason', 'Contagem'); await page.click('#btn-save'); ok(/atualizado/.test(await toast()), 'ajuste manual');
  ok((await page.innerText('#moves')).includes('Contagem'), 'histórico mostra o ajuste');

  await go('despesas'); await page.fill('#f-desc', 'Farinha 25kg'); await page.selectOption('#f-category', 'Farinhas e massas'); await page.fill('#f-amount', '95,50'); await page.fill('#f-notes', 'Atacadão'); await page.click('#btn-save'); ok(/lançada/.test(await toast()), 'despesa lançada com observação');

  await go('calculadora'); await page.fill('[data-f="name"]', 'Farinha'); await page.fill('[data-f="qty"]', '500'); await page.fill('[data-f="packQty"]', '1'); await page.fill('[data-f="packPrice"]', '6');
  await page.fill('#c-qty', '30'); await page.fill('#c-pack', '6'); await page.waitForTimeout(200);
  ok((await page.inputValue('#c-ing')) === '3,00', 'calculadora: ingrediente convertido (500 g de 1 kg a R$ 6 = R$ 3,00)');
  ok((await page.innerText('#result')).includes('Por unidade'), 'calculadora: resultado'); await page.selectOption('#c-product', { index: 1 }); await page.click('#btn-apply'); await page.waitForSelector('dialog.confirm[open]'); await page.click('dialog.confirm [data-r="1"]'); ok(/atualizado/.test(await toast()), 'calculadora salva no produto');

  await go('relatorios'); await page.waitForTimeout(500);
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('[data-exp="estoque"]')]);
  const csv = fs.readFileSync(await dl.path(), 'utf8'); ok(csv.startsWith('﻿') && csv.includes('Contagem'), 'CSV de estoque com BOM e dados');

  await go('backup'); const [bd] = await Promise.all([page.waitForEvent('download'), page.click('#btn-export')]);
  const bp = await bd.path(); const bk = JSON.parse(fs.readFileSync(bp, 'utf8'));
  ok(bk.app === 'salgado-lucrativo' && Object.keys(bk.data).length === 7 && bk.data.stock.length >= 5, 'backup tem os 7 repositórios');
  await page.click('#btn-wipe'); await page.fill('#cf-typed', 'APAGAR'); await page.click('dialog.confirm [data-r="1"]'); await toast();
  await page.setInputFiles('#f-file', bp); await page.waitForSelector('#btn-restore'); await page.click('#btn-restore'); await page.click('dialog.confirm [data-r="1"]'); await page.waitForTimeout(600);
  ok(/restaurado/.test(await page.innerText('#restore-info')), 'restauração do backup: ' + (await page.innerText('#restore-info')).slice(0, 120));
  await go('estoque'); ok((await page.innerText('#balances')).includes('Coxinha de frango'), 'dados voltaram após restaurar');
  await page.setInputFiles('#f-file', { name: 'x.json', mimeType: 'application/json', buffer: Buffer.from('{"app":"outro"}') }).catch(() => {});
  ok(errors.length === 0, 'nenhum erro de console no fluxo real' + (errors.length ? ': ' + errors.slice(0, 3).join(' | ') : ''));
  await browser.close(); server.close();
  console.log(fails ? '\n' + fails + ' FALHA(S)' : '\nTUDO OK'); process.exit(fails ? 1 : 0);
})();
