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
  search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/>',
  spark: '<path d="m12 3 1.7 6.3L20 11l-6.3 1.7L12 19l-1.7-6.3L4 11l6.3-1.7L12 3ZM19 18l.6 2.4L22 21l-2.4.6L19 24l-.6-2.4L16 21l2.4-.6L19 18Z"/>',
  scan: '<path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M8 12h8M12 8v8"/>',
  truck: '<path d="M3 6h11v11H3zM14 10h4l3 3v4h-7zM6 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM18 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 8h.01"/>'
};

document.querySelectorAll('[data-icon]').forEach((node) => {
  const name = node.dataset.icon;
  if (iconPaths[name]) node.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${iconPaths[name]}</svg>`;
});

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

document.querySelectorAll('[data-toast]').forEach(bindToast);
document.querySelectorAll('[data-open-intake]').forEach((button) => button.addEventListener('click', openModal));
document.querySelectorAll('[data-close-intake]').forEach((button) => button.addEventListener('click', closeModal));
document.querySelector('#intake-modal').addEventListener('click', (event) => { if (event.target.id === 'intake-modal') closeModal(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeModal(); });
document.querySelector('.mobile-menu').addEventListener('click', () => document.querySelector('.sidebar').classList.toggle('open'));
document.querySelector('#lot-search').addEventListener('input', renderLots);
document.querySelector('#status-filter').addEventListener('change', renderLots);

document.querySelectorAll('.nav-item[data-view]').forEach((item) => item.addEventListener('click', () => {
  setActiveNav(item.dataset.view);
  if (item.dataset.view !== 'overview') showToast(`${item.textContent.trim()} is coming soon`);
  closeSidebar();
}));
document.querySelectorAll('[data-view-target]').forEach((button) => button.addEventListener('click', () => {
  const target = button.dataset.viewTarget;
  setActiveNav(target);
  document.querySelector('.lots-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  if (target !== 'lots') showToast(`${target === 'network' ? 'Recovery network' : 'This view'} is coming soon`);
}));
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
