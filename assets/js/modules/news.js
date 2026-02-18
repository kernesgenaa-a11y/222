import { formatDate } from "./utils.js";

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
  return response.text();
}

function parseFrontMatter(raw) {
  const match = raw.match(/^---\n([\s\S]+?)\n---\n([\s\S]*)$/);
  if (!match) return null;

  const yaml = match[1];
  const content = match[2];
  const data = {};

  yaml.split("\n").forEach(line => {
    const [key, ...rest] = line.split(":");
    if (key && rest.length) {
      data[key.trim()] = rest.join(":").trim().replace(/^"(.*)"$/, "$1");
    }
  });

  return { data, content };
}

function convertMarkdownToHTML(markdown) {
  return markdown
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/gim, "<em>$1</em>")
    .replace(/\n/gim, "<br>");
}

function createNewsCard(data, html) {
  const li = document.createElement("li");
  li.innerHTML = `
    <div class="blog-card">
      <h3 class="headline-sm card-title">${data.title}</h3>
      <time class="date">${formatDate(data.date)}</time>
      <p class="card-text">${data.description || ""}</p>
      <div class="full-text" hidden>${html}</div>
      <button class="btn-text toggle-btn">Читати далі</button>
    </div>
  `;
  return li;
}

export async function loadNews() {
  const list = document.querySelector(".grid-list");
  if (!list) return;

  const files = await fetchFileList();

  for (const file of files) {
    const raw = await fetchMarkdownFile(file.download_url);
    const parsed = parseFrontMatter(raw);
    if (!parsed) continue;

    const html = convertMarkdownToHTML(parsed.content);
    const card = createNewsCard(parsed.data, html);
    list.appendChild(card);
  }

  document.querySelectorAll(".toggle-btn").forEach(button => {
    button.addEventListener("click", () => {
      const card = button.closest(".blog-card");
      const fullText = card.querySelector(".full-text");
      const isOpen = card.classList.toggle("expanded");

      fullText.hidden = !isOpen;
      button.textContent = isOpen ? "Згорнути" : "Читати далі";
    });
  });
}
