/**
 * add event listener on multiple elements
 */

const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
}



/**
 * PRELOADER
 */

const preloader = document.querySelector("[data-preloader]");

window.addEventListener("load", function () {
  preloader.classList.add("loaded");
  document.body.classList.add("loaded");
});

/**
 * MOBILE NAVBAR
 * 
 * show the mobile navbar when click menu button
 * and hidden after click menu close button or overlay
 */

const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");
const navLinks = document.querySelectorAll("[data-navbar] a");

const toggleNav = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("nav-active");
}
navLinks.forEach(link => {
  link.addEventListener("click", () => {
    navbar.classList.remove("active");
    overlay.classList.remove("active");
    document.body.classList.remove("nav-active");
  });
});

addEventOnElements(navTogglers, "click", toggleNav);



/**
 * HEADER & BACK TOP BTN
 * 
 * active header & back top btn when window scroll down to 100px
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

const activeElementOnScroll = function () {
  if (window.scrollY > 100) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
}

window.addEventListener("scroll", activeElementOnScroll);



/**
 * SCROLL REVEAL
 */

const revealElements = document.querySelectorAll("[data-reveal]");

const revealElementOnScroll = function () {
  for (let i = 0, len = revealElements.length; i < len; i++) {
    if (revealElements[i].getBoundingClientRect().top < window.innerHeight / 1.15) {
      revealElements[i].classList.add("revealed");
    } else {
      revealElements[i].classList.remove("revealed");
    }
  }
}

window.addEventListener("scroll", revealElementOnScroll);

window.addEventListener("load", revealElementOnScroll);

/* about*/



  // Закрити меню після кліку на пункт
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      sidebar.classList.remove('open');
    });
  });



  /* ---------------------------------------------
     SERVICE CAROUSEL - autoplay by 4 items (slow)
     --------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
  const serviceList = document.querySelector('.service-list');
  if (!serviceList) return;

  const items = Array.from(serviceList.querySelectorAll('li'));
  if (!items.length) return;

  const DESKTOP_BP = 992;
  const AUTOPLAY_DELAY = 4000;

  let autoplayTimer = null;
  let isDragging = false;
  let startX = 0;
  let scrollStart = 0;

  /* ----------------------------------------
     Helpers
  ---------------------------------------- */

  const getItemWidth = () => {
    const item = items[0];
    const style = getComputedStyle(item);
    return item.offsetWidth + parseFloat(style.marginRight || 0);
  };

  const maxScrollLeft = () =>
    serviceList.scrollWidth - serviceList.clientWidth;

  const snapToNearest = () => {
    const itemWidth = getItemWidth();
    const index = Math.round(serviceList.scrollLeft / itemWidth);
    serviceList.scrollTo({
      left: index * itemWidth,
      behavior: 'smooth'
    });
  };

  /* ----------------------------------------
     Autoplay
  ---------------------------------------- */

  const autoplayStep = () => {
    if (isDragging) return;

    const itemWidth = getItemWidth();
    const next = serviceList.scrollLeft + itemWidth * 3;

    if (next >= maxScrollLeft() - 2) {
      serviceList.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      serviceList.scrollBy({ left: itemWidth * 3, behavior: 'smooth' });
    }
  };

  const startAutoplay = () => {
    stopAutoplay();
    if (window.innerWidth >= DESKTOP_BP && items.length > 3) {
      autoplayTimer = setInterval(autoplayStep, AUTOPLAY_DELAY);
    }
  };

  const stopAutoplay = () => {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  };

  /* ----------------------------------------
     Drag with mouse (desktop)
  ---------------------------------------- */

  serviceList.style.cursor = 'grab';

  serviceList.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse') return;

    isDragging = true;
    startX = e.clientX;
    scrollStart = serviceList.scrollLeft;

    stopAutoplay();
    serviceList.style.cursor = 'grabbing';
    serviceList.setPointerCapture(e.pointerId);
  });

  serviceList.addEventListener('pointermove', e => {
    if (!isDragging) return;

    const dx = e.clientX - startX;
    serviceList.scrollLeft = scrollStart - dx;
  });

  const stopDrag = e => {
    if (!isDragging) return;

    isDragging = false;
    serviceList.style.cursor = 'grab';
    serviceList.releasePointerCapture(e.pointerId);

    snapToNearest();
    startAutoplay();
  };

  serviceList.addEventListener('pointerup', stopDrag);
  serviceList.addEventListener('pointercancel', stopDrag);
  serviceList.addEventListener('pointerleave', stopDrag);

  /* ----------------------------------------
     Pause on interaction
  ---------------------------------------- */

  serviceList.addEventListener('mouseenter', stopAutoplay);
  serviceList.addEventListener('mouseleave', startAutoplay);
  serviceList.addEventListener('focusin', stopAutoplay);
  serviceList.addEventListener('focusout', startAutoplay);
  serviceList.addEventListener('touchstart', stopAutoplay, { passive: true });
  serviceList.addEventListener('touchend', startAutoplay, { passive: true });

  /* ----------------------------------------
     Resize (debounced)
  ---------------------------------------- */

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(startAutoplay, 200);
  });

  startAutoplay();
});
