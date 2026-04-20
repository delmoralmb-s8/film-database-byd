// ============================================================
// Stats — Módulo de estadísticas
// ============================================================

const Stats = (() => {

  // Segundos por rollo Super8 según fps
  const S8_SECS = { '9': 400, '18': 200, '24': 150 };

  const MONTHS_ES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

  const TYPE_LABELS  = { color: 'Color', bw: 'B&N', slide: 'Diapositiva' };
  const FMT_LABELS   = { '35mm': '35mm', '120': '120', 'Super8': 'Super 8' };
  const FMT_COLORS   = { '35mm': 'var(--primary)', '120': '#7c3aed', 'Super8': '#b45309' };

  const PHOTO_ICONS  = {
    'Paisaje':                  '🌄',
    'Retrato':                  '🧑',
    'Calle':                    '🏙️',
    'Viaje':                    '✈️',
    'Familia':                  '👨‍👩‍👧',
    'Amigos':                   '👥',
    'De chile, mole y pozole':  '🌶️',
    'de mi ex :(':              '💔',
  };

  function dateOf(f) { return f.end_date || f.start_date || null; }

  // ── Render principal ─────────────────────────────────────
  function render() {
    const films = Films.getAll();
    const el = document.getElementById('stats-view');
    if (!el) return;

    if (!films.length) {
      el.innerHTML = `
        <div class="empty-state" style="padding:4rem 1rem">
          <div class="empty-icon">📊</div>
          <p>Agrega rollos para ver tus estadísticas.</p>
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

  // ── ① Hero — 4 números grandes ──────────────────────────
  function buildHero(films) {
    const total = films.length;

    // Fotos estimadas (solo no-Super8)
    const totalPhotos = films
      .filter(f => f.format !== 'Super8')
      .reduce((sum, f) => sum + (parseInt(f.num_photos) || 0), 0);

    // Minutos rodados Super8
    const s8Films = films.filter(f => f.format === 'Super8');
    let totalS8Secs = 0;
    s8Films.forEach(f => { totalS8Secs += S8_SECS[f.num_photos] || 0; });
    const s8Mins = Math.floor(totalS8Secs / 60);
    const s8Secs = totalS8Secs % 60;

    // Años activo
    const dates = films.map(f => dateOf(f)).filter(Boolean);
    let yearsActive = 0;
    if (dates.length) {
      const years = dates.map(d => parseInt(d.split('-')[0]));
      yearsActive = Math.max(...years) - Math.min(...years) + 1;
    }

    // Formatos usados
    const formats = [...new Set(films.map(f => f.format).filter(Boolean))];

    return `
      <div class="stats-hero">
        <div class="stats-hero-grid">
          <div class="stats-hero-card">
            <div class="stats-hero-num">${total}</div>
            <div class="stats-hero-label">Total rollos</div>
          </div>
          <div class="stats-hero-card">
            <div class="stats-hero-num">${totalPhotos.toLocaleString('es-MX')}</div>
            <div class="stats-hero-label">Fotos estimadas</div>
          </div>
          ${s8Films.length ? `
          <div class="stats-hero-card stats-hero-card--s8">
            <div class="stats-hero-num">${s8Mins}m ${s8Secs < 10 ? '0' : ''}${s8Secs}s</div>
            <div class="stats-hero-label">Minutos rodados Super 8</div>
            <div class="stats-hero-sub">${s8Films.length} carrete${s8Films.length !== 1 ? 's' : ''}</div>
          </div>` : ''}
          <div class="stats-hero-card">
            <div class="stats-hero-num">${yearsActive || '—'}</div>
            <div class="stats-hero-label">Año${yearsActive !== 1 ? 's' : ''} activo</div>
          </div>
          <div class="stats-hero-card">
            <div class="stats-hero-num">${formats.length}</div>
            <div class="stats-hero-label">Formato${formats.length !== 1 ? 's' : ''} usado${formats.length !== 1 ? 's' : ''}</div>
            <div class="stats-hero-sub">${formats.map(f => FMT_LABELS[f] || f).join(' · ')}</div>
          </div>
        </div>
      </div>`;
  }

  // ── ② ADN fílmico ────────────────────────────────────────
  function buildDNA(films) {
    // Distribución de tipo
    const typeCounts = { color: 0, bw: 0, slide: 0 };
    films.forEach(f => { if (f.type in typeCounts) typeCounts[f.type]++; });
    const typeTotal = typeCounts.color + typeCounts.bw + typeCounts.slide || 1;
    const dominant  = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0];
    const colorPct  = Math.round(typeCounts.color / typeTotal * 100);
    const bwPct     = Math.round(typeCounts.bw    / typeTotal * 100);
    const slidePct  = Math.round(typeCounts.slide / typeTotal * 100);

    // Top emulsión
    const emulsions = countEmulsions(films);
    const topEm = emulsions[0];

    // Top cámara
    const cams = countCameras(films);
    const topCam = cams[0];

    const emHTML = topEm ? `
      <div class="dna-card">
        <div class="dna-card-title">Emulsión #1</div>
        <div class="dna-chip-lg">${StockChip.render(topEm.brand, topEm.name, topEm.type || 'color', 'lg')}</div>
        <div class="dna-card-value">${topEm.brand} ${topEm.name}</div>
        <div class="dna-card-sub">${topEm.count} rollo${topEm.count !== 1 ? 's' : ''}</div>
      </div>` : '';

    const camHTML = topCam ? `
      <div class="dna-card">
        <div class="dna-card-title">Cámara principal</div>
        <div class="dna-cam-icon">📷</div>
        <div class="dna-card-value">${topCam[0]}</div>
        <div class="dna-card-sub">${topCam[1]} rollo${topCam[1] !== 1 ? 's' : ''}</div>
      </div>` : '';

    return `
      <div class="stats-section">
        <div class="stats-section-title">Tu ADN fílmico</div>
        <div class="dna-grid">
          <div class="dna-card">
            <div class="dna-card-title">Tipo dominante</div>
            <div class="dna-dominant">${TYPE_LABELS[dominant?.[0]] || '—'}</div>
            <div class="dna-type-bar">
              <div class="dna-bar-seg dna-bar--color" style="width:${colorPct}%" title="Color ${colorPct}%"></div>
              <div class="dna-bar-seg dna-bar--bw"    style="width:${bwPct}%"    title="B&N ${bwPct}%"></div>
              <div class="dna-bar-seg dna-bar--slide" style="width:${slidePct}%" title="Slide ${slidePct}%"></div>
            </div>
            <div class="dna-type-legend">
              <span class="dna-dot dna-bar--color"></span>Color ${colorPct}%
              <span class="dna-dot dna-bar--bw" style="margin-left:.6rem"></span>B&N ${bwPct}%
              <span class="dna-dot dna-bar--slide" style="margin-left:.6rem"></span>Slide ${slidePct}%
            </div>
          </div>
          ${emHTML}
          ${camHTML}
        </div>
      </div>`;
  }

  // ── ③ Actividad por año ──────────────────────────────────
  function buildYearActivity(films) {
    const yearCount      = {};
    const yearMonthCount = {};

    films.forEach(f => {
      const d = dateOf(f);
      if (!d) return;
      const [yr, mo] = d.split('-');
      const y = parseInt(yr), m = parseInt(mo);
      yearCount[y] = (yearCount[y] || 0) + 1;
      if (!yearMonthCount[y]) yearMonthCount[y] = {};
      yearMonthCount[y][m] = (yearMonthCount[y][m] || 0) + 1;
    });

    const years = Object.keys(yearCount).map(Number).sort();
    if (!years.length) return '';

    const maxCount = Math.max(...Object.values(yearCount));
    const mostActiveYear = +Object.entries(yearCount).sort((a, b) => b[1] - a[1])[0][0];

    const barsHTML = years.map(y => {
      const count = yearCount[y];
      const pct   = Math.round(count / maxCount * 100);
      const isMost = y === mostActiveYear;
      return `
        <div class="year-bar-wrap">
          <div class="year-bar-count">${count}</div>
          <div class="year-bar${isMost ? ' year-bar--active' : ''}" style="height:${Math.max(pct, 4)}%"></div>
          <div class="year-bar-label">${y}</div>
        </div>`;
    }).join('');

    const monthCounts = yearMonthCount[mostActiveYear] || {};
    const maxMonth    = Math.max(...Object.values(monthCounts), 1);

    const heatHTML = MONTHS_ES.map((mo, i) => {
      const count   = monthCounts[i + 1] || 0;
      const opacity = count ? Math.max(0.15, count / maxMonth) : 0.05;
      return `
        <div class="heat-cell" title="${mo}: ${count} rollo${count !== 1 ? 's' : ''}"
             style="background:rgba(28,106,81,${opacity.toFixed(2)})">
          <span class="heat-label">${mo}</span>
        </div>`;
    }).join('');

    return `
      <div class="stats-section">
        <div class="stats-section-title">Actividad por año</div>
        <div class="year-chart">${barsHTML}</div>
        <div class="heat-row-label">Mes más activo — ${mostActiveYear}</div>
        <div class="heat-row">${heatHTML}</div>
      </div>`;
  }

  // ── ④ Rankings dobles ────────────────────────────────────
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
      </div>`).join('') || '<p class="stats-empty">Sin datos</p>';

    const camHTML = cams.map(([name, count], i) => `
      <div class="rank-row">
        <span class="rank-num">${i + 1}</span>
        <span class="rank-cam-icon">📷</span>
        <div class="rank-info">
          <div class="rank-name">${name}</div>
          <div class="rank-bar"><div class="rank-bar-fill" style="width:${Math.round(count/maxC*100)}%"></div></div>
        </div>
        <span class="rank-count">${count}</span>
      </div>`).join('') || '<p class="stats-empty">Sin datos</p>';

    return `
      <div class="stats-section">
        <div class="stats-section-title">Rankings</div>
        <div class="rankings-grid">
          <div class="rankings-col">
            <div class="rankings-col-title">Top emulsiones</div>
            ${emHTML}
          </div>
          <div class="rankings-col">
            <div class="rankings-col-title">Top cámaras</div>
            ${camHTML}
          </div>
        </div>
      </div>`;
  }

  // ── ⑤ Distribución ──────────────────────────────────────
  function buildDistribution(films) {
    // Formatos
    const fmtCount = {};
    films.forEach(f => { if (f.format) fmtCount[f.format] = (fmtCount[f.format] || 0) + 1; });
    const fmtTotal = Object.values(fmtCount).reduce((a, b) => a + b, 0) || 1;

    // Labs
    const labCount = {};
    films.forEach(f => { if (f.lab) labCount[f.lab] = (labCount[f.lab] || 0) + 1; });
    const topLabs = Object.entries(labCount).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const maxLab  = topLabs[0]?.[1] || 1;

    // Ciudades
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
        <div class="stats-section-title">Distribución</div>
        <div class="dist-grid">
          <div class="dist-col">
            <div class="dist-col-title">Formatos</div>
            ${fmtHTML}
          </div>
          <div class="dist-col">
            <div class="dist-col-title">Labs</div>
            ${labHTML}
          </div>
          <div class="dist-col">
            <div class="dist-col-title">Ciudades</div>
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
        <span class="photo-type-name">${type}</span>
        <div class="dist-bar-wrap">
          <div class="dist-bar" style="width:${Math.round(count/max*100)}%"></div>
        </div>
        <span class="dist-count">${Math.round(count/total*100)}%</span>
      </div>`).join('');

    return `
      <div class="stats-section">
        <div class="stats-section-title">Tipos de foto</div>
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
        <div class="stats-section-title">Sugerencia inteligente ✨</div>
        <div class="suggestions">${html}</div>
      </div>`;
  }

  // ── Lógica de sugerencias rule-based ────────────────────
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

    // Regla: Kodak color + ciudad → Cinestill 800T nocturno
    if (topBrand === 'Kodak' && dominantType === 'color' && isCityShooter
        && !usedStocks.has('Cinestill|800T')) {
      suggestions.push({
        brand: 'Cinestill', name: '800T', type: 'color',
        text: `Disparas mucho Kodak en color en ciudad. Probablemente te encante el Cinestill 800T para tus salidas nocturnas — comparte el ADN del Vision3 pero adaptado para luz artificial y ciudad.`
      });
    }

    // Regla: ISO promedio bajo + color → Velvia 50 para luz natural
    if (avgISO < 200 && dominantType !== 'bw' && !usedStocks.has('Fujifilm|Velvia 50')) {
      suggestions.push({
        brand: 'Fujifilm', name: 'Velvia 50', type: 'slide',
        text: `Tu ISO promedio es bajo (${avgISO}), señal de que disparas con buena luz. Prueba el Fujifilm Velvia 50 — colores ultra-saturados perfectos para paisaje y luz natural.`
      });
    }

    // Regla: ISO alto + B&N → Delta 3200
    if (avgISO >= 800 && dominantType === 'bw' && !usedStocks.has('Ilford|Delta 3200')) {
      suggestions.push({
        brand: 'Ilford', name: 'Delta 3200', type: 'bw',
        text: `Usas ISO alto en B&N (promedio ${avgISO}). Ilford Delta 3200 te dará grano expresivo y detalle sorprendente incluso en condiciones de poca luz.`
      });
    }

    // Regla: Color puro, sin slide, más de 5 rollos
    if (dominantType === 'color' && (typeCounts.slide || 0) === 0 && films.length >= 5
        && !usedStocks.has('Kodak|Ektachrome E100')) {
      suggestions.push({
        brand: 'Kodak', name: 'Ektachrome E100', type: 'slide',
        text: `Llevas ${films.length} rollos de color pero aún no has probado diapositiva. El Ektachrome E100 tiene colores pastel únicos y el proceso E-6 hace que cada rollo sea una experiencia distinta.`
      });
    }

    // Regla: B&W sin HP5
    if (dominantType === 'bw' && !usedStocks.has('Ilford|HP5 Plus 400') && topBrand !== 'Ilford') {
      suggestions.push({
        brand: 'Ilford', name: 'HP5 Plus 400', type: 'bw',
        text: `Disparas mucho en B&N. Si aún no has probado el HP5 Plus 400, es el punto de referencia del blanco y negro — latitud enorme, grano clásico, funciona en cualquier situación.`
      });
    }

    // Regla: Formato 120 + color → Ektar 100
    if (mainFormat === '120' && dominantType === 'color' && !usedStocks.has('Kodak|Ektar 100')) {
      suggestions.push({
        brand: 'Kodak', name: 'Ektar 100', type: 'color',
        text: `Con formato 120, el Ektar 100 brilla — el grano más fino de Kodak y colores vivos que aprovechan al máximo los negativos grandes.`
      });
    }

    // Regla: Mucho color, sin Portra 400
    if (dominantType === 'color' && !usedStocks.has('Kodak|Portra 400') && films.length >= 3) {
      suggestions.push({
        brand: 'Kodak', name: 'Portra 400', type: 'color',
        text: `El Portra 400 es el punto de referencia para color. Su latitud de exposición y tonos de piel son difíciles de superar — el rollo que siempre quieres tener cargado.`
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

  return { render };
})();
