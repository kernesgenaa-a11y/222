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

const MOBILE_BREAKPOINT = 768;

let currentPage = 0;
let sortedNews = [];
let pageSize = getPageSize();


function isMobile() {
  return window.innerWidth < MOBILE_BREAKPOINT;
}

function getPageSize() {
  return isMobile() ? 1 : 3;
}

async function loadNews() {
  const list = document.querySelector(".grid-list");
  if (!list) return;

  const files = await fetchFileList();
  const parsed = [];

  for (const file of files) {
    const raw = await fetchMarkdownFile(file.download_url);
    if (!raw) continue;
    const parsedFile = parseFrontMatter(raw);
    if (!parsedFile?.data?.date) continue;
    parsed.push(parsedFile);
  }

  sortedNews = parsed.sort(
    (a, b) => new Date(b.data.date) - new Date(a.data.date)
  );

  createNavigation();
  render();
  setupSwipe();
  window.addEventListener("resize", onResize);
}

document.addEventListener("DOMContentLoaded", loadNews);

function render() {
  pageSize = getPageSize();
  currentPage = Math.min(currentPage, getTotalPages() - 1);

  const list = document.querySelector(".grid-list");
  const viewport = document.querySelector(".carousel-viewport");

  list.innerHTML = "";
  list.classList.add("carousel");

  sortedNews.forEach(item => {
    const html = convertMarkdownToHTML(item.content);
    list.appendChild(createNewsCard(item.data, html));
  });

  layout();
  updateNavButtons();
  enableToggle();
}

function layout() {
  const list = document.querySelector(".grid-list");
  const viewport = document.querySelector(".carousel-viewport");
  if (!list || !viewport) return;

  const widthPercent = 100 / pageSize;

  [...list.children].forEach(li => {
    li.style.flex = `0 0 ${widthPercent}%`;
    li.style.maxWidth = `${widthPercent}%`;
  });

  list.style.transition = "transform 400ms ease";
  list.style.transform = `translateX(-${currentPage * viewport.clientWidth}px)`;
}

/* =========================
   Navigation
========================= */
function getTotalPages() {
  return Math.ceil(sortedNews.length / pageSize);
}

function changePage(delta) {
  const newPage = Math.max(
    0,
    Math.min(getTotalPages() - 1, currentPage + delta)
  );

  if (newPage === currentPage) return;
  currentPage = newPage;
  layout();
  updateNavButtons();
}

function updateNavButtons() {
  const prev = document.querySelector(".news-nav-btn.prev");
  const next = document.querySelector(".news-nav-btn.next");

  if (isMobile()) {
    prev.hidden = true;
    next.hidden = true;
    return;
  }

  prev.hidden = currentPage === 0;
  next.hidden = currentPage >= getTotalPages() - 1;
}

/* =========================
   Resize
========================= */
function onResize() {
  const oldSize = pageSize;
  pageSize = getPageSize();

  if (oldSize !== pageSize) {
    currentPage = Math.floor((currentPage * oldSize) / pageSize);
  }

  layout();
  updateNavButtons();
}

/* =========================
   Swipe (mobile-first)
========================= */
function setupSwipe() {
  const viewport = document.querySelector(".carousel-viewport");
  const list = document.querySelector(".grid-list");
  if (!viewport || !list) return;

  let startX = 0;
  let deltaX = 0;
  let active = false;

  viewport.style.touchAction = "pan-y";

  viewport.addEventListener("pointerdown", e => {
    active = true;
    startX = e.clientX;
    deltaX = 0;
    list.style.transition = "none";
  });

  viewport.addEventListener("pointermove", e => {
    if (!active) return;
    deltaX = e.clientX - startX;

    const base = -currentPage * viewport.clientWidth;
    list.style.transform = `translateX(${base + deltaX}px)`;
  });

  viewport.addEventListener("pointerup", () => {
    if (!active) return;
    active = false;

    list.style.transition = "transform 400ms ease";

    if (Math.abs(deltaX) > viewport.clientWidth * 0.25) {
      changePage(deltaX < 0 ? 1 : -1);
    } else {
      layout();
    }
  });
}

/* =========================
   Navigation DOM
========================= */
function createNavigation() {
  if (document.querySelector(".news-wrapper")) return;

  const list = document.querySelector(".grid-list");
  const wrapper = document.createElement("div");
  wrapper.className = "news-wrapper";

  const prev = document.createElement("button");
  prev.className = "news-nav-btn prev";
  prev.innerHTML = "‹";
  prev.onclick = () => changePage(-1);

  const next = document.createElement("button");
  next.className = "news-nav-btn next";
  next.innerHTML = "›";
  next.onclick = () => changePage(1);

  const viewport = document.createElement("div");
  viewport.className = "carousel-viewport";

  list.parentNode.insertBefore(wrapper, list);
  wrapper.append(prev, viewport, next);
  viewport.appendChild(list);
}

document.addEventListener("DOMContentLoaded", loadNews);   