// ============================================================
// Film Detail View
// ============================================================

const FilmDetail = (() => {
  let currentFilmId = null;

  function open(id) {
    currentFilmId = id;
    App.navigate('film-detail');
  }

  function render() {
    const film = Films.getAll().find(f => f.id === currentFilmId);
    const el = document.getElementById('film-detail-content');
    if (!el) return;
    if (!film) {
      el.innerHTML = `<p class="text-muted">${I18n.t('detail_not_found')}</p>`;
      return;
    }

    const cam   = film.cameras ? `${film.cameras.brand} ${film.cameras.model}` : null;
    const lens  = film.lenses  ? `${film.lenses.brand} ${film.lenses.focal_length}` : null;
    const start = Films.formatDate(film.start_date);
    const end   = Films.formatDate(film.end_date);

    el.innerHTML = `
      <div class="detail-card">
        <div class="detail-header">
          <div style="display:flex;gap:.85rem;align-items:flex-start">
            ${StockChip.render(film.brand, film.name, film.type, 'lg')}
            <div>
              <div class="detail-title">${film.name}</div>
              <div class="detail-brand">${film.brand}</div>
            </div>
          </div>
          <div class="detail-badges">
            ${Films.statusBadge(film.current_status)}
            ${Films.filmStatusBadge(film.film_status)}
          </div>
        </div>

        <div class="detail-badges-row">
          <span class="badge badge-yellow">${film.format}</span>
          ${film.type === 'color' ? `<span class="badge badge-teal">${I18n.t('type_color')}</span>`
            : film.type === 'bw'  ? `<span class="badge badge-gray">${I18n.t('type_bw')}</span>`
            : `<span class="badge badge-blue">${I18n.t('type_slide')}</span>`}
          <span class="badge badge-gray">ISO ${film.iso}</span>
          ${film.push_pull !== 'no' ? `<span class="badge badge-yellow">Push/Pull ${film.push_pull}</span>` : ''}
          ${film.num_photos ? `<span class="badge badge-gray">${film.num_photos} ${I18n.t('detail_exposures')}</span>` : ''}
        </div>

        <div class="detail-grid">
          ${cam ? `
          <div class="detail-row">
            <span class="detail-icon">📷</span>
            <span class="detail-label">${I18n.t('detail_camera')}</span>
            <span class="detail-value">${cam}</span>
          </div>` : ''}
          ${lens ? `
          <div class="detail-row">
            <span class="detail-icon">🔭</span>
            <span class="detail-label">${I18n.t('detail_lens')}</span>
            <span class="detail-value">${lens}</span>
          </div>` : ''}
          ${(film.city || film.country) ? `
          <div class="detail-row">
            <span class="detail-icon">📍</span>
            <span class="detail-label">${I18n.t('detail_location')}</span>
            <span class="detail-value">${[film.city, film.country].filter(Boolean).join(', ')}</span>
          </div>` : ''}
          ${start ? `
          <div class="detail-row">
            <span class="detail-icon">📅</span>
            <span class="detail-label">${I18n.t('detail_start')}</span>
            <span class="detail-value">${start}</span>
          </div>` : ''}
          ${end ? `
          <div class="detail-row">
            <span class="detail-icon">🏁</span>
            <span class="detail-label">${I18n.t('detail_end')}</span>
            <span class="detail-value">${end}</span>
          </div>` : ''}
          ${film.lab ? `
          <div class="detail-row">
            <span class="detail-icon">🧪</span>
            <span class="detail-label">${I18n.t('detail_lab')}</span>
            <span class="detail-value">${film.lab}</span>
          </div>` : ''}
          ${film.photo_type ? `
          <div class="detail-row">
            <span class="detail-icon">🖼</span>
            <span class="detail-label">${I18n.t('detail_photo_type')}</span>
            <span class="detail-value">${Films.photoTypeLabel(film.photo_type)}</span>
          </div>` : ''}
        </div>

        ${film.notes ? `
        <div class="detail-notes">
          <div class="detail-notes-label">${I18n.t('detail_notes')}</div>
          <p class="detail-notes-body">${film.notes}</p>
        </div>` : ''}

        <div class="detail-actions">
          <button class="btn btn-ghost" onclick="App.navigate('dashboard')">${I18n.t('detail_back')}</button>
          <button class="btn btn-primary" onclick="Films.openEdit('${film.id}')">${I18n.t('detail_edit')}</button>
        </div>
      </div>`;
  }

  return { open, render };
})();
