const iconPaths = {
  grid: '<rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="3" width="6" height="6" rx="1"/><rect x="3" y="15" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/>',
  layers: '<path d="m4 8 8-4 8 4-8 4-8-4Z"/><path d="m4 12 8 4 8-4"/><path d="m4 16 8 4 8-4"/>',
  network: '<circle cx="5" cy="12" r="2.5"/><circle cx="19" cy="6" r="2.5"/><circle cx="19" cy="18" r="2.5"/><path d="m7.3 11 9.3-4M7.3 13l9.3 4"/>',
  pulse: '<path d="M3 12h4l2.2-6 4.1 12 2.2-6H21"/>',
  users: '<path d="M16 20v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20M9.5 10.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM17 3.8a3.5 3.5 0 0 1 0 6.7M21 20v-1.5a4 4 0 0 0-3-3.8"/>',
  file: '<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v5h4M9 13h6M9 17h6"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.8 1.8 0 0 0 .3 2l.1.1-1.8 1.8-.1-.1a1.8 1.8 0 0 0-2-.3 1.8 1.8 0 0 0-1.1 1.6v.2h-2.6v-.2a1.8 1.8 0 0 0-1.1-1.6 1.8 1.8 0 0 0-2 .3l-.1.1-1.8-1.8.1-.1a1.8 1.8 0 0 0 .3-2 1.8 1.8 0 0 0-1.6-1.1H5v-2.6h.2a1.8 1.8 0 0 0 1.6-1.1 1.8 1.8 0 0 0-.3-2l-.1-.1 1.8-1.8.1.1a1.8 1.8 0 0 0 2 .3 1.8 1.8 0 0 0 1.1-1.6V4h2.6v.2a1.8 1.8 0 0 0 1.1 1.6 1.8 1.8 0 0 0 2-.3l.1-.1 1.8 1.8-.1.1a1.8 1.8 0 0 0-.3 2 1.8 1.8 0 0 0 1.6 1.1h.2v2.6h-.2a1.8 1.8 0 0 0-1.6 1Z"/>',
  bell: '<path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5M4 20h16"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  scale: '<path d="M12 4v16M6 7h12M5 20h14M7 7l-3 7h6L7 7ZM17 7l-3 7h6l-3-7Z"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  coins: '<circle cx="9" cy="9" r="5"/><path d="M14.5 11.5A5 5 0 1 1 11 17M9 7v4l2 1"/>',
  leaf: '<path d="M20.5 3.5C13 3.5 6 5.5 5 12.5c-.5 3.5 2 6 5.5 5.5C17.5 17 19.5 10 20.5 3.5Z"/><path d="M4 20c3-5 7-8 13-11"/>',
  fingerprint: '<path d="M8.2 7.2A5.4 5.4 0 0 1 12 5.8a5.4 5.4 0 0 1 5.4 5.4v1.2M5.3 10.8A6.8 6.8 0 0 1 12 4a6.8 6.8 0 0 1 6.7 6.8v2.1M8.2 12v1.7c0 3.1 1.4 5.7 3.8 7.3M12 9.2a2 2 0 0 0-2 2v2.4c0 2.6.8 4.6 2.5 6.4M15.8 11.2v2.4c0 1.9-.4 3.5-1.2 4.8M5 15.2c.3 2.5 1.2 4.5 2.7 6.1M19 15.2c-.2 1.2-.5 2.3-1 3.3"/>',
  hash: '<path d="M9 3 7 21M17 3l-2 18M4 9h17M3 15h17"/>',
  shield: '<path d="M12 3 20 6v5c0 5.2-3.3 8.7-8 10-4.7-1.3-8-4.8-8-10V6l8-3Z"/><path d="m8.5 12 2.3 2.3 4.8-5"/>',
  search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/>',
  spark: '<path d="m12 3 1.7 6.3L20 11l-6.3 1.7L12 19l-1.7-6.3L4 11l6.3-1.7L12 3ZM19 18l.6 2.4L22 21l-2.4.6L19 24l-.6-2.4L16 21l2.4-.6L19 18Z"/>',
  scan: '<path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M8 12h8M12 8v8"/>',
  truck: '<path d="M3 6h11v11H3zM14 10h4l3 3v4h-7zM6 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM18 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 8h.01"/>'
};

function replaceIcons(root = document) {
  root.querySelectorAll('[data-icon]').forEach((node) => {
    const name = node.dataset.icon;
    if (iconPaths[name]) node.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${iconPaths[name]}</svg>`;
  });
}

replaceIcons();

const baseLots = [
  { id: 'PT-24086', material: 'HDPE', source: 'Westlands Collection Point', route: 'Nairobi Metro', weight: 428, status: 'Verified', value: 34240, recorded: '07 Sep 2026', swatch: 'hdpe' },
  { id: 'PT-24085', material: 'PET', source: 'Kisauni Drop-off Hub', route: 'Mombasa Coast', weight: 612, status: 'In review', value: 42840, recorded: '07 Sep 2026', swatch: 'pet' },
  { id: 'PT-24084', material: 'PP', source: 'Kasarani Market Route', route: 'Nairobi Metro', weight: 285, status: 'Verified', value: 19950, recorded: '06 Sep 2026', swatch: 'pp' },
  { id: 'PT-24083', material: 'LDPE film', source: 'Kibuye Market Route', route: 'Kisumu Lake', weight: 194, status: 'Pending', value: 8730, recorded: '06 Sep 2026', swatch: 'ldpe' },
  { id: 'PT-24082', material: 'Mixed plastics', source: 'Industrial Area Sort Site', route: 'Nairobi Metro', weight: 740, status: 'Verified', value: 37000, recorded: '05 Sep 2026', swatch: 'mixed' },
  { id: 'PT-24081', material: 'HDPE', source: 'Nakuru East Collection Point', route: 'Rift Valley', weight: 351, status: 'Verified', value: 28080, recorded: '05 Sep 2026', swatch: 'hdpe' }
];
let lots = [...baseLots];
let toastTimer;

function formatValue(value) {
  return `KES ${value.toLocaleString('en-KE')}`;
}

function renderLots() {
  const search = document.querySelector('#lot-search').value.trim().toLowerCase();
  const status = document.querySelector('#status-filter').value;
  const filtered = lots.filter((lot) => {
    const matchesSearch = !search || [lot.id, lot.material, lot.source, lot.route].join(' ').toLowerCase().includes(search);
    const matchesStatus = status === 'all' || lot.status === status;
    return matchesSearch && matchesStatus;
  });
  const tbody = document.querySelector('#lots-body');
  tbody.innerHTML = filtered.length ? filtered.map((lot) => `
    <tr class="lots-table-row">
      <td>${lot.id}</td>
      <td><div class="material-cell"><i class="material-swatch ${lot.swatch}"></i>${lot.material}</div></td>
      <td><div class="route-cell"><strong>${lot.source}</strong><span>${lot.route}</span></div></td>
      <td>${lot.weight.toLocaleString('en-KE')} kg</td>
      <td><span class="status ${lot.status === 'Verified' ? 'verified' : lot.status === 'In review' ? 'review' : 'pending'}">${lot.status}</span></td>
      <td class="value-cell">${formatValue(lot.value)}</td>
      <td class="date-cell">${lot.recorded}</td>
      <td><button class="row-menu" aria-label="More options for ${lot.id}" data-toast="Lot actions are coming soon">•••</button></td>
    </tr>`).join('') : '<tr class="empty-row"><td colspan="8">No lots match this search.</td></tr>';
  document.querySelector('#showing-count').textContent = filtered.length;
  const totalLots = 86 + Math.max(0, lots.length - baseLots.length);
  document.querySelector('#lots-total-count').textContent = totalLots;
  document.querySelector('#nav-total-lots').textContent = totalLots;
  tbody.querySelectorAll('[data-toast]').forEach(bindToast);
}

function bindToast(button) {
  button.addEventListener('click', () => showToast(button.dataset.toast));
}

function showToast(message) {
  const toast = document.querySelector('#toast');
  document.querySelector('#toast-message').textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

function setActiveNav(view) {
  document.querySelectorAll('.nav-item[data-view]').forEach((item) => item.classList.toggle('active', item.dataset.view === view));
}

function closeSidebar() { document.querySelector('.sidebar').classList.remove('open'); }

function openModal() {
  const modal = document.querySelector('#intake-modal');
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  setTimeout(() => modal.querySelector('input')?.focus(), 30);
}
function closeModal() {
  document.querySelector('#intake-modal').hidden = true;
  document.body.style.overflow = '';
}

function updateMetrics(weight, value) {
  const weightNode = document.querySelector('#total-weight');
  const lotNode = document.querySelector('#total-lots');
  const valueNode = document.querySelector('#total-value');
  const impactNode = document.querySelector('#total-impact');
  const currentWeight = Number(weightNode.textContent);
  const currentLots = Number(lotNode.textContent);
  const currentValue = Number(valueNode.textContent);
  const currentImpact = Number(impactNode.textContent);
  weightNode.textContent = (currentWeight + weight / 1000).toFixed(1);
  lotNode.textContent = currentLots + 1;
  valueNode.textContent = (currentValue + value / 1000000).toFixed(2);
  impactNode.textContent = (currentImpact + weight * .00255).toFixed(1);
}

const overviewParts = ['.hero-row', '.metric-grid', '.identity-panel', '.settlement-panel', '.dashboard-grid', '.lots-panel', '.bottom-grid'];
const routePages = document.querySelector('#route-pages');
const pageNames = { overview: 'Overview', lots: 'Material lots', network: 'Recovery network', ledger: 'Impact ledger' };

function routeHeader(kicker, title, description, action = '') {
  return `<div class="route-page-header"><div><p class="eyebrow"><span class="eyebrow-dot"></span>${kicker}</p><h1>${title}</h1><p class="hero-copy">${description}</p></div>${action}</div>`;
}

function renderLotsPage() {
  routePages.innerHTML = `${routeHeader('Chain of custody · 86 active lots', 'Material lots', 'Search every verified kilogram, inspect its chain of custody, and move the next lot through verification.', '<button class="button button-primary" data-open-intake><span data-icon="plus"></span>Record intake</button>')}
    <section class="route-kpi-grid"><div class="route-kpi dark"><span>Verified this month</span><strong>18.6<span> t</span></strong><small>+12.4% vs last month</small></div><div class="route-kpi lime"><span>In review</span><strong>14<span> lots</span></strong><small>5 due today</small></div><div class="route-kpi paper"><span>Average evidence score</span><strong>94<span>%</span></strong><small>Across current network</small></div><div class="route-kpi sage"><span>Lots needing attention</span><strong>03<span> items</span></strong><small>Open verifier actions</small></div></section>
    <section class="panel route-table-panel"><div class="panel-heading lots-heading"><div><p class="section-kicker">Master register</p><h2>All material lots</h2><p class="section-description">The operational identity of every lot, from source capture to processor handoff.</p></div><div class="table-actions"><label class="search-field"><span data-icon="search"></span><input id="page-lot-search" type="search" placeholder="Search lots" aria-label="Search all material lots" /></label><select id="page-status-filter" aria-label="Filter all lots by status"><option value="all">All statuses</option><option value="Verified">Verified</option><option value="In review">In review</option><option value="Pending">Pending</option></select></div></div><div class="table-scroll"><table><thead><tr><th>Lot ID</th><th>Material</th><th>Source & route</th><th>Weight</th><th>Traceability</th><th>Value</th><th>Recorded</th></tr></thead><tbody id="page-lots-body"></tbody></table></div><div class="table-footer"><span>Showing <strong id="page-showing-count">6</strong> of <strong id="page-total-count">86</strong> lots</span><button class="text-button" data-toast="Bulk actions are coming soon">Bulk actions <span>→</span></button></div></section>`;
  replaceIcons(routePages);
  const draw = () => {
    const search = document.querySelector('#page-lot-search').value.trim().toLowerCase();
    const status = document.querySelector('#page-status-filter').value;
    const filtered = lots.filter((lot) => (!search || [lot.id, lot.material, lot.source, lot.route].join(' ').toLowerCase().includes(search)) && (status === 'all' || lot.status === status));
    document.querySelector('#page-lots-body').innerHTML = filtered.length ? filtered.map((lot) => `<tr><td>${lot.id}</td><td><div class="material-cell"><i class="material-swatch ${lot.swatch}"></i>${lot.material}</div></td><td><div class="route-cell"><strong>${lot.source}</strong><span>${lot.route}</span></div></td><td>${lot.weight.toLocaleString('en-KE')} kg</td><td><span class="status ${lot.status === 'Verified' ? 'verified' : lot.status === 'In review' ? 'review' : 'pending'}">${lot.status}</span></td><td class="value-cell">${formatValue(lot.value)}</td><td class="date-cell">${lot.recorded}</td></tr>`).join('') : '<tr class="empty-row"><td colspan="7">No lots match this search.</td></tr>';
    document.querySelector('#page-showing-count').textContent = filtered.length;
    document.querySelector('#page-total-count').textContent = lots.length + (86 - baseLots.length);
  };
  document.querySelector('#page-lot-search').addEventListener('input', draw);
  document.querySelector('#page-status-filter').addEventListener('change', draw);
  draw();
}

function renderNetworkPage() {
  routePages.innerHTML = `${routeHeader('Recovery network · Kenya', 'Recovery network', 'See where recovery happens, which hubs are moving material, and where the next unit of capacity should go.', '<button class="button button-ghost" data-toast="Network report export is coming soon"><span data-icon="download"></span>Export network report</button>')}
    <section class="network-summary-grid"><div class="network-hero"><div><p class="section-kicker">Live network footprint</p><h2>65 active collectors<br><span>across 4 hubs.</span></h2><p>Every active hub is a node in the same chain-of-custody graph.</p></div><div class="network-total"><strong>24.8</strong><span>t recovered</span></div></div><div class="network-stat"><span>Hub utilization</span><strong>78%</strong><small>+6.2% this month</small><div class="progress-track"><i style="width: 78%"></i></div></div><div class="network-stat"><span>Avg. pickup completion</span><strong>91%</strong><small>Across 342 routes</small><div class="progress-track orange"><i style="width: 91%"></i></div></div></section>
    <section class="network-layout"><div class="panel network-map-panel"><div class="panel-heading"><div><p class="section-kicker">Geography of recovery</p><h2>Kenya hub pulse</h2></div><span class="live-badge"><i></i> Live network</span></div><div class="large-map pulse-map"><div class="map-grid"></div><div class="map-outline"></div><span class="map-label label-nairobi">Nairobi <b></b></span><span class="map-label label-mombasa">Mombasa <b></b></span><span class="map-label label-kisumu">Kisumu <b></b></span><span class="map-label label-nakuru">Nakuru <b></b></span><span class="map-label label-eldoret">Eldoret <b></b></span><div class="map-legend"><span><i class="hub-dot live"></i>Operating hub</span><span><i class="hub-dot"></i>Emerging route</span></div></div></div><div class="panel hub-performance-panel"><div class="panel-heading"><div><p class="section-kicker">Hub performance</p><h2>Who is moving material</h2></div></div><div class="hub-performance-list"><div class="performance-row"><div><strong>Nairobi Metro</strong><span>42 collectors · 12.6t</span></div><b>51%</b><i><em style="width: 51%"></em></i></div><div class="performance-row"><div><strong>Mombasa Coast</strong><span>18 collectors · 5.1t</span></div><b>21%</b><i><em style="width: 21%"></em></i></div><div class="performance-row"><div><strong>Kisumu Lake</strong><span>11 collectors · 4.2t</span></div><b>17%</b><i><em style="width: 17%"></em></i></div><div class="performance-row"><div><strong>Rift Valley</strong><span>9 collectors · 2.9t</span></div><b>11%</b><i><em style="width: 11%"></em></i></div></div><button class="button button-secondary full-width" data-toast="Hub onboarding is coming soon">Onboard a recovery hub <span>→</span></button></div></section>
    <section class="panel route-table-panel"><div class="panel-heading"><div><p class="section-kicker">Network operations</p><h2>Capacity signals</h2></div><button class="more-button" data-toast="Capacity filters are coming soon">•••</button></div><div class="signal-grid"><div><span>Highest throughput</span><strong>Nairobi Metro</strong><small>12.6t in current period</small></div><div><span>Fastest verification</span><strong>Kisumu Lake</strong><small>2.1 hr average review time</small></div><div><span>Next expansion</span><strong>Thika corridor</strong><small>6 collector groups queued</small></div></div></section>`;
  replaceIcons(routePages);
}

function renderLedgerPage() {
  routePages.innerHTML = `${routeHeader('Impact ledger · Methodology versioned', 'Impact ledger', 'Keep measured outcomes, issued credits, and retired claims in separate states so value never outruns proof.', '<button class="button button-primary" data-toast="Ledger export is coming soon"><span data-icon="download"></span>Export ledger</button>')}
    <section class="route-kpi-grid ledger-kpis"><div class="route-kpi dark"><span>Impact measured</span><strong>18.4<span> units</span></strong><small>Across 24.8t verified</small></div><div class="route-kpi sage"><span>Reserved</span><strong>4.2<span> units</span></strong><small>Assigned to 2 buyers</small></div><div class="route-kpi lime"><span>Issued</span><strong>0<span> units</span></strong><small>Awaiting independent gate</small></div><div class="route-kpi paper"><span>Retired</span><strong>0<span> units</span></strong><small>No public claims yet</small></div></section>
    <section class="panel ledger-callout"><div class="ledger-callout-icon" data-icon="shield"></div><div><p class="section-kicker">Integrity rule</p><h2>Measured is not the same as claimable.</h2><p>A lot can contribute to the impact ledger before it becomes a serialized credit. Issuance requires a methodology, independent verification, an allocation root, and a unique retirement path.</p></div><div class="ledger-rule"><span>Current methodology</span><strong>impact-ke-2026-01</strong><span>Claimable now</span><strong class="locked-text">0.00 units</strong></div></section>
    <section class="panel route-table-panel"><div class="panel-heading lots-heading"><div><p class="section-kicker">Attribute register</p><h2>Impact allocations</h2><p class="section-description">Every environmental attribute stays linked to a specific lot and methodology.</p></div><select aria-label="Filter impact attributes" data-toast="Ledger filters are coming soon"><option>All attributes</option><option>Collection</option><option>Recycling</option><option>Carbon</option></select></div><div class="table-scroll"><table><thead><tr><th>Attribute ID</th><th>Source lot</th><th>Type</th><th>Measured</th><th>Methodology</th><th>State</th><th>Public claim</th></tr></thead><tbody><tr><td>IMP-KE-000184</td><td>PT-24086</td><td>Collection</td><td>0.43 units</td><td>PRC-C v1.1</td><td><span class="status pending">Measured</span></td><td class="locked-cell">Locked</td></tr><tr><td>IMP-KE-000185</td><td>PT-24085</td><td>Recycling</td><td>0.61 units</td><td>PRC-R v1.1</td><td><span class="status review">Reserved</span></td><td class="locked-cell">Locked</td></tr><tr><td>IMP-KE-000186</td><td>PT-24082</td><td>Collection</td><td>0.74 units</td><td>PRC-C v1.1</td><td><span class="status verified">Issued</span></td><td class="claim-cell">Awaiting retirement</td></tr><tr><td>IMP-KE-000187</td><td>PT-24081</td><td>Carbon</td><td>1.00 units</td><td>impact-ke-2026-01</td><td><span class="status pending">Measured</span></td><td class="locked-cell">Locked</td></tr></tbody></table></div><div class="table-footer"><span>Showing <strong>4</strong> active allocations</span><button class="text-button" data-toast="Credit serials are coming soon">View credit registry <span>→</span></button></div></section>`;
  replaceIcons(routePages);
}

function navigate(view) {
  setActiveNav(view);
  document.querySelector('#breadcrumb-view').textContent = pageNames[view];
  overviewParts.forEach((selector) => { document.querySelector(selector).style.display = view === 'overview' ? '' : 'none'; });
  if (view === 'overview') routePages.setAttribute('hidden', '');
  else routePages.removeAttribute('hidden');
  routePages.style.display = view === 'overview' ? 'none' : '';
  if (view === 'lots') renderLotsPage();
  if (view === 'network') renderNetworkPage();
  if (view === 'ledger') renderLedgerPage();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('[data-toast]').forEach(bindToast);
document.querySelectorAll('[data-open-intake]').forEach((button) => button.addEventListener('click', openModal));
document.querySelectorAll('[data-close-intake]').forEach((button) => button.addEventListener('click', closeModal));
document.querySelector('#intake-modal').addEventListener('click', (event) => { if (event.target.id === 'intake-modal') closeModal(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeModal(); });
document.querySelector('.mobile-menu').addEventListener('click', () => document.querySelector('.sidebar').classList.toggle('open'));
document.querySelector('#lot-search').addEventListener('input', renderLots);
document.querySelector('#status-filter').addEventListener('change', renderLots);

document.querySelectorAll('.nav-item[data-view]').forEach((item) => item.addEventListener('click', () => {
  navigate(item.dataset.view);
  closeSidebar();
}));
document.querySelectorAll('[data-view-target]').forEach((button) => button.addEventListener('click', () => {
  const target = button.dataset.viewTarget;
  navigate(target);
}));
routePages.addEventListener('click', (event) => {
  const back = event.target.closest('[data-route-back]');
  if (back) navigate('overview');
  const intake = event.target.closest('[data-open-intake]');
  if (intake) openModal();
  const toast = event.target.closest('[data-toast]');
  if (toast) showToast(toast.dataset.toast);
});
document.querySelectorAll('[data-range]').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('[data-range]').forEach((range) => range.classList.remove('selected'));
  button.classList.add('selected');
  const totals = { '30d': '8.42 t', '90d': '23.68 t', '12m': '86.40 t' };
  document.querySelector('#chart-total').innerHTML = `${totals[button.dataset.range]} <small>${button.dataset.range === '30d' ? 'this period' : 'selected period'}</small>`;
}));

document.querySelector('#intake-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const weight = Number(form.get('weight'));
  const material = String(form.get('material'));
  const valuePerKg = { HDPE: 80, PET: 70, PP: 70, 'LDPE film': 45, 'Mixed plastics': 50 }[material] || 50;
  const nextId = 24087 + lots.length - baseLots.length;
  const lot = { id: `PT-${nextId}`, material, source: String(form.get('source')), route: String(form.get('hub')), weight, status: 'In review', value: weight * valuePerKg, recorded: '07 Sep 2026', swatch: material === 'PET' ? 'pet' : material === 'PP' ? 'pp' : material === 'LDPE film' ? 'ldpe' : material === 'Mixed plastics' ? 'mixed' : 'hdpe' };
  lots = [lot, ...lots];
  updateMetrics(weight, lot.value);
  renderLots();
  closeModal();
  event.currentTarget.reset();
  showToast(`${lot.id} created and queued for verification`);
  document.querySelector('.lots-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

renderLots();
