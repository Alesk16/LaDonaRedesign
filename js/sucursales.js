/**
 * LA DOÑA HACIENDA — LÓGICA ESPECÍFICA DE SUCURSALES
 * Archivo: js/sucursales.js
 *
 * Responsabilidades:
 * - Botones "Reservar mesa" de cada sucursal → navegar a reservas.html con ?sucursal=
 *   para que el formulario preseleccione la sucursal automáticamente.
 * - Tarjetas de sucursal en index.html → clickeables (sin conflicto con botones internos).
 * - Verificar y reforzar atributos de enlaces Google Maps.
 *
 * WhatsApp se abre ÚNICAMENTE desde el formulario de reservas (js/reservas.js),
 * después de que el usuario completa y valida todos sus datos.
 */

(function () {
  'use strict';


  /* ============================================================
     INICIALIZACIÓN — PÁGINA DE SUCURSALES (sucursales.html)

     Cada botón [data-whatsapp-sucursal] navega a reservas.html
     pasando el nombre de la sucursal como parámetro URL para que
     el campo "Sucursal" quede preseleccionado en el formulario.

     Mapeo data-attribute → valor del <option> en reservas.html:
       cayambe  → "Cayambe"
       cumbaya  → "Cumbayá"
     ============================================================ */
  var SUCURSAL_NOMBRE = {
    cayambe: 'Cayambe',
    cumbaya: 'Cumbayá'
  };

  function initSucursalesPage() {
    var botones = document.querySelectorAll('[data-whatsapp-sucursal]');
    if (!botones.length) return;

    botones.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var key = btn.getAttribute('data-whatsapp-sucursal'); // "cayambe" | "cumbaya"
        var nombre = SUCURSAL_NOMBRE[key];

        if (!nombre) {
          console.warn('[La Doña Hacienda] Sucursal no reconocida en botón:', key);
          return;
        }

        // Navegar al formulario de reservas con el contexto de la sucursal.
        // La ruta es relativa desde pages/sucursales.html → pages/reservas.html
        window.location.href = 'reservas.html?sucursal=' + encodeURIComponent(nombre);
      });
    });
  }

  /* ============================================================
     INICIALIZACIÓN — TARJETAS DE SUCURSALES EN INDEX.HTML
     Las tarjetas .branch-card se hacen clickeables hacia la
     sección correspondiente en sucursales.html.
     Los clics en botones/enlaces internos NO propagan al card.
     ============================================================ */
  function initBranchCardsIndex() {
    // Solo actuar si existen tarjetas de sucursal sin botones de acción internos
    // (en index.html las tarjetas .branch-card tienen data-branch-url)
    var cards = document.querySelectorAll('.branch-card[data-branch-url]');
    if (!cards.length) return;

    cards.forEach(function (card) {
      var destino = card.getAttribute('data-branch-url');
      if (!destino) return;

      // Estilo interactivo
      card.style.cursor = 'pointer';

      // Soporte teclado: hacer la tarjeta enfocable
      if (!card.getAttribute('tabindex')) {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'link');
        card.setAttribute('aria-label', card.getAttribute('data-branch-label') || 'Ver sucursal');
      }

      // Clic en la tarjeta
      card.addEventListener('click', function (e) {
        // Si el clic viene de un enlace o botón interno, no hacer nada
        var origen = e.target.closest('a, button, [role="button"]');
        if (origen && origen !== card) return;

        window.location.href = destino;
      });

      // Soporte teclado: Enter y Espacio activan la tarjeta
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.location.href = destino;
        }
      });
    });
  }

  /* ============================================================
     INICIALIZACIÓN GLOBAL
     ============================================================ */
  function init() {
    initSucursalesPage();
    initBranchCardsIndex();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
