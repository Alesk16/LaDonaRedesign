/**
 * LA DOÑA HACIENDA — LÓGICA EXCLUSIVA DE EVENTOS (pages/eventos.html)
 * Archivo: js/eventos.js
 *
 * Responsabilidades:
 * 1. Control del modal / lightbox de vista ampliada para la galería de eventos realizados.
 * 2. Manejo accesible de apertura, cierre (botón, backdrop, tecla ESC) y foco del modal.
 * 3. Preparación de interacciones en tarjetas de eventos sin dependencias de backend.
 * 4. Arquitectura modular para filtrado por sucursal o categoría cuando se incorporen datos reales.
 */

(function () {
  'use strict';

  /**
   * Módulo de Modal / Vista ampliada para galería de eventos realizados
   */
  const EventosModal = (function () {
    let modal = null;
    let backdrop = null;
    let closeBtn = null;
    let mediaContainer = null;
    let titleEl = null;
    let dateEl = null;
    let descriptionEl = null;
    let categoryEl = null;
    let lastActiveElement = null;

    /**
     * Inicializa los elementos del modal y sus listeners
     */
    function init() {
      modal = document.getElementById('eventoModal');
      if (!modal) return;

      backdrop = document.getElementById('modalBackdrop');
      closeBtn = document.getElementById('modalCloseBtn');
      mediaContainer = document.getElementById('modalMedia');
      titleEl = document.getElementById('modalTitle');
      dateEl = document.getElementById('modalDate');
      descriptionEl = document.getElementById('modalDescription');
      categoryEl = document.getElementById('modalCategory');

      // Listeners de cierre
      if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
      }

      if (backdrop) {
        backdrop.addEventListener('click', closeModal);
      }

      // Cerrar al presionar la tecla ESC
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && isModalOpen()) {
          closeModal();
        }
      });

      // Configurar tarjetas de eventos realizados como disparadores del modal
      setupTriggers();
    }

    /**
     * Configura los eventos click y teclado (Enter/Espacio) en las tarjetas de galería
     */
    function setupTriggers() {
      const triggers = document.querySelectorAll('[data-evento-modal="true"], .evento-realizado-card');

      triggers.forEach(function (card) {
        // Asegurar accesibilidad
        if (!card.hasAttribute('tabindex')) {
          card.setAttribute('tabindex', '0');
        }
        if (!card.hasAttribute('role')) {
          card.setAttribute('role', 'button');
        }

        // Listener de clic
        card.addEventListener('click', function (e) {
          // Prevenir activación si se hizo clic en un enlace interno
          if (e.target.closest('a, button')) return;
          openFromElement(card);
        });

        // Listener de teclado (Accesibilidad)
        card.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            if (e.target.closest('a, button')) return;
            e.preventDefault();
            openFromElement(card);
          }
        });
      });
    }

    /**
     * Abre el modal extrayendo la información del elemento disparador
     */
    function openFromElement(el) {
      lastActiveElement = el;

      // Obtener datos del elemento o de su contenido interno
      const title = el.getAttribute('data-title') || 
                    (el.querySelector('.evento-header h3') ? el.querySelector('.evento-header h3').textContent.trim() : 'Celebración realizada');
      
      const date = el.getAttribute('data-date') || 
                   (el.querySelector('.meta-text') ? el.querySelector('.meta-text').textContent.trim() : 'Fecha archivada');
      
      const desc = el.getAttribute('data-description') || 
                   (el.querySelector('.evento-description') ? el.querySelector('.evento-description').textContent.trim() : 'Registro fotográfico y memoria de eventos realizados en nuestras instalaciones.');
      
      const category = el.getAttribute('data-category') || 'EVENTO REALIZADO';
      const imgSrc = el.getAttribute('data-img');
      const imgAlt = el.getAttribute('data-img-alt') || title;

      // Actualizar contenido del modal
      if (titleEl) titleEl.textContent = title;
      if (dateEl) dateEl.textContent = date;
      if (descriptionEl) descriptionEl.textContent = desc;
      if (categoryEl) categoryEl.textContent = category;

      // Actualizar media (imagen real o placeholder visual)
      if (mediaContainer) {
        mediaContainer.innerHTML = '';
        if (imgSrc) {
          const img = document.createElement('img');
          img.src = imgSrc;
          img.alt = imgAlt;
          img.loading = 'lazy';
          mediaContainer.appendChild(img);
        } else {
          // Si no hay imagen real cargada, clonar el placeholder visual existente
          const existingPlaceholder = el.querySelector('.evento-image-placeholder');
          if (existingPlaceholder) {
            const clone = existingPlaceholder.cloneNode(true);
            mediaContainer.appendChild(clone);
          } else {
            const defaultPlaceholder = document.createElement('div');
            defaultPlaceholder.className = 'evento-image-placeholder realizado-placeholder';
            defaultPlaceholder.innerHTML = '<span class="placeholder-icon">📸</span><span class="placeholder-tag">Galería de evento</span>';
            mediaContainer.appendChild(defaultPlaceholder);
          }
        }
      }

      openModal();
    }

    /**
     * Muestra el modal
     */
    function openModal() {
      if (!modal) return;

      modal.classList.add('is-active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      // Foco en el botón de cerrar
      if (closeBtn) {
        closeBtn.focus();
      }
    }

    /**
     * Cierra el modal y devuelve el foco
     */
    function closeModal() {
      if (!modal) return;

      modal.classList.remove('is-active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';

      // Restaurar el foco al elemento disparador
      if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
        lastActiveElement.focus();
      }
    }

    /**
     * Verifica si el modal está abierto
     */
    function isModalOpen() {
      return modal && modal.classList.contains('is-active');
    }

    return {
      init: init,
      open: openModal,
      close: closeModal,
      setupTriggers: setupTriggers
    };
  })();

  /**
   * Módulo para Interacciones de Tarjetas y Enlaces
   */
  const EventosInteractions = (function () {
    function init() {
      // Manejo accesible para enlaces tipo placeholder (#)
      const placeholderLinks = document.querySelectorAll('.eventos-grid a[href="#"], .eventos-fijos-grid a[href="#"]');

      placeholderLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
          e.preventDefault();
          const originalText = link.textContent.trim();
          link.textContent = 'Próximamente disponible';
          link.style.pointerEvents = 'none';

          setTimeout(function () {
            link.textContent = originalText;
            link.style.pointerEvents = '';
          }, 1800);
        });
      });
    }

    return {
      init: init
    };
  })();

  /**
   * Módulo de Filtrado de Eventos (Estructura lista para futuras activaciones)
   */
  const EventosFilter = (function () {
    let currentFilter = 'todos';

    /**
     * Filtra los elementos según el criterio especificado
     * @param {string} filterValue - Valor del filtro (ej: 'todos', 'cayambe', 'cumbaya')
     */
    function applyFilter(filterValue) {
      currentFilter = filterValue || 'todos';
      const items = document.querySelectorAll('.evento-card, .evento-fijo-card, .evento-realizado-card');

      items.forEach(function (item) {
        const itemLocation = (item.getAttribute('data-sucursal') || '').toLowerCase();
        const itemType = (item.getAttribute('data-tipo') || '').toLowerCase();

        if (
          currentFilter === 'todos' ||
          itemLocation === currentFilter ||
          itemType === currentFilter
        ) {
          item.style.display = '';
          item.removeAttribute('aria-hidden');
        } else {
          item.style.display = 'none';
          item.setAttribute('aria-hidden', 'true');
        }
      });
    }

    /**
     * Inicializa los listeners en botones de filtro si se agregan en el HTML
     */
    function init() {
      const filterButtons = document.querySelectorAll('[data-evento-filter]');

      filterButtons.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          const filterValue = btn.getAttribute('data-evento-filter');

          // Actualizar estado activo en botones de filtro
          filterButtons.forEach(function (b) {
            b.classList.remove('active');
            b.setAttribute('aria-pressed', 'false');
          });

          btn.classList.add('active');
          btn.setAttribute('aria-pressed', 'true');

          applyFilter(filterValue);
        });
      });
    }

    return {
      init: init,
      applyFilter: applyFilter,
      getCurrentFilter: function () {
        return currentFilter;
      }
    };
  })();

  /**
   * Inicialización global de eventos al cargar el DOM
   */
  function initEventos() {
    EventosModal.init();
    EventosInteractions.init();
    EventosFilter.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEventos);
  } else {
    initEventos();
  }

  // Exportar API pública ligera para extensiones futuras sin contaminar el scope global
  window.LaDonaEventos = {
    Modal: EventosModal,
    Filter: EventosFilter,
    Interactions: EventosInteractions
  };
})();
