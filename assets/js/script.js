'use strict';





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

const toggleNav = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("nav-active");
}

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

/* news*/

const repoOwner = "ernesgenaa-a11y";
const repoName = "222";
const branch = "main"; // або master
const folderPath = "public/news";

async function fetchFileList() {
  const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folderPath}?ref=${branch}`;
  const res = await fetch(apiUrl);
  const files = await res.json();
  return files.filter(file => file.name.endsWith(".md"));
}

async function fetchMarkdownFile(url) {
  const res = await fetch(url);
  return await res.text();
}

async function loadNews() {
  const files = await fetchFileList();
  const newsList = document.querySelector('.grid-list');

  for (const file of files) {
    const raw = await fetchMarkdownFile(file.download_url);
    const { data } = matter(raw);

    const html = `
      <li>
        <div class="blog-card has-before has-after">
          <div class="meta-wrapper">
            <div class="card-meta"><ion-icon name="person-outline"></ion-icon><span class="span">${data.author}</span></div>
            <div class="card-meta"><ion-icon name="folder-outline"></ion-icon><span class="span">${data.category}</span></div>
          </div>
          <h3 class="headline-sm card-title">${data.title}</h3>
          <time class="title-sm date">${new Date(data.date).toLocaleDateString()}</time>
          <p class="card-text">${data.description}</p>
          <a href="/news/${data.slug}.html" class="btn-text title-lg">Читати далі</a>
        </div>
      </li>`;
    newsList.insertAdjacentHTML('beforeend', html);
  }
}

loadNews();
