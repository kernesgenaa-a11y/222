'use strict';


if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(() => console.log('Service Worker Dentis зареєстровано з повним кешем'))
    .catch(err => console.error('Помилка Service Worker:', err));
}


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
 * 
 * preloader will be visible until document load
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


/*banner app */
(function() {
  let deferredPrompt = null;
  const banner = document.getElementById('pwa-banner');
  const iosModal = document.getElementById('pwa-ios-modal');

  const installBtn = document.getElementById('pwa-install-btn');
  const closeBtn = document.getElementById('pwa-close');
  const iosCloseBtn = document.getElementById('pwa-ios-close');

  // ---- Anti-duplicate guard ----
  if (window.__PWA_BANNER_SHOWN__) return;
  window.__PWA_BANNER_SHOWN__ = true;

  function isIos() {
    return /iphone|ipad|ipod/i.test(navigator.userAgent);
  }

  function isStandalone() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           navigator.standalone === true;
  }

  // Android / Chrome Desktop
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    if (!localStorage.getItem('pwa-dismissed')) {
      banner.classList.remove('hidden');
    }
  });

  // iOS — немає beforeinstallprompt
  document.addEventListener('DOMContentLoaded', () => {
    if (isIos() && !isStandalone() && !localStorage.getItem('pwa-dismissed')) {
      banner.classList.remove('hidden');
    }
  });

  // Install button
  function handleInstall() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt = null;
      banner.classList.add('hidden');
      return;
    }

    // iOS → show modal
    if (isIos()) {
      iosModal.classList.remove('hidden');
    }
  }

  installBtn.addEventListener('click', handleInstall);
  installBtn.addEventListener('touchstart', handleInstall, { passive: true });

  // Close banner
  function closeBanner() {
    banner.classList.add('hidden');
    localStorage.setItem('pwa-dismissed', '1');
  }

  closeBtn.addEventListener('click', closeBanner);
  closeBtn.addEventListener('touchstart', closeBanner, { passive: true });

  // Close iOS modal
  function closeIos() {
    iosModal.classList.add('hidden');
  }

  iosCloseBtn.addEventListener('click', closeIos);
  iosCloseBtn.addEventListener('touchstart', closeIos, { passive: true });

})();



