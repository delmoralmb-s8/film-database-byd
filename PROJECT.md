# 🎞️ Analog Film Roll Tracker

## 📌 Descripción
App para registrar y organizar rollos de 135, 120 y Super 8.

## ⚙️ Stack
- Frontend: HTML + CSS + JS puro → GitHub Pages
- Backend: Supabase (auth + DB con RLS)

## 🧠 Estado actual
- Funcional y desplegado en GitHub Pages. Auth con Supabase operando.

## 🧱 Funcionalidades
- 🔐 Registro / login / logout por usuario
- 📷 CRUD de cámaras (marca, modelo, formato, tipo)
- 🔭 CRUD de lentes (marca, focal, apertura)
- 🎞 Añadir/editar rollos con ~130 emulsiones por marca, defaults inteligentes, Super8 restringido
- 📊 Dashboard con stats y rollos agrupados por estado
- 🌙/☀️ Tema claro/oscuro con memoria
- 📱 Bottom nav en móvil

## 📂 Estructura
FILM-DATABASE/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── config.js
│   ├── auth.js
│   ├── cameras.js
│   ├── lenses.js
│   ├── films.js
│   ├── dashboard.js
│   └── app.js
└── sql/
    └── schema.sql

## 🧭 Decisiones
- UI minimalista
- Sin frameworks (solo Vanilla JS)

## 🚧 Pendientes
**UX / Visual**
- Página de detalle por rollo (ver toda la info sin editar)
- Ordenar y paginar la lista de rollos
- Foto de portada por rollo

**Funcionalidad**
- Estadísticas: marcas más usadas, labs más usados, rollos por mes
- Exportar datos a CSV
- Compartir un rollo como link público

**Técnico**
- Sin confirmación al cerrar el modal con cambios sin guardar
- No hay validación de fechas (fin < inicio)
- Sin manejo offline (PWA)

## 📝 Notas
- Considerar soporte para ISO / cámara usada