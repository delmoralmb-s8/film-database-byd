## Film Database — Contexto del proyecto

## 📌 Descripción
App para registrar y organizar rollos de 135, 120 y Super 8

### Stack
- Frontend: HTML + CSS + JS puro → GitHub Pages
- Backend: Supabase (auth + DB con RLS)
- URL: https://delmoralmb-s8.github.io/film-database-byd
- Repo: https://github.com/delmoralmb-s8/film-database-byd

### Archivos
FILM-DATABASE/
├── index.html
├── css/styles.css
├── js/config.js, auth.js, cameras.js, lenses.js, films.js, dashboard.js, app.js
└── sql/schema.sql

### Supabase
- URL: https://baapcdepyieanqdcrlbo.supabase.co
- Tablas: cameras, lenses, films (todas con RLS por user_id)
- Formatos: 35mm, 120, Super8
- Estados rollo: en_camara, en_revelado, finalizado, escaneado

### Funciones implementadas
- Auth: registro/login/logout
- CRUD: cámaras, lentes, rollos
- Dashboard con stats y rollos agrupados por estado
- Tema claro/oscuro con localStorage
- Bottom nav móvil
- Formulario de rollo: dropdown de emulsiones (~130 stocks), 
  defaults: Nikon F3 + Nikkor 50mm + fecha hoy + Mexico/CDMX,
  Super8 restringe marca a Kodak/Orwo, ISO oculto (en DB)
  Aquí el resumen para tu `.md`:
## Cambios recientes — Film Database

  ### UI / Rediseño (sesión actual)
  - **Fuente DM Sans**: reemplaza Inter — más redonda y con carácter propio (URL ligera, 940 bytes, sin ejes variables)
  - **Módulo Gear**: Cámaras y Lentes fusionados en una sola sección con tabs internos (⚙️ Gear en sidebar y bottom nav)
  - **Bottom nav pill (mobile)**: ítem activo = pastilla verde con icono + nombre; inactivos = solo icono
  - **Hero banner mobile**: tarjeta verde al tope del dashboard con "TU COLECCIÓN / Film Database"
  - **Search bar mobile**: pill decorativo que navega a Rollos al tocarlo
  - **Stat cards mobile**: scroll horizontal en vez de grid 2×3
  - **Section titles mobile**: más grandes, bold, sin uppercase
  - **Film cards mobile**: 2 columnas en dashboard
  - **Filtros mobile**: scroll horizontal sin wrap
  - **Fix crítico**: URL de Google Fonts con ejes variables (`opsz,ital`) generaba 14KB render-blocking → simplificada a 940 bytes

  ### Funcionalidad
  - **Eliminar rollo**: botón 🗑 en tabla de rollos con confirmación "¿Estás seguro que quieres eliminar tu rollo :O ?"
  - **Columna Notas**: aparece en la tabla solo si algún rollo tiene texto en notas
  - **Importar catálogo al crear rollo**: si el usuario no tiene cámaras, el select muestra opción para importar catálogo de cámaras + lentes automáticamente
  - **Tipos de foto nuevos**: "Familia", "Amigos", "De chile, mole y pozole", "de mi ex :("
  - **Fujifilm**: Fuji 100 y Fuji 200 al inicio de la lista de emulsiones
  - **Formato 120**: al seleccionarlo, Nº de fotos se auto-establece en 12
  - **"Por escanear"**: renombrado en todo el proyecto (badge, filtro, dashboard, stat card)
  - **Logout fix**: JWT expirado ya no bloquea el cierre de sesión — siempre recarga
  - **Sistema de logs**: tabla `logs` en Supabase registra alias, user_agent e IP por cada acceso

  ### CSS / UI
  - **Modo oscuro**: paleta verde-fría por capas (`#0f1a17` → `#162320` → `#1d2e28`), sin negro puro ni tinte azul
  - **Modo claro**: tono hueso (`#ede8df` base, `#f7f3ec` superficies)
  - **Transiciones**: `cubic-bezier(0.4, 0, 0.2, 1)` en todo
  - **Headings**: `letter-spacing: -0.025em`
  - **Botones**: `scale(0.97)` en `:active`, focus ring verde
  ## Imágenes añadidas (33 stocks)

 - Corregidos 3 nombres: velvia-100f → velvia-100, ultramax copia → ultramax-400, borrado duplicado de Ektachrome stocksMeta.js — nuevos colores de chip
- Kodak: Vision3 200T, Ektachrome (S8), Tri-X Reversal, Kodacolor 100/200
  - Lucky Lucky 200, SantaColor 100/800
  - Orwo completo: Wolfenc NC 200/400/500, UN54, NP100 + stocks Super8 (Vision3, Ektachrome, Tri-X Reversal)
  - README.md imgs/stock/README.md

  - Añadidas secciones: Kentmere, Lucky, SantaColor, Super8 Kodak, Super8 Orwo, Orwo 35mm
  - films.js — dropdown Nº fotos

  - Al seleccionar Super8: opciones cambian a 9 fps / 18 fps / 24 fps
  - Al cambiar a otro formato: vuelve a 12 / 24 / 36
  - 120 sigue autoseleccionando 12
  
  ### Formulario nuevo rollo
  - Opción "¿Tu cámara es única?" en select Cámara → abre inputs inline marca/modelo y la guarda al vuelo
  - Tipo Color: oculta Rollei, Fomapan, Ilford, Washi, Kentmere, Ferrania(s)
  - Tipo B&W: Ilford primero, oculta Revolog, Dubblefilm, Kono, SantaColor, Svema
  - Tipo Slide: solo Kodak, Fujifilm, Otra
  - Kodak/Fujifilm filtran emulsiones según tipo (Color/B&W/Slide)
  - Super8+Kodak+Color → Vision3 50D/200T/500T | B&W → Tri-X Reversal | Slide → Ektachrome
  - Super8+Orwo → NC 200, UN54
  - Nº fotos: 35mm=14/24/36 | 120=4/6/12 | Super8=9/18/24fps (default 36 en 35mm, 12 en 120)
  - ISO Super8: lookup explícito (Vision3 500T→500, 200T→200, 50D→50, Ektachrome→100, Tri-X Reversal→200) — la regex no matchea números pegados a letras (500T)
  - Pre-llenado: al abrir "Nuevo rollo" en la misma sesión, el formulario se rellena con los datos del último rollo agregado (lastRoll); solo se guarda en INSERT, no en edición
  - Stock chip en columna Rollo de la tabla (igual que dashboard)

  ### Dashboard
  - "En revelado" → "Por revelar" en todo el proyecto
  - Nueva sección Por revelar en Panel: En cámara → Por revelar → Por escanear → Finalizados
  - Stat Cámaras/Lentes: cuenta solo las que tienen rollos asociados

  ### Lentes
  - 10 lentes Genérico al inicio del catálogo: 8mm al 200mm

  ### Tabla Rollos
  - Columna Inicio eliminada, solo queda Fin

  ### DB (Supabase — requiere SQL manual)
  - films.format: añadido 'Super8'
  - films.num_photos: añadidos '9','18','4','6','14'
  - cameras.format: añadido 'Super8'
_
### Módulo Estadísticas (`js/stats.js`)

Nuevo módulo en sidebar (abajo de Línea de tiempo). 7 secciones:

1. **Hero** — Total rollos · Fotos estimadas · Minutos rodados Super8 (por fps: 9→6m40s, 18→3m20s, 24→2m30s) · Años activo · Formatos usados
2. **ADN fílmico** — Tipo dominante con barra Color/B&N/Slide · Emulsión #1 con chip grande · Cámara principal
3. **Actividad por año** — Barras apiladas por formato (35mm verde / 120 violeta `#7c3aed` / Super8 ámbar `#b45309`), indicador de tendencia entre años (↑↓=), tooltip al hover, panel expandible al clic con heatmap mensual + distribución tipo + top emulsión del año
4. **Rankings dobles** — Top 5 emulsiones con chip + barra de progreso · Top 5 cámaras
5. **Distribución** — Formatos · Labs · Ciudades (barras horizontales proporcionales)
6. **Tipos de foto** — Con iconos emoji, barras proporcionales
7. **Sugerencia inteligente** — Lógica rule-based sin API: cruza tipo dominante, marca favorita, ISO promedio, formato principal y ciudad para generar 2-3 sugerencias con chip visual

**Bug fix clave:** `dateOf` usa `start_date || end_date` (cuándo disparaste, no cuándo revelaste)

**Reactividad:** Stats se recalculan automáticamente al guardar/editar/eliminar rollos, cámaras o lentes si la vista está activa (`Films.load()` + `Stats.render()` en todos los callbacks de save/remove de `films.js`, `cameras.js`, `lenses.js`)

**Mobile:** 2 hero-cards por fila · secciones en columna única · gráfico de años compacto (CHART_H=85px) · panel de detalle en columna · sin tooltips (táctil)

### Modo Rápido (`films.js`)
- `openModal()` es ahora dispatcher: nuevo rollo → Quick Mode, edición → Advanced Mode
- Quick Mode muestra solo 4 campos: Formato, Marca+Emulsión (10 marcas), Cámara (opcional), Notas
- Defaults automáticos al guardar: `num_photos` (36/12/18fps), `lens_id` Genérico 28mm, `current_status` en_camara, `start_date` hoy, ISO resuelto del nombre de emulsión, tipo (Color/B&N/Slide) inferido
- Cámara inline: si el usuario escribe una nueva, se inserta en `cameras` y se usa el `id` devuelto
- Botón "Modo avanzado →" en el header del modal reemplaza el body sin cerrar el modal (`switchToAdvanced()`)

### Áreas de mejora pendientes
- Exportar CSV
- Validación fechas (fin < inicio)
- Sin confirmación al cerrar modal con cambios
- PWA / offline

---

### Sistema bilingüe ES/EN (commits cafab86 → 8f481db)

Soporte completo de internacionalización. 1 archivo nuevo, 11 modificados.

**Regla:** nunca hardcodear strings — usar `I18n.t('clave')` en JS y `data-i18n="clave"` en HTML estático.

#### Archivo nuevo: `js/i18n.js`
- IIFE con ~200 claves de traducción en `_T.es` y `_T.en`
- `t(key, vars)` — traduce con interpolación `{var}`
- `setLang(lang)` — guarda en localStorage, actualiza DOM, re-renderiza vista activa
- `apply()` — actualiza `[data-i18n]`, `[data-i18n-placeholder]`, `[data-i18n-aria]`
- `init()` — lee idioma de localStorage al cargar
- Debe cargarse **antes** que todos los demás JS

#### Patrones clave
```js
// Texto dinámico en JS
`<button>${I18n.t('modal_save')}</button>`

// Plural
`${n} ${n !== 1 ? I18n.t('stats_roll_n') : I18n.t('stats_roll_1')}`

// Interpolación
I18n.t('toast_cameras_imported', { n: data.length })

// Arrays (meses)
const months = I18n.t('months_short'); // ['Ene','Feb',...] o ['Jan','Feb',...]
```

#### Cambios clave por módulo
- **`films.js`**: `statusConfig()` y `typeCfg()` son ahora **funciones** (no constantes) para retornar traducciones frescas. Nueva función `photoTypeLabel(val)` mapea valores DB ('paisaje') a etiquetas traducidas.
- **`stats.js`** y **`timeline.js`**: eliminado `MONTHS_ES` hardcodeado, ahora usan `I18n.t('months_long')` / `I18n.t('months_short')`.
- **`app.js`**: títulos de página y tema usan `I18n.t()`.
- **`auth.js`**: todos los mensajes de error/éxito usan `I18n.t()`.

#### Botones de idioma (🇲🇽 ES / 🇺🇸 EN)
- **Login**: par de botones debajo del formulario, separados por línea horizontal
- **Sidebar**: mismo par en el footer, ancho completo
- El idioma activo se resalta en verde (`.lang-btn.active`)

```html
<div class="lang-switcher lang-switcher--auth">
  <button class="lang-btn" data-lang="es" onclick="I18n.setLang('es')">🇲🇽 ES</button>
  <button class="lang-btn" data-lang="en" onclick="I18n.setLang('en')">🇺🇸 EN</button>
</div>
```

#### CSS añadido
```css
.lang-switcher { display:flex; gap:.5rem; }
.lang-switcher--auth { justify-content:center; margin-top:1.25rem; padding-top:1.25rem; border-top:1px solid var(--border); }
.lang-switcher--sidebar { width:100%; margin-bottom:.25rem; }
.lang-btn { font-size:.8rem; font-weight:600; padding:.4rem .9rem; border-radius:var(--radius); border:1px solid var(--border); background:var(--card); color:var(--text-muted); cursor:pointer; }
.lang-btn:hover { border-color:var(--primary); color:var(--primary); }
.lang-btn.active { background:var(--primary); color:#fff; border-color:var(--primary); }
```


### CSS / UI
- **Modo oscuro**: paleta verde-fría por capas (`#0f1a17` → `#162320` → `#1d2e28`), sin negro puro ni tinte azul
- **Modo claro**: tono hueso (`#ede8df` base, `#f7f3ec` superficies)
- **Transiciones**: `cubic-bezier(0.4, 0, 0.2, 1)` en todo
- **Headings**: `letter-spacing: -0.025em`
- **Botones**: `scale(0.97)` en `:active`, focus ring verde

---

### Auditoría i18n + fixes (commit 537c811)

Pasada de revisión sobre el sistema bilingüe. 232 invocaciones `I18n.t()`, 274 claves ES = 274 EN (sin asimetría ni claves no definidas). Bugs detectados y corregidos:

#### Bugs corregidos
- **Botón de tema se rompía al cambiar idioma**: el `<span id="theme-label">` tenía `data-i18n="theme_dark"` y `I18n.apply()` reescribía el label dinámico que `Theme.apply()` venía gestionando según el modo activo. Tras cambiar idioma en dark mode, el botón mostraba "Modo oscuro" en vez de "Modo claro" hasta el siguiente click.
  - **Fix**: quitado `data-i18n` del span; añadido `Theme.refresh()` que lee `data-theme` y reaplica el label. `I18n.setLang()` lo invoca después de `apply()`.
- **`FILM_STATUS_CFG`** (films.js:143) tenía labels hardcoded `'Fresh' / 'CaduFresh'`; sólo `rancio` se traducía vía caso especial. Convertido a función `filmStatusConfig()` (mismo patrón que `statusConfig()` / `typeCfg()`); badges fresh/cadufresh/rancio ahora se traducen normalmente.
- **`'Sin año'` hardcoded** en timeline.js:97 → nueva clave `tl_no_year`.
- **`aria-label="Menú"` hardcoded** en el botón hamburger → nueva clave `aria_menu` + `data-i18n-aria`.

#### Cambios de copy en EN
- `cond_cadufresh`: `'CaduFresh'` → `'Aging'` (el portmanteau español no se entendía en inglés).

#### Deuda técnica documentada (no crítica)
- Errores de Supabase (`err.message`) llegan en inglés siempre, sin traducir.
- `<title>Film Database</title>` estático, no cambia con idioma.
- `<label>Email</label>` sin `data-i18n` (palabra universal, detalle).
- Orden de carga: `stocksMeta.js` se carga después de sus consumidores `films.js` / `dashboard.js` (funciona porque `StockChip` sólo se invoca en funciones diferidas).
- `js/notas.txt` huérfano; `imgs/.DS_Store` debería ir a `.gitignore`.
