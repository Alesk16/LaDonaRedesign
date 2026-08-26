/**
 * LA DOÑA HACIENDA — LÓGICA EXCLUSIVA DE EVENTOS (pages/eventos.html)
 * Archivo: js/eventos.js
 *
 * Responsabilidades:
 * 1. Definir los datos de eventos sociales e institucionales realizados.
 * 2. Renderizar las tarjetas de cada categoría (o un estado vacío si aún no hay datos).
 * 3. Controlar la navegación por pestañas (Eventos sociales / Eventos institucionales).
 * 4. Controlar el modal / lightbox de galería (apertura, cierre, navegación entre fotos).
 *
 * ==========================================================================
 * CÓMO AGREGAR UN NUEVO EVENTO
 * ==========================================================================
 * Agrega un objeto al arreglo correspondiente (`eventosSociales` o
 * `eventosInstitucionales`) con esta forma:
 *
 * {
 *     id: "identificador-unico",       // sin espacios, usado internamente
 *     tipo: "Evento social",           // o "Evento institucional"
 *     titulo: "Día de la Madre",
 *     fecha: "10 de mayo de 2026",     // o "Fecha por confirmar"
 *     sucursal: "Cumbayá",             // o "Sucursal por confirmar"
 *     descripcion: "Descripción breve del evento.",
 *     imagenPortada: "../img/eventos/sociales/dia-madre/portada.jpg", // o null
 *     galeria: [
 *         "../img/eventos/sociales/dia-madre/foto-01.jpg",
 *         "../img/eventos/sociales/dia-madre/foto-02.jpg"
 *     ]
 * }
 *
 * Si todavía no hay fotografías reales, deja `imagenPortada: null` y
 * `galeria: []`. La tarjeta y el modal mostrarán automáticamente un
 * espacio visual preparado en lugar de inventar una imagen.
 *
 * Campo opcional `estado`:
 * Si un evento todavía no ha ocurrido (fecha futura respecto a hoy), agrega
 * `estado: "proximo"`. El evento queda preparado en el arreglo pero NO se
 * muestra en el listado de "Eventos realizados" hasta que se quite ese
 * campo o se actualice manualmente cuando ya haya ocurrido.
 */

(function () {
    'use strict';

    /* ==========================================================================
       1. DATOS DE EVENTOS
       ========================================================================== */

    /**
     * Eventos sociales.
     * Información proporcionada por el negocio. Las fotografías reales aún
     * no han sido cargadas: las rutas de `imagenPortada` y `galeria` son
     * referencias preparadas (los archivos todavía no existen físicamente
     * en el proyecto) para que puedan colocarse allí más adelante.
     */
    var eventosSociales = [
        {
            id: 'bautizo-familia-benalcazar',
            tipo: 'Evento social',
            titulo: 'Bautizo familia Benalcázar',
            fecha: '3 de mayo de 2026',
            sucursal: 'Cayambe',
            descripcion: 'Una celebración familiar especial compartida en un ambiente acogedor de La Doña Hacienda.',
            // Fotografías reales pendientes: se prevén 18 fotos en total.
            imagenPortada: '../img/eventos/sociales/bautizo-familia-benalcazar/portada.jpg',
            galeria: [
                '../img/eventos/sociales/bautizo-familia-benalcazar/foto-01.jpg',
                '../img/eventos/sociales/bautizo-familia-benalcazar/foto-02.jpg',
                '../img/eventos/sociales/bautizo-familia-benalcazar/foto-03.jpg',
                '../img/eventos/sociales/bautizo-familia-benalcazar/foto-04.jpg',
                '../img/eventos/sociales/bautizo-familia-benalcazar/foto-05.jpg',
                '../img/eventos/sociales/bautizo-familia-benalcazar/foto-06.jpg',
                '../img/eventos/sociales/bautizo-familia-benalcazar/foto-07.jpg',
                '../img/eventos/sociales/bautizo-familia-benalcazar/foto-08.jpg',
                '../img/eventos/sociales/bautizo-familia-benalcazar/foto-09.jpg',
                '../img/eventos/sociales/bautizo-familia-benalcazar/foto-10.jpg',
                '../img/eventos/sociales/bautizo-familia-benalcazar/foto-11.jpg',
                '../img/eventos/sociales/bautizo-familia-benalcazar/foto-12.jpg',
                '../img/eventos/sociales/bautizo-familia-benalcazar/foto-13.jpg',
                '../img/eventos/sociales/bautizo-familia-benalcazar/foto-14.jpg',
                '../img/eventos/sociales/bautizo-familia-benalcazar/foto-15.jpg',
                '../img/eventos/sociales/bautizo-familia-benalcazar/foto-16.jpg',
                '../img/eventos/sociales/bautizo-familia-benalcazar/foto-17.jpg',
                '../img/eventos/sociales/bautizo-familia-benalcazar/foto-18.jpg'
            ]
        },
        {
            id: 'aniversario-10-anos',
            tipo: 'Evento social',
            titulo: 'Cena romántica — Aniversario 10 años',
            fecha: '17 de julio de 2026',
            sucursal: 'Cumbayá',
            descripcion: 'Una velada especial para celebrar diez años de historia, compañía y momentos para recordar.',
            // Fotografías reales pendientes: se prevén 8 fotos en total.
            imagenPortada: '../img/eventos/sociales/aniversario-10-anos/portada.jpg',
            galeria: [
                '../img/eventos/sociales/aniversario-10-anos/foto-01.jpg',
                '../img/eventos/sociales/aniversario-10-anos/foto-02.jpg',
                '../img/eventos/sociales/aniversario-10-anos/foto-03.jpg',
                '../img/eventos/sociales/aniversario-10-anos/foto-04.jpg',
                '../img/eventos/sociales/aniversario-10-anos/foto-05.jpg',
                '../img/eventos/sociales/aniversario-10-anos/foto-06.jpg',
                '../img/eventos/sociales/aniversario-10-anos/foto-07.jpg',
                '../img/eventos/sociales/aniversario-10-anos/foto-08.jpg'
            ]
        },
        {
            id: 'grado-universitario',
            tipo: 'Evento social',
            titulo: 'Celebración de grado universitario',
            fecha: '5 de septiembre de 2026',
            sucursal: 'Cayambe',
            descripcion: 'Una celebración especial para compartir el logro de una nueva etapa junto a familiares y amigos.',
            // Evento aún no realizado (fecha futura). No se muestra en "Eventos realizados".
            estado: 'proximo',
            // Fotografías reales pendientes: se prevén 22 fotos en total.
            imagenPortada: '../img/eventos/sociales/grado-universitario/portada.jpg',
            galeria: [
                '../img/eventos/sociales/grado-universitario/foto-01.jpg',
                '../img/eventos/sociales/grado-universitario/foto-02.jpg',
                '../img/eventos/sociales/grado-universitario/foto-03.jpg',
                '../img/eventos/sociales/grado-universitario/foto-04.jpg',
                '../img/eventos/sociales/grado-universitario/foto-05.jpg',
                '../img/eventos/sociales/grado-universitario/foto-06.jpg',
                '../img/eventos/sociales/grado-universitario/foto-07.jpg',
                '../img/eventos/sociales/grado-universitario/foto-08.jpg',
                '../img/eventos/sociales/grado-universitario/foto-09.jpg',
                '../img/eventos/sociales/grado-universitario/foto-10.jpg',
                '../img/eventos/sociales/grado-universitario/foto-11.jpg',
                '../img/eventos/sociales/grado-universitario/foto-12.jpg',
                '../img/eventos/sociales/grado-universitario/foto-13.jpg',
                '../img/eventos/sociales/grado-universitario/foto-14.jpg',
                '../img/eventos/sociales/grado-universitario/foto-15.jpg',
                '../img/eventos/sociales/grado-universitario/foto-16.jpg',
                '../img/eventos/sociales/grado-universitario/foto-17.jpg',
                '../img/eventos/sociales/grado-universitario/foto-18.jpg',
                '../img/eventos/sociales/grado-universitario/foto-19.jpg',
                '../img/eventos/sociales/grado-universitario/foto-20.jpg',
                '../img/eventos/sociales/grado-universitario/foto-21.jpg',
                '../img/eventos/sociales/grado-universitario/foto-22.jpg'
            ]
        },
        {
            id: 'brunch-club-andino',
            tipo: 'Evento social',
            titulo: 'Brunch de amigas — Club Andino',
            fecha: '8 de noviembre de 2026',
            sucursal: 'Cayambe',
            descripcion: 'Un encuentro para compartir, conversar y disfrutar de una experiencia gastronómica entre amigas.',
            // Evento aún no realizado (fecha futura). No se muestra en "Eventos realizados".
            estado: 'proximo',
            // Fotografías reales pendientes: se prevén 15 fotos en total.
            imagenPortada: '../img/eventos/sociales/brunch-club-andino/portada.jpg',
            galeria: [
                '../img/eventos/sociales/brunch-club-andino/foto-01.jpg',
                '../img/eventos/sociales/brunch-club-andino/foto-02.jpg',
                '../img/eventos/sociales/brunch-club-andino/foto-03.jpg',
                '../img/eventos/sociales/brunch-club-andino/foto-04.jpg',
                '../img/eventos/sociales/brunch-club-andino/foto-05.jpg',
                '../img/eventos/sociales/brunch-club-andino/foto-06.jpg',
                '../img/eventos/sociales/brunch-club-andino/foto-07.jpg',
                '../img/eventos/sociales/brunch-club-andino/foto-08.jpg',
                '../img/eventos/sociales/brunch-club-andino/foto-09.jpg',
                '../img/eventos/sociales/brunch-club-andino/foto-10.jpg',
                '../img/eventos/sociales/brunch-club-andino/foto-11.jpg',
                '../img/eventos/sociales/brunch-club-andino/foto-12.jpg',
                '../img/eventos/sociales/brunch-club-andino/foto-13.jpg',
                '../img/eventos/sociales/brunch-club-andino/foto-14.jpg',
                '../img/eventos/sociales/brunch-club-andino/foto-15.jpg'
            ]
        },
        {
            id: 'baby-shower',
            tipo: 'Evento social',
            titulo: 'Baby Shower sorpresa',
            fecha: 'Fecha por confirmar',
            sucursal: 'Cayambe',
            descripcion: 'Una celebración especial llena de alegría para acompañar la llegada de un nuevo integrante de la familia.',
            // Fotografías reales pendientes: se prevén 13 fotos en total.
            imagenPortada: '../img/eventos/sociales/baby-shower/portada.jpg',
            galeria: [
                '../img/eventos/sociales/baby-shower/foto-01.jpg',
                '../img/eventos/sociales/baby-shower/foto-02.jpg',
                '../img/eventos/sociales/baby-shower/foto-03.jpg',
                '../img/eventos/sociales/baby-shower/foto-04.jpg',
                '../img/eventos/sociales/baby-shower/foto-05.jpg',
                '../img/eventos/sociales/baby-shower/foto-06.jpg',
                '../img/eventos/sociales/baby-shower/foto-07.jpg',
                '../img/eventos/sociales/baby-shower/foto-08.jpg',
                '../img/eventos/sociales/baby-shower/foto-09.jpg',
                '../img/eventos/sociales/baby-shower/foto-10.jpg',
                '../img/eventos/sociales/baby-shower/foto-11.jpg',
                '../img/eventos/sociales/baby-shower/foto-12.jpg',
                '../img/eventos/sociales/baby-shower/foto-13.jpg'
            ]
        },
        {
            id: 'cumpleanos-50',
            tipo: 'Evento social',
            titulo: 'Fiesta de cumpleaños — 50 años',
            fecha: '28 de enero de 2026',
            sucursal: 'Cumbayá',
            descripcion: 'Una celebración especial para compartir y conmemorar cinco décadas de momentos y experiencias.',
            // Fotografías reales pendientes: se prevén 19 fotos en total.
            imagenPortada: '../img/eventos/sociales/cumpleanos-50/portada.jpg',
            galeria: [
                '../img/eventos/sociales/cumpleanos-50/foto-01.jpg',
                '../img/eventos/sociales/cumpleanos-50/foto-02.jpg',
                '../img/eventos/sociales/cumpleanos-50/foto-03.jpg',
                '../img/eventos/sociales/cumpleanos-50/foto-04.jpg',
                '../img/eventos/sociales/cumpleanos-50/foto-05.jpg',
                '../img/eventos/sociales/cumpleanos-50/foto-06.jpg',
                '../img/eventos/sociales/cumpleanos-50/foto-07.jpg',
                '../img/eventos/sociales/cumpleanos-50/foto-08.jpg',
                '../img/eventos/sociales/cumpleanos-50/foto-09.jpg',
                '../img/eventos/sociales/cumpleanos-50/foto-10.jpg',
                '../img/eventos/sociales/cumpleanos-50/foto-11.jpg',
                '../img/eventos/sociales/cumpleanos-50/foto-12.jpg',
                '../img/eventos/sociales/cumpleanos-50/foto-13.jpg',
                '../img/eventos/sociales/cumpleanos-50/foto-14.jpg',
                '../img/eventos/sociales/cumpleanos-50/foto-15.jpg',
                '../img/eventos/sociales/cumpleanos-50/foto-16.jpg',
                '../img/eventos/sociales/cumpleanos-50/foto-17.jpg',
                '../img/eventos/sociales/cumpleanos-50/foto-18.jpg',
                '../img/eventos/sociales/cumpleanos-50/foto-19.jpg'
            ]
        },
        {
            id: 'almuerzo-familiar',
            tipo: 'Evento social',
            titulo: 'Almuerzo familiar de fin de mes',
            fecha: 'Fecha por confirmar',
            sucursal: 'Cumbayá',
            descripcion: 'Un encuentro familiar para compartir una experiencia gastronómica en un ambiente acogedor.',
            // Fotografías reales pendientes: se prevén 10 fotos en total.
            imagenPortada: '../img/eventos/sociales/almuerzo-familiar/portada.jpg',
            galeria: [
                '../img/eventos/sociales/almuerzo-familiar/foto-01.jpg',
                '../img/eventos/sociales/almuerzo-familiar/foto-02.jpg',
                '../img/eventos/sociales/almuerzo-familiar/foto-03.jpg',
                '../img/eventos/sociales/almuerzo-familiar/foto-04.jpg',
                '../img/eventos/sociales/almuerzo-familiar/foto-05.jpg',
                '../img/eventos/sociales/almuerzo-familiar/foto-06.jpg',
                '../img/eventos/sociales/almuerzo-familiar/foto-07.jpg',
                '../img/eventos/sociales/almuerzo-familiar/foto-08.jpg',
                '../img/eventos/sociales/almuerzo-familiar/foto-09.jpg',
                '../img/eventos/sociales/almuerzo-familiar/foto-10.jpg'
            ]
        }
    ];

    /**
     * Tipos de celebraciones sociales que La Doña Hacienda puede acompañar.
     * Es información de referencia (categorías), usada únicamente como
     * respaldo visual si en algún momento `eventosSociales` quedara vacío.
     */
    var tiposEventosSociales = [
        'Día de la Madre',
        'Día del Padre',
        'San Valentín',
        'Navidad',
        'Fin de año',
        'Cumpleaños',
        'Aniversarios',
        'Reuniones familiares',
        'Bautizos',
        'Primeras comuniones',
        'Graduaciones',
        'Otras celebraciones especiales'
    ];

    /**
     * Eventos institucionales.
     * Información proporcionada por el negocio. Las fotografías reales aún
     * no han sido cargadas: las rutas de `imagenPortada` y `galeria` son
     * referencias preparadas (los archivos todavía no existen físicamente
     * en el proyecto) para que puedan colocarse allí más adelante.
     */
    var eventosInstitucionales = [
        {
            id: 'desayuno-constructora-andina',
            tipo: 'Evento institucional',
            titulo: 'Desayuno de trabajo — Constructora Andina',
            fecha: '14 de marzo de 2026',
            sucursal: 'Cayambe',
            descripcion: 'Desayuno de trabajo pensado para compartir, conversar y generar espacios de encuentro empresarial.',
            // Fotografías reales pendientes: se prevén 10 fotos en total.
            imagenPortada: '../img/eventos/institucionales/desayuno-constructora-andina/portada.jpg',
            galeria: [
                '../img/eventos/institucionales/desayuno-constructora-andina/foto-01.jpg',
                '../img/eventos/institucionales/desayuno-constructora-andina/foto-02.jpg',
                '../img/eventos/institucionales/desayuno-constructora-andina/foto-03.jpg',
                '../img/eventos/institucionales/desayuno-constructora-andina/foto-04.jpg',
                '../img/eventos/institucionales/desayuno-constructora-andina/foto-05.jpg',
                '../img/eventos/institucionales/desayuno-constructora-andina/foto-06.jpg',
                '../img/eventos/institucionales/desayuno-constructora-andina/foto-07.jpg',
                '../img/eventos/institucionales/desayuno-constructora-andina/foto-08.jpg',
                '../img/eventos/institucionales/desayuno-constructora-andina/foto-09.jpg',
                '../img/eventos/institucionales/desayuno-constructora-andina/foto-10.jpg'
            ]
        },
        {
            id: 'almuerzo-grupo-medisur',
            tipo: 'Evento institucional',
            titulo: 'Almuerzo de integración — Grupo Medisur',
            fecha: '22 de abril de 2026',
            sucursal: 'Cumbayá',
            descripcion: 'Un espacio de integración empresarial acompañado de una experiencia gastronómica en La Doña Hacienda.',
            // Fotografías reales pendientes: se prevén 14 fotos en total.
            imagenPortada: '../img/eventos/institucionales/almuerzo-grupo-medisur/portada.jpg',
            galeria: [
                '../img/eventos/institucionales/almuerzo-grupo-medisur/foto-01.jpg',
                '../img/eventos/institucionales/almuerzo-grupo-medisur/foto-02.jpg',
                '../img/eventos/institucionales/almuerzo-grupo-medisur/foto-03.jpg',
                '../img/eventos/institucionales/almuerzo-grupo-medisur/foto-04.jpg',
                '../img/eventos/institucionales/almuerzo-grupo-medisur/foto-05.jpg',
                '../img/eventos/institucionales/almuerzo-grupo-medisur/foto-06.jpg',
                '../img/eventos/institucionales/almuerzo-grupo-medisur/foto-07.jpg',
                '../img/eventos/institucionales/almuerzo-grupo-medisur/foto-08.jpg',
                '../img/eventos/institucionales/almuerzo-grupo-medisur/foto-09.jpg',
                '../img/eventos/institucionales/almuerzo-grupo-medisur/foto-10.jpg',
                '../img/eventos/institucionales/almuerzo-grupo-medisur/foto-11.jpg',
                '../img/eventos/institucionales/almuerzo-grupo-medisur/foto-12.jpg',
                '../img/eventos/institucionales/almuerzo-grupo-medisur/foto-13.jpg',
                '../img/eventos/institucionales/almuerzo-grupo-medisur/foto-14.jpg'
            ]
        },
        {
            id: 'lanzamiento-linea-cafe',
            tipo: 'Evento institucional',
            titulo: 'Lanzamiento de nueva línea de café',
            fecha: '1 de junio de 2026',
            sucursal: 'Cumbayá',
            descripcion: 'Un encuentro especial para presentar una nueva propuesta y compartir alrededor de la cultura del café.',
            // Fotografías reales pendientes: se prevén 12 fotos en total.
            imagenPortada: '../img/eventos/institucionales/lanzamiento-linea-cafe/portada.jpg',
            galeria: [
                '../img/eventos/institucionales/lanzamiento-linea-cafe/foto-01.jpg',
                '../img/eventos/institucionales/lanzamiento-linea-cafe/foto-02.jpg',
                '../img/eventos/institucionales/lanzamiento-linea-cafe/foto-03.jpg',
                '../img/eventos/institucionales/lanzamiento-linea-cafe/foto-04.jpg',
                '../img/eventos/institucionales/lanzamiento-linea-cafe/foto-05.jpg',
                '../img/eventos/institucionales/lanzamiento-linea-cafe/foto-06.jpg',
                '../img/eventos/institucionales/lanzamiento-linea-cafe/foto-07.jpg',
                '../img/eventos/institucionales/lanzamiento-linea-cafe/foto-08.jpg',
                '../img/eventos/institucionales/lanzamiento-linea-cafe/foto-09.jpg',
                '../img/eventos/institucionales/lanzamiento-linea-cafe/foto-10.jpg',
                '../img/eventos/institucionales/lanzamiento-linea-cafe/foto-11.jpg',
                '../img/eventos/institucionales/lanzamiento-linea-cafe/foto-12.jpg'
            ]
        },
        {
            id: 'capacitacion-tecnosoluciones',
            tipo: 'Evento institucional',
            titulo: 'Capacitación anual — TecnoSoluciones',
            fecha: '25 de agosto de 2026',
            sucursal: 'Cayambe',
            descripcion: 'Una jornada de capacitación acompañada de un espacio adecuado para el aprendizaje y la integración del equipo.',
            // Fotografías reales pendientes: se prevén 16 fotos en total.
            imagenPortada: '../img/eventos/institucionales/capacitacion-tecnosoluciones/portada.jpg',
            galeria: [
                '../img/eventos/institucionales/capacitacion-tecnosoluciones/foto-01.jpg',
                '../img/eventos/institucionales/capacitacion-tecnosoluciones/foto-02.jpg',
                '../img/eventos/institucionales/capacitacion-tecnosoluciones/foto-03.jpg',
                '../img/eventos/institucionales/capacitacion-tecnosoluciones/foto-04.jpg',
                '../img/eventos/institucionales/capacitacion-tecnosoluciones/foto-05.jpg',
                '../img/eventos/institucionales/capacitacion-tecnosoluciones/foto-06.jpg',
                '../img/eventos/institucionales/capacitacion-tecnosoluciones/foto-07.jpg',
                '../img/eventos/institucionales/capacitacion-tecnosoluciones/foto-08.jpg',
                '../img/eventos/institucionales/capacitacion-tecnosoluciones/foto-09.jpg',
                '../img/eventos/institucionales/capacitacion-tecnosoluciones/foto-10.jpg',
                '../img/eventos/institucionales/capacitacion-tecnosoluciones/foto-11.jpg',
                '../img/eventos/institucionales/capacitacion-tecnosoluciones/foto-12.jpg',
                '../img/eventos/institucionales/capacitacion-tecnosoluciones/foto-13.jpg',
                '../img/eventos/institucionales/capacitacion-tecnosoluciones/foto-14.jpg',
                '../img/eventos/institucionales/capacitacion-tecnosoluciones/foto-15.jpg',
                '../img/eventos/institucionales/capacitacion-tecnosoluciones/foto-16.jpg'
            ]
        },
        {
            id: 'almuerzo-agroexport',
            tipo: 'Evento institucional',
            titulo: 'Almuerzo empresarial — AgroExport',
            fecha: 'Fecha por confirmar',
            sucursal: 'Cumbayá',
            descripcion: 'Un encuentro empresarial acompañado de una experiencia gastronómica pensada para compartir y generar vínculos.',
            // Fotografías reales pendientes: se prevén 11 fotos en total.
            imagenPortada: '../img/eventos/institucionales/almuerzo-agroexport/portada.jpg',
            galeria: [
                '../img/eventos/institucionales/almuerzo-agroexport/foto-01.jpg',
                '../img/eventos/institucionales/almuerzo-agroexport/foto-02.jpg',
                '../img/eventos/institucionales/almuerzo-agroexport/foto-03.jpg',
                '../img/eventos/institucionales/almuerzo-agroexport/foto-04.jpg',
                '../img/eventos/institucionales/almuerzo-agroexport/foto-05.jpg',
                '../img/eventos/institucionales/almuerzo-agroexport/foto-06.jpg',
                '../img/eventos/institucionales/almuerzo-agroexport/foto-07.jpg',
                '../img/eventos/institucionales/almuerzo-agroexport/foto-08.jpg',
                '../img/eventos/institucionales/almuerzo-agroexport/foto-09.jpg',
                '../img/eventos/institucionales/almuerzo-agroexport/foto-10.jpg',
                '../img/eventos/institucionales/almuerzo-agroexport/foto-11.jpg'
            ]
        },
        {
            id: 'reunion-inmobiliaria-real',
            tipo: 'Evento institucional',
            titulo: 'Reunión de socios — Inmobiliaria Real',
            fecha: '18 de octubre de 2026',
            sucursal: 'Cumbayá',
            descripcion: 'Un espacio de encuentro para compartir, conversar y fortalecer vínculos entre socios.',
            // Evento aún no realizado (fecha futura). No se muestra en "Eventos realizados".
            estado: 'proximo',
            // Fotografías reales pendientes: se prevén 9 fotos en total.
            imagenPortada: '../img/eventos/institucionales/reunion-inmobiliaria-real/portada.jpg',
            galeria: [
                '../img/eventos/institucionales/reunion-inmobiliaria-real/foto-01.jpg',
                '../img/eventos/institucionales/reunion-inmobiliaria-real/foto-02.jpg',
                '../img/eventos/institucionales/reunion-inmobiliaria-real/foto-03.jpg',
                '../img/eventos/institucionales/reunion-inmobiliaria-real/foto-04.jpg',
                '../img/eventos/institucionales/reunion-inmobiliaria-real/foto-05.jpg',
                '../img/eventos/institucionales/reunion-inmobiliaria-real/foto-06.jpg',
                '../img/eventos/institucionales/reunion-inmobiliaria-real/foto-07.jpg',
                '../img/eventos/institucionales/reunion-inmobiliaria-real/foto-08.jpg',
                '../img/eventos/institucionales/reunion-inmobiliaria-real/foto-09.jpg'
            ]
        },
        {
            id: 'proyecto-vialcorp',
            tipo: 'Evento institucional',
            titulo: 'Presentación de proyecto — VialCorp',
            fecha: '11 de febrero de 2026',
            sucursal: 'Cayambe',
            descripcion: 'Un encuentro empresarial destinado a presentar y compartir los detalles de un nuevo proyecto.',
            // Fotografías reales pendientes: se prevén 7 fotos en total.
            imagenPortada: '../img/eventos/institucionales/proyecto-vialcorp/portada.jpg',
            galeria: [
                '../img/eventos/institucionales/proyecto-vialcorp/foto-01.jpg',
                '../img/eventos/institucionales/proyecto-vialcorp/foto-02.jpg',
                '../img/eventos/institucionales/proyecto-vialcorp/foto-03.jpg',
                '../img/eventos/institucionales/proyecto-vialcorp/foto-04.jpg',
                '../img/eventos/institucionales/proyecto-vialcorp/foto-05.jpg',
                '../img/eventos/institucionales/proyecto-vialcorp/foto-06.jpg',
                '../img/eventos/institucionales/proyecto-vialcorp/foto-07.jpg'
            ]
        },
        {
            id: 'cena-navidad-grupo-financiero-sur',
            tipo: 'Evento institucional',
            titulo: 'Cena de Navidad — Grupo Financiero Sur',
            fecha: '10 de diciembre de 2025',
            sucursal: 'Cumbayá',
            descripcion: 'Una celebración empresarial de fin de año para compartir y cerrar el año junto al equipo.',
            // Fotografías reales pendientes: se prevén 25 fotos en total.
            imagenPortada: '../img/eventos/institucionales/cena-navidad-grupo-financiero-sur/portada.jpg',
            galeria: [
                '../img/eventos/institucionales/cena-navidad-grupo-financiero-sur/foto-01.jpg',
                '../img/eventos/institucionales/cena-navidad-grupo-financiero-sur/foto-02.jpg',
                '../img/eventos/institucionales/cena-navidad-grupo-financiero-sur/foto-03.jpg',
                '../img/eventos/institucionales/cena-navidad-grupo-financiero-sur/foto-04.jpg',
                '../img/eventos/institucionales/cena-navidad-grupo-financiero-sur/foto-05.jpg',
                '../img/eventos/institucionales/cena-navidad-grupo-financiero-sur/foto-06.jpg',
                '../img/eventos/institucionales/cena-navidad-grupo-financiero-sur/foto-07.jpg',
                '../img/eventos/institucionales/cena-navidad-grupo-financiero-sur/foto-08.jpg',
                '../img/eventos/institucionales/cena-navidad-grupo-financiero-sur/foto-09.jpg',
                '../img/eventos/institucionales/cena-navidad-grupo-financiero-sur/foto-10.jpg',
                '../img/eventos/institucionales/cena-navidad-grupo-financiero-sur/foto-11.jpg',
                '../img/eventos/institucionales/cena-navidad-grupo-financiero-sur/foto-12.jpg',
                '../img/eventos/institucionales/cena-navidad-grupo-financiero-sur/foto-13.jpg',
                '../img/eventos/institucionales/cena-navidad-grupo-financiero-sur/foto-14.jpg',
                '../img/eventos/institucionales/cena-navidad-grupo-financiero-sur/foto-15.jpg',
                '../img/eventos/institucionales/cena-navidad-grupo-financiero-sur/foto-16.jpg',
                '../img/eventos/institucionales/cena-navidad-grupo-financiero-sur/foto-17.jpg',
                '../img/eventos/institucionales/cena-navidad-grupo-financiero-sur/foto-18.jpg',
                '../img/eventos/institucionales/cena-navidad-grupo-financiero-sur/foto-19.jpg',
                '../img/eventos/institucionales/cena-navidad-grupo-financiero-sur/foto-20.jpg',
                '../img/eventos/institucionales/cena-navidad-grupo-financiero-sur/foto-21.jpg',
                '../img/eventos/institucionales/cena-navidad-grupo-financiero-sur/foto-22.jpg',
                '../img/eventos/institucionales/cena-navidad-grupo-financiero-sur/foto-23.jpg',
                '../img/eventos/institucionales/cena-navidad-grupo-financiero-sur/foto-24.jpg',
                '../img/eventos/institucionales/cena-navidad-grupo-financiero-sur/foto-25.jpg'
            ]
        }
    ];

    /* ==========================================================================
       2. UTILIDADES
       ========================================================================== */

    function escapeHtml(value) {
        var div = document.createElement('div');
        div.textContent = value == null ? '' : String(value);
        return div.innerHTML;
    }

    /**
     * Devuelve el listado de imágenes disponibles para un evento:
     * la galería completa si existe, o la imagen de portada como única foto,
     * o un arreglo vacío si no hay ninguna fotografía real todavía.
     */
    function getGalleryImages(item) {
        if (item.galeria && item.galeria.length) {
            return item.galeria;
        }
        if (item.imagenPortada) {
            return [item.imagenPortada];
        }
        return [];
    }

    /**
     * Filtra los eventos que aún no se muestran como "realizados"
     * (los marcados con estado: "proximo" quedan preparados en el arreglo
     * pero no se listan todavía).
     */
    function getVisibleEvents(items) {
        return (items || []).filter(function (item) {
            return item.estado !== 'proximo';
        });
    }

    /* ==========================================================================
       3. RENDERIZADO DE TARJETAS
       ========================================================================== */

    function createPlaceholderElement(text) {
        var wrap = document.createElement('div');
        wrap.className = 'evento-image-placeholder';
        wrap.innerHTML =
            '<span class="placeholder-icon">📷</span>' +
            '<span class="placeholder-tag">' + escapeHtml(text) + '</span>';
        return wrap;
    }

    function createCardElement(item) {
        var card = document.createElement('article');
        card.className = 'evento-item-card';

        // Imagen de portada
        var media = document.createElement('div');
        media.className = 'evento-item-media';

        if (item.imagenPortada) {
            var img = document.createElement('img');
            img.src = item.imagenPortada;
            img.alt = item.titulo;
            img.loading = 'lazy';
            media.appendChild(img);
        } else {
            media.appendChild(createPlaceholderElement('Fotografía por agregar'));
        }

        card.appendChild(media);

        // Contenido de la tarjeta
        var content = document.createElement('div');
        content.className = 'evento-item-content';

        var category = document.createElement('span');
        category.className = 'evento-item-category';
        category.textContent = (item.tipo || '').toUpperCase();
        content.appendChild(category);

        var title = document.createElement('h3');
        title.className = 'evento-item-title';
        title.textContent = item.titulo;
        content.appendChild(title);

        // Fecha + sucursal
        var meta = document.createElement('div');
        meta.className = 'evento-item-meta';

        var date = document.createElement('span');
        date.className = 'evento-item-date';
        date.innerHTML = '<span class="meta-icon">📅</span> ' + escapeHtml(item.fecha || 'Fecha por confirmar');
        meta.appendChild(date);

        if (item.sucursal) {
            var location = document.createElement('span');
            location.className = 'evento-item-location';
            location.innerHTML = '<span class="meta-icon">📍</span> ' + escapeHtml(item.sucursal);
            meta.appendChild(location);
        }

        content.appendChild(meta);

        var desc = document.createElement('p');
        desc.className = 'evento-item-desc';
        desc.textContent = item.descripcion || 'Descripción por completar.';
        content.appendChild(desc);

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'evento-item-btn';
        btn.textContent = 'Ver galería';
        btn.setAttribute('aria-label', 'Ver galería de ' + item.titulo);
        btn.addEventListener('click', function () {
            EventosModal.open(item);
        });
        content.appendChild(btn);

        card.appendChild(content);

        return card;
    }

    function createEmptyStateElement(message, tags) {
        var wrap = document.createElement('div');
        wrap.className = 'eventos-empty-state';

        var text = document.createElement('p');
        text.className = 'eventos-empty-text';
        text.textContent = message;
        wrap.appendChild(text);

        if (tags && tags.length) {
            var tagsWrap = document.createElement('div');
            tagsWrap.className = 'eventos-empty-tags';

            tags.forEach(function (tag) {
                var tagEl = document.createElement('span');
                tagEl.className = 'eventos-empty-tag';
                tagEl.textContent = tag;
                tagsWrap.appendChild(tagEl);
            });

            wrap.appendChild(tagsWrap);
        }

        return wrap;
    }

    function renderGrid(containerId, items, emptyMessage, emptyTags) {
        var container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';

        if (!items || !items.length) {
            container.appendChild(createEmptyStateElement(emptyMessage, emptyTags));
            return;
        }

        var grid = document.createElement('div');
        grid.className = 'eventos-grid-dynamic';

        items.forEach(function (item) {
            grid.appendChild(createCardElement(item));
        });

        container.appendChild(grid);
    }

    function renderAllGrids() {
        renderGrid(
            'socialesGrid',
            getVisibleEvents(eventosSociales),
            'Aún no hemos registrado fotografías de eventos sociales. Pronto compartiremos aquí celebraciones como:',
            tiposEventosSociales
        );

        renderGrid(
            'institucionalesGrid',
            getVisibleEvents(eventosInstitucionales),
            'Aún no hay eventos institucionales registrados.',
            []
        );
    }

    /* ==========================================================================
       4. MÓDULO DE TABS (Eventos sociales / institucionales)
       ========================================================================== */

    var EventosTabs = (function () {
        function init() {
            var tabButtons = document.querySelectorAll('[data-eventos-tab]');
            var panels = document.querySelectorAll('[data-eventos-panel]');

            if (!tabButtons.length || !panels.length) return;

            tabButtons.forEach(function (btn) {
                btn.addEventListener('click', function () {
                    var target = btn.getAttribute('data-eventos-tab');

                    tabButtons.forEach(function (b) {
                        var isTarget = b === btn;
                        b.classList.toggle('is-active', isTarget);
                        b.setAttribute('aria-selected', isTarget ? 'true' : 'false');
                    });

                    panels.forEach(function (panel) {
                        var match = panel.getAttribute('data-eventos-panel') === target;
                        panel.hidden = !match;
                    });
                });
            });
        }

        return { init: init };
    })();

    /* ==========================================================================
       5. MÓDULO DE MODAL / GALERÍA
       ========================================================================== */

    var EventosModal = (function () {
        var modal, backdrop, closeBtn, mediaFrame, prevBtn, nextBtn, counterEl;
        var titleEl, dateEl, locationEl, descriptionEl, categoryEl;
        var lastActiveElement = null;
        var currentImages = [];
        var currentIndex = 0;

        function init() {
            modal = document.getElementById('eventoModal');
            if (!modal) return;

            backdrop = document.getElementById('modalBackdrop');
            closeBtn = document.getElementById('modalCloseBtn');
            mediaFrame = document.getElementById('modalMediaFrame');
            prevBtn = document.getElementById('modalPrevBtn');
            nextBtn = document.getElementById('modalNextBtn');
            counterEl = document.getElementById('modalCounter');
            titleEl = document.getElementById('modalTitle');
            dateEl = document.getElementById('modalDate');
            locationEl = document.getElementById('modalLocation');
            descriptionEl = document.getElementById('modalDescription');
            categoryEl = document.getElementById('modalCategory');

            if (closeBtn) closeBtn.addEventListener('click', closeModal);
            if (backdrop) backdrop.addEventListener('click', closeModal);
            if (prevBtn) prevBtn.addEventListener('click', showPrevious);
            if (nextBtn) nextBtn.addEventListener('click', showNext);

            document.addEventListener('keydown', function (e) {
                if (!isModalOpen()) return;

                if (e.key === 'Escape') {
                    closeModal();
                } else if (e.key === 'ArrowLeft') {
                    showPrevious();
                } else if (e.key === 'ArrowRight') {
                    showNext();
                }
            });
        }

        function open(item) {
            lastActiveElement = document.activeElement;
            currentImages = getGalleryImages(item);
            currentIndex = 0;

            if (titleEl) titleEl.textContent = item.titulo;
            if (categoryEl) categoryEl.textContent = (item.tipo || '').toUpperCase();
            if (dateEl) dateEl.textContent = item.fecha || 'Fecha por confirmar';

            if (locationEl) {
                if (item.sucursal) {
                    locationEl.innerHTML = '<span class="meta-icon">📍</span> ' + escapeHtml(item.sucursal);
                    locationEl.hidden = false;
                } else {
                    locationEl.hidden = true;
                }
            }

            if (descriptionEl) descriptionEl.textContent = item.descripcion || 'Descripción por completar.';

            renderMedia(item.titulo);
            openModal();
        }

        function renderMedia(altText) {
            if (!mediaFrame) return;
            mediaFrame.innerHTML = '';

            if (!currentImages.length) {
                mediaFrame.appendChild(createPlaceholderElement('Fotografías por agregar'));
                setNavVisibility(false);
                return;
            }

            var img = document.createElement('img');
            img.src = currentImages[currentIndex];
            img.alt = altText + ' — fotografía ' + (currentIndex + 1) + ' de ' + currentImages.length;
            img.loading = 'lazy';
            mediaFrame.appendChild(img);

            setNavVisibility(currentImages.length > 1);

            if (counterEl) {
                if (currentImages.length > 1) {
                    counterEl.hidden = false;
                    counterEl.textContent = (currentIndex + 1) + ' / ' + currentImages.length;
                } else {
                    counterEl.hidden = true;
                }
            }
        }

        function setNavVisibility(visible) {
            if (prevBtn) prevBtn.hidden = !visible;
            if (nextBtn) nextBtn.hidden = !visible;
            if (!visible && counterEl) counterEl.hidden = true;
        }

        function showPrevious() {
            if (currentImages.length < 2) return;
            currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
            renderMedia(titleEl ? titleEl.textContent : '');
        }

        function showNext() {
            if (currentImages.length < 2) return;
            currentIndex = (currentIndex + 1) % currentImages.length;
            renderMedia(titleEl ? titleEl.textContent : '');
        }

        function openModal() {
            if (!modal) return;

            modal.classList.add('is-active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';

            if (closeBtn) closeBtn.focus();
        }

        function closeModal() {
            if (!modal) return;

            modal.classList.remove('is-active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';

            if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
                lastActiveElement.focus();
            }
        }

        function isModalOpen() {
            return modal && modal.classList.contains('is-active');
        }

        return {
            init: init,
            open: open,
            close: closeModal
        };
    })();

    /* ==========================================================================
       6. INICIALIZACIÓN
       ========================================================================== */

    function initEventos() {
        renderAllGrids();
        EventosModal.init();
        EventosTabs.init();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEventos);
    } else {
        initEventos();
    }

    // API pública ligera para extensiones futuras sin contaminar el scope global
    window.LaDonaEventos = {
        Modal: EventosModal,
        Tabs: EventosTabs,
        data: {
            eventosSociales: eventosSociales,
            eventosInstitucionales: eventosInstitucionales
        }
    };
})();
