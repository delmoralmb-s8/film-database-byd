// ============================================================
// Auth — login, register, logout, session
// ============================================================

const Auth = (() => {
  let currentUser = null;

  function getUser() { return currentUser; }

  async function init() {
    const { data: { session } } = await supabase.auth.getSession();
    currentUser = session?.user ?? null;

    supabase.auth.onAuthStateChange((event, session) => {
      currentUser = session?.user ?? null;
      // Solo reaccionar a login/logout real; TOKEN_REFRESHED y USER_UPDATED
      // no deben reiniciar la app ni redirigir al dashboard.
      if (event === 'SIGNED_IN') {
        showApp();
      } else if (event === 'SIGNED_OUT') {
        showAuth();
      }
    });

    if (currentUser) showApp(); else showAuth();
  }

  function showAuth() {
    document.getElementById('auth-screen').classList.remove('hidden');
    document.getElementById('app-screen').classList.add('hidden');
  }

  function showApp() {
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('app-screen').classList.remove('hidden');
    document.getElementById('user-email').textContent = currentUser.email;
    logAccess(currentUser);
    App.init();
  }

  async function logAccess(user) {
    if (sessionStorage.getItem('access_logged')) return;

    let alias = localStorage.getItem('user_alias');
    if (!alias) {
      alias = user.email.split('@')[0];
      localStorage.setItem('user_alias', alias);
    }

    let location = null;
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      location = data.ip;
    } catch (_) {}

    try {
      await supabase.from('logs').insert({
        alias,
        user_agent: navigator.userAgent,
        location,
      });
      sessionStorage.setItem('access_logged', '1');
    } catch (_) {}
  }

  async function login(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async function register(email, password) {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  }

  async function logout() {
    try { await supabase.auth.signOut(); } catch (_) {}
    window.location.reload();
  }

  function bindUI() {
    // Tab switching
    document.querySelectorAll('.auth-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        document.querySelectorAll('.auth-form').forEach(f => f.classList.add('hidden'));
        document.getElementById(`form-${target}`).classList.remove('hidden');
      });
    });

    // Login form
    document.getElementById('form-login').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const pass  = document.getElementById('login-pass').value;
      const errEl = document.getElementById('login-error');
      errEl.classList.add('hidden');
      try {
        await login(email, pass);
      } catch (err) {
        errEl.textContent = err.message;
        errEl.classList.remove('hidden');
      }
    });

    // Register form
    document.getElementById('form-register').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('reg-email').value.trim();
      const pass  = document.getElementById('reg-pass').value;
      const pass2 = document.getElementById('reg-pass2').value;
      const errEl = document.getElementById('reg-error');
      errEl.classList.add('hidden');
      if (pass !== pass2) {
        errEl.textContent = 'Las contraseñas no coinciden.';
        errEl.classList.remove('hidden');
        return;
      }
      try {
        await register(email, pass);
        Toast.show('Cuenta creada. Revisa tu email para confirmarla.', 'success');
        document.getElementById('form-login').querySelector('[data-tab="login"]');
      } catch (err) {
        errEl.textContent = err.message;
        errEl.classList.remove('hidden');
      }
    });

    // Logout button
    document.getElementById('btn-logout').addEventListener('click', () => logout());
  }

  return { init, getUser, bindUI };
})();
