// ============================================================
// Films CRUD
// ============================================================

const Films = (() => {
  let films = [];
  let lastRoll = null;

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

  const QUICK_BRANDS = [
    'Kodak','Fujifilm','Ilford','Cinestill','Lomography','Agfa',
    'Fomapan','Orwo','SantaColor','Lucky','ReflxLab'
  ];

  function inferTypeFromStock(brand, name) {
    if (!name) return 'color';
    if (STOCKS_BY_TYPE.slide[brand]?.includes(name)) return 'slide';
    if (STOCKS_BY_TYPE.bw[brand]?.includes(name)) return 'bw';
    const slideKw = ['Velvia','Provia','Astia','Ektachrome','CT Precisa','R100','Sensia'];
    if (slideKw.some(kw => name.includes(kw))) return 'slide';
    const bwKw = [
      'BwXX','Tri-X','T-Max','HP5','FP4','Delta','Pan F','XP2','SFX','Ortho',
      'APX','UN54','NP100','Lady Grey','Earl Grey','Berlin Kino','Potsdam Kino'
    ];
    if (bwKw.some(kw => name.includes(kw))) return 'bw';
    if (['Ilford','Bergger','Kentmere'].includes(brand)) return 'bw';
    if (brand === 'Fomapan') return 'bw';
    return 'color';
  }

  function getQuickStocks(brand, format) {
    if (format === 'Super8') {
      if (brand === 'Orwo') return ['NC 200', 'UN54'];
      return ['Vision3 50D', 'Vision3 200T', 'Vision3 500T', 'Ektachrome', 'Tri-X Reversal'];
    }
    return FILM_STOCKS[brand] || [];
  }

  function getBrandListForType(type, format) {
    if (format === 'Super8') return ['Kodak','Orwo'];
    if (type === 'slide') return ['Kodak','Fujifilm','Otra'];
    if (type === 'bw')    return ['Ilford', ...FILM_BRANDS.filter(b => b !== 'Ilford' && !BW_EXCL.includes(b))];
    return FILM_BRANDS.filter(b => !COLOR_EXCL.includes(b));
  }

  const LABS = [
    'Yo soy mi lab','Pantera','Aborigen','Bengala',
    'Foto Hercules','Dichroic','Mexicana Analoga','Foto Ricardo','LabTank'
  ];

  function statusConfig() {
    return {
      en_camara:   { label: I18n.t('status_en_camara'),   cls: 'badge-blue'   },
      en_revelado: { label: I18n.t('status_en_revelado'), cls: 'badge-yellow'  },
      finalizado:  { label: I18n.t('status_finalizado'),  cls: 'badge-green'   },
      escaneado:   { label: I18n.t('status_escaneado'),   cls: 'badge-purple'  },
    };
  }

  function filmStatusConfig() {
    return {
      fresh:     { label: I18n.t('cond_fresh'),     cls: 'badge-green'  },
      cadufresh: { label: I18n.t('cond_cadufresh'), cls: 'badge-yellow' },
      rancio:    { label: I18n.t('cond_rancio'),    cls: 'badge-red'    },
    };
  }

  function typeCfg() {
    return {
      color: { label: I18n.t('type_color'), cls: 'badge-teal' },
      bw:    { label: I18n.t('type_bw'),    cls: 'badge-gray' },
      slide: { label: I18n.t('type_slide'), cls: 'badge-blue' },
    };
  }

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
    const cfg = statusConfig();
    const c = cfg[s] || { label: s, cls: 'badge-gray' };
    return `<span class="badge ${c.cls}">${c.label}</span>`;
  }

  function filmStatusBadge(s) {
    const cfg = filmStatusConfig();
    const c = cfg[s] || { label: s, cls: 'badge-gray' };
    return `<span class="badge ${c.cls}">${c.label}</span>`;
  }

  function typeBadge(t) {
    const cfg = typeCfg();
    const c = cfg[t] || { label: t, cls: 'badge-gray' };
    return `<span class="badge ${c.cls}">${c.label}</span>`;
  }

  function formatDate(str) {
    if (!str) return null;
    const [y, m, d] = str.split('-');
    const months = I18n.t('months_short');
    return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
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
    return ['Vision3 50D', 'Vision3 200T', 'Vision3 500T'];
  }

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
      `<option value="">${I18n.t('form_select')}</option>` +
      stocks.map(s => `<option value="${s}">${s}</option>`).join('') +
      `<option value="__otro__">${I18n.t('form_other_write')}</option>`;
    if (stocks.length) { nameSelect.value = stocks[0]; onNameChange(); }
  }

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

  const ISO_LOOKUP = {
    'Vision3 500T': 500,
    'Vision3 200T': 200,
    'Vision3 250D': 250,
    'Vision3 50D':  50,
    'Ektachrome':   100,
    'Tri-X Reversal': 200,
  };

  function onNameChange() {
    const val        = document.getElementById('f-name')?.value;
    const customWrap = document.getElementById('f-name-custom-wrap');
    const isoField   = document.getElementById('f-iso');
    customWrap?.classList.toggle('hidden', val !== '__otro__');
    if (val && val !== '__otro__' && isoField) {
      if (ISO_LOOKUP[val] !== undefined) {
        isoField.value = ISO_LOOKUP[val];
      } else {
        const m = val.match(/\b(50|100|125|160|200|250|320|400|500|800|1600|3200)\b/);
        if (m) isoField.value = m[1];
      }
    }
  }

  // ---- Photo type label helper ----
  function photoTypeLabel(val) {
    if (!val) return '';
    const key = `photo_${val}`;
    const translated = I18n.t(key);
    // If key not found, return capitalized original
    return translated !== key ? translated : (val.charAt(0).toUpperCase() + val.slice(1));
  }

  // ---- Modal form HTML ----

  function formHtml(film, cameras, lenses) {
    const isNew = !film;
    const v = (id, fallback = '') => film?.[id] ?? fallback;
    const sel = (opts, current) => opts.map(([val, lbl]) =>
      `<option value="${val}" ${current === val ? 'selected' : ''}>${lbl}</option>`
    ).join('');

    const today = new Date().toISOString().split('T')[0];

    const defCameraId = isNew
      ? (cameras.find(c => /nikon/i.test(c.brand) && /f3/i.test(c.model))?.id ?? '')
      : v('camera_id');
    const defLensId = isNew
      ? (lenses.find(l => /nikkor/i.test(l.brand) && /^50mm f\/1\.4/.test(l.focal_length))?.id ?? lenses.find(l => /nikkor/i.test(l.brand) && /50/.test(l.focal_length))?.id ?? '')
      : v('lens_id');
    const defStart   = isNew ? today   : v('start_date');
    const defEnd     = isNew ? today   : (v('end_date') || v('start_date') || today);
    const defCountry = isNew ? 'Mexico': v('country');
    const defCity    = isNew ? 'CDMX'  : v('city');

    const currentFormat = v('format', '35mm');
    const currentType   = v('type', 'color');
    const brandList     = getBrandListForType(currentType, currentFormat);
    const currentBrand  = brandList.includes(v('brand')) ? v('brand') : (brandList[0] || '');
    const defNumPhotos  = isNew ? (currentFormat === '120' ? '12' : currentFormat === 'Super8' ? '' : '36')
                               : v('num_photos');

    const rawStocks = currentFormat === 'Super8'
      ? getSuper8Stocks(currentBrand, currentType)
      : (STOCKS_BY_TYPE[currentType]?.[currentBrand] ?? FILM_STOCKS[currentBrand] ?? []);
    const currentName = v('name');
    const nameIsCustom = currentName && !rawStocks.includes(currentName);
    const selectValue = nameIsCustom ? '__otro__' : (currentName || (rawStocks[0] || ''));

    return `
      <div class="form-row-3">
        <div class="form-group">
          <label>${I18n.t('form_roll_condition')}</label>
          <select id="f-film-status">
            ${sel([
              ['fresh', I18n.t('cond_fresh')],
              ['cadufresh', I18n.t('cond_cadufresh')],
              ['rancio', I18n.t('cond_rancio')]
            ], v('film_status','fresh'))}
          </select>
        </div>
        <div class="form-group">
          <label>${I18n.t('form_type')}</label>
          <select id="f-type" onchange="Films.onTypeChange()">
            ${sel([
              ['color', I18n.t('type_color')],
              ['bw', I18n.t('type_bw')],
              ['slide', I18n.t('form_slide_type')]
            ], v('type','color'))}
          </select>
        </div>
        <div class="form-group">
          <label>${I18n.t('form_format')}</label>
          <select id="f-format" onchange="Films.onFormatChange()">
            ${sel([['35mm','35mm'],['120','120'],['Super8','Super 8']], currentFormat)}
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>${I18n.t('form_brand')}</label>
          <select id="f-brand" onchange="Films.onBrandChange()">
            ${brandList.map(b => `<option value="${b}" ${currentBrand === b ? 'selected' : ''}>${b}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>${I18n.t('form_emulsion')}</label>
          <select id="f-name" onchange="Films.onNameChange()">
            <option value="">${I18n.t('form_select')}</option>
            ${rawStocks.map(s => `<option value="${s}" ${selectValue === s ? 'selected' : ''}>${s}</option>`).join('')}
            <option value="__otro__" ${selectValue === '__otro__' ? 'selected' : ''}>${I18n.t('form_other_write')}</option>
          </select>
          <div id="f-name-custom-wrap" class="${nameIsCustom ? '' : 'hidden'}" style="margin-top:.4rem">
            <input id="f-name-custom" value="${nameIsCustom ? currentName : ''}" placeholder="${I18n.t('form_emulsion_placeholder')}">
          </div>
        </div>
      </div>
      <input id="f-iso" type="hidden" value="${v('iso')}">
      <div class="form-group">
        <label>${I18n.t('form_num_photos')}</label>
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
          <label>${I18n.t('form_camera')}</label>
          <select id="f-camera" onchange="Films.onCameraChange()">
            <option value="">${I18n.t('form_no_camera')}</option>
            ${isNew && cameras.length === 0
              ? `<option value="__import_cameras__">${I18n.t('form_import_cameras')}</option>`
              : cameras.map(c => `<option value="${c.id}" ${defCameraId === c.id ? 'selected' : ''}>${c.brand} ${c.model}</option>`).join('')
            }
            <option value="__add_camera__">${I18n.t('form_add_camera_unique')}</option>
          </select>
          <div id="f-camera-custom-wrap" class="hidden" style="margin-top:.5rem;display:flex;gap:.5rem">
            <input id="f-camera-brand" placeholder="${I18n.t('form_camera_brand_ph')}" style="flex:1">
            <input id="f-camera-model" placeholder="${I18n.t('form_camera_model_ph')}" style="flex:1">
          </div>
        </div>
        <div class="form-group">
          <label>${I18n.t('form_lens')}</label>
          <select id="f-lens">
            <option value="">${I18n.t('form_no_lens')}</option>
            ${lenses.map(l => `<option value="${l.id}" ${defLensId === l.id ? 'selected' : ''}>${l.brand} ${l.focal_length}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>${I18n.t('form_status')}</label>
          <select id="f-status">
            ${sel([
              ['en_camara',   I18n.t('status_en_camara')],
              ['en_revelado', I18n.t('status_en_revelado')],
              ['finalizado',  I18n.t('status_finalizado')],
              ['escaneado',   I18n.t('status_escaneado')]
            ], v('current_status','en_camara'))}
          </select>
        </div>
        <div class="form-group">
          <label>${I18n.t('form_push_pull')}</label>
          <select id="f-push-pull">
            ${sel([
              ['no',  I18n.t('form_push_no')],
              ['+1',  I18n.t('form_push_1')],
              ['+2',  I18n.t('form_push_2')],
              ['+3',  I18n.t('form_push_3')],
              ['-1',  I18n.t('form_pull_1')],
              ['-2',  I18n.t('form_pull_2')]
            ], v('push_pull','no'))}
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>${I18n.t('form_start_date')}</label>
          <input id="f-start" type="date" value="${defStart}">
        </div>
        <div class="form-group">
          <label>${I18n.t('form_end_date')}</label>
          <input id="f-end" type="date" value="${defEnd}">
        </div>
      </div>
      <div class="form-group">
        <label>${I18n.t('form_lab')}</label>
        <select id="f-lab">
          <option value="">${I18n.t('form_no_lab')}</option>
          ${LABS.map(l => `<option value="${l}" ${v('lab') === l ? 'selected' : ''}>${l}</option>`).join('')}
        </select>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>${I18n.t('form_city')}</label>
          <input id="f-city" value="${defCity}" placeholder="${I18n.t('form_city_ph')}">
        </div>
        <div class="form-group">
          <label>${I18n.t('form_country')}</label>
          <input id="f-country" value="${defCountry}" placeholder="${I18n.t('form_country_ph')}">
        </div>
      </div>
      <div class="form-group">
        <label>${I18n.t('form_photo_type')}</label>
        <select id="f-photo-type">
          <option value="">${I18n.t('form_photo_type_none')}</option>
          ${[
            ['familia','photo_familia'],['amigos','photo_amigos'],
            ['paisaje','photo_paisaje'],['retrato','photo_retrato'],['macro','photo_macro'],
            ['boda','photo_boda'],['eventos','photo_eventos'],['mascotas','photo_mascotas'],
            ['estudio','photo_estudio'],['producto','photo_producto'],
            ['chile_mole','photo_chile_mole'],['ex','photo_ex'],
            ['otro','photo_otro']
          ].map(([val, key]) =>
            `<option value="${val}" ${v('photo_type') === val ? 'selected' : ''}>${I18n.t(key)}</option>`
          ).join('')}
        </select>
      </div>
      <div class="form-group">
        <label>${I18n.t('form_notes')}</label>
        <textarea id="f-notes" placeholder="${I18n.t('form_notes_ph')}">${v('notes')}</textarea>
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
      title: I18n.t('delete_roll_title'),
      body: `<p>${I18n.t('delete_roll_q')}<br><strong>${film.name} — ${film.brand}</strong></p>`,
      saveLabel: I18n.t('modal_delete'),
      saveDanger: true,
      onSave: async () => {
        await remove(id);
        Toast.show(I18n.t('toast_roll_deleted'), 'success');
        await render();
        await Dashboard.render();
        if (document.getElementById('stats-view')?.classList.contains('active')) Stats.render();
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
    camSel.innerHTML = `<option value="">${I18n.t('form_no_camera')}</option>` +
      updatedCameras.map(c => `<option value="${c.id}">${c.brand} ${c.model}</option>`).join('');
    const defCam = updatedCameras.find(c => /nikon/i.test(c.brand) && /f3/i.test(c.model));
    if (defCam) camSel.value = defCam.id;
    const lensSel = document.getElementById('f-lens');
    lensSel.innerHTML = `<option value="">${I18n.t('form_no_lens')}</option>` +
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
          <p>${films.length ? I18n.t('empty_filters') : I18n.t('empty_rolls')}</p>
        </div>`;
      return;
    }

    const hasNotes = list.some(f => f.notes);
    wrapper.innerHTML = `
      <table>
        <thead><tr>
          ${_th('created_at', I18n.t('th_added'))}
          ${_th('name',       I18n.t('th_roll'))}
          ${_th('tipo',       I18n.t('th_type'))}
          ${_th('iso',        I18n.t('th_iso'))}
          ${_th('formato',    I18n.t('th_format'))}
          ${_th('camara',     I18n.t('th_camera'))}
          ${_th('estado',     I18n.t('th_status'))}
          ${_th('lab',        I18n.t('th_lab'))}
          ${_th('fin',        I18n.t('th_finished'))}
          ${hasNotes ? `<th>${I18n.t('th_notes')}</th>` : ''}
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

  // Entry point: Quick Mode for new rolls, Advanced for edits
  function openModal(film = null) {
    film ? _openAdvancedModal(film) : openQuickModal();
  }

  function openQuickModal() {
    const cameras = Cameras.getAll();

    Modal.open({
      title: I18n.t('quick_title'),
      wide: false,
      saveLabel: I18n.t('quick_save'),
      body: quickFormHtml(cameras),
      onSave: async () => {
        try {
          const format  = document.getElementById('q-format')?.value || '35mm';
          const brand   = document.getElementById('q-brand')?.value;
          const rawName = document.getElementById('q-name')?.value;

          if (!brand || !rawName) {
            Toast.show(I18n.t('quick_select_emulsion'), 'error');
            return false;
          }

          let cameraId = document.getElementById('q-camera')?.value || null;
          if (cameraId === '__add_camera__') {
            const camBrand = document.getElementById('q-camera-brand')?.value.trim();
            const camModel = document.getElementById('q-camera-model')?.value.trim();
            if (!camBrand || !camModel) {
              Toast.show(I18n.t('toast_fill_camera'), 'error');
              return false;
            }
            await Cameras.save({ brand: camBrand, model: camModel, format, type: 'SLR' });
            await Cameras.load();
            const newCam = Cameras.getAll().find(c => c.brand === camBrand && c.model === camModel);
            cameraId = newCam?.id || null;
          } else if (!cameraId) {
            cameraId = null;
          }

          const genericLens = Lenses.getAll().find(l =>
            /gen[eé]rico/i.test(l.brand) && /28mm/i.test(l.focal_length)
          );

          const numPhotos = format === '120' ? '12' : format === 'Super8' ? '18' : '36';
          const today = new Date().toISOString().split('T')[0];

          let iso = 0;
          if (ISO_LOOKUP[rawName] !== undefined) {
            iso = ISO_LOOKUP[rawName];
          } else {
            const m = rawName.match(/\b(50|100|125|160|200|250|320|400|500|800|1600|3200)\b/);
            if (m) iso = parseInt(m[1]);
          }

          const form = {
            film_status:    'fresh',
            brand,
            name:           rawName,
            type:           inferTypeFromStock(brand, rawName),
            iso,
            format,
            camera_id:      cameraId,
            lens_id:        genericLens?.id || null,
            current_status: 'en_camara',
            push_pull:      'no',
            num_photos:     numPhotos,
            start_date:     today,
            end_date:       null,
            notes:          document.getElementById('q-notes')?.value.trim() || null,
            lab:            null,
            city:           null,
            country:        null,
            photo_type:     null,
          };

          await save(form);
          lastRoll = form;
          Toast.show(I18n.t('toast_roll_added'), 'success');
          await render();
          await Dashboard.render();
          if (document.getElementById('stats-view')?.classList.contains('active')) Stats.render();
          return true;
        } catch (err) {
          Toast.show(err.message || I18n.t('toast_save_error'), 'error');
          return false;
        }
      }
    });

    setTimeout(() => onQuickBrandChange(), 0);
  }

  function switchToAdvanced() {
    _openAdvancedModal(null);
  }

  function switchToQuick() {
    openQuickModal();
  }

  function _openAdvancedModal(film = null) {
    const isEdit = !!film;
    const cameras = Cameras.getAll();
    const lenses  = Lenses.getAll();
    const defaults = film ?? (lastRoll ? { ...lastRoll, id: null } : null);

    const modeHeader = !isEdit ? `
      <div class="quick-mode-header">
        <span class="quick-mode-badge">&#9881; ${I18n.t('adv_mode_label')}</span>
        <button type="button" class="btn-link-subtle" onclick="Films.switchToQuick()">${I18n.t('adv_quick_btn')}</button>
      </div>` : '';

    Modal.open({
      title: isEdit ? I18n.t('adv_title_edit') : I18n.t('adv_title_new'),
      wide: true,
      body: modeHeader + formHtml(defaults, cameras, lenses),
      onSave: async () => {
        try {
          const camVal = document.getElementById('f-camera')?.value;
          if (camVal === '__add_camera__') {
            const camBrand = document.getElementById('f-camera-brand')?.value.trim();
            const camModel = document.getElementById('f-camera-model')?.value.trim();
            if (!camBrand || !camModel) { Toast.show(I18n.t('toast_fill_camera'), 'error'); return false; }
            const format = document.getElementById('f-format')?.value || '35mm';
            await Cameras.save({ brand: camBrand, model: camModel, format, type: 'SLR' });
            await Cameras.load();
            const newCam = Cameras.getAll().find(c => c.brand === camBrand && c.model === camModel);
            const camSel = document.getElementById('f-camera');
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
            Toast.show(I18n.t('toast_required'), 'error'); return false;
          }
          await save(form);
          if (!isEdit) lastRoll = form;
          Toast.show(isEdit ? I18n.t('toast_roll_updated') : I18n.t('toast_roll_added'), 'success');
          await render();
          await Dashboard.render();
          if (document.getElementById('stats-view')?.classList.contains('active')) Stats.render();
          return true;
        } catch (err) {
          Toast.show(err.message || I18n.t('toast_save_roll_error'), 'error');
          return false;
        }
      }
    });
    setTimeout(!film ? onFormatChange : onNameChange, 0);
  }

  // ---- Quick Mode form ----

  function quickFormHtml(cameras) {
    const initialStocks = FILM_STOCKS['Kodak'] || [];
    return `
      <div class="quick-mode-header">
        <span class="quick-mode-badge">&#9889; ${I18n.t('quick_mode_label')}</span>
        <button type="button" class="btn-link-subtle" onclick="Films.switchToAdvanced()">${I18n.t('quick_advanced_btn')}</button>
      </div>
      <div class="form-group">
        <label>${I18n.t('form_format')}</label>
        <select id="q-format" onchange="Films.onQuickFormatChange()">
          <option value="35mm">35mm</option>
          <option value="120">120</option>
          <option value="Super8">Super 8</option>
        </select>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>${I18n.t('form_brand')}</label>
          <select id="q-brand" onchange="Films.onQuickBrandChange()">
            ${QUICK_BRANDS.map(b => `<option value="${b}">${b}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>${I18n.t('quick_emulsion')}</label>
          <select id="q-name" onchange="Films.onQuickNameChange()">
            <option value="">${I18n.t('quick_select')}</option>
            ${initialStocks.map(s => `<option value="${s}">${s}</option>`).join('')}
          </select>
        </div>
      </div>
      <div id="q-chip-preview" style="display:flex;justify-content:center;margin:.5rem 0 .75rem;min-height:58px"></div>
      <div class="form-group">
        <label>${I18n.t('quick_camera_optional')} <span class="label-optional">${I18n.t('quick_camera_opt_label')}</span></label>
        <select id="q-camera" onchange="Films.onQuickCameraChange()">
          <option value="">${I18n.t('quick_no_camera')}</option>
          ${cameras.map(c => `<option value="${c.id}">${c.brand} ${c.model}</option>`).join('')}
          <option value="__add_camera__">${I18n.t('quick_add_camera')}</option>
        </select>
        <div id="q-camera-custom-wrap" class="hidden" style="margin-top:.5rem;display:flex;gap:.5rem">
          <input id="q-camera-brand" placeholder="${I18n.t('form_camera_brand_ph')}" style="flex:1">
          <input id="q-camera-model" placeholder="${I18n.t('form_camera_model_ph')}" style="flex:1">
        </div>
      </div>
      <div class="form-group">
        <label>${I18n.t('quick_notes_optional')} <span class="label-optional">${I18n.t('quick_camera_opt_label')}</span></label>
        <textarea id="q-notes" placeholder="${I18n.t('form_notes_ph')}" rows="2"></textarea>
      </div>`;
  }

  function onQuickFormatChange() {
    const format = document.getElementById('q-format')?.value;
    const brandSel = document.getElementById('q-brand');
    if (!brandSel) return;
    if (format === 'Super8') {
      brandSel.innerHTML = ['Kodak','Orwo'].map(b => `<option value="${b}">${b}</option>`).join('');
      brandSel.value = 'Kodak';
    } else {
      const current = brandSel.value;
      brandSel.innerHTML = QUICK_BRANDS.map(b => `<option value="${b}">${b}</option>`).join('');
      if (QUICK_BRANDS.includes(current)) brandSel.value = current;
    }
    onQuickBrandChange();
  }

  function onQuickBrandChange() {
    const format = document.getElementById('q-format')?.value || '35mm';
    const brand = document.getElementById('q-brand')?.value;
    const nameSel = document.getElementById('q-name');
    if (!nameSel || !brand) return;
    const stocks = getQuickStocks(brand, format);
    nameSel.innerHTML =
      `<option value="">${I18n.t('quick_select')}</option>` +
      stocks.map(s => `<option value="${s}">${s}</option>`).join('');
    if (stocks.length) nameSel.value = stocks[0];
    _updateQuickChip();
  }

  function onQuickNameChange() {
    _updateQuickChip();
  }

  function _updateQuickChip() {
    const brand = document.getElementById('q-brand')?.value;
    const name  = document.getElementById('q-name')?.value;
    const preview = document.getElementById('q-chip-preview');
    if (!preview) return;
    if (!brand || !name) { preview.innerHTML = ''; return; }
    preview.innerHTML = StockChip.render(brand, name, inferTypeFromStock(brand, name), 'lg');
  }

  function onQuickCameraChange() {
    const val = document.getElementById('q-camera')?.value;
    const wrap = document.getElementById('q-camera-custom-wrap');
    if (wrap) wrap.classList.toggle('hidden', val !== '__add_camera__');
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
    onQuickFormatChange, onQuickBrandChange, onQuickNameChange, onQuickCameraChange,
    switchToAdvanced, switchToQuick,
    remove, confirmDelete, toggleSort,
    statusBadge, filmStatusBadge, typeBadge, formatDate, photoTypeLabel,
    STATUS_CONFIG: statusConfig,
  };
})();
