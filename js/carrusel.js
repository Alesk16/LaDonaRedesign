/**
 * LA DOÑA HACIENDA — CARRUSEL GASTRONÓMICO (Home)
 * Archivo: js/carrusel.js
 *
 * Responsabilidades:
 * - Desplazar el track por flechas, puntos, teclado y swipe/touch nativo.
 * - Marcar el punto activo según la diapositiva más visible.
 * - Autoplay moderado, pausado con el mouse/teclado/touch y detenido en
 *   definitiva en cuanto la persona interactúa manualmente.
 * - Respeta prefers-reduced-motion: sin autoplay ni scroll suave.
 *
 * Solo se ejecuta en index.html (busca [data-carousel]; si no lo
 * encuentra, no hace nada — seguro de cargar en cualquier página).
 */

(function () {
  'use strict';

  var AUTOPLAY_MS = 4500;

  function initCarousel(root) {
    var track = root.querySelector('[data-carousel-track]');
    var dotsWrap = root.querySelector('[data-carousel-dots]');
    var prevBtn = root.querySelector('[data-carousel-prev]');
    var nextBtn = root.querySelector('[data-carousel-next]');
    var slides = track ? Array.prototype.slice.call(track.querySelectorAll('.carousel-slide')) : [];

    if (!track || !slides.length) return;

    var reduceMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var dots = [];
    var activeIndex = 0;
    var autoplayTimer = null;
    var userInteracted = false;

    /* -------- puntos de posición -------- */
    if (dotsWrap) {
      slides.forEach(function (_, i) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel-dot';
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', 'Ir a la fotografía ' + (i + 1) + ' de ' + slides.length);
        if (i === 0) dot.classList.add('is-active');
        dot.addEventListener('click', function () {
          stopAutoplay();
          setActive(i);
          goToSlide(i);
        });
        dotsWrap.appendChild(dot);
        dots.push(dot);
      });
    }

    function setActive(index) {
      activeIndex = index;
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
        dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
      });
    }

    function goToSlide(index) {
      var target = slides[index];
      if (!target) return;
      track.scrollTo({
        left: index === 0 ? 0 : target.offsetLeft - track.offsetLeft,
        behavior: reduceMotion ? 'auto' : 'smooth'
      });
    }

    function step(direction) {
      var next = activeIndex + direction;
      if (next < 0) next = slides.length - 1;
      if (next >= slides.length) next = 0;
      setActive(next);
      goToSlide(next);
    }

    /* -------- flechas -------- */
    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        stopAutoplay();
        step(-1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        stopAutoplay();
        step(1);
      });
    }

    /* -------- teclado (con el track enfocado) -------- */
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        stopAutoplay();
        step(1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        stopAutoplay();
        step(-1);
      }
    });

    /* -------- swipe / scroll manual del usuario -------- */
    track.addEventListener('pointerdown', function () {
      userInteracted = true;
      stopAutoplay();
    }, { passive: true });

    /* -------- diapositiva activa segun la posicion real de scroll -------- */
    var scrollSyncTimer = null;

    function nearestSlideIndex() {
      var pos = track.scrollLeft;
      var best = 0;
      var bestDist = Infinity;
      for (var i = 0; i < slides.length; i++) {
        var dist = Math.abs((slides[i].offsetLeft - track.offsetLeft) - pos);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      }
      return best;
    }

    track.addEventListener('scroll', function () {
      if (scrollSyncTimer) window.clearTimeout(scrollSyncTimer);
      scrollSyncTimer = window.setTimeout(function () {
        setActive(nearestSlideIndex());
      }, 120);
    }, { passive: true });

    /* -------- autoplay -------- */
    function startAutoplay() {
      if (reduceMotion || userInteracted || slides.length < 2) return;
      stopAutoplay();
      autoplayTimer = window.setInterval(function () {
        step(1);
      }, AUTOPLAY_MS);
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        window.clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    root.addEventListener('pointerenter', stopAutoplay);
    root.addEventListener('pointerleave', startAutoplay);
    root.addEventListener('focusin', stopAutoplay);
    root.addEventListener('focusout', function (e) {
      if (!root.contains(e.relatedTarget)) startAutoplay();
    });
    root.addEventListener('touchstart', function () {
      userInteracted = true;
      stopAutoplay();
    }, { passive: true });

    startAutoplay();
  }

  function init() {
    var carousels = document.querySelectorAll('[data-carousel]');
    carousels.forEach(function (root) { initCarousel(root); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
