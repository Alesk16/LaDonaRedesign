/**
 * LA DOÑA HACIENDA — LÓGICA DE INTERFAZ DE DENUNCIAS (pages/denuncia.html)
 * Archivo: js/denuncia.js
 *
 * Responsabilidades:
 * - Control de modalidad de reporte (identificado vs. anónimo).
 * - Actualización en tiempo real del contador de caracteres en la descripción.
 * - Validación de campos obligatorios en el cliente para revisión de interfaz.
 * - Prevención estricta de envío a backend o simulación falsa de comunicación con servidores.
 */

(function () {
  'use strict';

  // Elementos principales
  const form = document.getElementById('denunciaForm');
  if (!form) return;

  // Radios de modalidad
  const modIdentificada = document.getElementById('modIdentificada');
  const modAnonima = document.getElementById('modAnonima');
  const contactoSection = document.getElementById('contactoSection');

  // Campos de contacto
  const inputNombre = document.getElementById('nombre');
  const inputTelefono = document.getElementById('telefono');
  const inputEmail = document.getElementById('email');
  const reqNombre = document.getElementById('reqNombre');
  const reqTelefono = document.getElementById('reqTelefono');
  const reqEmail = document.getElementById('reqEmail');

  // Campos principales del reporte
  const selectTipo = document.getElementById('tipoDenuncia');
  const selectSucursal = document.getElementById('sucursal');
  const inputFecha = document.getElementById('fechaHecho');
  const textareaDescripcion = document.getElementById('descripcion');
  const charCounter = document.getElementById('charCounter');
  const checkLegal = document.getElementById('declaracionLegal');
  const btnSubmit = document.getElementById('btnSubmitDenuncia');
  const uiFeedback = document.getElementById('uiFeedback');

  /**
   * Configura la fecha máxima como la fecha actual (no se pueden reportar hechos futuros)
   */
  function setupDateLimits() {
    if (!inputFecha) return;
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    inputFecha.max = `${yyyy}-${mm}-${dd}`;
  }

  /**
   * Actualiza el estado visual y de validación según la modalidad elegida
   */
  function updateModality() {
    const isAnonima = modAnonima && modAnonima.checked;

    if (contactoSection) {
      contactoSection.classList.toggle('is-disabled', isAnonima);
    }

    // Actualizar requerimientos de campos de contacto
    const contactInputs = [inputNombre, inputTelefono, inputEmail];
    contactInputs.forEach((input) => {
      if (!input) return;
      input.disabled = isAnonima;
      const group = input.closest('.form-group');
      if (group) {
        group.classList.remove('has-error');
      }
    });

    if (reqNombre) reqNombre.style.display = isAnonima ? 'none' : 'inline';
    if (reqTelefono) reqTelefono.style.display = isAnonima ? 'none' : 'inline';
    if (reqEmail) reqEmail.style.display = isAnonima ? 'none' : 'inline';
  }

  /**
   * Actualiza el contador de caracteres de la descripción
   */
  function updateCharCounter() {
    if (!textareaDescripcion || !charCounter) return;
    const currentLength = textareaDescripcion.value.length;
    const maxLength = textareaDescripcion.getAttribute('maxlength') || 2000;
    charCounter.textContent = `${currentLength} / ${maxLength}`;
  }

  /**
   * Valida un campo individual
   */
  function validateField(input) {
    if (!input || input.disabled) return true;
    const group = input.closest('.form-group') || input.closest('.legal-check-group');
    if (!group) return true;

    let isValid = true;

    // Validación según tipo de campo
    if (input.type === 'checkbox') {
      isValid = input.checked;
    } else if (input.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isValid = emailRegex.test(input.value.trim());
    } else if (input.type === 'tel') {
      const telRegex = /^[0-9+\s\-()]{7,20}$/;
      isValid = telRegex.test(input.value.trim());
    } else if (input.tagName.toLowerCase() === 'textarea') {
      isValid = input.value.trim().length >= 20;
    } else {
      isValid = input.value.trim().length > 0;
    }

    group.classList.toggle('has-error', !isValid);
    return isValid;
  }

  /**
   * Configura listeners de eventos en inputs
   */
  function setupEventListeners() {
    // Modalidad
    if (modIdentificada) modIdentificada.addEventListener('change', updateModality);
    if (modAnonima) modAnonima.addEventListener('change', updateModality);

    // Contador de caracteres
    if (textareaDescripcion) {
      textareaDescripcion.addEventListener('input', () => {
        updateCharCounter();
        const group = textareaDescripcion.closest('.form-group');
        if (group && group.classList.contains('has-error')) {
          validateField(textareaDescripcion);
        }
      });
    }

    // Validación interactiva en campos
    const inputsToWatch = [
      selectTipo,
      selectSucursal,
      inputFecha,
      inputNombre,
      inputTelefono,
      inputEmail,
      checkLegal
    ];

    inputsToWatch.forEach((input) => {
      if (!input) return;

      input.addEventListener('input', () => {
        const group = input.closest('.form-group') || input.closest('.legal-check-group');
        if (group && group.classList.contains('has-error')) {
          validateField(input);
        }
      });

      input.addEventListener('change', () => {
        const group = input.closest('.form-group') || input.closest('.legal-check-group');
        if (group && group.classList.contains('has-error')) {
          validateField(input);
        }
      });

      input.addEventListener('blur', () => {
        if (input.value && input.value.trim().length > 0) {
          validateField(input);
        }
      });
    });
  }

  /**
   * Manejador del envío (puramente interfaz estática, sin backend)
   */
  function handleSubmit(e) {
    e.preventDefault();

    const isAnonima = modAnonima && modAnonima.checked;

    const fieldsToValidate = [
      selectTipo,
      selectSucursal,
      inputFecha,
      textareaDescripcion
    ];

    if (!isAnonima) {
      fieldsToValidate.push(inputNombre, inputTelefono, inputEmail);
    }

    fieldsToValidate.push(checkLegal);

    let allValid = true;
    let firstInvalid = null;

    fieldsToValidate.forEach((field) => {
      const valid = validateField(field);
      if (!valid) {
        allValid = false;
        if (!firstInvalid) {
          firstInvalid = field;
        }
      }
    });

    if (!allValid) {
      if (firstInvalid) {
        firstInvalid.focus();
      }
      return;
    }

    // Mostrar confirmación visual de validación de interfaz
    if (uiFeedback) {
      uiFeedback.removeAttribute('hidden');
      uiFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    if (btnSubmit) {
      btnSubmit.textContent = 'Interfaz validada ✓';
      btnSubmit.style.background = 'var(--verde-oscuro)';
    }
  }

  // Inicialización
  setupDateLimits();
  updateModality();
  updateCharCounter();
  setupEventListeners();
  form.addEventListener('submit', handleSubmit);
})();
