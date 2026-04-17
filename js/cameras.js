// ============================================================
// Cameras CRUD
// ============================================================

const Cameras = (() => {
  let cameras = [];

  async function load() {
    const { data, error } = await supabase
      .from('cameras')
      .select('*')
      .order('brand');
    if (error) { Toast.show(error.message, 'error'); return []; }
    cameras = data;
    return cameras;
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
    Modal.open({
      title: isEdit ? 'Editar cámara' : 'Nueva cámara',
      body: `
        <div class="form-group">
          <label>Marca</label>
          <input id="cam-brand" value="${camera?.brand ?? ''}" placeholder="Ej. Canon, Nikon, Olympus…" required>
        </div>
        <div class="form-group">
          <label>Modelo</label>
          <input id="cam-model" value="${camera?.model ?? ''}" placeholder="Ej. AE-1, FM2, OM-1…" required>
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
        const form = {
          id: camera?.id,
          brand: document.getElementById('cam-brand').value.trim(),
          model: document.getElementById('cam-model').value.trim(),
          format: document.getElementById('cam-format').value,
          type: document.getElementById('cam-type').value,
        };
        if (!form.brand || !form.model) { Toast.show('Rellena todos los campos', 'error'); return false; }
        await save(form);
        Toast.show(isEdit ? 'Cámara actualizada' : 'Cámara añadida', 'success');
        await render();
        return true;
      }
    });
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
  }

  return { load, getAll, render, openModal, openEdit, confirmDelete, bindUI };
})();
