// ============================================================
// Timeline — visual roll history
// ============================================================

const Timeline = (() => {

  const MONTHS = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

  function dateOf(film) {
    return film.end_date || film.start_date || null;
  }

  function parseYear(dateStr) {
    if (!dateStr) return null;
    return parseInt(dateStr.split('-')[0]);
  }

  function formatMonthYear(dateStr) {
    if (!dateStr) return null;
    const [y, m] = dateStr.split('-');
    return `${MONTHS[parseInt(m) - 1]} ${y}`;
  }

  function formatDotClass(format) {
    if (format === '35mm')  return 'tl-dot--35mm';
    if (format === '120')   return 'tl-dot--120';
    if (format === 'Super8') return 'tl-dot--s8';
    return '';
  }

  function render() {
    const films = Films.getAll();

    const container = document.getElementById('timeline-view');
    if (!container) return;

    // Only rolls that have a date; sort newest first
    const dated = films
      .filter(f => dateOf(f))
      .sort((a, b) => (dateOf(b) || '').localeCompare(dateOf(a) || ''));

    if (!dated.length) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">&#128338;</div>
          <p>Registra rollos con fecha para ver tu línea de tiempo.</p>
        </div>`;
      return;
    }

    // Group by year
    const byYear = {};
    dated.forEach(f => {
      const y = parseYear(dateOf(f)) || 'Sin año';
      if (!byYear[y]) byYear[y] = [];
      byYear[y].push(f);
    });

    const years = Object.keys(byYear).sort((a, b) => b - a);

    container.innerHTML = `
      <div class="page-header" style="margin-bottom:1.5rem">
        <div>
          <h2>Línea de tiempo</h2>
          <p class="text-muted text-sm" style="margin-top:.25rem">${dated.length} rollo${dated.length !== 1 ? 's' : ''} con fecha registrada</p>
        </div>
      </div>
      <div class="tl-legend">
        <span class="tl-legend-item"><span class="tl-dot tl-dot--35mm"></span>35mm</span>
        <span class="tl-legend-item"><span class="tl-dot tl-dot--120"></span>120</span>
        <span class="tl-legend-item"><span class="tl-dot tl-dot--s8"></span>Super 8</span>
      </div>
      <div class="tl-root">
        ${years.map(year => `
          <div class="tl-year-block">
            <div class="tl-year-label">${year}</div>
            <div class="tl-entries">
              ${byYear[year].map(f => entryHtml(f)).join('')}
            </div>
          </div>
        `).join('')}
      </div>`;
  }

  function entryHtml(f) {
    const d = dateOf(f);
    const label = formatMonthYear(d) || '—';
    const dotCls = formatDotClass(f.format);
    const cam = f.cameras ? `${f.cameras.brand} ${f.cameras.model}` : null;

    return `
      <div class="tl-entry" onclick="FilmDetail.open('${f.id}')">
        <div class="tl-spine">
          <div class="tl-dot ${dotCls}"></div>
          <div class="tl-line"></div>
        </div>
        <div class="tl-card">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:.5rem">
            <div style="flex:1;min-width:0">
              <div class="tl-card-date">${label}</div>
              <div class="tl-card-title">${f.name}</div>
              <div class="tl-card-brand">${f.brand}</div>
              <div class="tl-card-badges">
                <span class="badge badge-yellow">${f.format}</span>
                ${Films.statusBadge(f.current_status)}
                ${Films.typeBadge(f.type)}
              </div>
              ${cam ? `<div class="tl-card-cam text-muted text-sm">&#128247; ${cam}</div>` : ''}
            </div>
            ${StockChip.render(f.brand, f.name, f.type, 'md')}
          </div>
        </div>
      </div>`;
  }

  return { render };
})();
