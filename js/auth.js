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
      if (event === 'SIGNED_IN') {
        // Si el usuario acaba de confirmar su correo, viene sin sesión activa previa
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
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    // Retorna true si se requiere confirmación de email (session === null)
    return !data.session;
  }

  async function changePassword(newPassword) {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
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
        const needsConfirmation = await register(email, pass);
        if (needsConfirmation) {
          // Mostrar pantalla de "revisa tu email"
          document.getElementById('auth-screen').innerHTML = `
            <div class="auth-card" style="text-align:center">
              <div class="auth-logo">
                <h1>&#128253; &#127902; Film Database</h1>
              </div>
              <div style="font-size:3rem;margin:1rem 0">&#128140;</div>
              <h2 style="margin-bottom:.5rem">Revisa tu correo</h2>
              <p style="color:var(--text-muted);margin-bottom:1.5rem">
                Te enviamos un enlace de confirmación a <strong>${email}</strong>.<br>
                Haz clic en el link del correo para activar tu cuenta.
              </p>
              <button class="btn btn-ghost btn-sm" onclick="location.reload()">
                Ya confirmé, ir al inicio de sesión
              </button>
            </div>`;
        } else {
          // Supabase no requiere confirmación (auto-confirm activo)
          Toast.show('Cuenta creada exitosamente.', 'success');
        }
      } catch (err) {
        errEl.textContent = err.message;
        errEl.classList.remove('hidden');
      }
    });

    // Logout button
    document.getElementById('btn-logout').addEventListener('click', () => logout());

    // Change password button
    document.getElementById('btn-change-pass').addEventListener('click', () => {
      document.getElementById('modal-change-pass').classList.add('open');
      document.getElementById('new-pass').value = '';
      document.getElementById('new-pass2').value = '';
      document.getElementById('change-pass-error').classList.add('hidden');
    });

    document.getElementById('modal-change-pass').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) e.currentTarget.classList.remove('open');
    });

    document.getElementById('form-change-pass').addEventListener('submit', async (e) => {
      e.preventDefault();
      const newPass  = document.getElementById('new-pass').value;
      const newPass2 = document.getElementById('new-pass2').value;
      const errEl    = document.getElementById('change-pass-error');
      errEl.classList.add('hidden');
      if (newPass !== newPass2) {
        errEl.textContent = 'Las contraseñas no coinciden.';
        errEl.classList.remove('hidden');
        return;
      }
      if (newPass.length < 6) {
        errEl.textContent = 'La contraseña debe tener al menos 6 caracteres.';
        errEl.classList.remove('hidden');
        return;
      }
      try {
        await changePassword(newPass);
        document.getElementById('modal-change-pass').classList.remove('open');
        Toast.show('Contraseña actualizada correctamente.', 'success');
      } catch (err) {
        errEl.textContent = err.message;
        errEl.classList.remove('hidden');
      }
    });
  }

  return { init, getUser, bindUI, changePassword };
})();
