'use strict';


/**if ('serviceWorker' in navigator) {
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
 */

const preloader = document.querySelector("[data-preloader]");

window.addEventListener("load", function () {
  preloader.classList.add("loaded");
  document.body.classList.add("loaded");
});


/**
 * pwa banner
 

 document.addEventListener("DOMContentLoaded", () => {
    const banner = document.getElementById("pwa-banner");
    const installBtn = document.getElementById("pwa-install-btn");
    const closeBtn = document.getElementById("pwa-close-btn");
    const iosInstructions = document.getElementById("ios-instructions");
    const iosOkBtn = document.getElementById("ios-ok-btn");

    let deferredPrompt;

    // Перевірка чи вже встановлено або закрито раніше
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    const isBannerDismissed = localStorage.getItem("pwaBannerDismissed") === "true";

    // Якщо вже встановлено або закрито користувачем - не показуємо
    if (isStandalone || isBannerDismissed) {
      banner.style.display = "none"; 
      return;
    }

    // Плавне розгортання при завантаженні (відсуває сайт вниз)
    setTimeout(() => {
      banner.classList.add("visible");
    }, 500);

    // Відловлюємо подію beforeinstallprompt (Android/Chrome)
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;
    });

    // Визначаємо iOS
    const isIOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent);

    installBtn.addEventListener("click", () => {
      if (isIOS) {
        // Показуємо інструкцію для iOS
        iosInstructions.classList.add("active");
      } else if (deferredPrompt) {
        // Стандартний промпт для Android/Desktop
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choice) => {
          if (choice.outcome === "accepted") {
            hideBanner(true); // Ховаємо назавжди після встановлення
          }
        });
      }
    });

    iosOkBtn.addEventListener("click", () => {
      iosInstructions.classList.remove("active");
      hideBanner(true); // Ховаємо банер після ознайомлення з інструкцією
    });

    closeBtn.addEventListener("click", () => {
      hideBanner(true); // Закриття хрестиком = назавжди
    });

    // При скролі вниз - плавно ховаємо
    let scrolled = false;
    window.addEventListener("scroll", () => {
      if (!scrolled && window.scrollY > 50) { // Додано поріг > 50px, щоб не спрацьовувало від мікро-рухів
        scrolled = true;
        
        // Затримка перед зникненням
        setTimeout(() => {
          // Важливо: При скролі ми ховаємо банер, але чи ховати його НАЗАВЖДИ?
          // false = при наступному перезавантаженні сторінки він знову з'явиться (якщо не був натиснутий хрестик)
          // true = більше ніколи не показувати
          hideBanner(false); 
        }, 1500);
      }
    });

    
     * Функція приховування банера
     * - чи запам'ятовувати вибір в localStorage
     
    function hideBanner(remember) {
      banner.classList.remove("visible");
      banner.classList.add("hidden");
      
      if (remember) {
        localStorage.setItem("pwaBannerDismissed", "true");
      }
    }
  });
*/
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

    const items = serviceList.querySelectorAll('li');
    const VISIBLE = 4; // number of visible items to move by
    const AUTOPLAY_DELAY = 5000; // 5 seconds - slow
    let timer = null;

    const scrollStep = () => {
      // scroll by container width (shows next group of VISIBLE items)
      const step = serviceList.clientWidth;
      const maxScrollLeft = serviceList.scrollWidth - serviceList.clientWidth;

      if (serviceList.scrollLeft >= maxScrollLeft - 2) {
        // when at the end, go back to start smoothly
        serviceList.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        serviceList.scrollBy({ left: step, behavior: 'smooth' });
      }
    };

    const startAutoplay = () => {
      stopAutoplay();
      if (window.innerWidth >= 992 && items.length > VISIBLE) {
        timer = setInterval(scrollStep, AUTOPLAY_DELAY);
      }
    };

    const stopAutoplay = () => {
      if (timer) { clearInterval(timer); timer = null; }
    };

    // start/stop based on viewport
    const onResize = () => {
      if (window.innerWidth >= 992 && items.length > VISIBLE) startAutoplay();
      else stopAutoplay();
    };

    onResize();
    window.addEventListener('resize', onResize);

    // Pause autoplay on user interaction
    serviceList.addEventListener('mouseenter', stopAutoplay);
    serviceList.addEventListener('mouseleave', startAutoplay);
    serviceList.addEventListener('touchstart', stopAutoplay, { passive: true });
    serviceList.addEventListener('touchend', startAutoplay, { passive: true });

    // allow keyboard focus to pause autoplay
    serviceList.addEventListener('focusin', stopAutoplay);
    serviceList.addEventListener('focusout', startAutoplay);

    // Provide affordance for dragging
    serviceList.style.cursor = 'grab';
    serviceList.addEventListener('pointerdown', () => { serviceList.style.cursor = 'grabbing'; });
    serviceList.addEventListener('pointerup', () => { serviceList.style.cursor = 'grab'; });
  });

document.addEventListener('DOMContentLoaded', () => {
  new Swiper('.review-swiper', {
    slidesPerView: 1,
    spaceBetween: 24,
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    navigation: {
      nextEl: '.review-next',
      prevEl: '.review-prev'
    },
    breakpoints: {
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 }
    }
  });
});
