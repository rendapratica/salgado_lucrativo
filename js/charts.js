/* charts.js — gráficos (Chart.js local, sem CDN) com a paleta laranja da RendaPrática */
(function (global) {
  'use strict';
  const SL = (global.SL = global.SL || {});
  const inst = {};
  const COLORS = ['#e8731a', '#f5a524', '#8f5a2c', '#ffcf6b', '#5c3315', '#d9a679', '#c2410c', '#a3541f'];
  const money = (n) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);

  function ready() {
    if (typeof global.Chart === 'undefined') return false;
    global.Chart.defaults.font.family = "'Nunito', system-ui, sans-serif";
    global.Chart.defaults.color = '#8a6a4a';
    return true;
  }
  function draw(id, cfg) {
    const el = document.getElementById(id);
    if (!el) return null;
    if (inst[id]) { inst[id].destroy(); delete inst[id]; }
    if (!ready()) { el.parentNode.innerHTML = '<p class="muted center" style="padding:40px 10px">Não foi possível carregar os gráficos (Chart.js).</p>'; return null; }
    inst[id] = new global.Chart(el.getContext('2d'), cfg);
    return inst[id];
  }

  // Faturamento (barras) × despesas (linha)
  function revenue(id, ser, withExpenses) {
    const ds = [{ type: 'bar', label: 'Faturamento', data: ser.revenue, backgroundColor: '#f5a524', hoverBackgroundColor: '#d98a0b', borderRadius: 5, maxBarThickness: 28 }];
    if (withExpenses) ds.push({ type: 'bar', label: 'Despesas', data: ser.expenses, backgroundColor: '#8f5a2c', hoverBackgroundColor: '#5c3315', borderRadius: 5, maxBarThickness: 28 });
    return draw(id, {
      data: { labels: ser.labels, datasets: ds },
      options: {
        responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false },
        plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8 } }, tooltip: { callbacks: { label: (c) => ' ' + c.dataset.label + ': ' + money(c.parsed.y) } } },
        scales: { x: { grid: { display: false }, ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 14 } }, y: { beginAtZero: true, grid: { color: 'rgba(143,90,44,.14)' }, ticks: { callback: (v) => money(v).replace(',00', '') } } },
      },
    });
  }

  function doughnut(id, labels, values) {
    return draw(id, {
      type: 'doughnut',
      data: { labels, datasets: [{ data: values, backgroundColor: COLORS, borderColor: '#fffdfa', borderWidth: 3, hoverOffset: 8 }] },
      options: { responsive: true, maintainAspectRatio: false, cutout: '62%', plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8 } }, tooltip: { callbacks: { label: (c) => ' ' + c.label + ': ' + c.parsed + ' un.' } } } },
    });
  }
  function moneyDoughnut(id, labels, values) {
    return draw(id, {
      type: 'doughnut',
      data: { labels, datasets: [{ data: values, backgroundColor: COLORS, borderColor: '#fffdfa', borderWidth: 3, hoverOffset: 8 }] },
      options: { responsive: true, maintainAspectRatio: false, cutout: '62%', plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8 } }, tooltip: { callbacks: { label: (c) => ' ' + c.label + ': ' + money(c.parsed) } } } },
    });
  }
  SL.charts = { revenue, doughnut, moneyDoughnut, draw, ready };
})(typeof window !== 'undefined' ? window : globalThis);
