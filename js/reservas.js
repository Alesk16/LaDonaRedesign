/**
 * LA DOÑA HACIENDA — LÓGICA DE RESERVAS (pages/reservas.html)
 * Archivo: js/reservas.js
 *
 * Responsabilidades:
 * - Actualizar en tiempo real el resumen de reserva conforme el usuario completa el formulario.
 * - Formatear fechas y horas para una lectura clara.
 * - Validar los campos requeridos del formulario.
 * - Al enviar, construir un mensaje de WhatsApp y abrirlo en la sucursal seleccionada.
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
  const inputComentarios = document.getElementById('comentarios');
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

  // ─── Números de WhatsApp por sucursal ────────────────────────────────────────
  const WHATSAPP_SUCURSALES = {
    Cayambe: '593994031040',
    'Cumbayá': '593980240747'
  };

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
   * Construye el mensaje de WhatsApp con todos los datos del formulario.
   * Los campos opcionales (ocasión, comentarios) se omiten si están vacíos.
   * @param {string} sucursal - Nombre de la sucursal seleccionada
   * @returns {string} Mensaje formateado listo para encodeURIComponent
   */
  function buildWhatsAppMessage(sucursal) {
    const nombre      = inputNombre      ? inputNombre.value.trim()      : '';
    const telefono    = inputTelefono    ? inputTelefono.value.trim()    : '';
    const email       = inputEmail       ? inputEmail.value.trim()       : '';
    const personas    = inputPersonas    ? inputPersonas.value.trim()    : '';
    const fecha       = inputFecha       ? formatDisplayDate(inputFecha.value) : '';
    const hora        = inputHora        ? formatDisplayTime(inputHora.value) : '';
    const ocasion     = selectOcasion    ? selectOcasion.value.trim()    : '';
    const comentarios = inputComentarios ? inputComentarios.value.trim() : '';

    const personasLabel = parseInt(personas, 10) === 1 ? '1 persona' : `${personas} personas`;

    let mensaje =
      `Hola, quisiera realizar una reserva en La Doña Hacienda.\n\n` +
      `📍 Sucursal: ${sucursal}\n` +
      `👤 Nombre: ${nombre}\n` +
      `📞 Teléfono: ${telefono}\n` +
      `📧 Correo: ${email}\n` +
      `👥 Número de personas: ${personasLabel}\n` +
      `📅 Fecha: ${fecha}\n` +
      `🕐 Hora: ${hora}\n`;

    if (ocasion) {
      mensaje += `🎉 Ocasión: ${ocasion}\n`;
    }

    if (comentarios) {
      mensaje += `📝 Comentarios o requerimientos especiales: ${comentarios}\n`;
    }

    mensaje += `\nPor favor, confirmar disponibilidad. ¡Gracias!`;

    return mensaje;
  }

  /**
   * Selecciona el número de WhatsApp según la sucursal y abre la conversación
   * en una nueva pestaña usando wa.me con el mensaje codificado.
   * @param {string} sucursal - Valor del select (ej. "Cayambe" o "Cumbayá")
   */
  function openWhatsApp(sucursal) {
    const numero = WHATSAPP_SUCURSALES[sucursal];
    if (!numero) {
      console.error('[Reservas] Número de WhatsApp no encontrado para:', sucursal);
      return;
    }
    const mensaje = buildWhatsAppMessage(sucursal);
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  /**
   * Maneja el envío del formulario:
   * 1. Valida todos los campos obligatorios.
   * 2. Si hay errores, hace foco en el primero y NO abre WhatsApp.
   * 3. Si todo es válido, abre WhatsApp con los datos de la reserva.
   * 4. NO limpia el formulario para que el usuario pueda revisarlo al regresar.
   * 5. NO afirma que la reserva está confirmada (solo indica que se envió la solicitud).
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
      return; // No abrir WhatsApp si faltan datos obligatorios
    }

    // Abrir WhatsApp con los datos del formulario en la sucursal correcta
    const sucursal = selectSucursal ? selectSucursal.value : '';
    openWhatsApp(sucursal);

    // Mostrar aviso informativo (sin afirmar que la reserva está confirmada)
    if (successCard) {
      successCard.removeAttribute('hidden');
      successCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Actualizar badge del resumen
    const badge = document.querySelector('.summary-badge');
    if (badge) {
      badge.textContent = 'Solicitud enviada a WhatsApp';
      badge.style.background = 'rgb(80 118 77 / 20%)';
      badge.style.color = 'var(--verde-principal)';
    }

    // Actualizar botón para indicar que se abrió WhatsApp;
    // se restaura a los 4 s para permitir reintentos si es necesario
    if (btnSubmit) {
      btnSubmit.textContent = 'WhatsApp abierto ✓';
      btnSubmit.style.background = 'var(--verde-principal)';

      setTimeout(() => {
        btnSubmit.textContent = 'Solicitar reserva';
        btnSubmit.style.background = '';
      }, 4000);
    }
  }

  /**
   * Lee el parámetro ?sucursal= de la URL y, si corresponde a una opción
   * válida del select, la preselecciona automáticamente al cargar la página.
   * El usuario puede cambiar la sucursal manualmente en cualquier momento.
   *
   * Ejemplo de URL: reservas.html?sucursal=Cayambe
   *                 reservas.html?sucursal=Cumbay%C3%A1
   */
  function preselectSucursalFromURL() {
    if (!selectSucursal) return;

    var params = new URLSearchParams(window.location.search);
    var sucursalParam = params.get('sucursal');

    if (!sucursalParam) return; // Sin parámetro: comportamiento normal

    // Verificar que el valor sea una sucursal conocida (evitar valores arbitrarios)
    var esValida = WHATSAPP_SUCURSALES.hasOwnProperty(sucursalParam);
    if (!esValida) {
      console.warn('[Reservas] Parámetro ?sucursal= no reconocido:', sucursalParam);
      return;
    }

    // Preseleccionar la sucursal en el select
    selectSucursal.value = sucursalParam;

    // Confirmar que el value realmente cambió (por si el option no existe)
    if (selectSucursal.value !== sucursalParam) {
      console.warn('[Reservas] No se encontró la opción en el select para:', sucursalParam);
      return;
    }

    // Actualizar el resumen lateral inmediatamente
    updateSummary();
  }

  // Inicialización
  setupMinDate();
  setupLiveListeners();
  preselectSucursalFromURL();
  form.addEventListener('submit', handleSubmit);
})();
