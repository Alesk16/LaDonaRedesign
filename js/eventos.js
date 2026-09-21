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
            id: 'cumpleanos-50',
            tipo: 'Evento social',
            titulo: 'Fiesta de cumpleaños — 50 años',
            fecha: '28 de enero de 2026',
            sucursal: 'Cumbayá',
            descripcion: 'Una celebración especial para compartir y conmemorar cinco décadas de momentos y experiencias.',
            imagenPortada: '../img/eventos/sociales/cumpleanos-50/foto-01.jpg',
            galeria: [
                '../img/eventos/sociales/cumpleanos-50/foto-01.jpg',
                '../img/eventos/sociales/cumpleanos-50/foto-02.jpg',
                '../img/eventos/sociales/cumpleanos-50/foto-03.jpg',
                '../img/eventos/sociales/cumpleanos-50/foto-04.jpg',
                '../img/eventos/sociales/cumpleanos-50/foto-05.jpg',
                '../img/eventos/sociales/cumpleanos-50/foto-06.jpg',
                '../img/eventos/sociales/cumpleanos-50/foto-07.jpg',
                '../img/eventos/sociales/cumpleanos-50/foto-08.jpg'
            ]
        },
        {
            id: 'bautizo-familia-joaquin',
            tipo: 'Evento social',
            titulo: 'Bautizo familia Joaquín',
            fecha: 'Fecha por confirmar',
            sucursal: 'Sucursal por confirmar',
            descripcion: 'Una celebración familiar especial compartida en La Doña Hacienda.',
            imagenPortada: '../img/eventos/sociales/bautizo-familia-joaquin/foto-01.jpg',
            galeria: [
                '../img/eventos/sociales/bautizo-familia-joaquin/foto-01.jpg',
                '../img/eventos/sociales/bautizo-familia-joaquin/foto-02.jpg',
                '../img/eventos/sociales/bautizo-familia-joaquin/foto-03.jpg',
                '../img/eventos/sociales/bautizo-familia-joaquin/foto-04.jpg',
                '../img/eventos/sociales/bautizo-familia-joaquin/foto-05.jpg',
                '../img/eventos/sociales/bautizo-familia-joaquin/foto-06.jpg'
            ]
        },
        {
            id: 'cumpleanos-80',
            tipo: 'Evento social',
            titulo: 'Cumpleaños de 80 años',
            fecha: 'Fecha por confirmar',
            sucursal: 'Sucursal por confirmar',
            descripcion: 'Una celebración especial para conmemorar ochenta años de vida en La Doña Hacienda.',
            imagenPortada: '../img/eventos/sociales/cumpleanos-80/foto-01.jpg',
            galeria: [
                '../img/eventos/sociales/cumpleanos-80/foto-01.jpg',
                '../img/eventos/sociales/cumpleanos-80/foto-02.jpg',
                '../img/eventos/sociales/cumpleanos-80/foto-03.jpg',
                '../img/eventos/sociales/cumpleanos-80/foto-04.jpg',
                '../img/eventos/sociales/cumpleanos-80/foto-05.jpg'
            ]
        },
        {
            id: 'boda-cayambe',
            tipo: 'Evento social',
            titulo: 'Boda, sucursal Cayambe',
            fecha: 'Fecha por confirmar',
            sucursal: 'Cayambe',
            descripcion: 'Una boda celebrada en las instalaciones de La Doña Hacienda.',
            imagenPortada: '../img/eventos/sociales/boda-cayambe/foto-01.jpg',
            galeria: [
                '../img/eventos/sociales/boda-cayambe/foto-01.jpg',
                '../img/eventos/sociales/boda-cayambe/foto-02.jpg',
                '../img/eventos/sociales/boda-cayambe/foto-03.jpg',
                '../img/eventos/sociales/boda-cayambe/foto-04.jpg'
            ]
        },
        {
            id: 'dia-de-la-madre',
            tipo: 'Evento social',
            titulo: 'Celebración del Día de la Madre',
            fecha: 'Fecha por confirmar',
            sucursal: 'Sucursal por confirmar',
            descripcion: 'Una celebración especial del Día de la Madre en La Doña Hacienda.',
            imagenPortada: '../img/eventos/sociales/dia-de-la-madre/foto-01.jpg',
            galeria: [
                '../img/eventos/sociales/dia-de-la-madre/foto-01.jpg',
                '../img/eventos/sociales/dia-de-la-madre/foto-02.jpg',
                '../img/eventos/sociales/dia-de-la-madre/foto-03.jpg',
                '../img/eventos/sociales/dia-de-la-madre/foto-04.jpg',
                '../img/eventos/sociales/dia-de-la-madre/foto-05.jpg',
                '../img/eventos/sociales/dia-de-la-madre/foto-06.jpg',
                '../img/eventos/sociales/dia-de-la-madre/foto-07.jpg'
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
            id: 'Reunión-byrcon',
            tipo: 'Evento institucional',
            titulo: 'Reunión de trabajo — Byrcon',
            fecha: '14 de marzo de 2026',
            sucursal: 'Cayambe',
            descripcion: 'Reunión de trabajo pensada para compartir, conversar y generar espacios de encuentro empresarial.',
            // Fotografías reales pendientes: se prevén 10 fotos en total.
            imagenPortada: '../img/eventos/institucionales/reunión-byrcon/portada.jpg',
            galeria: [
                '../img/eventos/institucionales/reunión-byrcon/foto-01.jpg',
                '../img/eventos/institucionales/reunión-byrcon/foto-02.jpg',
                '../img/eventos/institucionales/reunión-byrcon/foto-03.jpg',
                '../img/eventos/institucionales/reunión-byrcon/foto-04.jpg',
                '../img/eventos/institucionales/reunión-byrcon/foto-05.jpg'
            ]
        },
        {
            id: 'evento-corporativo',
            tipo: 'Evento institucional',
            titulo: 'Evento corporativo', // TODO: confirmar nombre real del cliente
            fecha: 'Fecha por confirmar',
            sucursal: 'Sucursal por confirmar',
            descripcion: 'Un encuentro corporativo realizado en las instalaciones de La Doña Hacienda.',
            imagenPortada: '../img/eventos/institucionales/evento-corporativo/foto-01.jpg',
            galeria: [
                '../img/eventos/institucionales/evento-corporativo/foto-01.jpg',
                '../img/eventos/institucionales/evento-corporativo/foto-02.jpg',
                '../img/eventos/institucionales/evento-corporativo/foto-03.jpg'
            ]
        },
        {
            id: 'evento-corporativo-cayambe',
            tipo: 'Evento institucional',
            titulo: 'Evento corporativo, sucursal Cayambe', // TODO: confirmar nombre real del cliente
            fecha: 'Fecha por confirmar',
            sucursal: 'Cayambe',
            descripcion: 'Un encuentro corporativo realizado en las instalaciones de La Doña Hacienda.',
            imagenPortada: '../img/eventos/institucionales/evento-corporativo-cayambe/foto-01.jpg',
            galeria: [
                '../img/eventos/institucionales/evento-corporativo-cayambe/foto-01.jpg',
                '../img/eventos/institucionales/evento-corporativo-cayambe/foto-02.jpg',
                '../img/eventos/institucionales/evento-corporativo-cayambe/foto-03.jpg',
                '../img/eventos/institucionales/evento-corporativo-cayambe/foto-04.jpg',
                '../img/eventos/institucionales/evento-corporativo-cayambe/foto-05.jpg'
            ]
        },
        {
            id: 'lee-jeans-ecuador',
            tipo: 'Evento institucional',
            titulo: 'Evento corporativo, Lee Jeans Ecuador',
            fecha: 'Fecha por confirmar',
            sucursal: 'Sucursal por confirmar',
            descripcion: 'Un encuentro corporativo realizado en las instalaciones de La Doña Hacienda.',
            imagenPortada: '../img/eventos/institucionales/lee-jeans-ecuador/foto-01.jpg',
            galeria: [
                '../img/eventos/institucionales/lee-jeans-ecuador/foto-01.jpg',
                '../img/eventos/institucionales/lee-jeans-ecuador/foto-02.jpg',
                '../img/eventos/institucionales/lee-jeans-ecuador/foto-03.jpg',
                '../img/eventos/institucionales/lee-jeans-ecuador/foto-04.jpg',
                '../img/eventos/institucionales/lee-jeans-ecuador/foto-05.jpg'
            ]
        },
        {
            id: 'coworking-cerveceria-nacional',
            tipo: 'Evento institucional',
            titulo: 'Coworking, Cervecería Nacional',
            fecha: 'Fecha por confirmar',
            sucursal: 'Sucursal por confirmar',
            descripcion: 'Un espacio de coworking compartido en las instalaciones de La Doña Hacienda.',
            imagenPortada: '../img/eventos/institucionales/coworking-cerveceria-nacional/foto-01.jpg',
            galeria: [
                '../img/eventos/institucionales/coworking-cerveceria-nacional/foto-01.jpg',
                '../img/eventos/institucionales/coworking-cerveceria-nacional/foto-02.jpg',
                '../img/eventos/institucionales/coworking-cerveceria-nacional/foto-03.jpg',
                '../img/eventos/institucionales/coworking-cerveceria-nacional/foto-04.jpg'
            ]
        },
        {
            id: 'evento-corporativo-cayambe-2',
            tipo: 'Evento institucional',
            titulo: 'Evento corporativo, sucursal Cayambe', // TODO: confirmar nombre real del cliente y diferenciarlo del otro evento en Cayambe
            fecha: 'Fecha por confirmar',
            sucursal: 'Cayambe',
            descripcion: 'Un encuentro corporativo realizado en las instalaciones de La Doña Hacienda.',
            imagenPortada: '../img/eventos/institucionales/evento-corporativo-cayambe-2/foto-01.jpg',
            galeria: [
                '../img/eventos/institucionales/evento-corporativo-cayambe-2/foto-01.jpg',
                '../img/eventos/institucionales/evento-corporativo-cayambe-2/foto-02.jpg',
                '../img/eventos/institucionales/evento-corporativo-cayambe-2/foto-03.jpg',
                '../img/eventos/institucionales/evento-corporativo-cayambe-2/foto-04.jpg'
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
            // Fallback visual: si el archivo todavía no existe o falla al cargar,
            // se reemplaza por el mismo placeholder usado cuando no hay ruta.
            img.addEventListener('error', function () {
                media.innerHTML = '';
                media.appendChild(createPlaceholderElement('Fotografía por agregar'));
            }, { once: true });
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
            // Fallback visual: si esta fotografía todavía no existe o falla al
            // cargar, se muestra el placeholder sin afectar navegación ni contador
            // (que siguen dependiendo únicamente de currentImages.length).
            img.addEventListener('error', function () {
                mediaFrame.innerHTML = '';
                mediaFrame.appendChild(createPlaceholderElement('Fotografía por agregar'));
            }, { once: true });
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
