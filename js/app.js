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

  function open({ title, body, onSave, saveLabel = null, saveDanger = false, wide = false }) {
    onSaveCallback = onSave;
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = body;
    const saveBtn = document.getElementById('modal-save');
    saveBtn.textContent = saveLabel ?? I18n.t('modal_save');
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
  const views = ['dashboard', 'gear', 'films', 'film-detail', 'timeline', 'stats'];
  let currentView = 'dashboard';

  function viewTitles() {
    return {
      dashboard:     I18n.t('page_dashboard'),
      gear:          I18n.t('page_gear'),
      films:         I18n.t('page_rolls'),
      'film-detail': I18n.t('page_film_detail'),
      timeline:      I18n.t('page_timeline'),
      stats:         I18n.t('page_stats'),
    };
  }

  function updateDocumentTitle(view) {
    const title = viewTitles()[view] || view;
    document.title = title ? `${title} | Film Database` : 'Film Database';
  }

  function navigate(view) {
    currentView = view;
    sessionStorage.setItem('lastView', view);
    views.forEach(v => {
      document.getElementById(`${v}-view`).classList.toggle('active', v === view);
    });
    const navView = view === 'film-detail' ? 'dashboard' : view;
    document.querySelectorAll('.nav-link, .bottom-nav-item[data-view]').forEach(link => {
      link.classList.toggle('active', link.dataset.view === navView);
    });
    const titles = viewTitles();
    document.getElementById('page-title').textContent = titles[view] || view;
    updateDocumentTitle(view);

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
      case 'stats':       Stats.render();      break;
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
    const savedView = sessionStorage.getItem('lastView') || 'dashboard';
    navigate(savedView);
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

    const mobileSearch = document.getElementById('mobile-search-trigger');
    if (mobileSearch) mobileSearch.addEventListener('click', () => navigate('films'));
  }

  return { init, navigate, bindUI, bindGearTabs };
})();

// ============================================================
// Theme
// ============================================================

const Theme = (() => {
  function apply(dark) {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    document.getElementById('theme-label').textContent = dark ? I18n.t('theme_light') : I18n.t('theme_dark');
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

  function refresh() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    apply(isDark);
  }

  return { init, bindUI, refresh };
})();

// ============================================================
// Bootstrap
// ============================================================

function bootstrapApp() {
  I18n.init();
  I18n.apply();
  document.title = `${I18n.t('page_auth')} | Film Database`;
  // Mark active lang button on load
  const currentLang = I18n.getLang();
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === currentLang);
  });

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

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrapApp);
} else {
  bootstrapApp();
}
