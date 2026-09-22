/**
 * LA DOÑA HACIENDA — LÓGICA DE INTERFAZ DE DENUNCIAS (pages/denuncia.html)
 * Archivo: js/denuncia.js
 *
 * Responsabilidades:
 * - Control de modalidad de reporte (identificado vs. anónimo).
 * - Actualización en tiempo real del contador de caracteres en la descripción.
 * - Validación de campos obligatorios en el cliente.
 * - Envío del mensaje por correo mediante EmailJS (sin backend propio), con estados de éxito y error.
 */

// Configuración de EmailJS: reemplaza estos 3 valores con los de tu cuenta (emailjs.com > Dashboard).
const EMAILJS_PUBLIC_KEY = 'Sk2xC4xrZiTztyaLT';
const EMAILJS_SERVICE_ID = 'service_fn0enuu';
const EMAILJS_TEMPLATE_ID = 'template_vud8oom';

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
  const uiError = document.getElementById('uiError');
  const submitLabel = btnSubmit ? btnSubmit.textContent : '';
  let isSending = false;

  // Inicializa el SDK de EmailJS (si el script del CDN no cargó, el envío mostrará el estado de error)
  if (window.emailjs) {
    window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

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
   * Manejador del envío: valida los campos y, si todo es correcto, envía el mensaje con EmailJS
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

    sendMessage(isAnonima);
  }

  /**
   * Arma las variables que recibe la plantilla de EmailJS.
   * En modo anónimo los datos de contacto se envían vacíos, aunque el usuario los haya escrito antes de cambiar de modalidad.
   */
  function buildTemplateParams(isAnonima) {
    const optionLabel = (select) => {
      const opt = select && select.options[select.selectedIndex];
      return opt ? opt.textContent.trim() : '';
    };

    return {
      modalidad: isAnonima ? 'Anónima' : 'Identificada',
      tipo_mensaje: optionLabel(selectTipo),
      sucursal: optionLabel(selectSucursal),
      fecha_hecho: inputFecha.value,
      descripcion: textareaDescripcion.value.trim(),
      nombre: isAnonima ? '' : inputNombre.value.trim(),
      telefono: isAnonima ? '' : inputTelefono.value.trim(),
      email: isAnonima ? '' : inputEmail.value.trim(),
      declaracion_veracidad: 'Sí',
      fecha_envio: new Date().toLocaleString('es-EC', { timeZone: 'America/Guayaquil' })
    };
  }

  function setSendingState(sending) {
    isSending = sending;
    if (!btnSubmit) return;
    btnSubmit.disabled = sending;
    btnSubmit.setAttribute('aria-busy', String(sending));
    btnSubmit.textContent = sending ? 'Enviando…' : submitLabel;
  }

  function showFeedback(el) {
    if (uiFeedback) uiFeedback.setAttribute('hidden', '');
    if (uiError) uiError.setAttribute('hidden', '');
    if (!el) return;
    el.removeAttribute('hidden');
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /**
   * Envía el mensaje con EmailJS. Si falla, conserva lo que el usuario escribió.
   */
  function sendMessage(isAnonima) {
    if (isSending) return;

    const notConfigured = [EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID]
      .some((value) => value.indexOf('PEGAR_AQUI') === 0);

    if (notConfigured || !window.emailjs) {
      console.error(notConfigured
        ? 'EmailJS sin configurar: completa EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID y EMAILJS_TEMPLATE_ID en js/denuncia.js.'
        : 'El SDK de EmailJS no se cargó (revisa la conexión o un bloqueador de contenido).');
      showFeedback(uiError);
      return;
    }

    setSendingState(true);
    showFeedback(null);

    window.emailjs
      .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, buildTemplateParams(isAnonima), { publicKey: EMAILJS_PUBLIC_KEY })
      .then(() => {
        form.reset();
        updateModality();
        updateCharCounter();
        showFeedback(uiFeedback);
      })
      .catch((error) => {
        console.error('EmailJS: no se pudo enviar el mensaje.', error);
        showFeedback(uiError);
      })
      .finally(() => {
        setSendingState(false);
      });
  }

  /**
   * Modal de "Términos de Atención al Cliente": el enlace dentro del checkbox
   * de declaración sigue siendo un <a href> real (funciona sin JS o al abrirlo
   * en una pestaña nueva), pero con click normal se intercepta para mostrar
   * el mismo contenido en un modal sin sacar al usuario del formulario.
   */
  function setupTerminosModal() {
    const trigger = document.querySelector('a[href="terminos-atencion.html"]');
    const modal = document.getElementById('terminosModal');
    if (!trigger || !modal) return;

    const backdrop = document.getElementById('terminosModalBackdrop');
    const closeBtn = document.getElementById('terminosModalCloseBtn');
    let lastActiveElement = null;

    function isOpen() {
      return modal.classList.contains('is-active');
    }

    function openModal() {
      lastActiveElement = document.activeElement;
      modal.classList.add('is-active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();
    }

    function closeModal() {
      modal.classList.remove('is-active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
        lastActiveElement.focus();
      }
    }

    trigger.addEventListener('click', (e) => {
      // Click normal: abre el modal. Click con modificador (nueva pestaña,
      // nueva ventana) o distinto del botón izquierdo: deja el href real.
      if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      openModal();
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
      if (!isOpen()) return;

      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'Tab' && window.FocusTrap) {
        window.FocusTrap.trapFocus(e, modal);
      }
    });
  }

  // Inicialización
  setupDateLimits();
  updateModality();
  updateCharCounter();
  setupEventListeners();
  setupTerminosModal();
  form.addEventListener('submit', handleSubmit);
})();
