// ============================================================
// Films CRUD
// ============================================================

const Films = (() => {
  let films = [];

  const FILM_BRANDS = [
    'Kodak','Fujifilm','Ilford','Cinestill','Rollei','Lomography',
    'Agfa','Fomapan','Bergger','Kentmere','Film Ferrania','Ferrania',
    'Washi','Revolog','Dubblefilm','Kono','Svema','Orwo','Adox',
    'Konica','Lucky','SantaColor','ReflxLab','Expired','Otra'
  ];

  const FILM_STOCKS = {
    'Kodak': [
      'Portra 160','Portra 400','Portra 800',
      'Ektar 100','Gold 200','ColorPlus 200','UltraMax 400','Pro Image 100',
      'Tri-X 400','T-Max 100','T-Max 400','T-Max 3200',
      'Vision3 50D','Vision3 250D','Vision3 500T',
      'Kodacolor 100','Kodacolor 200',
      'EKTACOLOR PRO 160','EKTACOLOR PRO 400','EKTACOLOR PRO 800',
      'Ektachrome E100',
      'EKTAPAN 100','EKTAPAN 400','EKTAPAN P3200',
      'Verita 200D','Vision 3 250D AHU','Vision 3 500T AHU',
    ],
    'Fujifilm': [
      'Provia 100F','Provia 400','Provia 1600',
      'Velvia 50','Velvia 100','Astia 100F',
      'Superia 100','Superia 200','Superia 400 Premium','Superia X-TRA 400',
      'Acros 100 II','Eterna 250D','Eterna 500T','Natura 1600','Fujicolor 100',
    ],
    'Ilford': [
      'HP5 Plus 400','FP4 Plus 125','Delta 100','Delta 400','Delta 3200',
      'Pan F Plus 50','XP2 Super 400','SFX 200','Ortho Plus 80',
    ],
    'Cinestill': ['50D','400D','800T','BwXX'],
    'Rollei': [
      'RPX 25','RPX 100','RPX 400','Retro 80S','Retro 400S','Superpan 200','Infrared 400',
    ],
    'Lomography': [
      'Color Negative 100','Color Negative 400','Color Negative 800',
      'Lady Grey 400','Earl Grey 100','Berlin Kino 400','Potsdam Kino 100',
      'LomoChrome Purple','LomoChrome Metropolis','LomoChrome Turquoise',
      'Redscale XR 50-200','Peacock 100',
    ],
    'Agfa': ['APX 100','APX 400','Vista Plus 200','CT Precisa 100','Optima 400'],
    'Fomapan': ['100','200','400','R100'],
    'Bergger': ['Pancro 400'],
    'Kentmere': ['100','400'],
    'Film Ferrania': ['P30 Alpha'],
    'Ferrania': ['P33'],
    'Washi': ['A','D','F','S','W','X','Z','V'],
    'Revolog': ['Textura','Volvox','Plexus','Kolor','500nm','800nm','Lazer'],
    'Dubblefilm': ['Show','Eclipse','Chrome','Espresso','Slide','Safari','Circus','Redscale'],
    'Kono': ['Rekorder','Monicolor RC','Rotwild'],
    'Svema': ['FN 64','Color 125'],
    'Orwo': ['Wolfenc NC 200','Wolfenc NC 400','Wolfenc NC 500','UN54','NP100'],
    'Adox': ['CHS 100 II','CMS 20 II','Silvermax 100','Color Mission 200'],
    'Konica': ['Centuria 100','Centuria 200'],
    'Lucky': ['Lucky 200'],
    'SantaColor': ['SantaColor 100','SantaColor 800'],
    'ReflxLab': ['Pro 100','800T','50D','200T','500T','400D','320D AHU','DoubleXX','640T'],
  };

  const LABS = [
    'Yo soy mi lab','Pantera','Aborigen','Bengala',
    'Foto Hercules','Dichroic','Mexicana Analoga','Foto Ricardo'
  ];

  const STATUS_CONFIG = {
    en_camara:   { label: 'En cámara',   cls: 'badge-blue'   },
    en_revelado: { label: 'En revelado', cls: 'badge-yellow'  },
    finalizado:  { label: 'Finalizado',  cls: 'badge-green'   },
    escaneado:   { label: 'Escaneado',   cls: 'badge-purple'  },
  };

  const FILM_STATUS_CFG = {
    fresh:     { label: 'Fresh',     cls: 'badge-green'  },
    cadufresh: { label: 'CaduFresh', cls: 'badge-yellow' },
    rancio:    { label: 'Rancio',    cls: 'badge-red'    },
  };

  const TYPE_CFG = {
    color: { label: 'Color', cls: 'badge-teal' },
    bw:    { label: 'B&N',   cls: 'badge-gray' },
    slide: { label: 'Diapo', cls: 'badge-blue' },
  };

  async function load() {
    const { data, error } = await supabase
      .from('films')
      .select(`
        *,
        cameras ( brand, model ),
        lenses  ( brand, focal_length )
      `)
      .order('created_at', { ascending: false });
    if (error) { Toast.show(error.message, 'error'); return []; }
    films = data;
    return films;
  }

  function getAll() { return films; }

  async function save(form) {
    const user = Auth.getUser();
    const payload = {
      user_id:        user.id,
      film_status:    form.film_status,
      brand:          form.brand,
      name:           form.name,
      type:           form.type,
      iso:            parseInt(form.iso),
      format:         form.format,
      camera_id:      form.camera_id || null,
      lens_id:        form.lens_id   || null,
      current_status: form.current_status,
      start_date:     form.start_date || null,
      end_date:       form.end_date   || null,
      notes:          form.notes      || null,
      push_pull:      form.push_pull,
      num_photos:     form.num_photos || null,
      lab:            form.lab        || null,
      city:           form.city       || null,
      country:        form.country    || null,
      photo_type:     form.photo_type || null,
    };
    if (form.id) {
      const { error } = await supabase.from('films').update(payload).eq('id', form.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('films').insert(payload);
      if (error) throw error;
    }
  }

  // ---- Helpers ----

  function statusBadge(s) {
    const c = STATUS_CONFIG[s] || { label: s, cls: 'badge-gray' };
    return `<span class="badge ${c.cls}">${c.label}</span>`;
  }

  function filmStatusBadge(s) {
    const c = FILM_STATUS_CFG[s] || { label: s, cls: 'badge-gray' };
    return `<span class="badge ${c.cls}">${c.label}</span>`;
  }

  function typeBadge(t) {
    const c = TYPE_CFG[t] || { label: t, cls: 'badge-gray' };
    return `<span class="badge ${c.cls}">${c.label}</span>`;
  }

  function cameraName(film) {
    if (!film.cameras) return '—';
    return `${film.cameras.brand} ${film.cameras.model}`;
  }

  function lensName(film) {
    if (!film.lenses) return '—';
    return `${film.lenses.brand} ${film.lenses.focal_length}mm`;
  }

  const SUPER8_STOCKS = [
    'Vision3 50D', 'Vision3 200T', 'Vision3 500T', 'Ektachrome', 'Tri-X Reversal',
  ];

  // Rebuild brand options (Super8 restricts to Kodak/Orwo)
  function onFormatChange() {
    const format      = document.getElementById('f-format')?.value;
    const brandSelect = document.getElementById('f-brand');
    if (!brandSelect) return;
    const list = format === 'Super8' ? ['Kodak','Orwo'] : FILM_BRANDS;
    brandSelect.innerHTML = list.map(b =>
      `<option value="${b}">${b}</option>`
    ).join('');
    brandSelect.value = format === 'Super8' ? 'Kodak' : (list[0] || '');
    onBrandChange();
  }

  // Rebuild emulsion select based on brand + format
  function onBrandChange() {
    const brand      = document.getElementById('f-brand')?.value;
    const format     = document.getElementById('f-format')?.value;
    const nameSelect = document.getElementById('f-name');
    if (!nameSelect) return;
    const stocks = format === 'Super8' ? SUPER8_STOCKS : (FILM_STOCKS[brand] || []);
    nameSelect.innerHTML =
      `<option value="">— Seleccionar —</option>` +
      stocks.map(s => `<option value="${s}">${s}</option>`).join('') +
      `<option value="__otro__">Otro (escribir)</option>`;
    if (stocks.length) { nameSelect.value = stocks[0]; onNameChange(); }
  }

  // Show custom input when "Otro", auto-fill ISO from emulsion name
  function onNameChange() {
    const val       = document.getElementById('f-name')?.value;
    const customWrap = document.getElementById('f-name-custom-wrap');
    const isoField  = document.getElementById('f-iso');
    customWrap?.classList.toggle('hidden', val !== '__otro__');
    if (val && val !== '__otro__' && isoField) {
      const m = val.match(/\b(50|100|125|160|200|250|320|400|500|800|1600|3200)\b/);
      if (m) isoField.value = m[1];
    }
  }

  // ---- Modal form HTML ----

  function formHtml(film, cameras, lenses) {
    const isNew = !film;
    const v = (id, fallback = '') => film?.[id] ?? fallback;
    const sel = (opts, current) => opts.map(([val, lbl]) =>
      `<option value="${val}" ${current === val ? 'selected' : ''}>${lbl}</option>`
    ).join('');

    const today = new Date().toISOString().split('T')[0];

    // Smart defaults for new rolls
    const defCameraId = isNew
      ? (cameras.find(c => /nikon/i.test(c.brand) && /f3/i.test(c.model))?.id ?? '')
      : v('camera_id');
    const defLensId = isNew
      ? (lenses.find(l => /nikkor/i.test(l.brand) && /50/.test(l.focal_length))?.id ?? '')
      : v('lens_id');
    const defStart   = isNew ? today   : v('start_date');
    const defEnd     = isNew ? today   : v('end_date');
    const defCountry = isNew ? 'Mexico': v('country');
    const defCity    = isNew ? 'CDMX'  : v('city');

    // Brand list respects Super8 restriction
    const currentFormat = v('format', '35mm');
    const brandList = currentFormat === 'Super8' ? ['Kodak','Orwo'] : FILM_BRANDS;
    const currentBrand = v('brand', brandList[0] || '');

    // Emulsion select
    const stocks = currentFormat === 'Super8' ? SUPER8_STOCKS : (FILM_STOCKS[currentBrand] || []);
    const currentName = v('name');
    const nameIsCustom = currentName && !stocks.includes(currentName);
    const selectValue = nameIsCustom ? '__otro__' : (currentName || (stocks[0] || ''));

    return `
      <div class="form-row-3">
        <div class="form-group">
          <label>Estado rollo</label>
          <select id="f-film-status">
            ${sel([['fresh','Fresh'],['cadufresh','CaduFresh'],['rancio','Rancio']], v('film_status','fresh'))}
          </select>
        </div>
        <div class="form-group">
          <label>Tipo</label>
          <select id="f-type">
            ${sel([['color','Color'],['bw','B&N'],['slide','Diapositiva']], v('type','color'))}
          </select>
        </div>
        <div class="form-group">
          <label>Formato</label>
          <select id="f-format" onchange="Films.onFormatChange()">
            ${sel([['35mm','35mm'],['120','120'],['Super8','Super 8']], currentFormat)}
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Marca</label>
          <select id="f-brand" onchange="Films.onBrandChange()">
            ${brandList.map(b => `<option value="${b}" ${currentBrand === b ? 'selected' : ''}>${b}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Nombre / Emulsión</label>
          <select id="f-name" onchange="Films.onNameChange()">
            <option value="">— Seleccionar —</option>
            ${stocks.map(s => `<option value="${s}" ${selectValue === s ? 'selected' : ''}>${s}</option>`).join('')}
            <option value="__otro__" ${selectValue === '__otro__' ? 'selected' : ''}>Otro (escribir)</option>
          </select>
          <div id="f-name-custom-wrap" class="${nameIsCustom ? '' : 'hidden'}" style="margin-top:.4rem">
            <input id="f-name-custom" value="${nameIsCustom ? currentName : ''}" placeholder="Escribe la emulsión…">
          </div>
        </div>
      </div>
      <input id="f-iso" type="hidden" value="${v('iso')}">
      <div class="form-group">
        <label>Nº fotos</label>
        <select id="f-num-photos">
          <option value="">—</option>
          ${sel([['12','12'],['24','24'],['36','36']], v('num_photos'))}
        </select>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Cámara</label>
          <select id="f-camera">
            <option value="">— Sin cámara —</option>
            ${cameras.map(c => `<option value="${c.id}" ${defCameraId === c.id ? 'selected' : ''}>${c.brand} ${c.model}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Lente</label>
          <select id="f-lens">
            <option value="">— Sin lente —</option>
            ${lenses.map(l => `<option value="${l.id}" ${defLensId === l.id ? 'selected' : ''}>${l.brand} ${l.focal_length}mm</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Estado actual</label>
          <select id="f-status">
            ${sel([
              ['en_camara','En cámara'],['en_revelado','En revelado'],
              ['finalizado','Finalizado'],['escaneado','Escaneado']
            ], v('current_status','en_camara'))}
          </select>
        </div>
        <div class="form-group">
          <label>Forzado</label>
          <select id="f-push-pull">
            ${sel([['no','No'],['+1','+1 paso'],['+2','+2 pasos'],['+3','+3 pasos'],['-1','-1 paso'],['-2','-2 pasos']], v('push_pull','no'))}
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Fecha inicio</label>
          <input id="f-start" type="date" value="${defStart}">
        </div>
        <div class="form-group">
          <label>Fecha fin</label>
          <input id="f-end" type="date" value="${defEnd}">
        </div>
      </div>
      <div class="form-group">
        <label>Lab de revelado</label>
        <select id="f-lab">
          <option value="">— Sin lab —</option>
          ${LABS.map(l => `<option value="${l}" ${v('lab') === l ? 'selected' : ''}>${l}</option>`).join('')}
        </select>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Ciudad</label>
          <input id="f-city" value="${defCity}" placeholder="Ciudad">
        </div>
        <div class="form-group">
          <label>País</label>
          <input id="f-country" value="${defCountry}" placeholder="País">
        </div>
      </div>
      <div class="form-group">
        <label>Tipo de foto</label>
        <select id="f-photo-type">
          <option value="">— Sin clasificar —</option>
          ${sel([
            ['paisaje','Paisaje'],['retrato','Retrato'],['macro','Macro'],
            ['boda','Boda'],['eventos','Eventos'],['mascotas','Mascotas'],
            ['estudio','Estudio'],['producto','De producto'],['otro','Otro']
          ], v('photo_type'))}
        </select>
      </div>
      <div class="form-group">
        <label>Notas</label>
        <textarea id="f-notes" placeholder="Notas libres…">${v('notes')}</textarea>
      </div>`;
  }

  function collectForm(film) {
    const rawName = document.getElementById('f-name')?.value;
    const name = rawName === '__otro__'
      ? document.getElementById('f-name-custom')?.value.trim()
      : rawName;
    return {
      id:             film?.id,
      film_status:    document.getElementById('f-film-status').value,
      brand:          document.getElementById('f-brand').value,
      name,
      type:           document.getElementById('f-type').value,
      iso:            document.getElementById('f-iso').value,
      format:         document.getElementById('f-format').value,
      camera_id:      document.getElementById('f-camera').value,
      lens_id:        document.getElementById('f-lens').value,
      current_status: document.getElementById('f-status').value,
      push_pull:      document.getElementById('f-push-pull').value,
      num_photos:     document.getElementById('f-num-photos').value,
      start_date:     document.getElementById('f-start').value,
      end_date:       document.getElementById('f-end').value,
      lab:            document.getElementById('f-lab').value,
      city:           document.getElementById('f-city').value.trim(),
      country:        document.getElementById('f-country').value.trim(),
      photo_type:     document.getElementById('f-photo-type').value,
      notes:          document.getElementById('f-notes').value.trim(),
    };
  }

  // ---- Render list ----

  async function render() {
    await load();
    const cameras = Cameras.getAll();
    const lenses  = Lenses.getAll();

    // Apply filters
    const fStatus  = document.getElementById('filter-status')?.value || '';
    const fType    = document.getElementById('filter-type')?.value   || '';
    const fFormat  = document.getElementById('filter-format')?.value || '';
    const fSearch  = document.getElementById('filter-search')?.value.toLowerCase() || '';

    let list = films;
    if (fStatus)  list = list.filter(f => f.current_status === fStatus);
    if (fType)    list = list.filter(f => f.type === fType);
    if (fFormat)  list = list.filter(f => f.format === fFormat);
    if (fSearch)  list = list.filter(f =>
      `${f.brand} ${f.name} ${f.city} ${f.country}`.toLowerCase().includes(fSearch)
    );

    const wrapper = document.querySelector('#films-view .table-wrapper');
    if (!wrapper) return;

    if (!list.length) {
      wrapper.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🎞</div>
          <p>${films.length ? 'No hay rollos con esos filtros.' : 'No tienes rollos registrados aún.'}</p>
        </div>`;
      return;
    }

    wrapper.innerHTML = `
      <table>
        <thead><tr>
          <th>Rollo</th><th>Tipo</th><th>ISO</th><th>Formato</th>
          <th>Cámara</th><th>Estado</th><th>Push/Pull</th><th>Lab</th><th></th>
        </tr></thead>
        <tbody>
          ${list.map(f => `
            <tr>
              <td>
                <div style="font-weight:600">${f.name}</div>
                <div class="text-muted text-sm">${f.brand}</div>
              </td>
              <td>${typeBadge(f.type)}</td>
              <td>${f.iso}</td>
              <td><span class="badge badge-yellow">${f.format}</span></td>
              <td class="text-sm">${cameraName(f)}</td>
              <td>${statusBadge(f.current_status)}</td>
              <td>${f.push_pull !== 'no' ? `<span class="badge badge-yellow">${f.push_pull}</span>` : '<span class="text-muted">—</span>'}</td>
              <td class="text-sm">${f.lab || '—'}</td>
              <td>
                <div class="actions">
                  <button class="btn btn-ghost btn-sm btn-icon" onclick="Films.openEdit('${f.id}')">✏️</button>
                </div>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>`;
  }

  function openModal(film = null) {
    const isEdit = !!film;
    const cameras = Cameras.getAll();
    const lenses  = Lenses.getAll();

    Modal.open({
      title: isEdit ? 'Editar rollo' : 'Nuevo rollo',
      wide: true,
      body: formHtml(film, cameras, lenses),
      onSave: async () => {
        const form = collectForm(film);
        if (!form.brand || !form.name || !form.iso) {
          Toast.show('Marca, nombre e ISO son obligatorios', 'error'); return false;
        }
        await save(form);
        Toast.show(isEdit ? 'Rollo actualizado' : 'Rollo añadido', 'success');
        await render();
        await Dashboard.render();
        return true;
      }
    });
    // Trigger ISO auto-fill for pre-selected emulsion
    setTimeout(onNameChange, 0);
  }

  function openEdit(id) {
    const film = films.find(f => f.id === id);
    if (film) openModal(film);
  }

  function bindUI() {
    document.getElementById('btn-add-film')?.addEventListener('click', () => openModal());
    document.getElementById('btn-add-film-mobile')?.addEventListener('click', () => openModal());
    document.getElementById('btn-add-film-dash')?.addEventListener('click', () => openModal());

    ['filter-status','filter-type','filter-format'].forEach(id => {
      document.getElementById(id)?.addEventListener('change', () => render());
    });
    document.getElementById('filter-search')?.addEventListener('input', () => render());
  }

  return {
    load, getAll, save, render, openModal, openEdit, bindUI,
    onFormatChange, onBrandChange, onNameChange,
    STATUS_CONFIG, FILM_STATUS_CFG, statusBadge, filmStatusBadge
  };
})();
