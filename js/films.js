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

  const COLOR_EXCL = ['Rollei','Fomapan','Ilford','Washi','Kentmere','Film Ferrania','Ferrania'];
  const BW_EXCL    = ['Revolog','Dubblefilm','Kono','SantaColor','Svema','Harman'];

  const FILM_STOCKS = {
    'Kodak': [
      'Portra 160','Portra 400','Portra 800',
      'Ektar 100','Gold 200','ColorPlus 200','UltraMax 400','Pro Image 100',
      'Tri-X 400','T-Max 100','T-Max 400','T-Max 3200',
      'Vision3 50D','Vision3 200T','Vision3 250D','Vision3 500T',
      'Kodacolor 100','Kodacolor 200',
      'EKTACOLOR PRO 160','EKTACOLOR PRO 200','EKTACOLOR PRO 400','EKTACOLOR PRO 800',
      'Ektachrome E100',
      'EKTAPAN 100','EKTAPAN 400','EKTAPAN P3200',
      'Verita 200D','Vision 3 250D AHU','Vision 3 500T AHU',
    ],
    'Fujifilm': [
      'Fuji 100','Fuji 200',
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
	'Harman': ['Phoenix I','Phoenix II', 'Azure'],
    'Ferrania': ['P33'],
    'Washi': ['A','D','F','S','W','X','Z','V'],
    'Revolog': ['Textura','Volvox','Plexus','Kolor','500nm','800nm','Lazer'],
    'Dubblefilm': ['Show','Eclipse','Chrome','Espresso','Slide','Safari','Circus','Redscale'],
    'Kono': ['Rekorder','Monicolor RC','Rotwild'],
    'Svema': ['FN 64','Color 125'],
    'Orwo': ['Wolfenc NC 200','Wolfenc NC 400','Wolfenc NC 500','UN54','NP100'],
    'Adox': ['Adox Scala','CHS 100 II','CMS 20 II','Silvermax 100','Color Mission 200'],
    'Konica': ['Centuria 100','Centuria 200'],
    'Lucky': ['Lucky 200'],
    'SantaColor': ['SantaColor 100','SantaColor 800'],
    'ReflxLab': ['Pro 100','800T','50D','200T','500T','400D','320D AHU','DoubleXX','640T'],
  };

  // Stocks filtrados según Tipo + Marca
  const STOCKS_BY_TYPE = {
    slide: {
      'Kodak':    ['Ektachrome 64T','Ektachrome E100','Elitechrome 100','Ektachrome E200','Ektachrome E400'],
      'Fujifilm': ['Provia 100F','Provia 400','Provia 1600','Velvia 50','Velvia 100','Astia 100F','Sensia'],
    },
    color: {
      'Kodak': [
        'Portra 160','Portra 400','Gold 200','ColorPlus 200','UltraMax 400','Pro Image 100',
        'Vision3 50D','Vision3 200T','Vision3 250D','Vision3 500T',
        'Kodacolor 100','Kodacolor 200',
        'EKTACOLOR PRO 160','EKTACOLOR PRO 200','EKTACOLOR PRO 800',
        'Verita 200D','Vision 3 250D AHU','Vision 3 500T AHU',
      ],
      'Fujifilm': FILM_STOCKS['Fujifilm'].filter(s => s !== 'Acros 100 II'),
    },
    bw: {
      'Kodak':    ['Tri-X 400','T-Max 100','T-Max 400','T-Max 3200','EKTAPAN 100','EKTAPAN 400','EKTAPAN P3200'],
      'Fujifilm': ['Acros 100 II'],
    },
  };

  function getBrandListForType(type, format) {
    if (format === 'Super8') return ['Kodak','Orwo'];
    if (type === 'slide') return ['Kodak','Fujifilm','Otra'];
    if (type === 'bw')    return ['Ilford', ...FILM_BRANDS.filter(b => b !== 'Ilford' && !BW_EXCL.includes(b))];
    return FILM_BRANDS.filter(b => !COLOR_EXCL.includes(b)); // color (default)
  }

  const LABS = [
    'Yo soy mi lab','Pantera','Aborigen','Bengala',
    'Foto Hercules','Dichroic','Mexicana Analoga','Foto Ricardo','LabTank'
  ];

  const STATUS_CONFIG = {
    en_camara:   { label: 'En cámara',   cls: 'badge-blue'   },
    en_revelado: { label: 'Por revelar', cls: 'badge-yellow'  },
    finalizado:  { label: 'Finalizado',  cls: 'badge-green'   },
    escaneado:   { label: 'Por escanear', cls: 'badge-purple'  },
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
      iso:            parseInt(form.iso) || 0,
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

  const MONTHS = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  function formatDate(str) {
    if (!str) return null;
    const [y, m, d] = str.split('-');
    return `${parseInt(d)} ${MONTHS[parseInt(m) - 1]} ${y}`;
  }

  function cameraName(film) {
    if (!film.cameras) return '—';
    return `${film.cameras.brand} ${film.cameras.model}`;
  }

  function lensName(film) {
    if (!film.lenses) return '—';
    return `${film.lenses.brand} ${film.lenses.focal_length}`;
  }

  function getSuper8Stocks(brand, type) {
    if (brand === 'Orwo') return ['NC 200', 'UN54'];
    if (type === 'bw')    return ['Tri-X Reversal'];
    if (type === 'slide') return ['Ektachrome'];
    return ['Vision3 50D', 'Vision3 200T', 'Vision3 500T']; // color
  }

  // Rebuild brand options and num_photos when format changes
  function onFormatChange() {
    const format      = document.getElementById('f-format')?.value;
    const brandSelect = document.getElementById('f-brand');
    if (!brandSelect) return;

    const numPhotos = document.getElementById('f-num-photos');
    if (numPhotos) {
      if (format === 'Super8') {
        numPhotos.innerHTML =
          `<option value="">—</option>` +
          [['9','9 fps'],['18','18 fps'],['24','24 fps']]
            .map(([v,l]) => `<option value="${v}">${l}</option>`).join('');
      } else if (format === '120') {
        numPhotos.innerHTML =
          `<option value="">—</option>` +
          [['4','4'],['6','6'],['12','12']]
            .map(([v,l]) => `<option value="${v}">${l}</option>`).join('');
        numPhotos.value = '12';
      } else {
        numPhotos.innerHTML =
          `<option value="">—</option>` +
          [['14','14'],['24','24'],['36','36']]
            .map(([v,l]) => `<option value="${v}">${l}</option>`).join('');
        numPhotos.value = '36';
      }
    }

    if (format === 'Super8') {
      brandSelect.innerHTML = ['Kodak','Orwo'].map(b =>
        `<option value="${b}">${b}</option>`
      ).join('');
      brandSelect.value = 'Kodak';
      onBrandChange();
    } else {
      onTypeChange();
    }
  }

  // Rebuild emulsion select based on brand + format + type
  function onBrandChange() {
    const brand      = document.getElementById('f-brand')?.value;
    const format     = document.getElementById('f-format')?.value;
    const type       = document.getElementById('f-type')?.value;
    const nameSelect = document.getElementById('f-name');
    if (!nameSelect) return;
    let stocks;
    if (format === 'Super8') {
      stocks = getSuper8Stocks(brand, type);
    } else if (type && STOCKS_BY_TYPE[type]?.[brand] !== undefined) {
      stocks = STOCKS_BY_TYPE[type][brand];
    } else {
      stocks = FILM_STOCKS[brand] || [];
    }
    nameSelect.innerHTML =
      `<option value="">— Seleccionar —</option>` +
      stocks.map(s => `<option value="${s}">${s}</option>`).join('') +
      `<option value="__otro__">Otro (escribir)</option>`;
    if (stocks.length) { nameSelect.value = stocks[0]; onNameChange(); }
  }

  // Rebuild brand list when type changes
  function onTypeChange() {
    const type        = document.getElementById('f-type')?.value;
    const format      = document.getElementById('f-format')?.value;
    const brandSelect = document.getElementById('f-brand');
    if (!brandSelect || format === 'Super8') { onBrandChange(); return; }
    const list    = getBrandListForType(type, format);
    const current = brandSelect.value;
    brandSelect.innerHTML = list.map(b => `<option value="${b}">${b}</option>`).join('');
    brandSelect.value = list.includes(current) ? current : list[0];
    onBrandChange();
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
      ? (lenses.find(l => /nikkor/i.test(l.brand) && /^50mm f\/1\.4/.test(l.focal_length))?.id ?? lenses.find(l => /nikkor/i.test(l.brand) && /50/.test(l.focal_length))?.id ?? '')
      : v('lens_id');
    const defStart   = isNew ? today   : v('start_date');
    const defEnd     = isNew ? today   : v('end_date');
    const defCountry = isNew ? 'Mexico': v('country');
    const defCity    = isNew ? 'CDMX'  : v('city');

    const currentFormat = v('format', '35mm');
    const currentType   = v('type', 'color');
    const brandList     = getBrandListForType(currentType, currentFormat);
    const currentBrand  = brandList.includes(v('brand')) ? v('brand') : (brandList[0] || '');
    const defNumPhotos  = isNew ? (currentFormat === '120' ? '12' : currentFormat === 'Super8' ? '' : '36')
                               : v('num_photos');

    // Emulsion select
    const rawStocks = currentFormat === 'Super8'
      ? getSuper8Stocks(currentBrand, currentType)
      : (STOCKS_BY_TYPE[currentType]?.[currentBrand] ?? FILM_STOCKS[currentBrand] ?? []);
    const currentName = v('name');
    const nameIsCustom = currentName && !rawStocks.includes(currentName);
    const selectValue = nameIsCustom ? '__otro__' : (currentName || (rawStocks[0] || ''));

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
          <select id="f-type" onchange="Films.onTypeChange()">
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
            ${rawStocks.map(s => `<option value="${s}" ${selectValue === s ? 'selected' : ''}>${s}</option>`).join('')}
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
          ${currentFormat === 'Super8'
            ? sel([['9','9 fps'],['18','18 fps'],['24','24 fps']], defNumPhotos)
            : currentFormat === '120'
            ? sel([['4','4'],['6','6'],['12','12']], defNumPhotos)
            : sel([['14','14'],['24','24'],['36','36']], defNumPhotos)}
        </select>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Cámara</label>
          <select id="f-camera" onchange="Films.onCameraChange()">
            <option value="">— Sin cámara —</option>
            ${isNew && cameras.length === 0
              ? `<option value="__import_cameras__">📷 ¿Quieres importar las cámaras de nuestro brevísimo catálogo?</option>`
              : cameras.map(c => `<option value="${c.id}" ${defCameraId === c.id ? 'selected' : ''}>${c.brand} ${c.model}</option>`).join('')
            }
            <option value="__add_camera__">📸 ¿Tu cámara es única y diferente? Añádela aquí</option>
          </select>
          <div id="f-camera-custom-wrap" class="hidden" style="margin-top:.5rem;display:flex;gap:.5rem">
            <input id="f-camera-brand" placeholder="Marca (ej. Olympus)" style="flex:1">
            <input id="f-camera-model" placeholder="Modelo (ej. OM-1)" style="flex:1">
          </div>
        </div>
        <div class="form-group">
          <label>Lente</label>
          <select id="f-lens">
            <option value="">— Sin lente —</option>
            ${lenses.map(l => `<option value="${l.id}" ${defLensId === l.id ? 'selected' : ''}>${l.brand} ${l.focal_length}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Estado actual</label>
          <select id="f-status">
            ${sel([
              ['en_camara','En cámara'],['en_revelado','Por revelar'],
              ['finalizado','Finalizado'],['escaneado','Por escanear']
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
            ['familia','Familia'],['amigos','Amigos'],
            ['paisaje','Paisaje'],['retrato','Retrato'],['macro','Macro'],
            ['boda','Boda'],['eventos','Eventos'],['mascotas','Mascotas'],
            ['estudio','Estudio'],['producto','De producto'],
            ['chile_mole','De chile, mole y pozole'],['ex','de mi ex :('],
            ['otro','Otro']
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

  async function remove(id) {
    const { error } = await supabase.from('films').delete().eq('id', id);
    if (error) throw error;
    films = films.filter(f => f.id !== id);
  }

  function confirmDelete(id) {
    const film = films.find(f => f.id === id);
    if (!film) return;
    Modal.open({
      title: 'Eliminar rollo',
      body: `<p>¿Estás seguro que quieres eliminar tu rollo :O ?<br><strong>${film.name} — ${film.brand}</strong></p>`,
      saveLabel: 'Eliminar',
      saveDanger: true,
      onSave: async () => {
        await remove(id);
        Toast.show('Rollo eliminado', 'success');
        await render();
        await Dashboard.render();
        return true;
      }
    });
  }

  async function onCameraChange() {
    const val = document.getElementById('f-camera')?.value;
    const customWrap = document.getElementById('f-camera-custom-wrap');
    if (customWrap) customWrap.classList.toggle('hidden', val !== '__add_camera__');
    if (val !== '__import_cameras__') return;
    await Cameras.seedDefaults();
    await Lenses.seedDefaults();
    const updatedCameras = Cameras.getAll();
    const updatedLenses  = Lenses.getAll();
    const camSel = document.getElementById('f-camera');
    camSel.innerHTML = `<option value="">— Sin cámara —</option>` +
      updatedCameras.map(c => `<option value="${c.id}">${c.brand} ${c.model}</option>`).join('');
    const defCam = updatedCameras.find(c => /nikon/i.test(c.brand) && /f3/i.test(c.model));
    if (defCam) camSel.value = defCam.id;
    const lensSel = document.getElementById('f-lens');
    lensSel.innerHTML = `<option value="">— Sin lente —</option>` +
      updatedLenses.map(l => `<option value="${l.id}">${l.brand} ${l.focal_length}</option>`).join('');
    const defLens = updatedLenses.find(l => /nikkor/i.test(l.brand) && /^50mm f\/1\.4/.test(l.focal_length))
                 || updatedLenses.find(l => /nikkor/i.test(l.brand) && /50/.test(l.focal_length));
    if (defLens) lensSel.value = defLens.id;
  }

  // ---- Sort state ----
  let _sortCol = 'created_at';
  let _sortDir = 'desc';

  const _SORT_FN = {
    name:       (a, b) => (a.name || '').localeCompare(b.name || ''),
    tipo:       (a, b) => (a.type || '').localeCompare(b.type || ''),
    iso:        (a, b) => (parseInt(a.iso) || 0) - (parseInt(b.iso) || 0),
    formato:    (a, b) => (a.format || '').localeCompare(b.format || ''),
    camara:     (a, b) => cameraName(a).localeCompare(cameraName(b)),
    estado:     (a, b) => (a.current_status || '').localeCompare(b.current_status || ''),
    lab:        (a, b) => (a.lab || '').localeCompare(b.lab || ''),
    fin:        (a, b) => (a.end_date || '').localeCompare(b.end_date || ''),
    created_at: (a, b) => (a.created_at || '').localeCompare(b.created_at || ''),
  };

  function toggleSort(col) {
    if (_sortCol === col) {
      _sortDir = _sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      _sortCol = col;
      _sortDir = 'asc';
    }
    render();
  }

  function _sortIcon(col) {
    if (_sortCol !== col) return `<span class="th-sort-icon">↕</span>`;
    return `<span class="th-sort-icon sorted">${_sortDir === 'asc' ? '↑' : '↓'}</span>`;
  }

  function _th(col, label) {
    return `<th class="th-sortable${_sortCol === col ? ' th-active' : ''}" onclick="Films.toggleSort('${col}')">${label} ${_sortIcon(col)}</th>`;
  }

  function formatDatetime(str) {
    if (!str) return '—';
    const dateStr = str.includes('T') ? str.split('T')[0] : str;
    return formatDate(dateStr) || '—';
  }

  // ---- Render list ----

  async function render() {
    await load();

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

    // Apply sort
    const sortFn = _SORT_FN[_sortCol];
    if (sortFn) {
      list = [...list].sort((a, b) => _sortDir === 'asc' ? sortFn(a, b) : sortFn(b, a));
    }

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

    const hasNotes = list.some(f => f.notes);
    wrapper.innerHTML = `
      <table>
        <thead><tr>
          ${_th('created_at','Agregado el: ')}
          ${_th('name','Rollo')}
          ${_th('tipo','Tipo')}
          ${_th('iso','ISO')}
          ${_th('formato','Formato')}
          ${_th('camara','Cámara')}
          ${_th('estado','Estado')}
          ${_th('lab','Lab')}
          ${_th('fin','Finalizado en: ')}
          ${hasNotes ? '<th>Notas</th>' : ''}
          <th></th>
        </tr></thead>
        <tbody>
          ${list.map(f => `
            <tr>
              <td class="text-sm">${formatDatetime(f.created_at)}</td>
              <td>
                <div style="display:flex;gap:.5rem;align-items:center">
                  ${StockChip.render(f.brand, f.name, f.type, 'sm')}
                  <div>
                    <div style="font-weight:600">${f.name}</div>
                    <div class="text-muted text-sm">${f.brand}</div>
                  </div>
                </div>
              </td>
              <td>${typeBadge(f.type)}</td>
              <td>${f.iso || '—'}</td>
              <td><span class="badge badge-yellow">${f.format}</span></td>
              <td class="text-sm">${cameraName(f)}</td>
              <td>${statusBadge(f.current_status)}</td>
              <td class="text-sm">${f.lab || '—'}</td>
              <td class="text-sm">${formatDate(f.end_date) || '—'}</td>

              ${hasNotes ? `<td class="text-sm">${f.notes || ''}</td>` : ''}
              <td>
                <div class="actions">
                  <button class="btn btn-ghost btn-sm btn-icon" onclick="Films.openEdit('${f.id}')">✏️</button>
                  <button class="btn btn-danger btn-sm btn-icon" onclick="Films.confirmDelete('${f.id}')">🗑</button>
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
        try {
          const camVal = document.getElementById('f-camera')?.value;
          if (camVal === '__add_camera__') {
            const camBrand = document.getElementById('f-camera-brand')?.value.trim();
            const camModel = document.getElementById('f-camera-model')?.value.trim();
            if (!camBrand || !camModel) { Toast.show('Escribe la marca y modelo de tu cámara', 'error'); return false; }
            const format = document.getElementById('f-format')?.value || '35mm';
            await Cameras.save({ brand: camBrand, model: camModel, format, type: 'SLR' });
            await Cameras.load();
            const newCam = Cameras.getAll().find(c => c.brand === camBrand && c.model === camModel);
            const camSel = document.getElementById('f-camera');
            // Si no se encontró la cámara recién creada, limpiar el select para no mandar un ID inválido
            camSel.value = newCam ? newCam.id : '';
            if (newCam) {
              const opt = document.createElement('option');
              opt.value = newCam.id;
              camSel.appendChild(opt);
              camSel.value = newCam.id;
            }
          }
          const form = collectForm(film);
          const needsIso = form.format !== 'Super8';
          if (!form.brand || !form.name || (needsIso && !form.iso)) {
            Toast.show('Marca y nombre son obligatorios', 'error'); return false;
          }
          await save(form);
          Toast.show(isEdit ? 'Rollo actualizado' : 'Rollo añadido', 'success');
          await render();
          await Dashboard.render();
          return true;
        } catch (err) {
          Toast.show(err.message || 'Error al guardar el rollo', 'error');
          return false;
        }
      }
    });
    setTimeout(!film ? onFormatChange : onNameChange, 0);
  }

  function openEdit(id) {
    const film = films.find(f => f.id === id);
    if (film) openModal(film);
  }

  function bindUI() {
    document.getElementById('btn-add-film')?.addEventListener('click', () => openModal());
    document.getElementById('btn-add-film-list')?.addEventListener('click', () => openModal());
    document.getElementById('btn-add-film-mobile')?.addEventListener('click', () => openModal());
    document.getElementById('btn-add-film-dash')?.addEventListener('click', () => openModal());

    ['filter-status','filter-type','filter-format'].forEach(id => {
      document.getElementById(id)?.addEventListener('change', () => render());
    });
    document.getElementById('filter-search')?.addEventListener('input', () => render());
  }

  return {
    load, getAll, save, render, openModal, openEdit, bindUI,
    onFormatChange, onTypeChange, onBrandChange, onNameChange, onCameraChange,
    remove, confirmDelete, toggleSort,
    STATUS_CONFIG, FILM_STATUS_CFG, statusBadge, filmStatusBadge, typeBadge, formatDate
  };
})();
