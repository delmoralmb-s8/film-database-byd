// ============================================================
// Timeline — agrupada por Formato → Año → Mes (colapsable)
// ============================================================

const Timeline = (() => {

  const FORMATS = [
    { key: '35mm',   label: '35mm',    icon: '&#127902;' },
    { key: '120',    label: '120',     icon: '&#128247;' },
    { key: 'Super8', label: 'Super 8', icon: '&#127909;' },
  ];

  function dateOf(f) { return f.end_date || f.start_date || null; }

  function parseYM(dateStr) {
    if (!dateStr) return { year: null, month: null };
    const parts = dateStr.split('-');
    return { year: parseInt(parts[0]), month: parseInt(parts[1]) };
  }

  function formatDotClass(format) {
    if (format === '35mm')   return 'tl-dot--35mm';
    if (format === '120')    return 'tl-dot--120';
    if (format === 'Super8') return 'tl-dot--s8';
    return '';
  }

  function toggleSection(btn) {
    const body   = btn.nextElementSibling;
    const isOpen = btn.classList.contains('open');
    const isYear = !btn.classList.contains('tl-collapse-btn--month');

    btn.classList.toggle('open', !isOpen);
    body.style.display = isOpen ? 'none' : '';

    if (!isOpen && isYear) {
      body.querySelectorAll('.tl-collapse-btn--month').forEach(mBtn => {
        mBtn.classList.add('open');
        mBtn.nextElementSibling.style.display = '';
      });
    }
  }

  function toggleAll(expand) {
    const panel = document.querySelector('.tl-fmt-panel.active');
    if (!panel) return;
    panel.querySelectorAll('.tl-collapse-btn').forEach(btn => {
      const body = btn.nextElementSibling;
      if (!body) return;
      btn.classList.toggle('open', expand);
      body.style.display = expand ? '' : 'none';
    });
    const allBtn = document.getElementById('tl-toggle-all-btn');
    if (allBtn) allBtn.textContent = expand ? I18n.t('tl_collapse_all') : I18n.t('tl_expand_all');
    allBtn?.setAttribute('data-expanded', expand ? '1' : '0');
  }

  function onToggleAll() {
    const btn = document.getElementById('tl-toggle-all-btn');
    const expanded = btn?.getAttribute('data-expanded') === '1';
    toggleAll(!expanded);
  }

  function switchFormat(btn) {
    const fmt = btn.dataset.fmt;
    document.querySelectorAll('.tl-fmt-tab').forEach(t =>
      t.classList.toggle('active', t.dataset.fmt === fmt));
    document.querySelectorAll('.tl-fmt-panel').forEach(p =>
      p.classList.toggle('active', p.dataset.fmt === fmt));
  }

  function render() {
    const films    = Films.getAll();
    const container = document.getElementById('timeline-view');
    if (!container) return;

    const dated = films
      .filter(f => dateOf(f))
      .sort((a, b) => (dateOf(b) || '').localeCompare(dateOf(a) || ''));

    if (!dated.length) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">&#128338;</div>
          <p>${I18n.t('empty_timeline')}</p>
        </div>`;
      return;
    }

    const grouped = {};
    FORMATS.forEach(f => { grouped[f.key] = {}; });

    dated.forEach(film => {
      const fmt = film.format || '35mm';
      if (!grouped[fmt]) grouped[fmt] = {};
      const { year, month } = parseYM(dateOf(film));
      const y = year  || 'Sin año';
      const m = month || 0;
      if (!grouped[fmt][y])    grouped[fmt][y] = {};
      if (!grouped[fmt][y][m]) grouped[fmt][y][m] = [];
      grouped[fmt][y][m].push(film);
    });

    const firstFmt = FORMATS.find(f =>
      Object.keys(grouped[f.key]).length
    )?.key || '35mm';

    const n = dated.length;
    container.innerHTML = `
      <div class="page-header" style="margin-bottom:1.25rem">
        <div>
          <h2>${I18n.t('tl_title')}</h2>
          <p class="text-muted text-sm" style="margin-top:.25rem">
            ${n} ${n !== 1 ? I18n.t('tl_rolls_date_n') : I18n.t('tl_rolls_date_1')}
          </p>
        </div>
        <button id="tl-toggle-all-btn" class="btn btn-ghost btn-sm"
          data-expanded="1" onclick="Timeline.onToggleAll()">${I18n.t('tl_collapse_all')}</button>
      </div>

      <div class="tl-fmt-tabs">
        ${FORMATS.map(f => {
          const count = Object.values(grouped[f.key])
            .reduce((sum, ms) => sum + Object.values(ms)
              .reduce((s, arr) => s + arr.length, 0), 0);
          return `
            <button class="tl-fmt-tab${f.key === firstFmt ? ' active' : ''}"
              data-fmt="${f.key}" onclick="Timeline.switchFormat(this)">
              <span class="tl-fmt-icon">${f.icon}</span>
              <span class="tl-fmt-label">${f.label}</span>
              ${count ? `<span class="tl-fmt-count">${count}</span>` : ''}
            </button>`;
        }).join('')}
      </div>

      ${FORMATS.map(f => `
        <div class="tl-fmt-panel${f.key === firstFmt ? ' active' : ''}" data-fmt="${f.key}">
          ${renderPanel(grouped[f.key])}
        </div>
      `).join('')}
    `;
  }

  function renderPanel(yearData) {
    const years = Object.keys(yearData).sort((a, b) => b - a);

    if (!years.length) {
      return `
        <div class="empty-state" style="padding:2rem 1rem">
          <div class="empty-icon" style="font-size:1.75rem;opacity:.35">&#127902;</div>
          <p style="font-size:.875rem">${I18n.t('empty_fmt_timeline')}</p>
        </div>`;
    }

    const monthsLong = I18n.t('months_long');

    return `
      <div class="tl-root">
        ${years.map((year, yi) => {
          const monthData = yearData[year];
          const months    = Object.keys(monthData).map(Number).sort((a, b) => b - a);
          const total     = months.reduce((s, m) => s + monthData[m].length, 0);
          const yearOpen  = yi === 0;

          return `
            <div class="tl-year-block">
              <button class="tl-collapse-btn${yearOpen ? ' open' : ''}"
                onclick="Timeline.toggleSection(this)">
                <span class="tl-collapse-year">${year}</span>
                <span class="tl-collapse-count">${total} ${total !== 1 ? I18n.t('stats_roll_n') : I18n.t('stats_roll_1')}</span>
                <span class="tl-chevron">&#8250;</span>
              </button>

              <div class="tl-year-body" style="${yearOpen ? '' : 'display:none'}">
                ${months.map((month, mi) => {
                  const entries    = monthData[month];
                  const monthLabel = month ? (monthsLong[month - 1] || month) : I18n.t('tl_no_month');
                  const monthOpen  = yearOpen && mi === 0;

                  return `
                    <div class="tl-month-block">
                      <button class="tl-collapse-btn tl-collapse-btn--month${monthOpen ? ' open' : ''}"
                        onclick="Timeline.toggleSection(this)">
                        <span class="tl-collapse-month">${monthLabel}</span>
                        <span class="tl-collapse-count">${entries.length} ${entries.length !== 1 ? I18n.t('stats_roll_n') : I18n.t('stats_roll_1')}</span>
                        <span class="tl-chevron">&#8250;</span>
                      </button>

                      <div class="tl-month-body" style="${monthOpen ? '' : 'display:none'}">
                        <div class="tl-entries">
                          ${entries.map(f => entryHtml(f)).join('')}
                        </div>
                      </div>
                    </div>`;
                }).join('')}
              </div>
            </div>`;
        }).join('')}
      </div>`;
  }

  function entryHtml(f) {
    const dotCls = formatDotClass(f.format);
    const cam    = f.cameras ? `${f.cameras.brand} ${f.cameras.model}` : null;

    return `
      <div class="tl-entry" onclick="FilmDetail.open('${f.id}')">
        <div class="tl-spine">
          <div class="tl-dot ${dotCls}"></div>
          <div class="tl-line"></div>
        </div>
        <div class="tl-card">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:.5rem">
            <div style="flex:1;min-width:0">
              <div class="tl-card-title">${f.name}</div>
              <div class="tl-card-brand">${f.brand}</div>
              <div class="tl-card-badges">
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

  return { render, switchFormat, toggleSection, onToggleAll };
})();
