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
