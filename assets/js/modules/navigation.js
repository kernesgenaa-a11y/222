import { addEventOnElements } from "./utils.js";

export function initNavigation() {
  const navbar = document.querySelector("[data-navbar]");
  const navTogglers = document.querySelectorAll("[data-nav-toggler]");
  const overlay = document.querySelector("[data-overlay]");
  const navLinks = document.querySelectorAll("[data-navbar]");

  if (!navbar) return;

  const toggleNav = () => {
    navbar.classList.toggle("active");
    overlay.classList.toggle("active");
    document.body.classList.toggle("nav-active");
  };

  addEventOnElements(navTogglers, "click", toggleNav);

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      navbar.classList.remove("active");
      overlay.classList.remove("active");
      document.body.classList.remove("nav-active");
    });
  });
}
