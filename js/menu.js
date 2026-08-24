/**
 * LA DOÑA HACIENDA — LÓGICA DE NAVEGACIÓN DEL MENÚ
 * Archivo: js/menu.js
 *
 * Responsabilidades:
 * - Mostrar una única categoría a la vez y ocultar las demás.
 * - Actualizar el estado visual de la categoría activa (desktop y móvil).
 * - Controlar la apertura y cierre del selector desplegable en dispositivos móviles.
 * - Navegación entre categorías mediante botones "Anterior" / "Siguiente".
 * - Soporte para navegación por URL hash (#desayunos, #entradas, etc.).
 * - Scroll suave controlado por JS al cambiar de categoría:
 *     → Calcula offset real del header fijo + barra de categorías sticky.
 *     → Funciona en desktop y móvil.
 *     → Al cargar con hash, evita el scroll nativo del navegador.
 */

(function () {
  'use strict';

  // Lista ordenada de identificadores de categoría válidos
  const CATEGORIES = [
    'desayunos',
    'entradas',
    'especialidades',
    'sanduches',
    'hamburguesas',
    'vegetariano',
    'postres',
    'cafeteria',
    'chocolate',
    'bebidas',
    'cervezas-vinos'
  ];

  // Nombres legibles para el selector móvil
  const CATEGORY_NAMES = {
    'desayunos': 'Desayunos',
    'entradas': 'Entradas y Picadas',
    'especialidades': 'Especialidades de la Hacienda',
    'sanduches': 'Sanduches',
    'hamburguesas': 'Hamburguesas',
    'vegetariano': 'Opción vegetariana',
    'postres': 'Postres',
    'cafeteria': 'Cafetería',
    'chocolate': 'Chocolate',
    'bebidas': 'Bebidas',
    'cervezas-vinos': 'Cervezas y vinos'
  };

  // Elementos del DOM
  let categoryNav = null;
  let categoryToggle = null;
  let categoryToggleCurrent = null;
  let categoryList = null;
  let categoryLinks = [];
  let categorySections = [];
  let activeCategoryId = 'desayunos';

  /**
   * Calcula el offset total de los elementos fijos/sticky que cubren la parte
   * superior de la ventana: header fijo + barra de categorías sticky.
   *
   * Se mide dinámicamente con getBoundingClientRect para ser exacto en cualquier
   * breakpoint y estado del header (transparente vs. scrolled).
   *
   * @returns {number} Offset en píxeles a restar del scroll target
   */
  function getStickyOffset() {
    var offset = 0;

    // 1. Header fijo
    var header = document.querySelector('.header');
    if (header) {
      offset += header.getBoundingClientRect().height;
    }

    // 2. Barra de categorías sticky
    if (categoryNav) {
      offset += categoryNav.getBoundingClientRect().height;
    }

    // Pequeño margen de respiración (8px) para que el título no quede
    // pegado a la barra de categorías
    offset += 8;

    return offset;
  }

  /**
   * Realiza un scroll hasta la sección activa, compensando exactamente
   * la altura de los elementos fijos (header + barra de categorías sticky).
   *
   * @param {string} categoryId     ID de la sección objetivo
   * @param {string} [behavior]     'smooth' | 'instant' (default: 'smooth')
   */
  function scrollToSection(categoryId, behavior) {
    behavior = behavior || 'smooth';

    var section = document.getElementById(categoryId);
    if (!section) return;

    // getBoundingClientRect da la posición relativa al viewport actual
    var rect = section.getBoundingClientRect();
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    var stickyOffset = getStickyOffset();
    var targetY = scrollTop + rect.top - stickyOffset;

    window.scrollTo({
      top: Math.max(0, targetY),
      behavior: behavior
    });
  }

  /**
   * Inicialización al cargar el DOM
   */
  function init() {
    categoryNav = document.getElementById('categoryNav');
    categoryToggle = document.getElementById('categoryToggle');
    categoryToggleCurrent = document.getElementById('categoryToggleCurrent');
    categoryList = document.getElementById('categoryList');

    if (!categoryNav) return;

    categoryLinks = Array.from(categoryNav.querySelectorAll('.menu-nav-link'));
    categorySections = Array.from(document.querySelectorAll('.menu-page-section'));

    // Configurar listeners de la barra de navegación (desktop y móvil)
    categoryLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var targetId = getTargetIdFromHref(link.getAttribute('href'));
        if (targetId) {
          switchCategory(targetId, true);
        }
      });
    });

    // Configurar toggle móvil
    if (categoryToggle) {
      categoryToggle.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = categoryNav.classList.contains('is-open');
        setMobileDropdown(!isOpen);
      });
    }

    // Cerrar desplegable móvil al hacer clic fuera
    document.addEventListener('click', function (e) {
      if (categoryNav && !categoryNav.contains(e.target)) {
        setMobileDropdown(false);
      }
    });

    // Cerrar desplegable móvil al presionar Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && categoryNav.classList.contains('is-open')) {
        setMobileDropdown(false);
      }
    });

    // Delegación de eventos para botones "Anterior" y "Siguiente"
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.menu-nav-btn');
      if (btn) {
        e.preventDefault();
        var targetId = btn.getAttribute('data-target') || getTargetIdFromHref(btn.getAttribute('href'));
        if (targetId) {
          switchCategory(targetId, true);
        }
      }
    });

    // Escuchar cambios de hash en la ventana (navegación atrás/adelante del navegador)
    window.addEventListener('hashchange', function () {
      var hashId = getHashCategoryId();
      if (hashId && hashId !== activeCategoryId) {
        switchCategory(hashId, true);
      }
    });

    // -----------------------------------------------------------------------
    // Categoría inicial desde el hash o por defecto 'desayunos'
    //
    // Si la página se carga con un hash válido (#chocolate, #cafeteria, etc.):
    //   1. Mostramos la sección correcta sin hacer scroll todavía.
    //   2. Tras dos requestAnimationFrame (para que el browser haya pintado
    //      y haya intentado su scroll nativo al hash), hacemos scroll 'instant'
    //      con nuestro offset correcto. Esto cancela cualquier posición incorrecta
    //      del browser y posiciona el título debajo de los elementos sticky.
    // -----------------------------------------------------------------------
    var initialHash = getHashCategoryId();
    var initialCategory = CATEGORIES.includes(initialHash) ? initialHash : 'desayunos';

    if (initialHash && CATEGORIES.includes(initialHash)) {
      // Mostrar la sección correcta sin scroll todavía
      switchCategory(initialCategory, false);

      // Después del primer paint, reposicionar instantáneamente
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          scrollToSection(initialCategory, 'instant');
        });
      });
    } else {
      switchCategory(initialCategory, false);
    }
  }

  /**
   * Extrae el ID de categoría del hash de la URL
   */
  function getHashCategoryId() {
    var rawHash = window.location.hash.replace(/^#/, '').trim();
    return CATEGORIES.includes(rawHash) ? rawHash : null;
  }

  /**
   * Extrae el ID de categoría de un atributo href (ej. "#sanduches" -> "sanduches")
   */
  function getTargetIdFromHref(href) {
    if (!href) return null;
    var match = href.match(/#([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  }

  /**
   * Abre o cierra el selector desplegable móvil
   */
  function setMobileDropdown(open) {
    if (!categoryNav) return;
    categoryNav.classList.toggle('is-open', open);
    if (categoryList) {
      categoryList.classList.toggle('is-open', open);
    }
    if (categoryToggle) {
      categoryToggle.classList.toggle('is-open', open);
      categoryToggle.setAttribute('aria-expanded', String(open));
    }
  }

  /**
   * Cambia la categoría activa y actualiza la vista
   * @param {string}  categoryId   ID de la categoría a mostrar
   * @param {boolean} shouldScroll Si se debe realizar scroll al contenido
   */
  function switchCategory(categoryId, shouldScroll) {
    if (!CATEGORIES.includes(categoryId)) {
      categoryId = 'desayunos';
    }

    activeCategoryId = categoryId;

    // 1. Mostrar únicamente la sección seleccionada y ocultar todas las demás
    categorySections.forEach(function (section) {
      var isTarget = section.id === categoryId;
      section.classList.toggle('is-active', isTarget);
      if (isTarget) {
        section.removeAttribute('hidden');
      } else {
        section.setAttribute('hidden', '');
      }
    });

    // 2. Actualizar estado visual de los enlaces de navegación (desktop & móvil)
    categoryLinks.forEach(function (link) {
      var linkTarget = getTargetIdFromHref(link.getAttribute('href')) || link.getAttribute('data-category');
      var isActive = linkTarget === categoryId;
      link.classList.toggle('is-active', isActive);
      link.setAttribute('aria-selected', String(isActive));
    });

    // 3. Actualizar texto en el selector móvil
    if (categoryToggleCurrent) {
      categoryToggleCurrent.textContent = CATEGORY_NAMES[categoryId] || categoryId;
    }

    // 4. Cerrar menú móvil si estaba abierto
    setMobileDropdown(false);

    // 5. Actualizar hash en la URL sin salto brusco
    if (window.location.hash !== '#' + categoryId) {
      if (history.replaceState) {
        history.replaceState(null, '', '#' + categoryId);
      } else {
        window.location.hash = '#' + categoryId;
      }
    }

    // 6. Scroll hacia el inicio de la categoría activa
    if (shouldScroll) {
      // rAF garantiza que hidden fue removido y el browser recalculó el layout
      // antes de que midamos la posición de la sección con getBoundingClientRect
      requestAnimationFrame(function () {
        scrollToSection(categoryId, 'smooth');
      });
    }
  }

  // Ejecutar inicialización cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

