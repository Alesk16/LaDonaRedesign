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
 * - Scroll suave al inicio del contenido al cambiar de categoría.
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
        const targetId = getTargetIdFromHref(link.getAttribute('href'));
        if (targetId) {
          switchCategory(targetId, true);
        }
      });
    });

    // Configurar toggle móvil
    if (categoryToggle) {
      categoryToggle.addEventListener('click', function (e) {
        e.stopPropagation();
        const isOpen = categoryNav.classList.contains('is-open');
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
      const btn = e.target.closest('.menu-nav-btn');
      if (btn) {
        e.preventDefault();
        const targetId = btn.getAttribute('data-target') || getTargetIdFromHref(btn.getAttribute('href'));
        if (targetId) {
          switchCategory(targetId, true);
        }
      }
    });

    // Escuchar cambios de hash en la ventana (navegación atrás/adelante del navegador)
    window.addEventListener('hashchange', function () {
      const hashId = getHashCategoryId();
      if (hashId && hashId !== activeCategoryId) {
        switchCategory(hashId, true);
      }
    });

    // Determinar categoría inicial desde el hash o por defecto 'desayunos'
    const initialHash = getHashCategoryId();
    const initialCategory = CATEGORIES.includes(initialHash) ? initialHash : 'desayunos';
    switchCategory(initialCategory, false);
  }

  /**
   * Extrae el ID de categoría del hash de la URL
   */
  function getHashCategoryId() {
    const rawHash = window.location.hash.replace(/^#/, '').trim();
    return CATEGORIES.includes(rawHash) ? rawHash : null;
  }

  /**
   * Extrae el ID de categoría de un atributo href (ej. "#sanduches" -> "sanduches")
   */
  function getTargetIdFromHref(href) {
    if (!href) return null;
    const match = href.match(/#([a-zA-Z0-9_-]+)/);
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
   * @param {string} categoryId ID de la categoría a mostrar
   * @param {boolean} shouldScroll Si se debe realizar scroll suave al contenido
   */
  function switchCategory(categoryId, shouldScroll) {
    if (!CATEGORIES.includes(categoryId)) {
      categoryId = 'desayunos';
    }

    activeCategoryId = categoryId;

    // 1. Mostrar únicamente la sección seleccionada y ocultar todas las demás
    categorySections.forEach(function (section) {
      const isTarget = section.id === categoryId;
      section.classList.toggle('is-active', isTarget);
      if (isTarget) {
        section.removeAttribute('hidden');
      } else {
        section.setAttribute('hidden', '');
      }
    });

    // 2. Actualizar estado visual de los enlaces de navegación (desktop & móvil)
    categoryLinks.forEach(function (link) {
      const linkTarget = getTargetIdFromHref(link.getAttribute('href')) || link.getAttribute('data-category');
      const isActive = linkTarget === categoryId;
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

    // 6. Scroll suave hacia el inicio de la categoría activa
    if (shouldScroll) {
      scrollToCategoryTop();
    }
  }

  /**
   * Realiza un scroll suave hacia el contenedor de categorías / inicio del contenido,
   * calculando la compensación del header y de la barra de navegación sticky.
   */
  function scrollToCategoryTop() {
    if (!categoryNav) return;

    // Obtener la posición del categoryNav
    const navRect = categoryNav.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Altura del header fijo según ancho de pantalla
    const isMobile = window.innerWidth <= 650;
    const isSmallMobile = window.innerWidth <= 400;
    const headerHeight = isSmallMobile ? 52 : (isMobile ? 56 : 72);

    // Posición calculada para dejar el nav y la sección en la vista óptima
    const targetY = scrollTop + navRect.top - headerHeight;

    window.scrollTo({
      top: Math.max(0, targetY),
      behavior: 'smooth'
    });
  }

  // Ejecutar inicialización cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
