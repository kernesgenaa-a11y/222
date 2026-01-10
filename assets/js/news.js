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

  // НАЙНОВІШІ ПЕРШИМИ
  sortedNews = parsedFiles.sort(
    (a, b) => new Date(b.data.date) - new Date(a.data.date)
  );

  renderPage();
  createNavigation();
}

function renderPage() {
  const newsList = document.querySelector(".grid-list");
  newsList.innerHTML = "";

  const start = currentPage * PAGE_SIZE;
  const pageItems = sortedNews.slice(start, start + PAGE_SIZE);

  pageItems.forEach(item => {
    const fullTextHTML = convertMarkdownToHTML(item.content);
    newsList.appendChild(createNewsCard(item.data, fullTextHTML));
  });

  enableToggle();
  updateNavButtons();

  newsList.scrollIntoView({ behavior: "smooth", block: "start" });
}

function createNavigation() {
  const container = document.createElement("div");
  container.className = "news-nav";

  container.innerHTML = `
    <button class="nav-btn prev" hidden>←</button>
    <button class="nav-btn next">→</button>
  `;

  const prevBtn = container.querySelector(".prev");
  const nextBtn = container.querySelector(".next");

  prevBtn.onclick = () => {
    currentPage--;
    renderPage();
  };

  nextBtn.onclick = () => {
    currentPage++;
    renderPage();
  };

  document.querySelector(".grid-list").after(container);
}

function updateNavButtons() {
  const prevBtn = document.querySelector(".nav-btn.prev");
  const nextBtn = document.querySelector(".nav-btn.next");

  prevBtn.hidden = currentPage === 0;
  nextBtn.hidden = (currentPage + 1) * PAGE_SIZE >= sortedNews.length;
}

document.addEventListener("DOMContentLoaded", loadNews);