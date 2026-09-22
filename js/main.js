/* ============================================================
   LA DOÑA HACIENDA — JAVASCRIPT GLOBAL (js/main.js)
   Responsabilidades:
   - Toggle del menú móvil
   - Estado del header al hacer scroll
   - Scroll al inicio al cargar una página nueva (sin romper anclas)
   ============================================================ */

/* ----------------------------------------------------------
   1. SCROLL RESTORATION MANUAL
   Evita que el navegador restaure automáticamente una posición
   anterior al navegar entre páginas.
   ---------------------------------------------------------- */
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

/* ----------------------------------------------------------
   2. SCROLL AL INICIO O AL ANCLA AL CARGAR LA PÁGINA
   - Si la URL tiene un hash válido (#seccion): el navegador
     ya posiciona en el ancla automáticamente (no interferir).
   - Si no hay hash: forzar scroll a (0, 0) para que la
     página empiece desde arriba.
   ---------------------------------------------------------- */
(function handlePageScroll() {
  var hash = window.location.hash;

  if (!hash) {
    // Sin ancla: ir al tope inmediatamente
    window.scrollTo(0, 0);
  }
  // Con ancla: el navegador la procesa solo; no forzamos nada
})();

/* ----------------------------------------------------------
   3. MENÚ MÓVIL
   ---------------------------------------------------------- */
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const header = document.querySelector(".header");

function setMenuState(isOpen) {
  if (!menuToggle || !mainNav) return;

  mainNav.classList.toggle("active", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
}

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    setMenuState(!mainNav.classList.contains("active"));
  });

  // Cerrar el menú al hacer clic en cualquier enlace
  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
  });
}

/* ----------------------------------------------------------
   4. ESTADO DEL HEADER (transparent → scrolled)
   ---------------------------------------------------------- */
function updateHeaderState() {
  if (header) {
    header.classList.toggle("header-scrolled", window.scrollY > 30);
  }
}

window.addEventListener("scroll", updateHeaderState, { passive: true });
updateHeaderState();

/* ----------------------------------------------------------
   5. TRAMPA DE FOCO PARA MODALES
   Utilidad genérica compartida por cualquier modal del sitio
   (galería de Eventos, Términos de Atención en Denuncia, etc.):
   mientras el modal esté abierto, Tab/Shift+Tab deben ciclar
   solo entre sus propios elementos enfocables.
   ---------------------------------------------------------- */
function getFocusableElements(container) {
  if (!container) return [];
  var selector = 'button:not([hidden]):not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';
  return Array.prototype.slice.call(container.querySelectorAll(selector)).filter(function (el) {
    return el.offsetParent !== null;
  });
}

function trapFocus(e, container) {
  var focusable = getFocusableElements(container);
  if (!focusable.length) return;

  var first = focusable[0];
  var last = focusable[focusable.length - 1];
  var active = document.activeElement;

  if (e.shiftKey) {
    if (active === first || !container.contains(active)) {
      e.preventDefault();
      last.focus();
    }
  } else {
    if (active === last || !container.contains(active)) {
      e.preventDefault();
      first.focus();
    }
  }
}

window.FocusTrap = {
  getFocusableElements: getFocusableElements,
  trapFocus: trapFocus
};
