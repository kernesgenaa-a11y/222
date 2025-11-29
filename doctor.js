// doctors.js
async function loadDoctors() {
  const folder = '/content/doctors/';
  const files = await fetchDoctorFiles(folder);
  const doctors = await Promise.all(files.map(parseDoctorFile));
  renderDoctors(doctors);
}

async function fetchDoctorFiles(folder) {
  const res = await fetch('https://api.github.com/repos/USER/REPO/contents/content/doctors'); // заміни USER/REPO
  const data = await res.json();
  return data.filter(f => f.name.endsWith('.md')).map(f => f.download_url);
}

async function parseDoctorFile(url) {
  const text = await fetch(url).then(r => r.text());
  const frontmatter = text.match(/---([\s\S]*?)---/)[1];
  const fields = Object.fromEntries(
    frontmatter.trim().split('\n').map(line => {
      const [key, ...rest] = line.split(':');
      return [key.trim(), rest.join(':').trim().replace(/^"|"$/g, '')];
    })
  );
  return fields;
}

function renderDoctors(doctors) {
  const container = document.getElementById('doctors');
  doctors.forEach(doc => {
    const card = document.createElement('div');
    card.className = 'doctor-card';
    card.innerHTML = `
      <img src="${doc.photo}" alt="${doc.name}">
      <h3>${doc.name}</h3>
      <p><strong>Посада:</strong> ${doc.position}</p>
      <p><strong>Спеціалізація:</strong> ${doc.specialization}</p>
      <p><strong>Стаж:</strong> ${doc.experience}</p>
    `;
    container.appendChild(card);
  });
}

loadDoctors();
