// ============================================================
// Toast
// ============================================================

const Toast = (() => {
  function show(msg, type = 'success') {
    const container = document.getElementById('toast-container');
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.textContent = msg;
    container.appendChild(el);
    setTimeout(() => el.remove(), 3500);
  }
  return { show };
})();

// ============================================================
// Modal
// ============================================================

const Modal = (() => {
  let onSaveCallback = null;

  function open({ title, body, onSave, saveLabel = 'Guardar', saveDanger = false, wide = false }) {
    onSaveCallback = onSave;
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = body;
    const saveBtn = document.getElementById('modal-save');
    saveBtn.textContent = saveLabel;
    saveBtn.className = `btn ${saveDanger ? 'btn-danger' : 'btn-primary'}`;
    const modal = document.querySelector('.modal');
    modal.style.maxWidth = wide ? '680px' : '580px';
    document.getElementById('modal-overlay').classList.add('open');
  }

  function close() {
    document.getElementById('modal-overlay').classList.remove('open');
    onSaveCallback = null;
  }

  function bindUI() {
    document.getElementById('modal-close').addEventListener('click', close);
    document.getElementById('modal-cancel').addEventListener('click', close);
    document.getElementById('modal-overlay').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) close();
    });
    document.getElementById('modal-save').addEventListener('click', async () => {
      if (!onSaveCallback) return;
      try {
        const result = await onSaveCallback();
        if (result !== false) close();
      } catch (err) {
        Toast.show(err.message, 'error');
      }
    });
  }

  return { open, close, bindUI };
})();

// ============================================================
// Router / Navigation
// ============================================================

const App = (() => {
  const views = ['dashboard', 'gear', 'films', 'film-detail', 'timeline'];
  let currentView = 'dashboard';

  function navigate(view) {
    currentView = view;
    views.forEach(v => {
      document.getElementById(`${v}-view`).classList.toggle('active', v === view);
    });
    const navView = view === 'film-detail' ? 'dashboard' : view;
    document.querySelectorAll('.nav-link, .bottom-nav-item[data-view]').forEach(link => {
      link.classList.toggle('active', link.dataset.view === navView);
    });
    document.getElementById('page-title').textContent = {
      dashboard:     'Panel de control',
      gear:          'Gear',
      films:         'Rollos',
      'film-detail': 'Detalle del rollo',
      timeline:      'Línea de tiempo',
    }[view] || view;

    // Close mobile sidebar
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebar-backdrop').classList.remove('open');

    // Render the active view
    switch (view) {
      case 'dashboard':   Dashboard.render();  break;
      case 'gear':        Cameras.render(); Lenses.render(); break;
      case 'films':       Films.render();      break;
      case 'film-detail': FilmDetail.render(); break;
      case 'timeline':    Timeline.render();   break;
    }
  }

  function bindGearTabs() {
    document.querySelectorAll('.gear-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.gear;
        document.querySelectorAll('.gear-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.gear-panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(`gear-${target}`).classList.add('active');
      });
    });
  }

  async function init() {
    // Load all data upfront for dropdowns
    await Promise.all([Cameras.load(), Lenses.load(), Films.load()]);
    navigate('dashboard');
  }

  function bindUI() {
    document.querySelectorAll('.nav-link, .bottom-nav-item[data-view]').forEach(link => {
      link.addEventListener('click', () => navigate(link.dataset.view));
    });

    // Hamburger menu (mobile)
    document.getElementById('hamburger').addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('open');
      document.getElementById('sidebar-backdrop').classList.toggle('open');
    });
    document.getElementById('sidebar-backdrop').addEventListener('click', () => {
      document.getElementById('sidebar').classList.remove('open');
      document.getElementById('sidebar-backdrop').classList.remove('open');
    });
  }

  return { init, navigate, bindUI, bindGearTabs };
})();

// ============================================================
// Theme
// ============================================================

const Theme = (() => {
  function apply(dark) {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    document.getElementById('theme-label').textContent = dark ? 'Modo claro' : 'Modo oscuro';
    document.getElementById('theme-icon').textContent  = dark ? '☀️' : '🌙';
  }

  function init() {
    const saved = localStorage.getItem('theme');
    apply(saved === 'dark');
  }

  function toggle() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
    apply(!isDark);
  }

  function bindUI() {
    document.getElementById('btn-theme').addEventListener('click', toggle);
  }

  return { init, bindUI };
})();

// ============================================================
// Bootstrap
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  Theme.init();
  Theme.bindUI();
  Modal.bindUI();
  App.bindUI();
  App.bindGearTabs();
  Cameras.bindUI();
  Lenses.bindUI();
  Films.bindUI();
  Auth.bindUI();
  Auth.init();
});
