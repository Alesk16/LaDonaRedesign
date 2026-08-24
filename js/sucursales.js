/**
 * LA DOÑA HACIENDA — LÓGICA ESPECÍFICA DE SUCURSALES
 * Archivo: js/sucursales.js
 *
 * Responsabilidades:
 * - Manejo accesible de enlaces de ubicación pendientes.
 * - Soporte para interacciones en tarjetas de sucursales.
 */

(function () {
  'use strict';

  function initSucursales() {
    // Interceptar enlaces de ubicación que aún no cuentan con URL real de Google Maps
    const locationLinks = document.querySelectorAll('.sucursal-actions a[href="#"]');

    locationLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        // Prevenir salto brusco de página si el enlace aún es un placeholder
        e.preventDefault();
        
        // Efecto visual sutil de indicación
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSucursales);
  } else {
    initSucursales();
  }
})();
