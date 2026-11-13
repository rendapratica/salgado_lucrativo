/* home.js — tela inicial: boas-vindas, atalhos e resumo rápido do dia */
(function () {
  'use strict';
  const { icon, esc, money, int, $ } = SL.ui;

  SL.ui.boot(async function () {
    const data = await SL.db.loadAll();
    const today = SL.dates.today();
    const s = SL.calc.summarize(data, today, today);
    const hasProducts = data.products.length > 0;
    const stock = data.products.reduce((a, p) => a + SL.calc.stockTotal(p), 0);
    const last = await SL.db.getSetting('lastBackupAt', null);
    const backupOld = hasProducts && !SL.mode.isDemo() && (!last || Date.now() - last > 30 * 86400000);
    const picks = ['coxinha-de-frango-tradicional', 'pastel-de-carne', 'pao-de-queijo-mineiro'].map((id) => SL.RECIPES.find((r) => r.id === id)).filter(Boolean);

    const shortcuts = [
      ['vendas.html', 'cart', 'Registrar venda', 'Vendas e encomendas, com baixa no estoque'],
      ['producao.html', 'flame', 'Registrar produção', 'Soma os salgados no estoque'],
      ['estoque.html', 'boxes', 'Estoque', 'Prontos, congelados e validade'],
      ['produtos.html', 'box', 'Meus produtos', 'Preço, custo e fotos'],
      ['despesas.html', 'wallet', 'Lançar despesa', 'Farinha, frango, gás, embalagens…'],
      ['calculadora.html', 'calc', 'Calculadora de preços', 'Descubra quanto cobrar'],
      ['relatorios.html', 'file', 'Relatórios', 'Exporte em CSV'],
    ];

    $('#content').innerHTML =
      '<section class="hero"><div><span class="pill gold">' + icon('sparkle') + ' RendaPrática · receitas &amp; gestão</span>' +
      '<h1>Faça salgados que <em>dão lucro</em></h1>' +
      '<p>Tenha receitas e um sistema simples para controlar produção, vendas, estoque e despesas, sem planilha e sem complicação.</p>' +
      '<div class="row" style="margin-top:18px"><a class="btn gold" href="' + (hasProducts ? 'dashboard.html' : 'produtos.html') + '">' + (hasProducts ? 'Abrir meu painel' : 'Cadastrar meu primeiro produto') + '</a>' +
      '<a class="btn" style="background:rgba(255,255,255,.12);color:#fff" href="receitas.html">' + icon('book') + ' Ver receitas</a>' +
      (SL.mode.isDemo() ? '' : '<button class="btn" style="background:rgba(255,255,255,.12);color:#fff" type="button" data-act="enter-demo">' + icon('eye') + ' Conhecer com exemplos</button>') + '</div></div>' +
      '<div class="hero-art"><img src="img/home-salgados.jpg" alt="Coxinhas, pastéis, quibes, empadas e enroladinhos numa travessa de madeira" width="1600" height="873" decoding="async" style="display:block;width:100%;height:auto;aspect-ratio:4/3;object-fit:cover;object-position:42% center;border-radius:18px"></div></section>' +

      (backupOld ? '<div class="alert section">' + icon('shield') + '<div><b>Hora de fazer um backup.</b> Seus dados ficam só neste aparelho. <a href="backup.html">Salvar um backup agora</a>.</div></div>' : '') +

      '<section class="section"><div class="grid g4">' +
      SL.ui.stat('Vendido hoje', money(s.revenue), { icon: 'cart', tone: 'gold', note: s.salesCount + (s.salesCount === 1 ? ' venda' : ' vendas') }) +
      SL.ui.stat('Salgados vendidos hoje', int(s.unitsSold), { icon: 'tag' }) +
      SL.ui.stat('Produzidos hoje', int(s.produced), { icon: 'flame' }) +
      SL.ui.stat('Estoque disponível', int(stock), { icon: 'box', tone: 'dark', note: data.products.length + (data.products.length === 1 ? ' produto' : ' produtos') }) +
      '</div></section>' +

      '<section class="section"><h2>Por onde começar</h2><div class="steps3">' +
      '<div><h3>Cadastre seus produtos</h3><p class="muted">Informe nome, preço de venda e custo de cada salgado. Se tiver foto, melhor.</p></div>' +
      '<div><h3>Registre produção e vendas</h3><p class="muted">Cada produção soma ao estoque (pronto ou congelado) e cada venda concluída desconta sozinha. Não dá para vender mais do que existe.</p></div>' +
      '<div><h3>Acompanhe o lucro</h3><p class="muted">O painel mostra faturamento, despesas e lucro estimado por dia, semana e mês.</p></div></div></section>' +

      '<section class="section"><h2>Atalhos</h2><div class="grid g3">' +
      shortcuts.map((a) => '<a class="shortcut" href="' + a[0] + '"><div class="ico">' + icon(a[1]) + '</div><div><b>' + a[2] + '</b><span>' + a[3] + '</span></div></a>').join('') + '</div></section>' +

      '<section class="section"><div class="card-head"><h2 style="margin:0">Receitas para começar</h2><a class="btn sm" href="receitas.html">Ver todas</a></div>' +
      '<div class="cards-grid">' + picks.map((r) => '<a class="tile" href="receitas.html?r=' + esc(r.id) + '" style="text-decoration:none;color:inherit"><div class="thumb">' + SL.ui.thumb(r, r.art) + '</div><div class="body"><h3>' + esc(r.name) + '</h3><div class="meta"><span>' + icon('clock') + ' ' + esc(r.time.split(' + ')[0]) + '</span><span>' + esc(r.yield.split(' (')[0]) + '</span></div><div class="price">Sugestão: ' + money(r.suggestedPrice) + ' / un.</div></div></a>').join('') + '</div></section>';
  });
})();
