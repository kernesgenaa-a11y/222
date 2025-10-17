
const repoOwner = "kernesgenaa-a11y";
const repoName = "222";
const branch = "main"; // або master
const folderPath = "public/news";

async function fetchFileList() {
  const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folderPath}?ref=${branch}`;
  const response = await fetch(apiUrl);
  if (!response.ok) {
    console.error("Не вдалося отримати список файлів:", response.status);
    return [];
  }
  const files = await response.json();
  return files.filter(file => file.name.endsWith(".md"));
}

async function fetchMarkdownFile(url) {
  const response = await fetch(url);
  if (!response.ok) {
    console.error("Не вдалося завантажити файл:", response.status);
    return null;
  }
  return await response.text();
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

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

async function loadNews() {
  const newsList = document.querySelector(".grid-list");
  if (!newsList) return;

  const files = await fetchFileList();
  for (const file of files) {
    const raw = await fetchMarkdownFile(file.download_url);
    if (!raw) continue;

    const parsed = window.matter(raw);
    const data = parsed.data;

    const card = createNewsCard(data);
    newsList.appendChild(card);
  }
}

document.addEventListener("DOMContentLoaded", loadNews);

