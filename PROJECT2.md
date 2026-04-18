## Film Database — Contexto del proyecto

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

### Áreas de mejora pendientes
- Página detalle por rollo
- Estadísticas avanzadas
- Exportar CSV
- Validación fechas (fin < inicio)
- Sin confirmación al cerrar modal con cambios
- PWA / offline