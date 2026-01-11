const repoOwner = "kernesgenaa-a11y";
const repoName = "222";
const branch = "main";
const folderPath = "data/news";


async function fetchFileList() {
  const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folderPath}?ref=${branch}`;
  const response = await fetch(apiUrl);
  if (!response.ok) return [];
  const files = await response.json();
  return files.filter(file => file.name.endsWith(".md"));
}

async function fetchMarkdownFile(url) {
  const response = await fetch(url);
  if (!response.ok) return null;
  return await response.text();
}

function parseFrontMatter(raw) {
  const match = raw.match(/^---\n([\s\S]+?)\n---\n([\s\S]*)$/);
  if (!match) return null;

  const yaml = match[1];
  const content = match[2];
  const data = {};

  yaml.split('\n').forEach(line => {
    const [key, ...rest] = line.split(':');
    if (key && rest.length) {
      data[key.trim()] = rest.join(':').trim().replace(/^"(.*)"$/, '$1');
    }
  });

  return { data, content };
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

function convertMarkdownToHTML(markdown) {
  return markdown
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/\n$/gim, '<br>')
    .replace(/\n/gim, '<p>');
}

function createNewsCard(data, fullTextHTML) {
  const li = document.createElement("li");
  li.innerHTML = `
    <div class="blog-card has-before has-after">
      <div class="meta-wrapper">
        <div class="card-meta">
          <ion-icon name="person-outline"></ion-icon>
          <span class="span">${data.author || "Автор"}</span>
        </div>
        <div class="card-meta">
          <ion-icon name="folder-outline"></ion-icon>
          <span class="span">${data.category || "Категорія"}</span>
        </div>
      </div>
      <h3 class="headline-sm card-title">${data.title || "Без назви"}</h3>
      <time class="title-sm date">${formatDate(data.date)}</time>
      <p class="card-text">${data.description || ""}</p>

      <div class="full-text" hidden>
        ${fullTextHTML}
      </div>
      <button class="btn-text title-lg toggle-btn">Читати далі</button>
    </div>
  `;
  return li;
}

function enableToggle() {
  document.querySelectorAll(".toggle-btn").forEach(button => {
    button.onclick = () => {
      const card = button.closest(".blog-card");
      const fullText = card.querySelector(".full-text");
      const isOpen = card.classList.toggle("expanded");

      fullText.hidden = !isOpen;
      button.textContent = isOpen ? "Згорнути" : "Читати далі";

      if (!isOpen) {
        card.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    };
  });
}

const PAGE_SIZE = 3;
let currentPage = 0;
let sortedNews = [];

async function loadNews() {
  const newsList = document.querySelector(".grid-list");
  if (!newsList) return;

  const files = await fetchFileList();
  const parsedFiles = [];

  for (const file of files) {
    const raw = await fetchMarkdownFile(file.download_url);
    if (!raw) continue;

    const parsed = parseFrontMatter(raw);
    if (!parsed || !parsed.data?.date) continue;

    parsedFiles.push({
      data: parsed.data,
      content: parsed.content
    });
  }

  // Найновіші першими
  sortedNews = parsedFiles.sort(
    (a, b) => new Date(b.data.date) - new Date(a.data.date)
  );

  createNavigation();
  console.debug('news: parsedFiles=', parsedFiles.length, 'sortedNews=', sortedNews.length);
  renderCarousel();
  // ensure layout after render
  layoutCarousel();
  window.addEventListener('resize', () => layoutCarousel());
  // enable touch swipe on mobile
  setupSwipe();
}

function renderCarousel() {
  const newsList = document.querySelector(".grid-list");
  if (!newsList) return;

  newsList.innerHTML = "";
  newsList.classList.add('carousel');

  sortedNews.forEach(item => {
    const fullTextHTML = convertMarkdownToHTML(item.content);
    newsList.appendChild(createNewsCard(item.data, fullTextHTML));
  });

  enableToggle();
  updateNavButtons();

  // initial position
  const viewport = document.querySelector('.carousel-viewport');
  if (viewport) {
    const list = newsList;
    list.style.transition = 'transform 400ms ease';
    list.style.transform = `translateX(-${currentPage * viewport.clientWidth}px)`;
  }
}

function layoutCarousel() {
  const list = document.querySelector('.grid-list');
  const viewport = document.querySelector('.carousel-viewport');
  if (!list || !viewport) return;

  const items = Array.from(list.querySelectorAll('li'));
  const percent = 100 / PAGE_SIZE;

  items.forEach(li => {
    li.style.flex = `0 0 ${percent}%`;
    li.style.maxWidth = `${percent}%`;
    li.style.boxSizing = 'border-box';
  });

  // set transform in pixels so it's viewport-accurate
  const shift = currentPage * viewport.clientWidth;
  list.style.transform = `translateX(-${shift}px)`;
}

function setupSwipe() {
  const viewport = document.querySelector('.carousel-viewport');
  const list = document.querySelector('.grid-list');
  if (!viewport || !list) return;

  let startX = 0;
  let currentX = 0;
  let isDown = false;
  const threshold = 50; // px

  // allow vertical scrolling but capture horizontal pointer moves
  viewport.style.touchAction = 'pan-y';

  viewport.addEventListener('pointerdown', (e) => {
    isDown = true;
    startX = e.clientX;
    currentX = startX;
    try { viewport.setPointerCapture(e.pointerId); } catch (err) {}
    list.style.transition = 'none';
  });

  viewport.addEventListener('pointermove', (e) => {
    if (!isDown) return;
    currentX = e.clientX;
    const dx = currentX - startX;
    const base = -currentPage * viewport.clientWidth;
    list.style.transform = `translateX(${base + dx}px)`;
  });

  function endPointer(e) {
    if (!isDown) return;
    isDown = false;
    try { viewport.releasePointerCapture(e.pointerId); } catch (err) {}
    const dx = currentX - startX;
    list.style.transition = 'transform 400ms ease';
    if (Math.abs(dx) > threshold) {
      changePage(dx < 0 ? 1 : -1);
    } else {
      // snap back
      const shift = currentPage * viewport.clientWidth;
      list.style.transform = `translateX(-${shift}px)`;
    }
  }

  viewport.addEventListener('pointerup', endPointer);
  viewport.addEventListener('pointercancel', endPointer);
}

function createNavigation() {
  if (document.querySelector('.news-wrapper')) return;

  const list = document.querySelector('.grid-list');
  if (!list) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'news-wrapper';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'nav-btn prev';
  prevBtn.setAttribute('aria-label', 'previous news');
  prevBtn.innerHTML = '<svg class="strelka-left-3" viewBox="0 0 5 9" xmlns="http://www.w3.org/2000/svg">\n    <path fill="currentColor" d="M0.419,9.000 L0.003,8.606 L4.164,4.500 L0.003,0.394 L0.419,0.000 L4.997,4.500 L0.419,9.000 Z"></path>\n  </svg>';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'nav-btn next';
  nextBtn.setAttribute('aria-label', 'next news');
  nextBtn.innerHTML = '<svg class="strelka-right-3" viewBox="0 0 5 9" xmlns="http://www.w3.org/2000/svg">\n    <path fill="currentColor" d="M0.419,9.000 L0.003,8.606 L4.164,4.500 L0.003,0.394 L0.419,0.000 L4.997,4.500 L0.419,9.000 Z"></path>\n  </svg>';

  const viewport = document.createElement('div');
  viewport.className = 'carousel-viewport';

  // insert wrapper and move list into viewport
  list.parentElement.insertBefore(wrapper, list);
  wrapper.appendChild(prevBtn);
  wrapper.appendChild(viewport);
  viewport.appendChild(list);
  wrapper.appendChild(nextBtn);

  prevBtn.addEventListener('click', () => changePage(-1));
  nextBtn.addEventListener('click', () => changePage(1));
}

function changePage(delta) {
  const list = document.querySelector('.grid-list');
  const viewport = document.querySelector('.carousel-viewport');
  if (!list || !viewport) return;

  const totalPages = Math.ceil(sortedNews.length / PAGE_SIZE) || 0;
  const newPage = Math.max(0, Math.min(totalPages - 1, currentPage + delta));
  if (newPage === currentPage) return;

  currentPage = newPage;
  const shift = currentPage * viewport.clientWidth;
  list.style.transition = 'transform 400ms ease';
  list.style.transform = `translateX(-${shift}px)`;
  updateNavButtons();
}

function updateNavButtons() {
  const prevBtn = document.querySelector(".nav-btn.prev");
  const nextBtn = document.querySelector(".nav-btn.next");
  const totalPages = Math.ceil(sortedNews.length / PAGE_SIZE) || 0;

  if (prevBtn) prevBtn.hidden = currentPage === 0;
  if (nextBtn) nextBtn.hidden = currentPage >= totalPages - 1;
}

document.addEventListener("DOMContentLoaded", loadNews);