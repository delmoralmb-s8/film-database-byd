// ============================================================
// Dashboard
// ============================================================

const Dashboard = (() => {

  async function render() {
    const films   = Films.getAll();
    const cameras = Cameras.getAll();
    const lenses  = Lenses.getAll();

    const inCam    = films.filter(f => f.current_status === 'en_camara');
    const inDev    = films.filter(f => f.current_status === 'en_revelado');
    const done     = films.filter(f => f.current_status === 'finalizado');
    const scanned  = films.filter(f => f.current_status === 'escaneado');
    const rancio   = films.filter(f => f.film_status === 'rancio');

    // Stats
    document.getElementById('stat-total').textContent   = films.length;
    document.getElementById('stat-in-cam').textContent  = inCam.length;
    document.getElementById('stat-in-dev').textContent  = inDev.length;
    document.getElementById('stat-scanned').textContent = scanned.length;
    document.getElementById('stat-cameras').textContent = cameras.length;
    document.getElementById('stat-lenses').textContent  = lenses.length;

    // Rollos en cámara
    renderCards('dash-in-cam', inCam, '📷 En cámara', inCam.length === 0);

    // Rollos rancios
    renderCards('dash-rancio', rancio, '⚠️ Rancios', rancio.length === 0);

    // Rollos en revelado
    renderCards('dash-in-dev', inDev, '🧪 En revelado', inDev.length === 0);

    renderCards('dash-scanned', scanned.slice(0, 6), '🖼 Por escanear', scanned.length === 0);
  }

  function renderCards(containerId, list, emptyMsg, isEmpty) {
    const el = document.getElementById(containerId);
    if (!el) return;
    if (isEmpty) {
      el.innerHTML = `<p class="text-muted text-sm">Ninguno.</p>`;
      return;
    }
    el.innerHTML = `<div class="film-cards">${list.map(f => filmCard(f)).join('')}</div>`;
  }

  function filmCard(f) {
    const cam = f.cameras ? `${f.cameras.brand} ${f.cameras.model}` : null;
    return `
      <div class="film-card" onclick="FilmDetail.open('${f.id}')">
        <div class="film-card-header">
          <div>
            <div class="film-card-title">${f.name}</div>
            <div class="film-card-brand">${f.brand}</div>
          </div>
          ${Films.statusBadge(f.current_status)}
        </div>
        <div class="film-card-meta">
          ${Films.filmStatusBadge(f.film_status)}
          <span class="badge badge-yellow">${f.format}</span>
          <span class="badge badge-gray">ISO ${f.iso}</span>
          ${f.push_pull !== 'no' ? `<span class="badge badge-yellow">${f.push_pull}</span>` : ''}
        </div>
        ${cam ? `<div class="text-muted text-sm mt-1">📷 ${cam}</div>` : ''}
        ${f.city ? `<div class="text-muted text-sm">📍 ${f.city}${f.country ? ', '+f.country : ''}</div>` : ''}
        ${(f.start_date || f.end_date) ? `<div class="text-muted text-sm">📅 ${Films.formatDate(f.start_date) || '?'}${f.end_date ? ' → ' + Films.formatDate(f.end_date) : ''}</div>` : ''}
      </div>`;
  }

  return { render };
})();
