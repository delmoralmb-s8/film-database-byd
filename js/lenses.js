// ============================================================
// Lenses CRUD
// ============================================================

const Lenses = (() => {
  let lenses = [];

  async function load() {
    const { data, error } = await supabase
      .from('lenses')
      .select('*')
      .order('brand');
    if (error) { Toast.show(error.message, 'error'); return []; }
    lenses = data;
    return lenses;
  }

  function getAll() { return lenses; }

  async function save(form) {
    const user = Auth.getUser();
    const payload = {
      user_id: user.id,
      brand: form.brand,
      focal_length: form.focal_length,
      max_aperture: form.max_aperture,
    };
    if (form.id) {
      const { error } = await supabase.from('lenses').update(payload).eq('id', form.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('lenses').insert(payload);
      if (error) throw error;
    }
  }

  async function remove(id) {
    const { error } = await supabase.from('lenses').delete().eq('id', id);
    if (error) throw error;
    lenses = lenses.filter(l => l.id !== id);
  }

  async function render() {
    await load();
    const wrapper = document.querySelector('#lenses-view .table-wrapper');
    if (!wrapper) return;

    if (!lenses.length) {
      wrapper.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🔭</div>
          <p>No tienes lentes registradas aún.</p>
        </div>`;
      return;
    }

    wrapper.innerHTML = `
      <table>
        <thead><tr>
          <th>Marca</th><th>Focal</th><th>Apertura máx.</th><th></th>
        </tr></thead>
        <tbody>
          ${lenses.map(l => `
            <tr>
              <td>${l.brand}</td>
              <td>${l.focal_length}</td>
              <td>f/${l.max_aperture}</td>
              <td>
                <div class="actions">
                  <button class="btn btn-ghost btn-sm btn-icon" onclick="Lenses.openEdit('${l.id}')">✏️</button>
                  <button class="btn btn-danger btn-sm btn-icon" onclick="Lenses.confirmDelete('${l.id}')">🗑</button>
                </div>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>`;
  }

  function openModal(lens = null) {
    const isEdit = !!lens;
    Modal.open({
      title: isEdit ? 'Editar lente' : 'Nueva lente',
      body: `
        <div class="form-group">
          <label>Marca</label>
          <input id="lens-brand" value="${lens?.brand ?? ''}" placeholder="Ej. Canon, Nikkor, Leica…" required>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Distancia focal (mm)</label>
            <input id="lens-focal" value="${lens?.focal_length ?? ''}" placeholder="Ej. 50, 28-70…">
          </div>
          <div class="form-group">
            <label>Apertura máxima</label>
            <input id="lens-aperture" value="${lens?.max_aperture ?? ''}" placeholder="Ej. 1.8, 2.8…">
          </div>
        </div>`,
      onSave: async () => {
        const form = {
          id: lens?.id,
          brand: document.getElementById('lens-brand').value.trim(),
          focal_length: document.getElementById('lens-focal').value.trim(),
          max_aperture: document.getElementById('lens-aperture').value.trim(),
        };
        if (!form.brand || !form.focal_length || !form.max_aperture) {
          Toast.show('Rellena todos los campos', 'error'); return false;
        }
        await save(form);
        Toast.show(isEdit ? 'Lente actualizada' : 'Lente añadida', 'success');
        await render();
        return true;
      }
    });
  }

  function openEdit(id) {
    const lens = lenses.find(l => l.id === id);
    if (lens) openModal(lens);
  }

  function confirmDelete(id) {
    const lens = lenses.find(l => l.id === id);
    if (!lens) return;
    Modal.open({
      title: 'Eliminar lente',
      body: `<p>¿Eliminar <strong>${lens.brand} ${lens.focal_length}mm</strong>? Los rollos asociados quedarán sin lente asignada.</p>`,
      saveLabel: 'Eliminar',
      saveDanger: true,
      onSave: async () => {
        await remove(id);
        Toast.show('Lente eliminada', 'success');
        await render();
        return true;
      }
    });
  }

  function bindUI() {
    document.getElementById('btn-add-lens')?.addEventListener('click', () => openModal());
  }

  return { load, getAll, render, openModal, openEdit, confirmDelete, bindUI };
})();
