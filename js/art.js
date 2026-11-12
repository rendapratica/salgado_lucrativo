/* art.js — ilustrações originais (SVG) de salgados, usadas como "foto ilustrativa" quando
   não há uma fotografia. Nenhuma imagem externa: funciona offline e sem direitos autorais. */
(function (global) {
  'use strict';
  const SL = (global.SL = global.SL || {});
  let uid = 0;

  function pseudo(seed) {
    let a = seed >>> 0;
    return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  const f = (n) => Math.round(n * 10) / 10;

  // Rótulo e cores de fundo de cada ilustração
  const K = {
    coxinha: { label: 'Coxinhas douradas', bg: ['#fff3dc', '#fbd9a4'], table: ['#e8a15a', '#c97a32'] },
    pastel: { label: 'Pastéis crocantes', bg: ['#fff0d2', '#f9d398'], table: ['#e6a05a', '#c47a34'] },
    empada: { label: 'Empadinhas', bg: ['#fff5e2', '#f6dcae'], table: ['#e9ae6c', '#c98640'] },
    esfiha: { label: 'Esfihas abertas de carne', bg: ['#fff0da', '#f7cfa0'], table: ['#e29a58', '#bf7433'] },
    quibe: { label: 'Quibes fritos', bg: ['#fdefd6', '#f2cd98'], table: ['#e3a05f', '#bd7a39'] },
    risole: { label: 'Risoles empanados', bg: ['#fff2da', '#fad7a0'], table: ['#e8a35c', '#c67c34'] },
    enroladinho: { label: 'Enroladinhos de salsicha', bg: ['#fff4e0', '#f8d8a8'], table: ['#e7a45e', '#c27d37'] },
    folhado: { label: 'Folhados de queijo', bg: ['#fff6e4', '#f8e0b0'], table: ['#e8b070', '#c58a45'] },
    'pao-queijo': { label: 'Pães de queijo', bg: ['#fff7e6', '#f9e1b4'], table: ['#e9b272', '#c68b47'] },
    mini: { label: 'Mini salgados para festa', bg: ['#fff1dc', '#fad5a0'], table: ['#e6a05a', '#c47a34'] },
    mix: { label: 'Seleção de salgados', bg: ['#fff3dc', '#fbd6a0'], table: ['#e8a15a', '#c97a32'] },
  };
  SL.ART_KINDS = Object.keys(K);

  // Categoria de produto -> ilustração padrão
  SL.artForCategory = (cat) => ({
    Coxinhas: 'coxinha', 'Pastéis': 'pastel', Empadas: 'empada', Esfihas: 'esfiha', Quibes: 'quibe', Risoles: 'risole',
    Enroladinhos: 'enroladinho', Folhados: 'folhado', 'Pães e assados': 'pao-queijo', 'Mini salgados': 'mini',
  }[cat] || 'mix');

  // Cada função desenha um salgado centrado em (0,0), com cerca de 100 px de largura.
  function speckles(rand, n, rx, ry, cols, rmin, rmax, op) {
    let s = '';
    for (let i = 0; i < n; i++) {
      const a = rand() * Math.PI * 2, d = Math.sqrt(rand());
      s += '<circle cx="' + f(Math.cos(a) * d * rx) + '" cy="' + f(Math.sin(a) * d * ry) + '" r="' + f(rmin + rand() * (rmax - rmin)) + '" fill="' + cols[Math.floor(rand() * cols.length)] + '" opacity="' + (op || 0.7) + '"/>';
    }
    return s;
  }
  const G = (id) => ({
    fry: 'url(#' + id + 'fry)', bake: 'url(#' + id + 'bake)', dark: 'url(#' + id + 'dark)', pale: 'url(#' + id + 'pale)', flaky: 'url(#' + id + 'flk)',
  });

  const DRAW = {
    coxinha(id, rand) {
      const g = G(id);
      return '<path d="M0 -50 C9 -50 13 -40 19 -28 C34 -16 41 1 37 18 C33 37 17 47 0 47 C-17 47 -33 37 -37 18 C-41 1 -34 -16 -19 -28 C-13 -40 -9 -50 0 -50Z" fill="' + g.fry + '" stroke="#b9661a" stroke-width="1.5"/>' +
        speckles(rand, 46, 28, 34, ['#b9661a', '#f6c25d', '#c27322'], 0.9, 2.2, 0.55) +
        '<path d="M-24 -4 C-24 -16 -16 -28 -8 -34" stroke="#fff3c9" stroke-width="3.5" stroke-linecap="round" fill="none" opacity=".65"/>' +
        '<path d="M-2 -52 C2 -56 6 -55 7 -50" stroke="#b9661a" stroke-width="2" fill="none"/>';
    },
    pastel(id, rand) {
      const g = G(id); let s = '<path d="M-52 20 C-52 -26 -24 -42 0 -42 C24 -42 52 -26 52 20Z" fill="' + g.fry + '" stroke="#b9661a" stroke-width="1.5"/>';
      for (let i = -10; i <= 10; i++) s += '<line x1="' + (i * 4.8) + '" y1="20" x2="' + (i * 4.8) + '" y2="12" stroke="#a65a16" stroke-width="2" stroke-linecap="round"/>';
      s += '<path d="M-52 20H52" stroke="#a65a16" stroke-width="2.5"/>';
      for (let i = 0; i < 9; i++) s += '<ellipse cx="' + f(-36 + rand() * 72) + '" cy="' + f(-26 + rand() * 40) + '" rx="' + f(3 + rand() * 4) + '" ry="' + f(2 + rand() * 3) + '" fill="#fff0b8" opacity=".7"/>';
      return s + '<path d="M-38 -8C-34 -22 -22 -32 -10 -35" stroke="#fff3c9" stroke-width="3.5" stroke-linecap="round" fill="none" opacity=".6"/>';
    },
    empada(id, rand) {
      const g = G(id);
      let s = '<path d="M-36 -4 L36 -4 L29 36 L-29 36Z" fill="' + g.bake + '" stroke="#b27a2e" stroke-width="1.5"/>';
      for (let i = -5; i <= 5; i++) s += '<line x1="' + (i * 6.2) + '" y1="-3" x2="' + (i * 5.2) + '" y2="35" stroke="#b27a2e" stroke-width="1.3" opacity=".55"/>';
      s += '<path d="M-38 -4 C-38 -38 38 -38 38 -4Z" fill="' + g.pale + '" stroke="#b27a2e" stroke-width="1.5"/>';
      s += '<ellipse cx="0" cy="-22" rx="5" ry="2.4" fill="#b27a2e" opacity=".55"/>' + speckles(rand, 18, 24, 12, ['#d9a14a', '#fff2c4'], 0.8, 1.7, 0.6);
      return s + '<path d="M-28 -10C-24 -22 -14 -28 -6 -30" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" opacity=".55"/>';
    },
    esfiha(id, rand) {
      const g = G(id);
      return '<circle r="44" fill="' + g.bake + '" stroke="#a9702a" stroke-width="1.5"/><circle r="34" fill="url(#' + id + 'meat)"/>' +
        speckles(rand, 40, 30, 30, ['#4e8a3a', '#f3d36b', '#5a1d10', '#d6523a'], 1.2, 2.6, 0.85) +
        '<path d="M-38 -14C-32 -28 -20 -38 -6 -41" stroke="#fff3c9" stroke-width="3" stroke-linecap="round" fill="none" opacity=".6"/>' +
        '<path d="M16 26 q8 -6 14 -14" stroke="#ffe27a" stroke-width="3" stroke-linecap="round" fill="none" opacity=".8"/>';
    },
    quibe(id, rand) {
      const g = G(id);
      return '<path d="M-52 0 C-36 -40 36 -40 52 0 C36 40 -36 40 -52 0Z" fill="' + g.dark + '" stroke="#6e3410" stroke-width="1.5"/>' +
        speckles(rand, 60, 38, 22, ['#6e3410', '#e3a14a', '#f2c277'], 0.9, 2.1, 0.55) +
        '<path d="M-36 -8C-28 -20 -14 -26 0 -27" stroke="#ffe3a8" stroke-width="3.5" stroke-linecap="round" fill="none" opacity=".55"/>';
    },
    risole(id, rand) {
      const g = G(id);
      return '<path d="M-50 22 C-54 -24 -22 -44 4 -42 C30 -40 54 -20 50 22Z" fill="' + g.fry + '" stroke="#b9661a" stroke-width="1.5"/>' +
        speckles(rand, 90, 42, 28, ['#f6c25d', '#d98a2b', '#fbe08a', '#b9661a'], 1, 2.4, 0.8) +
        '<path d="M-52 22H50" stroke="#a65a16" stroke-width="2.5"/>' +
        '<path d="M-38 -6C-33 -22 -20 -32 -8 -36" stroke="#fff3c9" stroke-width="3" stroke-linecap="round" fill="none" opacity=".55"/>';
    },
    enroladinho(id, rand) {
      const g = G(id);
      let s = '<rect x="-48" y="-20" width="96" height="40" rx="20" fill="' + g.bake + '" stroke="#a9702a" stroke-width="1.5"/>';
      s += '<circle cx="-48" cy="0" r="12" fill="#c2503f" stroke="#8f2e22" stroke-width="1.5"/><circle cx="48" cy="0" r="12" fill="#c2503f" stroke="#8f2e22" stroke-width="1.5"/>';
      s += '<circle cx="-48" cy="0" r="6" fill="#d8705a"/><circle cx="48" cy="0" r="6" fill="#d8705a"/>';
      for (let i = -3; i <= 3; i++) s += '<path d="M' + (i * 12 - 7) + ' -19 L' + (i * 12 + 7) + ' 19" stroke="#c68a3c" stroke-width="3.5" stroke-linecap="round" opacity=".75"/>';
      s += speckles(rand, 14, 36, 12, ['#fff0b8'], 1, 1.8, 0.7);
      return s + '<path d="M-34 -13H30" stroke="#fff3c9" stroke-width="3" stroke-linecap="round" opacity=".6"/>';
    },
    folhado(id, rand) {
      const g = G(id);
      let s = '<rect x="-46" y="-28" width="92" height="56" rx="12" fill="' + g.flaky + '" stroke="#a9702a" stroke-width="1.5"/>';
      for (let i = 0; i < 6; i++) s += '<path d="M-46 ' + (-18 + i * 9) + ' q23 ' + (i % 2 ? 4 : -4) + ' 46 0 t46 0" stroke="#b9822f" stroke-width="1.4" fill="none" opacity=".6"/>';
      for (let i = -3; i <= 3; i++) s += '<path d="M' + (i * 11 - 6) + ' -22 L' + (i * 11 + 6) + ' 22" stroke="#9a621c" stroke-width="2" stroke-linecap="round" opacity=".5"/>';
      s += '<ellipse cx="36" cy="22" rx="12" ry="6" fill="#ffd54f" stroke="#e0a400" stroke-width="1"/>';
      return s + speckles(rand, 24, 40, 24, ['#fff0b8', '#d9a14a'], 0.8, 1.6, 0.55) + '<path d="M-36 -20H24" stroke="#fff3c9" stroke-width="3" stroke-linecap="round" opacity=".6"/>';
    },
    'pao-queijo'(id, rand) {
      const g = G(id);
      let s = '<path d="M0 -40 C24 -44 44 -26 42 -2 C44 22 26 42 0 40 C-26 42 -44 22 -42 -2 C-44 -26 -24 -44 0 -40Z" fill="' + g.pale + '" stroke="#bd8330" stroke-width="1.5"/>';
      s += '<path d="M-14 -30 q8 10 2 22 M12 -32 q-8 12 -2 24 M-28 4 q10 6 20 0 M10 14 q10 8 22 2" stroke="#c98d34" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7"/>';
      s += speckles(rand, 26, 32, 32, ['#f3b85a', '#fff1c0'], 1, 2.4, 0.6);
      return s + '<path d="M-30 -14C-26 -26 -16 -34 -6 -36" stroke="#fff" stroke-width="3.5" stroke-linecap="round" fill="none" opacity=".6"/>';
    },
  };

  function defs(id) {
    const lg = (n, a, b, x2, y2) => '<linearGradient id="' + id + n + '" x1="0" y1="0" x2="' + (x2 || 0) + '" y2="' + (y2 || 1) + '"><stop offset="0" stop-color="' + a + '"/><stop offset="1" stop-color="' + b + '"/></linearGradient>';
    return '<defs>' + lg('fry', '#fbcf63', '#d9831f', 0.4, 1) + lg('bake', '#f5d28f', '#d9994a', 0.4, 1) + lg('dark', '#d07c30', '#8f4515', 0.4, 1) +
      lg('pale', '#fde7ae', '#ebba68', 0.4, 1) + lg('flk', '#f8da96', '#d08f30', 0.4, 1) +
      '<radialGradient id="' + id + 'meat" cx="40%" cy="35%" r="80%"><stop offset="0" stop-color="#c0583a"/><stop offset="1" stop-color="#7a2a18"/></radialGradient>' +
      '<radialGradient id="' + id + 'plate" cx="50%" cy="40%" r="70%"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#f4e6d2"/></radialGradient></defs>';
  }

  function item(id, kind, x, y, sc, rot, rand) {
    return '<g transform="translate(' + x + ' ' + y + ')"><ellipse cx="0" cy="' + f(40 * sc) + '" rx="' + f(46 * sc) + '" ry="' + f(9 * sc) + '" fill="rgba(80,40,10,.25)"/>' +
      '<g transform="rotate(' + rot + ') scale(' + sc + ')">' + DRAW[kind](id, rand) + '</g></g>';
  }
  function steam(x, y) {
    return '<path d="M' + x + ' ' + y + ' q-8 -12 0 -22 t0 -22" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".5"/>';
  }

  // Gera o SVG completo. opts.label sobrescreve o texto de acessibilidade.
  function art(kind, opts) {
    opts = opts || {};
    const key = K[kind] ? kind : 'mix';
    const cfg = K[key];
    const id = 'a' + (++uid) + '_';
    const rand = pseudo(2000 + key.split('').reduce((a, c) => a + c.charCodeAt(0) * 7, 0));
    let s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label="' + (opts.label || 'Ilustração: ' + cfg.label) + '">' + defs(id);
    s += '<defs><linearGradient id="' + id + 'bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + cfg.bg[0] + '"/><stop offset="1" stop-color="' + cfg.bg[1] + '"/></linearGradient>' +
      '<linearGradient id="' + id + 'tb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + cfg.table[0] + '"/><stop offset="1" stop-color="' + cfg.table[1] + '"/></linearGradient></defs>';
    s += '<rect width="400" height="300" fill="url(#' + id + 'bg)"/>';
    [[56, 52, 44, .35], [338, 44, 58, .28], [262, 92, 26, .3], [28, 142, 22, .25], [372, 134, 28, .3]].forEach((c) => { s += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="' + c[2] + '" fill="#fff" opacity="' + c[3] + '"/>'; });
    s += '<rect y="212" width="400" height="88" fill="url(#' + id + 'tb)"/><rect y="212" width="400" height="4" fill="rgba(255,255,255,.4)"/>';
    for (let i = 0; i < 5; i++) s += '<path d="M0 ' + (230 + i * 15) + ' Q100 ' + (226 + i * 15) + ' 200 ' + (231 + i * 15) + ' T400 ' + (229 + i * 15) + '" stroke="rgba(90,45,10,.14)" stroke-width="1.5" fill="none"/>';
    // prato
    s += '<ellipse cx="200" cy="218" rx="176" ry="48" fill="rgba(80,40,10,.22)"/><ellipse cx="200" cy="208" rx="176" ry="48" fill="url(#' + id + 'plate)" stroke="#ecd9bd" stroke-width="3"/>' +
      '<ellipse cx="200" cy="208" rx="132" ry="33" fill="none" stroke="#f0dfc4" stroke-width="2"/>';
    const place = (kinds, pos) => pos.map((p, i) => ({ k: kinds[i % kinds.length], x: p[0], y: p[1], sc: p[2], rot: p[3] })).sort((a, b) => a.y - b.y)
      .map((o) => item(id, o.k, o.x, o.y, o.sc, o.rot, rand)).join('');
    if (key === 'mix') {
      s += place(['coxinha', 'pastel', 'quibe', 'esfiha', 'empada'], [[96, 176, 0.8, -8], [200, 128, 0.82, 4], [300, 176, 0.8, 10], [150, 198, 0.78, 6], [252, 196, 0.78, -6]]);
    } else if (key === 'mini') {
      const pos = []; for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) pos.push([86 + c * 57 + (r % 2) * 20, 150 + r * 28, 0.42, (c * 17 + r * 23) % 24 - 12]);
      s += place(['coxinha'], pos);
    } else {
      s += place([key], [[110, 172, 0.95, -8], [218, 138, 1.0, 5], [296, 184, 0.95, 12], [196, 196, 0.92, -4]]);
    }
    s += steam(150, 118) + steam(224, 84) + steam(296, 128);
    s += '<rect width="400" height="300" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="6"/></svg>';
    return s;
  }
  SL.art = art;
})(typeof globalThis !== 'undefined' ? globalThis : window);
