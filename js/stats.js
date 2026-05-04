// ============================================================
// Stats — Módulo de estadísticas
// ============================================================

const Stats = (() => {

  const S8_SECS = { '9': 400, '18': 200, '24': 150 };

  const FMT_LABELS   = { '35mm': '35mm', '120': '120', 'Super8': 'Super 8' };
  const FMT_COLORS   = { '35mm': 'var(--primary)', '120': '#7c3aed', 'Super8': '#b45309' };

  const PHOTO_ICONS  = {
    // DB keys (new format)
    'familia':   '👨‍👩‍👧',
    'amigos':    '👥',
    'paisaje':   '🌄',
    'retrato':   '🧑',
    'calle':     '🏙️',
    'viaje':     '✈️',
    'chile_mole':'🌶️',
    'ex':        '💔',
    'boda':      '💍',
    'eventos':   '🎉',
    'mascotas':  '🐾',
    'estudio':   '🎞',
    'producto':  '📦',
    'macro':     '🔬',
    'otro':      '📸',
    // Legacy Spanish labels (backward compat)
    'Paisaje':   '🌄',
    'Retrato':   '🧑',
    'Calle':     '🏙️',
    'Viaje':     '✈️',
    'Familia':   '👨‍👩‍👧',
    'Amigos':    '👥',
    'De chile, mole y pozole': '🌶️',
    'de mi ex :(': '💔',
  };

  function dateOf(f) { return f.start_date || f.end_date || null; }

  let _activeYear = null;

  // ── Render principal ─────────────────────────────────────
  function render() {
    _activeYear = null;
    const films = Films.getAll();
    const el = document.getElementById('stats-view');
    if (!el) return;

    if (!films.length) {
      el.innerHTML = `
        <div class="empty-state" style="padding:4rem 1rem">
          <div class="empty-icon">📊</div>
          <p>${I18n.t('empty_stats')}</p>
        </div>`;
      return;
    }

    el.innerHTML = `
      ${buildHero(films)}
      ${buildDNA(films)}
      ${buildYearActivity(films)}
      ${buildRankings(films)}
      ${buildDistribution(films)}
      ${buildPhotoTypes(films)}
      ${buildSuggestions(films)}
    `;
  }

  // ── ① Hero ──────────────────────────────────────────────
  function buildHero(films) {
    const total = films.length;

    const totalPhotos = films
      .filter(f => f.format !== 'Super8')
      .reduce((sum, f) => sum + (parseInt(f.num_photos) || 0), 0);

    const s8Films = films.filter(f => f.format === 'Super8');
    let totalS8Secs = 0;
    s8Films.forEach(f => { totalS8Secs += S8_SECS[f.num_photos] || 0; });
    const s8Mins = Math.floor(totalS8Secs / 60);
    const s8Secs = totalS8Secs % 60;

    const dates = films.map(f => dateOf(f)).filter(Boolean);
    let yearsActive = 0;
    if (dates.length) {
      const years = dates.map(d => parseInt(d.split('-')[0]));
      yearsActive = Math.max(...years) - Math.min(...years) + 1;
    }

    const formats = [...new Set(films.map(f => f.format).filter(Boolean))];
    const locale = I18n.getLang() === 'en' ? 'en-US' : 'es-MX';

    return `
      <div class="stats-hero">
        <div class="stats-hero-grid">
          <div class="stats-hero-card">
            <div class="stats-hero-num">${total}</div>
            <div class="stats-hero-label">${I18n.t('stats_total_rolls')}</div>
          </div>
          <div class="stats-hero-card">
            <div class="stats-hero-num">${totalPhotos.toLocaleString(locale)}</div>
            <div class="stats-hero-label">${I18n.t('stats_estimated_photos')}</div>
          </div>
          ${s8Films.length ? `
          <div class="stats-hero-card stats-hero-card--s8">
            <div class="stats-hero-num">${s8Mins}m ${s8Secs < 10 ? '0' : ''}${s8Secs}s</div>
            <div class="stats-hero-label">${I18n.t('stats_s8_mins')}</div>
            <div class="stats-hero-sub">${s8Films.length} ${s8Films.length !== 1 ? I18n.t('stats_reel_n') : I18n.t('stats_reel_1')}</div>
          </div>` : ''}
          <div class="stats-hero-card">
            <div class="stats-hero-num">${yearsActive || '—'}</div>
            <div class="stats-hero-label">${yearsActive !== 1 ? I18n.t('stats_year_n') : I18n.t('stats_year_1')}</div>
          </div>
          <div class="stats-hero-card">
            <div class="stats-hero-num">${formats.length}</div>
            <div class="stats-hero-label">${formats.length !== 1 ? I18n.t('stats_fmt_n') : I18n.t('stats_fmt_1')}</div>
            <div class="stats-hero-sub">${formats.map(f => FMT_LABELS[f] || f).join(' · ')}</div>
          </div>
        </div>
      </div>`;
  }

  // ── ② ADN fílmico ────────────────────────────────────────
  function buildDNA(films) {
    const typeCounts = { color: 0, bw: 0, slide: 0 };
    films.forEach(f => { if (f.type in typeCounts) typeCounts[f.type]++; });
    const typeTotal = typeCounts.color + typeCounts.bw + typeCounts.slide || 1;
    const dominant  = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0];
    const colorPct  = Math.round(typeCounts.color / typeTotal * 100);
    const bwPct     = Math.round(typeCounts.bw    / typeTotal * 100);
    const slidePct  = Math.round(typeCounts.slide / typeTotal * 100);

    const TYPE_LABELS = {
      color: I18n.t('type_color'),
      bw:    I18n.t('type_bw'),
      slide: I18n.t('type_slide'),
    };

    const emulsions = countEmulsions(films);
    const topEm = emulsions[0];

    const cams = countCameras(films);
    const topCam = cams[0];

    const rollWord = (n) => n !== 1 ? I18n.t('stats_roll_n') : I18n.t('stats_roll_1');

    const emHTML = topEm ? `
      <div class="dna-card">
        <div class="dna-card-title">${I18n.t('stats_top_emulsion')}</div>
        <div class="dna-chip-lg">${StockChip.render(topEm.brand, topEm.name, topEm.type || 'color', 'lg')}</div>
        <div class="dna-card-value">${topEm.brand} ${topEm.name}</div>
        <div class="dna-card-sub">${topEm.count} ${rollWord(topEm.count)}</div>
      </div>` : '';

    const camHTML = topCam ? `
      <div class="dna-card">
        <div class="dna-card-title">${I18n.t('stats_main_camera')}</div>
        <div class="dna-cam-icon">📷</div>
        <div class="dna-card-value">${topCam[0]}</div>
        <div class="dna-card-sub">${topCam[1]} ${rollWord(topCam[1])}</div>
      </div>` : '';

    return `
      <div class="stats-section">
        <div class="stats-section-title">${I18n.t('stats_dna')}</div>
        <div class="dna-grid">
          <div class="dna-card">
            <div class="dna-card-title">${I18n.t('stats_dominant_type')}</div>
            <div class="dna-dominant">${TYPE_LABELS[dominant?.[0]] || '—'}</div>
            <div class="dna-type-bar">
              <div class="dna-bar-seg dna-bar--color" style="width:${colorPct}%" title="${TYPE_LABELS.color} ${colorPct}%"></div>
              <div class="dna-bar-seg dna-bar--bw"    style="width:${bwPct}%"    title="${TYPE_LABELS.bw} ${bwPct}%"></div>
              <div class="dna-bar-seg dna-bar--slide" style="width:${slidePct}%" title="${TYPE_LABELS.slide} ${slidePct}%"></div>
            </div>
            <div class="dna-type-legend">
              <span class="dna-dot dna-bar--color"></span>${TYPE_LABELS.color} ${colorPct}%
              <span class="dna-dot dna-bar--bw" style="margin-left:.6rem"></span>${TYPE_LABELS.bw} ${bwPct}%
              <span class="dna-dot dna-bar--slide" style="margin-left:.6rem"></span>${TYPE_LABELS.slide} ${slidePct}%
            </div>
          </div>
          ${emHTML}
          ${camHTML}
        </div>
      </div>`;
  }

  // ── ③ Actividad por año ──────────────────────────────────
  function buildYearActivity(films) {
    const yearData = {};
    let sinFecha = 0;

    films.forEach(f => {
      const d = dateOf(f);
      if (!d) { sinFecha++; return; }
      const parts = d.split('-');
      const y = parseInt(parts[0]);
      const m = parseInt(parts[1]);
      if (!yearData[y]) {
        yearData[y] = { total: 0, fmt: { '35mm': 0, '120': 0, 'Super8': 0 }, months: {}, typeCounts: { color: 0, bw: 0, slide: 0 } };
      }
      yearData[y].total++;
      if (f.format in yearData[y].fmt) yearData[y].fmt[f.format]++;
      yearData[y].months[m] = (yearData[y].months[m] || 0) + 1;
      if (f.type in yearData[y].typeCounts) yearData[y].typeCounts[f.type]++;
    });

    const years = Object.keys(yearData).map(Number).sort();
    if (!years.length) return '';

    const maxCount = Math.max(...years.map(y => yearData[y].total));
    const peakYear = years.reduce((a, b) => yearData[a].total >= yearData[b].total ? a : b);

    const CHART_H = 85;
    const rollWord = (n) => n !== 1 ? I18n.t('stats_roll_n') : I18n.t('stats_roll_1');

    const barsHTML = years.map((y, i) => {
      const data  = yearData[y];
      const barH  = Math.max(Math.round(data.total / maxCount * CHART_H), 6);
      const isPeak = y === peakYear;

      const fmt35  = data.fmt['35mm']   || 0;
      const fmt120 = data.fmt['120']    || 0;
      const fmtS8  = data.fmt['Super8'] || 0;
      const segs = [
        fmt35  ? `<div class="yseg yseg--35mm" style="flex:${fmt35}"></div>`  : '',
        fmt120 ? `<div class="yseg yseg--120"  style="flex:${fmt120}"></div>` : '',
        fmtS8  ? `<div class="yseg yseg--s8"   style="flex:${fmtS8}"></div>`  : '',
      ].join('');

      let trendHTML = '';
      if (i > 0) {
        const prev = yearData[years[i - 1]].total;
        const diff = data.total - prev;
        const pct  = Math.round(Math.abs(diff) / prev * 100);
        if      (diff > 0) trendHTML = `<span class="year-trend year-trend--up">↑${pct}%</span>`;
        else if (diff < 0) trendHTML = `<span class="year-trend year-trend--dn">↓${pct}%</span>`;
        else               trendHTML = `<span class="year-trend year-trend--eq">=</span>`;
      }

      const fmtLine = [fmt35 ? `35mm·${fmt35}` : '', fmt120 ? `120·${fmt120}` : '', fmtS8 ? `S8·${fmtS8}` : ''].filter(Boolean).join('  ');

      return `
        <div class="year-bar-wrap${isPeak ? ' year-bar-wrap--peak' : ''}"
             data-year="${y}"
             onclick="Stats._toggleDetail(${y})">
          ${trendHTML}
          <div class="year-bar-count">${data.total}</div>
          <div class="year-bar-stacked" style="height:${barH}px">${segs}</div>
          <div class="year-bar-label">${y}${isPeak ? ' 🏆' : ''}</div>
          <div class="year-bar-tooltip">
            <strong>${y}</strong> — ${data.total} ${rollWord(data.total)}<br>
            <span style="opacity:.8">${fmtLine}</span>
          </div>
        </div>`;
    }).join('');

    const noDateNote = sinFecha
      ? `<span class="year-no-date">${sinFecha} ${rollWord(sinFecha)} ${I18n.t('stats_no_date')}</span>`
      : '';

    return `
      <div class="stats-section">
        <div class="stats-section-title-row">
          <span class="stats-section-title">${I18n.t('stats_activity')}</span>
          ${noDateNote}
        </div>
        <div class="year-chart">${barsHTML}</div>
        <div class="year-chart-legend">
          <span class="ycl-dot" style="background:#1c6a51"></span><span class="ycl-label">35mm</span>
          <span class="ycl-dot" style="background:#7c3aed"></span><span class="ycl-label">120</span>
          <span class="ycl-dot" style="background:#b45309"></span><span class="ycl-label">Super 8</span>
          <span class="ycl-hint">${I18n.t('stats_tap_year')}</span>
        </div>
        <div id="year-detail-panel" class="year-detail-panel"></div>
      </div>`;
  }

  // ── Panel de detalle por año ──────────────────────────────
  function _toggleDetail(year) {
    const panel = document.getElementById('year-detail-panel');
    if (!panel) return;

    document.querySelectorAll('.year-bar-wrap').forEach(b => b.classList.remove('year-bar-wrap--selected'));

    if (_activeYear === year) {
      _activeYear = null;
      panel.style.maxHeight = '0';
      panel.style.opacity   = '0';
      setTimeout(() => { panel.innerHTML = ''; }, 250);
      return;
    }

    _activeYear = year;
    document.querySelector(`.year-bar-wrap[data-year="${year}"]`)?.classList.add('year-bar-wrap--selected');

    const films = Films.getAll();
    const yearFilms = films.filter(f => {
      const d = dateOf(f);
      return d && parseInt(d.split('-')[0]) === year;
    });

    const monthCounts = {};
    yearFilms.forEach(f => {
      const d = dateOf(f);
      if (!d) return;
      const m = parseInt(d.split('-')[1]);
      monthCounts[m] = (monthCounts[m] || 0) + 1;
    });
    const maxMonth = Math.max(...Object.values(monthCounts), 1);

    const tc = { color: 0, bw: 0, slide: 0 };
    yearFilms.forEach(f => { if (f.type in tc) tc[f.type]++; });
    const tt = yearFilms.length || 1;
    const cp = Math.round(tc.color / tt * 100);
    const bp = Math.round(tc.bw    / tt * 100);
    const sp = Math.round(tc.slide / tt * 100);

    const emulsions = countEmulsions(yearFilms);
    const topEm = emulsions[0];

    const fmtCount = {};
    yearFilms.forEach(f => { if (f.format) fmtCount[f.format] = (fmtCount[f.format] || 0) + 1; });
    const fmtBadges = Object.entries(fmtCount)
      .map(([fmt, n]) => {
        const cls = { '35mm': 'fmt-35mm', '120': 'fmt-120', 'Super8': 'fmt-s8' }[fmt] || '';
        return `<span class="fmt-badge ${cls}">${FMT_LABELS[fmt] || fmt}: ${n}</span>`;
      }).join('');

    const monthsShort = I18n.t('months_short');
    const rollWord = (n) => n !== 1 ? I18n.t('stats_roll_n') : I18n.t('stats_roll_1');

    const heatHTML = monthsShort.map((mo, i) => {
      const count   = monthCounts[i + 1] || 0;
      const opacity = count ? Math.max(0.18, count / maxMonth) : 0.06;
      return `
        <div class="heat-cell" title="${mo}: ${count} ${rollWord(count)}"
             style="background:rgba(28,106,81,${opacity.toFixed(2)})">
          <span class="heat-label">${mo}</span>
        </div>`;
    }).join('');

    const TYPE_LABELS = {
      color: I18n.t('type_color'),
      bw:    I18n.t('type_bw'),
      slide: I18n.t('type_slide'),
    };

    const topEmHTML = topEm ? `
      <div class="year-detail-top-em">
        ${StockChip.render(topEm.brand, topEm.name, topEm.type || 'color', 'sm')}
        <div>
          <div class="year-detail-em-name">${topEm.brand} ${topEm.name}</div>
          <div class="year-detail-em-sub">${topEm.count} ${rollWord(topEm.count)}</div>
        </div>
      </div>` : '<span class="stats-empty">—</span>';

    panel.innerHTML = `
      <div class="year-detail-header">
        <div class="year-detail-title-group">
          <span class="year-detail-year">${year}</span>
          <span class="year-detail-total">${yearFilms.length} ${rollWord(yearFilms.length)}</span>
          <div class="year-detail-fmt-badges">${fmtBadges}</div>
        </div>
        <button class="year-detail-close" onclick="Stats._closeDetail()">✕</button>
      </div>
      <div class="year-detail-body">
        <div class="year-detail-sub-title">${I18n.t('stats_monthly_activity')}</div>
        <div class="heat-row" style="margin-bottom:1.1rem">${heatHTML}</div>
        <div class="year-detail-split">
          <div>
            <div class="year-detail-sub-title">${I18n.t('stats_type')}</div>
            <div class="dna-type-bar" style="height:8px;margin-bottom:.4rem">
              <div class="dna-bar-seg dna-bar--color" style="width:${cp}%"></div>
              <div class="dna-bar-seg dna-bar--bw"    style="width:${bp}%"></div>
              <div class="dna-bar-seg dna-bar--slide" style="width:${sp}%"></div>
            </div>
            <div class="dna-type-legend">
              <span class="dna-dot dna-bar--color"></span>${TYPE_LABELS.color} ${cp}%
              <span class="dna-dot dna-bar--bw"    style="margin-left:.5rem"></span>${TYPE_LABELS.bw} ${bp}%
              <span class="dna-dot dna-bar--slide" style="margin-left:.5rem"></span>${TYPE_LABELS.slide} ${sp}%
            </div>
          </div>
          <div>
            <div class="year-detail-sub-title">${I18n.t('stats_top_em_year')}</div>
            ${topEmHTML}
          </div>
        </div>
      </div>`;

    panel.style.maxHeight = '0';
    panel.style.opacity   = '0';
    requestAnimationFrame(() => {
      panel.style.maxHeight = '600px';
      panel.style.opacity   = '1';
    });
  }

  function _closeDetail() {
    const panel = document.getElementById('year-detail-panel');
    if (!panel) return;
    _activeYear = null;
    document.querySelectorAll('.year-bar-wrap').forEach(b => b.classList.remove('year-bar-wrap--selected'));
    panel.style.maxHeight = '0';
    panel.style.opacity   = '0';
    setTimeout(() => { panel.innerHTML = ''; }, 250);
  }

  // ── ④ Rankings ───────────────────────────────────────────
  function buildRankings(films) {
    const emulsions = countEmulsions(films).slice(0, 5);
    const cams      = countCameras(films).slice(0, 5);
    const maxE = emulsions[0]?.count || 1;
    const maxC = cams[0]?.[1] || 1;

    const emHTML = emulsions.map((e, i) => `
      <div class="rank-row">
        <span class="rank-num">${i + 1}</span>
        ${StockChip.render(e.brand, e.name, e.type || 'color', 'sm')}
        <div class="rank-info">
          <div class="rank-name">${e.brand} ${e.name}</div>
          <div class="rank-bar"><div class="rank-bar-fill" style="width:${Math.round(e.count/maxE*100)}%"></div></div>
        </div>
        <span class="rank-count">${e.count}</span>
      </div>`).join('') || `<p class="stats-empty">${I18n.t('stats_no_data')}</p>`;

    const camHTML = cams.map(([name, count], i) => `
      <div class="rank-row">
        <span class="rank-num">${i + 1}</span>
        <span class="rank-cam-icon">📷</span>
        <div class="rank-info">
          <div class="rank-name">${name}</div>
          <div class="rank-bar"><div class="rank-bar-fill" style="width:${Math.round(count/maxC*100)}%"></div></div>
        </div>
        <span class="rank-count">${count}</span>
      </div>`).join('') || `<p class="stats-empty">${I18n.t('stats_no_data')}</p>`;

    return `
      <div class="stats-section">
        <div class="stats-section-title">${I18n.t('stats_rankings')}</div>
        <div class="rankings-grid">
          <div class="rankings-col">
            <div class="rankings-col-title">${I18n.t('stats_top_emulsions')}</div>
            ${emHTML}
          </div>
          <div class="rankings-col">
            <div class="rankings-col-title">${I18n.t('stats_top_cameras')}</div>
            ${camHTML}
          </div>
        </div>
      </div>`;
  }

  // ── ⑤ Distribución ──────────────────────────────────────
  function buildDistribution(films) {
    const fmtCount = {};
    films.forEach(f => { if (f.format) fmtCount[f.format] = (fmtCount[f.format] || 0) + 1; });
    const fmtTotal = Object.values(fmtCount).reduce((a, b) => a + b, 0) || 1;

    const labCount = {};
    films.forEach(f => { if (f.lab) labCount[f.lab] = (labCount[f.lab] || 0) + 1; });
    const topLabs = Object.entries(labCount).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const maxLab  = topLabs[0]?.[1] || 1;

    const cityCount = {};
    films.forEach(f => { if (f.city) cityCount[f.city] = (cityCount[f.city] || 0) + 1; });
    const topCities = Object.entries(cityCount).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const maxCity   = topCities[0]?.[1] || 1;

    const fmtHTML = Object.entries(fmtCount)
      .sort((a, b) => b[1] - a[1])
      .map(([fmt, count]) => `
        <div class="dist-row">
          <span class="dist-label">${FMT_LABELS[fmt] || fmt}</span>
          <div class="dist-bar-wrap">
            <div class="dist-bar" style="width:${Math.round(count/fmtTotal*100)}%;background:${FMT_COLORS[fmt] || 'var(--primary)'}"></div>
          </div>
          <span class="dist-count">${count} · ${Math.round(count/fmtTotal*100)}%</span>
        </div>`).join('') || '<p class="stats-empty">—</p>';

    const labHTML = topLabs.map(([lab, count]) => `
      <div class="dist-row">
        <span class="dist-label">${lab}</span>
        <div class="dist-bar-wrap">
          <div class="dist-bar" style="width:${Math.round(count/maxLab*100)}%"></div>
        </div>
        <span class="dist-count">${count}</span>
      </div>`).join('') || '<p class="stats-empty">—</p>';

    const cityHTML = topCities.map(([city, count]) => `
      <div class="dist-row">
        <span class="dist-label">${city}</span>
        <div class="dist-bar-wrap">
          <div class="dist-bar" style="width:${Math.round(count/maxCity*100)}%"></div>
        </div>
        <span class="dist-count">${count}</span>
      </div>`).join('') || '<p class="stats-empty">—</p>';

    return `
      <div class="stats-section">
        <div class="stats-section-title">${I18n.t('stats_distribution')}</div>
        <div class="dist-grid">
          <div class="dist-col">
            <div class="dist-col-title">${I18n.t('stats_formats_col')}</div>
            ${fmtHTML}
          </div>
          <div class="dist-col">
            <div class="dist-col-title">${I18n.t('stats_labs_col')}</div>
            ${labHTML}
          </div>
          <div class="dist-col">
            <div class="dist-col-title">${I18n.t('stats_cities_col')}</div>
            ${cityHTML}
          </div>
        </div>
      </div>`;
  }

  // ── ⑥ Tipos de foto ─────────────────────────────────────
  function buildPhotoTypes(films) {
    const typeCount = {};
    let total = 0;
    films.forEach(f => {
      if (!f.photo_type) return;
      typeCount[f.photo_type] = (typeCount[f.photo_type] || 0) + 1;
      total++;
    });
    if (!total) return '';

    const sorted = Object.entries(typeCount).sort((a, b) => b[1] - a[1]);
    const max    = sorted[0][1];

    const html = sorted.map(([type, count]) => `
      <div class="photo-type-row">
        <span class="photo-type-icon">${PHOTO_ICONS[type] || '📸'}</span>
        <span class="photo-type-name">${Films.photoTypeLabel(type)}</span>
        <div class="dist-bar-wrap">
          <div class="dist-bar" style="width:${Math.round(count/max*100)}%"></div>
        </div>
        <span class="dist-count">${Math.round(count/total*100)}%</span>
      </div>`).join('');

    return `
      <div class="stats-section">
        <div class="stats-section-title">${I18n.t('stats_photo_types')}</div>
        <div class="photo-types">${html}</div>
      </div>`;
  }

  // ── ⑦ Sugerencia inteligente ─────────────────────────────
  function buildSuggestions(films) {
    const suggestions = getSuggestions(films);
    if (!suggestions.length) return '';

    const html = suggestions.map(s => `
      <div class="suggestion-card">
        <div class="suggestion-chip">${StockChip.render(s.brand, s.name, s.type || 'color', 'sm')}</div>
        <div class="suggestion-body">
          <div class="suggestion-stock">${s.brand} ${s.name}</div>
          <p class="suggestion-text">${s.text}</p>
        </div>
      </div>`).join('');

    return `
      <div class="stats-section">
        <div class="stats-section-title">${I18n.t('stats_suggestion')}</div>
        <div class="suggestions">${html}</div>
      </div>`;
  }

  // ── Lógica de sugerencias ────────────────────────────────
  function getSuggestions(films) {
    const suggestions = [];
    if (films.length < 2) return suggestions;

    const typeCounts = { color: 0, bw: 0, slide: 0 };
    films.forEach(f => { if (f.type in typeCounts) typeCounts[f.type]++; });
    const dominantType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

    const brandCount = {};
    films.forEach(f => { if (f.brand) brandCount[f.brand] = (brandCount[f.brand] || 0) + 1; });
    const topBrand = Object.entries(brandCount).sort((a, b) => b[1] - a[1])[0]?.[0];

    const isos = films.map(f => f.iso).filter(v => v && v > 0);
    const avgISO = isos.length ? Math.round(isos.reduce((a, b) => a + b, 0) / isos.length) : 400;

    const fmtCount = {};
    films.forEach(f => { if (f.format) fmtCount[f.format] = (fmtCount[f.format] || 0) + 1; });
    const mainFormat = Object.entries(fmtCount).sort((a, b) => b[1] - a[1])[0]?.[0];

    const cityCount = {};
    films.forEach(f => { if (f.city) cityCount[f.city] = (cityCount[f.city] || 0) + 1; });
    const isCityShooter = Object.keys(cityCount).length <= 2;

    const usedStocks = new Set(films.map(f => `${f.brand}|${f.name}`));

    if (topBrand === 'Kodak' && dominantType === 'color' && isCityShooter
        && !usedStocks.has('Cinestill|800T')) {
      suggestions.push({
        brand: 'Cinestill', name: '800T', type: 'color',
        text: I18n.t('sugg_cinestill')
      });
    }

    if (avgISO < 200 && dominantType !== 'bw' && !usedStocks.has('Fujifilm|Velvia 50')) {
      suggestions.push({
        brand: 'Fujifilm', name: 'Velvia 50', type: 'slide',
        text: I18n.t('sugg_velvia', { iso: avgISO })
      });
    }

    if (avgISO >= 800 && dominantType === 'bw' && !usedStocks.has('Ilford|Delta 3200')) {
      suggestions.push({
        brand: 'Ilford', name: 'Delta 3200', type: 'bw',
        text: I18n.t('sugg_delta3200', { iso: avgISO })
      });
    }

    if (dominantType === 'color' && (typeCounts.slide || 0) === 0 && films.length >= 5
        && !usedStocks.has('Kodak|Ektachrome E100')) {
      suggestions.push({
        brand: 'Kodak', name: 'Ektachrome E100', type: 'slide',
        text: I18n.t('sugg_ektachrome', { n: films.length })
      });
    }

    if (dominantType === 'bw' && !usedStocks.has('Ilford|HP5 Plus 400') && topBrand !== 'Ilford') {
      suggestions.push({
        brand: 'Ilford', name: 'HP5 Plus 400', type: 'bw',
        text: I18n.t('sugg_hp5')
      });
    }

    if (mainFormat === '120' && dominantType === 'color' && !usedStocks.has('Kodak|Ektar 100')) {
      suggestions.push({
        brand: 'Kodak', name: 'Ektar 100', type: 'color',
        text: I18n.t('sugg_ektar')
      });
    }

    if (dominantType === 'color' && !usedStocks.has('Kodak|Portra 400') && films.length >= 3) {
      suggestions.push({
        brand: 'Kodak', name: 'Portra 400', type: 'color',
        text: I18n.t('sugg_portra')
      });
    }

    return suggestions.slice(0, 3);
  }

  // ── Helpers ──────────────────────────────────────────────
  function countEmulsions(films) {
    const map = {};
    films.forEach(f => {
      if (!f.brand || !f.name) return;
      const key = `${f.brand}|${f.name}`;
      if (!map[key]) map[key] = { brand: f.brand, name: f.name, type: f.type, count: 0 };
      map[key].count++;
    });
    return Object.values(map).sort((a, b) => b.count - a.count);
  }

  function countCameras(films) {
    const map = {};
    films.forEach(f => {
      if (!f.cameras) return;
      const key = `${f.cameras.brand} ${f.cameras.model}`;
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }

  return { render, _toggleDetail, _closeDetail };
})();
