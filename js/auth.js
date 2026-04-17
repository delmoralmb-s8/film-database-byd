// ============================================================
// Auth — login, register, logout, session
// ============================================================

const Auth = (() => {
  let currentUser = null;

  function getUser() { return currentUser; }

  async function init() {
    const { data: { session } } = await supabase.auth.getSession();
    currentUser = session?.user ?? null;

    supabase.auth.onAuthStateChange((_event, session) => {
      currentUser = session?.user ?? null;
      if (currentUser) {
        showApp();
      } else {
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
    App.init();
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
    await supabase.auth.signOut();
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
