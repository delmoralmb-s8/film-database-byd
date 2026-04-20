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
### Áreas de mejora pendientes
- Página detalle por rollo
- Estadísticas avanzadas
- Exportar CSV
- Validación fechas (fin < inicio)
- Sin confirmación al cerrar modal con cambios
- PWA / offline


### CSS / UI
- **Modo oscuro**: paleta verde-fría por capas (`#0f1a17` → `#162320` → `#1d2e28`), sin negro puro ni tinte azul
- **Modo claro**: tono hueso (`#ede8df` base, `#f7f3ec` superficies)
- **Transiciones**: `cubic-bezier(0.4, 0, 0.2, 1)` en todo
- **Headings**: `letter-spacing: -0.025em`
- **Botones**: `scale(0.97)` en `:active`, focus ring verde
