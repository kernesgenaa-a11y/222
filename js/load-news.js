<script>
const repoOwner = "kernesgenaa-a11y";
const repoName = "222";
const branch = "main"; // або master
const folderPath = "news";

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
</script>
