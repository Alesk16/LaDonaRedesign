/* Interacciones básicas de navegación */

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

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
  });
}

function updateHeaderState() {
  if (header) {
    header.classList.toggle("header-scrolled", window.scrollY > 30);
  }
}

window.addEventListener("scroll", updateHeaderState, { passive: true });
updateHeaderState();
