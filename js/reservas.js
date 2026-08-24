/**
 * LA DOÑA HACIENDA — LÓGICA DE RESERVAS (pages/reservas.html)
 * Archivo: js/reservas.js
 *
 * Responsabilidades:
 * - Actualizar en tiempo real el resumen de reserva conforme el usuario completa el formulario.
 * - Formatear fechas y horas para una lectura clara.
 * - Validar los campos requeridos del formulario.
 * - Mostrar el mensaje de confirmación de solicitud preparada sin enviar datos externos.
 */

(function () {
  'use strict';

  // Elementos del formulario
  const form = document.getElementById('reservasForm');
  const inputNombre = document.getElementById('nombre');
  const inputTelefono = document.getElementById('telefono');
  const inputEmail = document.getElementById('email');
  const inputPersonas = document.getElementById('personas');
  const selectSucursal = document.getElementById('sucursal');
  const inputFecha = document.getElementById('fecha');
  const inputHora = document.getElementById('hora');
  const selectOcasion = document.getElementById('ocasion');
  const btnSubmit = document.getElementById('btnSubmit');
  const successCard = document.getElementById('reservasSuccess');

  // Elementos del resumen dinámico
  const sumNombre = document.getElementById('sumNombre');
  const sumPersonas = document.getElementById('sumPersonas');
  const sumFecha = document.getElementById('sumFecha');
  const sumHora = document.getElementById('sumHora');
  const sumSucursal = document.getElementById('sumSucursal');
  const sumOcasion = document.getElementById('sumOcasion');

  if (!form) return;

  /**
   * Establece la fecha mínima de reserva como la fecha actual
   */
  function setupMinDate() {
    if (!inputFecha) return;
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    inputFecha.min = `${yyyy}-${mm}-${dd}`;
  }

  /**
   * Formatea una fecha YYYY-MM-DD en formato legible
   */
  function formatDisplayDate(dateStr) {
    if (!dateStr) return '—';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];
    return `${day}/${month}/${year}`;
  }

  /**
   * Formatea una hora HH:MM en formato de 12 horas (AM/PM)
   */
  function formatDisplayTime(timeStr) {
    if (!timeStr) return '—';
    const parts = timeStr.split(':');
    if (parts.length < 2) return timeStr;
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // Si es 0, mostrar 12
    return `${hours}:${minutes} ${ampm}`;
  }

  /**
   * Actualiza un campo del resumen visual
   */
  function updateSummaryItem(element, value, fallback = '—') {
    if (!element) return;
    const trimmed = (value || '').trim();
    if (trimmed) {
      element.textContent = trimmed;
      element.classList.add('has-value');
    } else {
      element.textContent = fallback;
      element.classList.remove('has-value');
    }
  }

  /**
   * Actualiza todos los valores del resumen
   */
  function updateSummary() {
    // 1. Nombre
    updateSummaryItem(sumNombre, inputNombre ? inputNombre.value : '');

    // 2. Personas
    if (inputPersonas && inputPersonas.value) {
      const num = parseInt(inputPersonas.value, 10);
      const text = num === 1 ? '1 persona' : `${num} personas`;
      updateSummaryItem(sumPersonas, text);
    } else {
      updateSummaryItem(sumPersonas, '');
    }

    // 3. Fecha
    if (inputFecha && inputFecha.value) {
      updateSummaryItem(sumFecha, formatDisplayDate(inputFecha.value));
    } else {
      updateSummaryItem(sumFecha, '');
    }

    // 4. Hora
    if (inputHora && inputHora.value) {
      updateSummaryItem(sumHora, formatDisplayTime(inputHora.value));
    } else {
      updateSummaryItem(sumHora, '');
    }

    // 5. Sucursal
    updateSummaryItem(sumSucursal, selectSucursal ? selectSucursal.value : '');

    // 6. Ocasión
    updateSummaryItem(sumOcasion, selectOcasion ? selectOcasion.value : '');
  }

  /**
   * Valida un campo individual y muestra/oculta el estado de error
   */
  function validateField(input) {
    if (!input) return true;
    const group = input.closest('.form-group');
    if (!group) return true;

    let isValid = true;

    if (input.hasAttribute('required')) {
      if (input.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(input.value.trim());
      } else if (input.type === 'number') {
        const val = parseInt(input.value, 10);
        isValid = !isNaN(val) && val >= 1;
      } else {
        isValid = input.value.trim().length > 0;
      }
    }

    group.classList.toggle('has-error', !isValid);
    return isValid;
  }

  /**
   * Configura los listeners de actualización en tiempo real
   */
  function setupLiveListeners() {
    const inputs = [
      inputNombre,
      inputTelefono,
      inputEmail,
      inputPersonas,
      selectSucursal,
      inputFecha,
      inputHora,
      selectOcasion
    ];

    inputs.forEach((input) => {
      if (!input) return;

      input.addEventListener('input', () => {
        updateSummary();
        const group = input.closest('.form-group');
        if (group && group.classList.contains('has-error')) {
          validateField(input);
        }
      });

      input.addEventListener('change', () => {
        updateSummary();
        const group = input.closest('.form-group');
        if (group && group.classList.contains('has-error')) {
          validateField(input);
        }
      });

      input.addEventListener('blur', () => {
        if (input.value.trim().length > 0 || input.hasAttribute('required')) {
          validateField(input);
        }
      });
    });
  }

  /**
   * Maneja el envío del formulario
   */
  function handleSubmit(e) {
    e.preventDefault();

    const requiredInputs = [
      inputNombre,
      inputTelefono,
      inputEmail,
      inputPersonas,
      selectSucursal,
      inputFecha,
      inputHora
    ];

    let allValid = true;
    let firstInvalid = null;

    requiredInputs.forEach((input) => {
      const valid = validateField(input);
      if (!valid) {
        allValid = false;
        if (!firstInvalid) {
          firstInvalid = input;
        }
      }
    });

    if (!allValid) {
      if (firstInvalid) {
        firstInvalid.focus();
      }
      return;
    }

    // Mostrar mensaje de confirmación de solicitud preparada
    if (successCard) {
      successCard.removeAttribute('hidden');
      successCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Actualizar badge del resumen
    const badge = document.querySelector('.summary-badge');
    if (badge) {
      badge.textContent = 'Solicitud registrada';
      badge.style.background = 'rgb(80 118 77 / 20%)';
      badge.style.color = 'var(--verde-principal)';
    }

    // Deshabilitar botón temporalmente para indicar éxito de registro
    if (btnSubmit) {
      btnSubmit.textContent = 'Solicitud registrada ✓';
      btnSubmit.style.background = 'var(--verde-principal)';
    }
  }

  // Inicialización
  setupMinDate();
  setupLiveListeners();
  form.addEventListener('submit', handleSubmit);
})();
