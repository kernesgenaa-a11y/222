let currentPage = 0;
const perPage = 3;
let news = [];

fetch('/data/news/index.json')
  .then(res => res.json())
  .then(data => {
    news = data;
    render();
  });

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
    button.addEventListener("click", () => {
      const card = button.closest(".blog-card");
      const fullText = card.querySelector(".full-text");

      const isExpanded = card.classList.toggle("expanded");
      fullText.hidden = !isExpanded;
      button.textContent = isExpanded ? "Згорнути" : "Читати далі";
    });
  });
}

const MAX_VISIBLE = 3;
let currentIndex = 0;
let sortedNews = [];



document.getElementById('nextNews').onclick = () => {
  if ((currentPage + 1) * perPage < news.length) {
    currentPage++;
    render();
  }
};

document.getElementById('prevNews').onclick = () => {
  if (currentPage > 0) {
    currentPage--;
    render();
  }
};
