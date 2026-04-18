// ============================================================
// Cameras CRUD
// ============================================================

const Cameras = (() => {
  let cameras = [];

  const DEFAULT_CAMERAS = [
    // Nikon 35mm SLR
    { brand: 'Nikon', model: 'F',          format: '35mm', type: 'SLR' },
    { brand: 'Nikon', model: 'F2',         format: '35mm', type: 'SLR' },
    { brand: 'Nikon', model: 'F3',         format: '35mm', type: 'SLR' },
    { brand: 'Nikon', model: 'FM',         format: '35mm', type: 'SLR' },
    { brand: 'Nikon', model: 'FM2',        format: '35mm', type: 'SLR' },
    { brand: 'Nikon', model: 'FE',         format: '35mm', type: 'SLR' },
    { brand: 'Nikon', model: 'FE2',        format: '35mm', type: 'SLR' },
    // Nikon Rangefinder 35mm
    { brand: 'Nikon', model: 'I',          format: '35mm', type: 'Rangefinder' },
    { brand: 'Nikon', model: 'M',          format: '35mm', type: 'Rangefinder' },
    { brand: 'Nikon', model: 'S',          format: '35mm', type: 'Rangefinder' },
    { brand: 'Nikon', model: 'S2',         format: '35mm', type: 'Rangefinder' },
    { brand: 'Nikon', model: 'S3',         format: '35mm', type: 'Rangefinder' },
    { brand: 'Nikon', model: 'S4',         format: '35mm', type: 'Rangefinder' },
    { brand: 'Nikon', model: 'SP',         format: '35mm', type: 'Rangefinder' },
    // Canon 35mm SLR
    { brand: 'Canon', model: 'F-1',        format: '35mm', type: 'SLR' },
    { brand: 'Canon', model: 'F-1 New',    format: '35mm', type: 'SLR' },
    { brand: 'Canon', model: 'AE-1',       format: '35mm', type: 'SLR' },
    { brand: 'Canon', model: 'AE-1 Program', format: '35mm', type: 'SLR' },
    { brand: 'Canon', model: 'A-1',        format: '35mm', type: 'SLR' },
    { brand: 'Canon', model: 'EOS-1',      format: '35mm', type: 'SLR' },
    { brand: 'Canon', model: 'FT',         format: '35mm', type: 'SLR' },
    // Canon Rangefinder 35mm
    { brand: 'Canon', model: 'II',         format: '35mm', type: 'Rangefinder' },
    { brand: 'Canon', model: 'III',        format: '35mm', type: 'Rangefinder' },
    { brand: 'Canon', model: 'IV',         format: '35mm', type: 'Rangefinder' },
    { brand: 'Canon', model: 'P',          format: '35mm', type: 'Rangefinder' },
    { brand: 'Canon', model: '7',          format: '35mm', type: 'Rangefinder' },
    { brand: 'Canon', model: '7s',         format: '35mm', type: 'Rangefinder' },
    { brand: 'Canon', model: 'VL',         format: '35mm', type: 'Rangefinder' },
    { brand: 'Canon', model: 'L1',         format: '35mm', type: 'Rangefinder' },
    // Pentax 35mm SLR
    { brand: 'Pentax', model: 'Spotmatic', format: '35mm', type: 'SLR' },
    { brand: 'Pentax', model: 'K1000',     format: '35mm', type: 'SLR' },
    { brand: 'Pentax', model: 'MX',        format: '35mm', type: 'SLR' },
    { brand: 'Pentax', model: 'LX',        format: '35mm', type: 'SLR' },
    // Pentax 120
    { brand: 'Pentax', model: '67',        format: '120',  type: 'SLR' },
    { brand: 'Pentax', model: '645',       format: '120',  type: 'SLR' },
    // Yashica 35mm SLR
    { brand: 'Yashica', model: 'FX-3',     format: '35mm', type: 'SLR' },
    { brand: 'Yashica', model: 'FX-D',     format: '35mm', type: 'SLR' },
    // Yashica 120 TLR
    { brand: 'Yashica', model: 'Mat-124G', format: '120',  type: 'TLR' },
    // Mamiya 120 SLR
    { brand: 'Mamiya', model: 'RB67',      format: '120',  type: 'SLR' },
    { brand: 'Mamiya', model: 'RZ67',      format: '120',  type: 'SLR' },
    { brand: 'Mamiya', model: '645',       format: '120',  type: 'SLR' },
    // Mamiya 35mm SLR
    { brand: 'Mamiya', model: 'ZE',        format: '35mm', type: 'SLR' },
    // Rolleiflex 120 TLR
    { brand: 'Rolleiflex', model: '2.8F',  format: '120',  type: 'TLR' },
    { brand: 'Rolleiflex', model: '3.5F',  format: '120',  type: 'TLR' },
    // Bronica 120 SLR
    { brand: 'Bronica', model: 'ETRS',     format: '120',  type: 'SLR' },
    { brand: 'Bronica', model: 'SQ-A',     format: '120',  type: 'SLR' },
    { brand: 'Bronica', model: 'GS-1',     format: '120',  type: 'SLR' },
    // Minolta 35mm SLR
    { brand: 'Minolta', model: 'SR-T 101', format: '35mm', type: 'SLR' },
    { brand: 'Minolta', model: 'X-700',    format: '35mm', type: 'SLR' },
    { brand: 'Minolta', model: 'X-570',    format: '35mm', type: 'SLR' },
    { brand: 'Minolta', model: 'Maxxum 7000', format: '35mm', type: 'SLR' },
    // Leica Rangefinder 35mm
    { brand: 'Leica', model: 'I',          format: '35mm', type: 'Rangefinder' },
    { brand: 'Leica', model: 'II',         format: '35mm', type: 'Rangefinder' },
    { brand: 'Leica', model: 'III',        format: '35mm', type: 'Rangefinder' },
    { brand: 'Leica', model: 'IIIg',       format: '35mm', type: 'Rangefinder' },
    { brand: 'Leica', model: 'M3',         format: '35mm', type: 'Rangefinder' },
    { brand: 'Leica', model: 'M2',         format: '35mm', type: 'Rangefinder' },
    { brand: 'Leica', model: 'M4',         format: '35mm', type: 'Rangefinder' },
    { brand: 'Leica', model: 'M5',         format: '35mm', type: 'Rangefinder' },
    { brand: 'Leica', model: 'M6',         format: '35mm', type: 'Rangefinder' },
    { brand: 'Leica', model: 'CL',         format: '35mm', type: 'Rangefinder' },
    // Fujica Rangefinder 35mm
    { brand: 'Fujica', model: '35M',       format: '35mm', type: 'Rangefinder' },
    { brand: 'Fujica', model: '35ML',      format: '35mm', type: 'Rangefinder' },
    { brand: 'Fujica', model: '35EE',      format: '35mm', type: 'Rangefinder' },
    { brand: 'Fujica', model: '35EE2',     format: '35mm', type: 'Rangefinder' },
    { brand: 'Fujica', model: '35EE3',     format: '35mm', type: 'Rangefinder' },
    { brand: 'Fujica', model: '35FS',      format: '35mm', type: 'Rangefinder' },
    { brand: 'Fujica', model: '35SE',      format: '35mm', type: 'Rangefinder' },
  ];

  const CAMERA_BRANDS = [...new Set(DEFAULT_CAMERAS.map(c => c.brand))];

  const CAMERA_MODELS = CAMERA_BRANDS.reduce((acc, brand) => {
    acc[brand] = DEFAULT_CAMERAS.filter(c => c.brand === brand);
    return acc;
  }, {});

  async function load() {
    const { data, error } = await supabase
      .from('cameras')
      .select('*')
      .order('brand');
    if (error) { Toast.show(error.message, 'error'); return []; }
    cameras = data;
    return cameras;
  }

  async function seedDefaults() {
    const user = Auth.getUser();
    if (!user) return;
    const missing = DEFAULT_CAMERAS.filter(d =>
      !cameras.some(c => c.brand === d.brand && c.model === d.model)
    );
    if (!missing.length) { Toast.show('Todas las cámaras predeterminadas ya están añadidas', 'success'); return; }
    const rows = missing.map(c => ({ ...c, user_id: user.id }));
    const { data, error } = await supabase.from('cameras').insert(rows).select();
    if (error) { Toast.show(error.message, 'error'); return; }
    cameras = [...cameras, ...data];
    Toast.show(`${data.length} cámaras importadas`, 'success');
    await render();
  }

  function onBrandChange() {
    const brand = document.getElementById('cam-brand-select')?.value;
    if (!brand) return;
    document.getElementById('cam-brand-custom-wrap').classList.toggle('hidden', brand !== '__otro__');
    const models = brand === '__otro__' ? [] : (CAMERA_MODELS[brand] || []);
    const modelSel = document.getElementById('cam-model-select');
    modelSel.innerHTML = models.map(c =>
      `<option value="${c.model}" data-format="${c.format}" data-type="${c.type}">${c.model}</option>`
    ).join('') + `<option value="__otro__">Otro…</option>`;
    onModelChange();
  }

  function onModelChange() {
    const sel = document.getElementById('cam-model-select');
    const opt = sel.options[sel.selectedIndex];
    const isOther = sel.value === '__otro__';
    document.getElementById('cam-model-custom-wrap').classList.toggle('hidden', !isOther);
    if (!isOther && opt) {
      const fmt = opt.dataset.format;
      const typ = opt.dataset.type;
      if (fmt) document.getElementById('cam-format').value = fmt;
      if (typ) document.getElementById('cam-type').value = typ;
    }
  }

  function getAll() { return cameras; }

  async function save(form) {
    const user = Auth.getUser();
    const payload = {
      user_id: user.id,
      brand: form.brand,
      model: form.model,
      format: form.format,
      type: form.type,
    };
    if (form.id) {
      const { error } = await supabase.from('cameras').update(payload).eq('id', form.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('cameras').insert(payload);
      if (error) throw error;
    }
  }

  async function remove(id) {
    const { error } = await supabase.from('cameras').delete().eq('id', id);
    if (error) throw error;
    cameras = cameras.filter(c => c.id !== id);
  }

  // ---- UI ----

  function typeBadge(type) {
    const map = { 'p&s': 'badge-gray', SLR: 'badge-blue', TLR: 'badge-purple', Rangefinder: 'badge-teal' };
    return `<span class="badge ${map[type] || 'badge-gray'}">${type}</span>`;
  }

  function formatBadge(fmt) {
    return `<span class="badge badge-yellow">${fmt}</span>`;
  }

  async function render() {
    await load();
    const container = document.getElementById('cameras-view');
    if (!container) return;

    if (!cameras.length) {
      container.querySelector('.table-wrapper').innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📷</div>
          <p>No tienes cámaras registradas aún.</p>
        </div>`;
      return;
    }

    container.querySelector('.table-wrapper').innerHTML = `
      <table>
        <thead><tr>
          <th>Marca</th><th>Modelo</th><th>Formato</th><th>Tipo</th><th></th>
        </tr></thead>
        <tbody>
          ${cameras.map(c => `
            <tr>
              <td>${c.brand}</td>
              <td>${c.model}</td>
              <td>${formatBadge(c.format)}</td>
              <td>${typeBadge(c.type)}</td>
              <td>
                <div class="actions">
                  <button class="btn btn-ghost btn-sm btn-icon" onclick="Cameras.openEdit('${c.id}')">✏️</button>
                  <button class="btn btn-danger btn-sm btn-icon" onclick="Cameras.confirmDelete('${c.id}')">🗑</button>
                </div>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>`;
  }

  function openModal(camera = null) {
    const isEdit = !!camera;
    const currentBrand = camera?.brand ?? CAMERA_BRANDS[0];
    const currentModel = camera?.model ?? '';
    const isCustomBrand = camera ? !CAMERA_BRANDS.includes(camera.brand) : false;
    const isCustomModel = camera ? !DEFAULT_CAMERAS.some(c => c.brand === camera.brand && c.model === camera.model) : false;

    const initialModels = CAMERA_MODELS[currentBrand] || [];

    Modal.open({
      title: isEdit ? 'Editar cámara' : 'Nueva cámara',
      body: `
        <div class="form-group">
          <label>Marca</label>
          <select id="cam-brand-select" onchange="Cameras.onBrandChange('', '')">
            ${CAMERA_BRANDS.map(b => `<option value="${b}" ${currentBrand === b ? 'selected' : ''}>${b}</option>`).join('')}
            <option value="__otro__" ${isCustomBrand ? 'selected' : ''}>Otra…</option>
          </select>
          <div id="cam-brand-custom-wrap" class="${isCustomBrand ? '' : 'hidden'}" style="margin-top:.4rem">
            <input id="cam-brand-custom" value="${isCustomBrand ? camera.brand : ''}" placeholder="Escribe la marca…">
          </div>
        </div>
        <div class="form-group">
          <label>Modelo</label>
          <select id="cam-model-select" onchange="Cameras.onModelChange()">
            ${initialModels.map(c =>
              `<option value="${c.model}" data-format="${c.format}" data-type="${c.type}"
                ${currentModel === c.model ? 'selected' : ''}>${c.model}</option>`
            ).join('')}
            <option value="__otro__" ${isCustomModel ? 'selected' : ''}>Otro…</option>
          </select>
          <div id="cam-model-custom-wrap" class="${isCustomModel ? '' : 'hidden'}" style="margin-top:.4rem">
            <input id="cam-model-custom" value="${isCustomModel ? camera.model : ''}" placeholder="Escribe el modelo…">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Formato</label>
            <select id="cam-format">
              <option value="35mm"   ${camera?.format === '35mm'   ? 'selected' : ''}>35mm</option>
              <option value="120"    ${camera?.format === '120'    ? 'selected' : ''}>120</option>
              <option value="Super8" ${camera?.format === 'Super8' ? 'selected' : ''}>Super 8</option>
            </select>
          </div>
          <div class="form-group">
            <label>Tipo</label>
            <select id="cam-type">
              ${['p&s','SLR','TLR','Rangefinder'].map(t =>
                `<option value="${t}" ${camera?.type === t ? 'selected' : ''}>${t}</option>`
              ).join('')}
            </select>
          </div>
        </div>`,
      onSave: async () => {
        const brandSel = document.getElementById('cam-brand-select').value;
        const modelSel = document.getElementById('cam-model-select').value;
        const brand = brandSel === '__otro__'
          ? document.getElementById('cam-brand-custom').value.trim()
          : brandSel;
        const model = modelSel === '__otro__'
          ? document.getElementById('cam-model-custom').value.trim()
          : modelSel;
        const form = {
          id: camera?.id,
          brand,
          model,
          format: document.getElementById('cam-format').value,
          type:   document.getElementById('cam-type').value,
        };
        if (!form.brand || !form.model) { Toast.show('Rellena todos los campos', 'error'); return false; }
        await save(form);
        Toast.show(isEdit ? 'Cámara actualizada' : 'Cámara añadida', 'success');
        await render();
        return true;
      }
    });
    // Auto-fill format/type for initial selection
    setTimeout(() => onModelChange(), 0);
  }

  function openEdit(id) {
    const camera = cameras.find(c => c.id === id);
    if (camera) openModal(camera);
  }

  function confirmDelete(id) {
    const cam = cameras.find(c => c.id === id);
    if (!cam) return;
    Modal.open({
      title: 'Eliminar cámara',
      body: `<p>¿Eliminar <strong>${cam.brand} ${cam.model}</strong>? Los rollos asociados quedarán sin cámara asignada.</p>`,
      saveLabel: 'Eliminar',
      saveDanger: true,
      onSave: async () => {
        await remove(id);
        Toast.show('Cámara eliminada', 'success');
        await render();
        return true;
      }
    });
  }

  function bindUI() {
    document.getElementById('btn-add-camera')?.addEventListener('click', () => openModal());
    document.getElementById('btn-seed-cameras')?.addEventListener('click', () => seedDefaults());
  }

  return { load, getAll, render, openModal, openEdit, confirmDelete, bindUI, seedDefaults, onBrandChange, onModelChange };
})();
