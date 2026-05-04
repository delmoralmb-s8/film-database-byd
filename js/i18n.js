// ============================================================
// i18n — Internacionalización ES / EN
// ============================================================

const I18n = (() => {
  let lang = localStorage.getItem('lang') || 'es';

  const _T = {
    es: {
      // Auth
      auth_subtitle: 'Seguimiento de rollos en formato 135, 120 y Super8',
      auth_by: 'Por ByD',
      auth_login_tab: 'Iniciar sesión',
      auth_register_tab: '¡Regístrate!',
      auth_password: 'Contraseña',
      auth_login_btn: 'Entrar',
      auth_confirm_password: 'Confirmar contraseña',
      auth_pass_placeholder: 'Mínimo 6 caracteres',
      auth_pass2_placeholder: 'Repite la contraseña',
      auth_register_btn: 'Crear cuenta',
      auth_check_email_title: 'Revisa tu correo',
      auth_check_email_body: 'Te enviamos un enlace de confirmación a {email}. Haz clic en el link del correo para activar tu cuenta.',
      auth_confirmed_btn: 'Ya confirmé, ir al inicio de sesión',
      auth_pass_mismatch: 'Las contraseñas no coinciden.',
      auth_account_created: 'Cuenta creada exitosamente.',
      auth_pass_too_short: 'La contraseña debe tener al menos 6 caracteres.',
      auth_pass_updated: 'Contraseña actualizada correctamente.',

      // Nav
      nav_dashboard: 'Panel',
      nav_rolls: 'Rollos',
      nav_gear: 'Gear',
      nav_timeline: 'Línea de tiempo',
      nav_stats: 'Estadísticas',
      nav_add_roll: '+ Agregar nuevo rollo',
      nav_film_rolls: 'Rollos de película',

      // Sidebar footer
      btn_change_pass: 'Cambiar contraseña',
      btn_logout: 'Cerrar sesión',

      // Theme
      theme_dark: 'Modo oscuro',
      theme_light: 'Modo claro',

      // Page titles
      page_dashboard: 'Panel de control',
      page_gear: 'Gear',
      page_rolls: 'Rollos',
      page_film_detail: 'Detalle del rollo',
      page_timeline: 'Línea de tiempo',
      page_stats: 'Estadísticas',

      // Dashboard
      dash_hero_eyebrow: 'Tu colección',
      dash_search_placeholder: 'Buscar rollos…',
      stat_total: 'Total rollos',
      stat_in_cam: 'En cámara',
      stat_in_dev: 'Por revelar',
      stat_scanned: 'Por escanear',
      stat_cameras: 'Cámaras',
      stat_lenses: 'Lentes',
      dash_in_cam: 'Rollos en cámara',
      dash_in_dev: 'Por revelar',
      dash_scanned: 'Por escanear',
      dash_done: 'Finalizados',
      dash_add_roll: '+ Agregar nuevo rollo',
      dash_empty: 'Ninguno.',

      // Gear
      gear_cameras_tab: 'Cámaras',
      gear_lenses_tab: 'Lentes',
      gear_cameras_title: 'Cámaras',
      gear_lenses_title: 'Lentes',
      gear_import_defaults: '↓ Importar predeterminadas',
      gear_add_camera: '+ Añadir cámara',
      gear_add_lens: '+ Añadir lente',
      loading: 'Cargando…',

      // Films list
      films_add_btn: '+ Añadir rollo',
      filter_all_status: 'Todos los estados',
      filter_in_cam: 'En cámara',
      filter_in_dev: 'Por revelar',
      filter_done: 'Finalizado',
      filter_to_scan: 'Por escanear',
      filter_all_types: 'Todos los tipos',
      filter_color: 'Color',
      filter_bw: 'B&N',
      filter_slide: 'Diapositiva',
      filter_all_formats: 'Todos los formatos',
      filter_search_placeholder: 'Buscar marca, nombre, ciudad…',

      // Table headers
      th_added: 'Agregado el: ',
      th_roll: 'Rollo',
      th_type: 'Tipo',
      th_iso: 'ISO',
      th_format: 'Formato',
      th_camera: 'Cámara',
      th_status: 'Estado',
      th_lab: 'Lab',
      th_finished: 'Finalizado en: ',
      th_notes: 'Notas',

      // Status labels
      status_en_camara: 'En cámara',
      status_en_revelado: 'Por revelar',
      status_finalizado: 'Finalizado',
      status_escaneado: 'Por escanear',

      // Type labels
      type_color: 'Color',
      type_bw: 'B&N',
      type_slide: 'Diapo',

      // Film condition labels
      cond_fresh: 'Fresh',
      cond_cadufresh: 'CaduFresh',
      cond_rancio: 'Rancio',
      tl_no_year: 'Sin año',
      aria_menu: 'Menú',

      // Film form
      form_roll_condition: 'Estado rollo',
      form_type: 'Tipo',
      form_format: 'Formato',
      form_brand: 'Marca',
      form_emulsion: 'Nombre / Emulsión',
      form_select: '— Seleccionar —',
      form_other_write: 'Otro (escribir)',
      form_emulsion_placeholder: 'Escribe la emulsión…',
      form_num_photos: 'Nº fotos',
      form_camera: 'Cámara',
      form_no_camera: '— Sin cámara —',
      form_import_cameras: '📷 ¿Quieres importar las cámaras de nuestro brevísimo catálogo?',
      form_add_camera_unique: '📸 ¿Tu cámara es única y diferente? Añádela aquí',
      form_camera_brand_ph: 'Marca (ej. Olympus)',
      form_camera_model_ph: 'Modelo (ej. OM-1)',
      form_lens: 'Lente',
      form_no_lens: '— Sin lente —',
      form_status: 'Estado actual',
      form_push_pull: 'Forzado',
      form_push_no: 'No',
      form_push_1: '+1 paso',
      form_push_2: '+2 pasos',
      form_push_3: '+3 pasos',
      form_pull_1: '-1 paso',
      form_pull_2: '-2 pasos',
      form_start_date: 'Fecha inicio',
      form_end_date: 'Fecha fin',
      form_lab: 'Lab de revelado',
      form_no_lab: '— Sin lab —',
      form_city: 'Ciudad',
      form_city_ph: 'Ciudad',
      form_country: 'País',
      form_country_ph: 'País',
      form_photo_type: 'Tipo de foto',
      form_photo_type_none: '— Sin clasificar —',
      form_notes: 'Notas',
      form_notes_ph: 'Notas libres…',
      form_slide_type: 'Diapositiva',

      // Photo types
      photo_familia: 'Familia',
      photo_amigos: 'Amigos',
      photo_paisaje: 'Paisaje',
      photo_retrato: 'Retrato',
      photo_macro: 'Macro',
      photo_boda: 'Boda',
      photo_eventos: 'Eventos',
      photo_mascotas: 'Mascotas',
      photo_estudio: 'Estudio',
      photo_producto: 'De producto',
      photo_chile_mole: 'De chile, mole y pozole',
      photo_ex: 'de mi ex :(',
      photo_otro: 'Otro',

      // Quick mode
      quick_title: 'Añadir rollo',
      quick_save: 'Crear rollo',
      quick_mode_label: '⚡ Modo rápido',
      quick_advanced_btn: 'Modo avanzado →',
      quick_emulsion: 'Emulsión',
      quick_camera_optional: 'Cámara',
      quick_camera_opt_label: '(opcional)',
      quick_notes_optional: 'Notas',
      quick_no_camera: '— Sin cámara —',
      quick_add_camera: '📷 ¿Tu cámara es única? Añádela aquí',
      quick_select: '— Seleccionar —',
      quick_select_emulsion: 'Selecciona una emulsión',

      // Advanced mode
      adv_mode_label: '⚙ Modo avanzado',
      adv_quick_btn: '← Modo rápido',
      adv_title_new: 'Nuevo rollo',
      adv_title_edit: 'Editar rollo',

      // Modal
      modal_cancel: 'Cancelar',
      modal_save: 'Guardar',
      modal_delete: 'Eliminar',
      modal_close_label: 'Cerrar',

      // Change password modal
      change_pass_title: 'Cambiar contraseña',
      change_pass_new: 'Nueva contraseña',
      change_pass_confirm: 'Confirmar nueva contraseña',

      // Toasts
      toast_roll_added: 'Rollo añadido',
      toast_roll_updated: 'Rollo actualizado',
      toast_roll_deleted: 'Rollo eliminado',
      toast_save_error: 'Error al guardar',
      toast_save_roll_error: 'Error al guardar el rollo',
      toast_required: 'Marca y nombre son obligatorios',
      toast_fill_camera: 'Escribe la marca y modelo de tu cámara',
      toast_camera_added: 'Cámara añadida',
      toast_camera_updated: 'Cámara actualizada',
      toast_camera_deleted: 'Cámara eliminada',
      toast_cameras_all_added: 'Todas las cámaras predeterminadas ya están añadidas',
      toast_cameras_imported: '{n} cámaras importadas',
      toast_fill_fields: 'Rellena todos los campos',
      toast_lens_added: 'Lente añadida',
      toast_lens_updated: 'Lente actualizada',
      toast_lens_deleted: 'Lente eliminada',
      toast_lenses_all_added: 'Todas las lentes predeterminadas ya están añadidas',
      toast_lenses_imported: '{n} lentes importadas',

      // Delete confirms
      delete_roll_title: 'Eliminar rollo',
      delete_roll_q: '¿Estás seguro que quieres eliminar tu rollo :O ?',
      delete_camera_title: 'Eliminar cámara',
      delete_camera_q: '¿Eliminar {name}? Los rollos asociados quedarán sin cámara asignada.',
      delete_lens_title: 'Eliminar lente',
      delete_lens_q: '¿Eliminar {name}? Los rollos asociados quedarán sin lente asignada.',

      // Empty states
      empty_filters: 'No hay rollos con esos filtros.',
      empty_rolls: 'No tienes rollos registrados aún.',
      empty_cameras: 'No tienes cámaras registradas aún.',
      empty_lenses: 'No tienes lentes registradas aún.',
      empty_stats: 'Agrega rollos para ver tus estadísticas.',
      empty_timeline: 'Registra rollos con fecha para ver tu línea de tiempo.',
      empty_fmt_timeline: 'Sin rollos de este formato con fecha registrada.',

      // Cameras table / form
      cam_th_brand: 'Marca',
      cam_th_model: 'Modelo',
      cam_th_format: 'Formato',
      cam_th_type: 'Tipo',
      cam_form_brand: 'Marca',
      cam_form_other_brand: 'Otra…',
      cam_form_other_model: 'Otro…',
      cam_form_brand_ph: 'Escribe la marca…',
      cam_form_model_ph: 'Escribe el modelo…',
      cam_form_new_title: 'Nueva cámara',
      cam_form_edit_title: 'Editar cámara',
      cam_form_model: 'Modelo',
      cam_form_format: 'Formato',
      cam_form_type: 'Tipo',

      // Lenses table / form
      lens_th_brand: 'Marca',
      lens_th_lens: 'Lente',
      lens_form_brand_ph: 'Ej. Canon, Nikkor, Leica…',
      lens_form_focal: 'Distancia focal (mm)',
      lens_form_focal_ph: 'Ej. 50, 28-70…',
      lens_form_aperture: 'Apertura máxima',
      lens_form_aperture_ph: 'Ej. 1.8, 2.8…',
      lens_form_new_title: 'Nueva lente',
      lens_form_edit_title: 'Editar lente',

      // Months
      months_short: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
      months_long:  ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],

      // Timeline
      tl_title: 'Línea de tiempo',
      tl_collapse_all: 'Colapsar todo',
      tl_expand_all: 'Expandir todo',
      tl_no_month: 'Sin mes',
      tl_rolls_date_1: 'rollo con fecha registrada',
      tl_rolls_date_n: 'rollos con fecha registrada',

      // Stats
      stats_total_rolls: 'Total rollos',
      stats_estimated_photos: 'Fotos estimadas',
      stats_s8_mins: 'Minutos rodados Super 8',
      stats_reel_1: 'carrete',
      stats_reel_n: 'carretes',
      stats_year_1: 'Año activo',
      stats_year_n: 'Años activo',
      stats_fmt_1: 'Formato usado',
      stats_fmt_n: 'Formatos usados',
      stats_dna: 'Tu ADN fílmico',
      stats_dominant_type: 'Tipo dominante',
      stats_top_emulsion: 'Emulsión #1',
      stats_main_camera: 'Cámara principal',
      stats_roll_1: 'rollo',
      stats_roll_n: 'rollos',
      stats_activity: 'Actividad por año',
      stats_no_date: 'sin fecha',
      stats_tap_year: 'Toca un año para ver el detalle',
      stats_monthly_activity: 'Actividad mensual',
      stats_type: 'Tipo',
      stats_top_em_year: 'Emulsión del año',
      stats_rankings: 'Rankings',
      stats_top_emulsions: 'Top emulsiones',
      stats_top_cameras: 'Top cámaras',
      stats_no_data: 'Sin datos',
      stats_distribution: 'Distribución',
      stats_formats_col: 'Formatos',
      stats_labs_col: 'Labs',
      stats_cities_col: 'Ciudades',
      stats_photo_types: 'Tipos de foto',
      stats_suggestion: 'Sugerencia inteligente ✨',

      // Film detail
      detail_not_found: 'Rollo no encontrado.',
      detail_camera: 'Cámara',
      detail_lens: 'Lente',
      detail_location: 'Lugar',
      detail_start: 'Inicio',
      detail_end: 'Fin',
      detail_lab: 'Lab',
      detail_photo_type: 'Tipo de foto',
      detail_notes: 'Notas',
      detail_back: '← Volver',
      detail_edit: '✏️ Editar',
      detail_exposures: 'fotos',

      // Suggestion texts
      sugg_cinestill: 'Disparas mucho Kodak en color en ciudad. Probablemente te encante el Cinestill 800T para tus salidas nocturnas — comparte el ADN del Vision3 pero adaptado para luz artificial y ciudad.',
      sugg_velvia: 'Tu ISO promedio es bajo ({iso}), señal de que disparas con buena luz. Prueba el Fujifilm Velvia 50 — colores ultra-saturados perfectos para paisaje y luz natural.',
      sugg_delta3200: 'Usas ISO alto en B&N (promedio {iso}). Ilford Delta 3200 te dará grano expresivo y detalle sorprendente incluso en condiciones de poca luz.',
      sugg_ektachrome: 'Llevas {n} rollos de color pero aún no has probado diapositiva. El Ektachrome E100 tiene colores pastel únicos y el proceso E-6 hace que cada rollo sea una experiencia distinta.',
      sugg_hp5: 'Disparas mucho en B&N. Si aún no has probado el HP5 Plus 400, es el punto de referencia del blanco y negro — latitud enorme, grano clásico, funciona en cualquier situación.',
      sugg_ektar: 'Con formato 120, el Ektar 100 brilla — el grano más fino de Kodak y colores vivos que aprovechan al máximo los negativos grandes.',
      sugg_portra: 'El Portra 400 es el punto de referencia para color. Su latitud de exposición y tonos de piel son difíciles de superar — el rollo que siempre quieres tener cargado.',
    },

    en: {
      // Auth
      auth_subtitle: 'Track your 135, 120, and Super 8 film rolls',
      auth_by: 'By ByD',
      auth_login_tab: 'Sign in',
      auth_register_tab: 'Sign up!',
      auth_password: 'Password',
      auth_login_btn: 'Log in',
      auth_confirm_password: 'Confirm password',
      auth_pass_placeholder: 'At least 6 characters',
      auth_pass2_placeholder: 'Repeat password',
      auth_register_btn: 'Create account',
      auth_check_email_title: 'Check your email',
      auth_check_email_body: 'We sent a confirmation link to {email}. Click the link in the email to activate your account.',
      auth_confirmed_btn: 'I confirmed, take me to sign in',
      auth_pass_mismatch: 'Passwords do not match.',
      auth_account_created: 'Account created successfully.',
      auth_pass_too_short: 'Password must be at least 6 characters.',
      auth_pass_updated: 'Password updated successfully.',

      // Nav
      nav_dashboard: 'Dashboard',
      nav_rolls: 'Rolls',
      nav_gear: 'Gear',
      nav_timeline: 'Timeline',
      nav_stats: 'Stats',
      nav_add_roll: '+ Add new roll',
      nav_film_rolls: 'Film rolls',

      // Sidebar footer
      btn_change_pass: 'Change password',
      btn_logout: 'Sign out',

      // Theme
      theme_dark: 'Dark mode',
      theme_light: 'Light mode',

      // Page titles
      page_dashboard: 'Dashboard',
      page_gear: 'Gear',
      page_rolls: 'Rolls',
      page_film_detail: 'Roll detail',
      page_timeline: 'Timeline',
      page_stats: 'Stats',

      // Dashboard
      dash_hero_eyebrow: 'Your collection',
      dash_search_placeholder: 'Search rolls…',
      stat_total: 'Total rolls',
      stat_in_cam: 'In camera',
      stat_in_dev: 'To develop',
      stat_scanned: 'To scan',
      stat_cameras: 'Cameras',
      stat_lenses: 'Lenses',
      dash_in_cam: 'Rolls in camera',
      dash_in_dev: 'To develop',
      dash_scanned: 'To scan',
      dash_done: 'Finished',
      dash_add_roll: '+ Add new roll',
      dash_empty: 'None.',

      // Gear
      gear_cameras_tab: 'Cameras',
      gear_lenses_tab: 'Lenses',
      gear_cameras_title: 'Cameras',
      gear_lenses_title: 'Lenses',
      gear_import_defaults: '↓ Import defaults',
      gear_add_camera: '+ Add camera',
      gear_add_lens: '+ Add lens',
      loading: 'Loading…',

      // Films list
      films_add_btn: '+ Add roll',
      filter_all_status: 'All statuses',
      filter_in_cam: 'In camera',
      filter_in_dev: 'To develop',
      filter_done: 'Finished',
      filter_to_scan: 'To scan',
      filter_all_types: 'All types',
      filter_color: 'Color',
      filter_bw: 'B&W',
      filter_slide: 'Slide',
      filter_all_formats: 'All formats',
      filter_search_placeholder: 'Search brand, name, city…',

      // Table headers
      th_added: 'Added on: ',
      th_roll: 'Roll',
      th_type: 'Type',
      th_iso: 'ISO',
      th_format: 'Format',
      th_camera: 'Camera',
      th_status: 'Status',
      th_lab: 'Lab',
      th_finished: 'Finished on: ',
      th_notes: 'Notes',

      // Status labels
      status_en_camara: 'In camera',
      status_en_revelado: 'To develop',
      status_finalizado: 'Finished',
      status_escaneado: 'To scan',

      // Type labels
      type_color: 'Color',
      type_bw: 'B&W',
      type_slide: 'Slide',

      // Film condition labels
      cond_fresh: 'Fresh',
      cond_cadufresh: 'Aging',
      cond_rancio: 'Expired',
      tl_no_year: 'No year',
      aria_menu: 'Menu',

      // Film form
      form_roll_condition: 'Roll condition',
      form_type: 'Type',
      form_format: 'Format',
      form_brand: 'Brand',
      form_emulsion: 'Name / Emulsion',
      form_select: '— Select —',
      form_other_write: 'Other (type it)',
      form_emulsion_placeholder: 'Type the emulsion…',
      form_num_photos: 'No. of exposures',
      form_camera: 'Camera',
      form_no_camera: '— No camera —',
      form_import_cameras: '📷 Import cameras from our catalog?',
      form_add_camera_unique: '📸 Is your camera one of a kind? Add it here',
      form_camera_brand_ph: 'Brand (e.g. Olympus)',
      form_camera_model_ph: 'Model (e.g. OM-1)',
      form_lens: 'Lens',
      form_no_lens: '— No lens —',
      form_status: 'Current status',
      form_push_pull: 'Push/Pull',
      form_push_no: 'No',
      form_push_1: '+1 stop',
      form_push_2: '+2 stops',
      form_push_3: '+3 stops',
      form_pull_1: '-1 stop',
      form_pull_2: '-2 stops',
      form_start_date: 'Start date',
      form_end_date: 'End date',
      form_lab: 'Development lab',
      form_no_lab: '— No lab —',
      form_city: 'City',
      form_city_ph: 'City',
      form_country: 'Country',
      form_country_ph: 'Country',
      form_photo_type: 'Photo type',
      form_photo_type_none: '— Unclassified —',
      form_notes: 'Notes',
      form_notes_ph: 'Free notes…',
      form_slide_type: 'Slide',

      // Photo types
      photo_familia: 'Family',
      photo_amigos: 'Friends',
      photo_paisaje: 'Landscape',
      photo_retrato: 'Portrait',
      photo_macro: 'Macro',
      photo_boda: 'Wedding',
      photo_eventos: 'Events',
      photo_mascotas: 'Pets',
      photo_estudio: 'Studio',
      photo_producto: 'Product',
      photo_chile_mole: 'A bit of everything',
      photo_ex: 'My ex :(',
      photo_otro: 'Other',

      // Quick mode
      quick_title: 'Add roll',
      quick_save: 'Create roll',
      quick_mode_label: '⚡ Quick mode',
      quick_advanced_btn: 'Advanced mode →',
      quick_emulsion: 'Emulsion',
      quick_camera_optional: 'Camera',
      quick_camera_opt_label: '(optional)',
      quick_notes_optional: 'Notes',
      quick_no_camera: '— No camera —',
      quick_add_camera: '📷 Is your camera one of a kind? Add it here',
      quick_select: '— Select —',
      quick_select_emulsion: 'Select an emulsion',

      // Advanced mode
      adv_mode_label: '⚙ Advanced mode',
      adv_quick_btn: '← Quick mode',
      adv_title_new: 'New roll',
      adv_title_edit: 'Edit roll',

      // Modal
      modal_cancel: 'Cancel',
      modal_save: 'Save',
      modal_delete: 'Delete',
      modal_close_label: 'Close',

      // Change password modal
      change_pass_title: 'Change password',
      change_pass_new: 'New password',
      change_pass_confirm: 'Confirm new password',

      // Toasts
      toast_roll_added: 'Roll added',
      toast_roll_updated: 'Roll updated',
      toast_roll_deleted: 'Roll deleted',
      toast_save_error: 'Error saving',
      toast_save_roll_error: 'Error saving roll',
      toast_required: 'Brand and name are required',
      toast_fill_camera: 'Enter the brand and model of your camera',
      toast_camera_added: 'Camera added',
      toast_camera_updated: 'Camera updated',
      toast_camera_deleted: 'Camera deleted',
      toast_cameras_all_added: 'All default cameras are already added',
      toast_cameras_imported: '{n} cameras imported',
      toast_fill_fields: 'Fill in all fields',
      toast_lens_added: 'Lens added',
      toast_lens_updated: 'Lens updated',
      toast_lens_deleted: 'Lens deleted',
      toast_lenses_all_added: 'All default lenses are already added',
      toast_lenses_imported: '{n} lenses imported',

      // Delete confirms
      delete_roll_title: 'Delete roll',
      delete_roll_q: 'Are you sure you want to delete this roll :O ?',
      delete_camera_title: 'Delete camera',
      delete_camera_q: 'Delete {name}? Associated rolls will have no camera assigned.',
      delete_lens_title: 'Delete lens',
      delete_lens_q: 'Delete {name}? Associated rolls will have no lens assigned.',

      // Empty states
      empty_filters: 'No rolls match these filters.',
      empty_rolls: 'You have no rolls yet.',
      empty_cameras: 'You have no cameras yet.',
      empty_lenses: 'You have no lenses yet.',
      empty_stats: 'Add rolls to see your stats.',
      empty_timeline: 'Add rolls with a date to see your timeline.',
      empty_fmt_timeline: 'No rolls of this format with a registered date.',

      // Cameras table / form
      cam_th_brand: 'Brand',
      cam_th_model: 'Model',
      cam_th_format: 'Format',
      cam_th_type: 'Type',
      cam_form_brand: 'Brand',
      cam_form_other_brand: 'Other…',
      cam_form_other_model: 'Other…',
      cam_form_brand_ph: 'Type the brand…',
      cam_form_model_ph: 'Type the model…',
      cam_form_new_title: 'New camera',
      cam_form_edit_title: 'Edit camera',
      cam_form_model: 'Model',
      cam_form_format: 'Format',
      cam_form_type: 'Type',

      // Lenses table / form
      lens_th_brand: 'Brand',
      lens_th_lens: 'Lens',
      lens_form_brand_ph: 'E.g. Canon, Nikkor, Leica…',
      lens_form_focal: 'Focal length (mm)',
      lens_form_focal_ph: 'E.g. 50, 28-70…',
      lens_form_aperture: 'Max aperture',
      lens_form_aperture_ph: 'E.g. 1.8, 2.8…',
      lens_form_new_title: 'New lens',
      lens_form_edit_title: 'Edit lens',

      // Months
      months_short: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      months_long:  ['January','February','March','April','May','June','July','August','September','October','November','December'],

      // Timeline
      tl_title: 'Timeline',
      tl_collapse_all: 'Collapse all',
      tl_expand_all: 'Expand all',
      tl_no_month: 'No month',
      tl_rolls_date_1: 'roll with a date',
      tl_rolls_date_n: 'rolls with a date',

      // Stats
      stats_total_rolls: 'Total rolls',
      stats_estimated_photos: 'Estimated photos',
      stats_s8_mins: 'Super 8 minutes filmed',
      stats_reel_1: 'roll',
      stats_reel_n: 'rolls',
      stats_year_1: 'Year active',
      stats_year_n: 'Years active',
      stats_fmt_1: 'Format used',
      stats_fmt_n: 'Formats used',
      stats_dna: 'Your film DNA',
      stats_dominant_type: 'Dominant type',
      stats_top_emulsion: 'Top emulsion',
      stats_main_camera: 'Main camera',
      stats_roll_1: 'roll',
      stats_roll_n: 'rolls',
      stats_activity: 'Activity by year',
      stats_no_date: 'no date',
      stats_tap_year: 'Tap a year for details',
      stats_monthly_activity: 'Monthly activity',
      stats_type: 'Type',
      stats_top_em_year: 'Top emulsion of the year',
      stats_rankings: 'Rankings',
      stats_top_emulsions: 'Top emulsions',
      stats_top_cameras: 'Top cameras',
      stats_no_data: 'No data',
      stats_distribution: 'Distribution',
      stats_formats_col: 'Formats',
      stats_labs_col: 'Labs',
      stats_cities_col: 'Cities',
      stats_photo_types: 'Photo types',
      stats_suggestion: 'Smart suggestion ✨',

      // Film detail
      detail_not_found: 'Roll not found.',
      detail_camera: 'Camera',
      detail_lens: 'Lens',
      detail_location: 'Location',
      detail_start: 'Start',
      detail_end: 'End',
      detail_lab: 'Lab',
      detail_photo_type: 'Photo type',
      detail_notes: 'Notes',
      detail_back: '← Back',
      detail_edit: '✏️ Edit',
      detail_exposures: 'exposures',

      // Suggestion texts
      sugg_cinestill: "You shoot a lot of Kodak color in the city. You'll probably love Cinestill 800T for night outings — it shares the Vision3 DNA but tuned for artificial light and city scenes.",
      sugg_velvia: 'Your average ISO is low ({iso}), a sign that you shoot in good light. Try Fujifilm Velvia 50 — ultra-saturated colors perfect for landscapes and natural light.',
      sugg_delta3200: 'You shoot with high ISO in B&W (average {iso}). Ilford Delta 3200 will give you expressive grain and surprising detail even in low-light conditions.',
      sugg_ektachrome: "You've shot {n} color rolls but haven't tried slide yet. Kodak Ektachrome E100 has unique pastel colors and the E-6 process makes every roll a distinct experience.",
      sugg_hp5: "You shoot a lot in B&W. If you haven't tried HP5 Plus 400 yet, it's the benchmark for black and white — huge latitude, classic grain, works in any situation.",
      sugg_ektar: "With 120 format, Ektar 100 shines — Kodak's finest grain and vivid colors that make the most of large negatives.",
      sugg_portra: "Portra 400 is the benchmark for color film. Its exposure latitude and skin tones are hard to beat — the roll you always want loaded.",
    }
  };

  // ── Core ───────────────────────────────────────────────────

  function t(key, vars = {}) {
    const val = _T[lang]?.[key] ?? _T.es[key] ?? key;
    if (Array.isArray(val)) return val;
    let str = String(val);
    Object.entries(vars).forEach(([k, v]) => {
      str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
    });
    return str;
  }

  function getLang() { return lang; }

  function setLang(newLang) {
    if (newLang === lang) return;
    lang = newLang;
    localStorage.setItem('lang', newLang);
    document.documentElement.lang = lang;
    apply();
    _updateLangBtns();
    if (typeof Theme !== 'undefined') Theme.refresh();
    // Re-render active view so all JS-generated text updates
    const activeEl = document.querySelector('.view.active');
    if (activeEl && typeof App !== 'undefined') {
      const viewId = activeEl.id.replace('-view', '');
      App.navigate(viewId);
    }
  }

  // Apply translations to all data-i18n elements in the DOM
  function apply() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      el.placeholder = t(el.dataset.i18nPlaceholder);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      el.setAttribute('aria-label', t(el.dataset.i18nAria));
    });
    document.documentElement.lang = lang;
  }

  function _updateLangBtns() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
  }

  function init() {
    lang = localStorage.getItem('lang') || 'es';
    document.documentElement.lang = lang;
    // Buttons are rendered after DOMContentLoaded so apply() will handle them
  }

  return { t, getLang, setLang, apply, init };
})();
