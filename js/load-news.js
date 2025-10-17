const repoOwner = "kernesgenaa-a11y"; // ← заміни
const repoName = "222";      // ← заміни
const branch = "main";                    // ← або "master"
const folderPath = "public/news";

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

function createNewsCard(data) {
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
      <a href="/news/${data.slug}.html" class="btn-text title-lg">Читати далі</a>
    </div>
  `;
  return li;
}

async function loadNews() {
  const newsList = document.querySelector(".grid-list");
  if (!newsList) return;

  const files = await fetchFileList();
  for (const file of files) {
    const raw = await fetchMarkdownFile(file.download_url);
    if (!raw) continue;

    const parsed = parseFrontMatter(raw);
    if (!parsed || !parsed.data) continue;

    const card = createNewsCard(parsed.data);
    newsList.appendChild(card);
  }
}

document.addEventListener("DOMContentLoaded", loadNews);
