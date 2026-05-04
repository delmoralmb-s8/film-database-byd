// ============================================================
// Lenses CRUD
// ============================================================

const Lenses = (() => {
  let lenses = [];

  const DEFAULT_LENSES = [
    { brand: 'Genérico', focal_length: '8mm',   max_aperture: '' },
    { brand: 'Genérico', focal_length: '14mm',  max_aperture: '' },
    { brand: 'Genérico', focal_length: '24mm',  max_aperture: '' },
    { brand: 'Genérico', focal_length: '28mm',  max_aperture: '' },
    { brand: 'Genérico', focal_length: '35mm',  max_aperture: '' },
    { brand: 'Genérico', focal_length: '50mm',  max_aperture: '' },
    { brand: 'Genérico', focal_length: '70mm',  max_aperture: '' },
    { brand: 'Genérico', focal_length: '85mm',  max_aperture: '' },
    { brand: 'Genérico', focal_length: '100mm', max_aperture: '' },
    { brand: 'Genérico', focal_length: '200mm', max_aperture: '' },
    { brand: 'Nikkor',   focal_length: '50mm f/1.4 AI-s',    max_aperture: '1.4' },
    { brand: 'Nikkor',   focal_length: '50mm f/1.8 AI-s',    max_aperture: '1.8' },
    { brand: 'Nikkor',   focal_length: '55mm f/2.8 Micro',   max_aperture: '2.8' },
    { brand: 'Nikkor',   focal_length: '28mm f/2.8 AI-s',    max_aperture: '2.8' },
    { brand: 'Nikkor',   focal_length: '105mm f/2.5',        max_aperture: '2.5' },
    { brand: 'Nikkor',   focal_length: '35mm f/2 AI-s',      max_aperture: '2'   },
    { brand: 'Nikkor',   focal_length: '85mm f/2 AI-s',      max_aperture: '2'   },
    { brand: 'Canon FD', focal_length: '50mm f/1.2 L',       max_aperture: '1.2' },
    { brand: 'Canon FD', focal_length: '50mm f/1.4',         max_aperture: '1.4' },
    { brand: 'Canon FD', focal_length: '50mm f/1.8',         max_aperture: '1.8' },
    { brand: 'Canon FD', focal_length: '28mm f/2.8',         max_aperture: '2.8' },
    { brand: 'Canon FD', focal_length: '85mm f/1.8',         max_aperture: '1.8' },
    { brand: 'Canon FD', focal_length: '100mm f/4 Macro',    max_aperture: '4'   },
    { brand: 'Canon FD', focal_length: '35-70mm f/4',        max_aperture: '4'   },
    { brand: 'Canon FD', focal_length: '35-105mm f/3.5',     max_aperture: '3.5' },
  ];

  async function load() {
    const { data, error } = await supabase
      .from('lenses')
      .select('*')
      .order('brand');
    if (error) { Toast.show(error.message, 'error'); return []; }
    lenses = data;
    if (!lenses.length) await seedDefaults();
    return lenses;
  }

  async function seedDefaults() {
    const user = Auth.getUser();
    if (!user) return;
    const missing = DEFAULT_LENSES.filter(d =>
      !lenses.some(l => l.brand === d.brand && l.focal_length === d.focal_length)
    );
    if (!missing.length) { Toast.show(I18n.t('toast_lenses_all_added'), 'success'); return; }
    const rows = missing.map(l => ({ ...l, user_id: user.id }));
    const { data, error } = await supabase.from('lenses').insert(rows).select();
    if (error) { Toast.show(error.message, 'error'); return; }
    lenses = [...lenses, ...data];
    Toast.show(I18n.t('toast_lenses_imported', { n: data.length }), 'success');
    await render();
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
    const wrapper = document.querySelector('#gear-lenses .table-wrapper');
    if (!wrapper) return;

    if (!lenses.length) {
      wrapper.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🔭</div>
          <p>${I18n.t('empty_lenses')}</p>
        </div>`;
      return;
    }

    wrapper.innerHTML = `
      <table>
        <thead><tr>
          <th>${I18n.t('lens_th_brand')}</th>
          <th>${I18n.t('lens_th_lens')}</th>
          <th></th>
        </tr></thead>
        <tbody>
          ${lenses.map(l => `
            <tr>
              <td>${l.brand}</td>
              <td>${l.focal_length}</td>
              <td></td>
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
      title: isEdit ? I18n.t('lens_form_edit_title') : I18n.t('lens_form_new_title'),
      body: `
        <div class="form-group">
          <label>${I18n.t('lens_th_brand')}</label>
          <input id="lens-brand" value="${lens?.brand ?? ''}" placeholder="${I18n.t('lens_form_brand_ph')}" required>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>${I18n.t('lens_form_focal')}</label>
            <input id="lens-focal" value="${lens?.focal_length ?? ''}" placeholder="${I18n.t('lens_form_focal_ph')}">
          </div>
          <div class="form-group">
            <label>${I18n.t('lens_form_aperture')}</label>
            <input id="lens-aperture" value="${lens?.max_aperture ?? ''}" placeholder="${I18n.t('lens_form_aperture_ph')}">
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
          Toast.show(I18n.t('toast_fill_fields'), 'error'); return false;
        }
        await save(form);
        Toast.show(isEdit ? I18n.t('toast_lens_updated') : I18n.t('toast_lens_added'), 'success');
        await render();
        await Films.load();
        if (document.getElementById('stats-view')?.classList.contains('active')) Stats.render();
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
      title: I18n.t('delete_lens_title'),
      body: `<p>${I18n.t('delete_lens_q', { name: `${lens.brand} ${lens.focal_length}` })}</p>`,
      saveLabel: I18n.t('modal_delete'),
      saveDanger: true,
      onSave: async () => {
        await remove(id);
        Toast.show(I18n.t('toast_lens_deleted'), 'success');
        await render();
        await Films.load();
        if (document.getElementById('stats-view')?.classList.contains('active')) Stats.render();
        return true;
      }
    });
  }

  function bindUI() {
    document.getElementById('btn-add-lens')?.addEventListener('click', () => openModal());
    document.getElementById('btn-seed-lenses')?.addEventListener('click', () => seedDefaults());
  }

  return { load, getAll, render, openModal, openEdit, confirmDelete, bindUI, seedDefaults };
})();
