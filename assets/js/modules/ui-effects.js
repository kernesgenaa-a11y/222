export function initPreloader() {
  const preloader = document.querySelector("[data-preloader]");
  if (!preloader) return;

  window.addEventListener("load", () => {
    preloader.classList.add("loaded");
    document.body.classList.add("loaded");
  });
}

export function initScrollEffects() {
  const header = document.querySelector("[data-header]");
  const backTopBtn = document.querySelector("[data-back-top-btn]");
  const revealElements = document.querySelectorAll("[data-reveal]");

  const onScroll = () => {
    if (window.scrollY > 100) {
      header?.classList.add("active");
      backTopBtn?.classList.add("active");
    } else {
      header?.classList.remove("active");
      backTopBtn?.classList.remove("active");
    }

    revealElements.forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight / 1.15) {
        el.classList.add("revealed");
      }
    });
  };

  window.addEventListener("scroll", onScroll);
  window.addEventListener("load", onScroll);
}
