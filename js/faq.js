/**
 * LA DOÑA HACIENDA — LÓGICA EXCLUSIVA DE PREGUNTAS FRECUENTES (pages/faq.html)
 * Archivo: js/faq.js
 *
 * Responsabilidades:
 * - Abrir/cerrar cada pregunta del acordeón al hacer clic en su botón.
 * - Mantener aria-expanded sincronizado en el botón.
 * - Actualizar el indicador visual "+" / "−".
 * - Permitir navegación accesible por teclado (el disparador es un <button>
 *   real, por lo que Tab/Enter/Espacio funcionan de forma nativa).
 *
 * Cada pregunta puede abrirse y cerrarse de forma independiente
 * (no se cierran las demás al abrir una nueva).
 */

(function () {
    'use strict';

    function togglePanel(trigger, panel) {
        var isOpen = trigger.getAttribute('aria-expanded') === 'true';

        if (isOpen) {
            closePanel(trigger, panel);
        } else {
            openPanel(trigger, panel);
        }
    }

    function openPanel(trigger, panel) {
        var item = trigger.closest('.faq-item');

        // Quitar "hidden" antes de animar para que el navegador pueda
        // calcular el layout del contenido y la transición CSS se vea suave.
        panel.hidden = false;

        // Forzar reflow: garantiza que el navegador registre el estado
        // "cerrado" antes de aplicar la clase que anima la apertura.
        // eslint-disable-next-line no-unused-expressions
        panel.offsetHeight;

        if (item) item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
        updateIcon(trigger, true);
    }

    function closePanel(trigger, panel) {
        var item = trigger.closest('.faq-item');

        if (item) item.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
        updateIcon(trigger, false);

        // Esperar a que termine la transición de cierre antes de ocultar
        // por completo el panel (evita que quede enfocable/leíble mientras
        // está visualmente colapsado).
        var handled = false;
        function onTransitionEnd(e) {
            if (e.target !== panel) return;
            handled = true;
            panel.removeEventListener('transitionend', onTransitionEnd);
            panel.hidden = true;
        }
        panel.addEventListener('transitionend', onTransitionEnd);

        // Respaldo por si el navegador no dispara transitionend
        // (por ejemplo, con "prefers-reduced-motion" u otros casos límite).
        setTimeout(function () {
            if (!handled) {
                panel.removeEventListener('transitionend', onTransitionEnd);
                panel.hidden = true;
            }
        }, 400);
    }

    function updateIcon(trigger, isOpen) {
        var icon = trigger.querySelector('.faq-icon');
        if (!icon) return;
        icon.textContent = isOpen ? '−' : '+';
    }

    function init() {
        var triggers = document.querySelectorAll('.faq-trigger');
        if (!triggers.length) return;

        triggers.forEach(function (trigger) {
            var panelId = trigger.getAttribute('aria-controls');
            var panel = panelId ? document.getElementById(panelId) : null;
            if (!panel) return;

            trigger.addEventListener('click', function () {
                togglePanel(trigger, panel);
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
