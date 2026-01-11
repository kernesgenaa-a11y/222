const fs = require('fs');
const path = require('path');

const manifestPath = path.join(__dirname, '..', 'manifest.json');
let ok = true;
try {
  const raw = fs.readFileSync(manifestPath, 'utf8');
  const m = JSON.parse(raw);
  if (!m.name && !m.short_name) {
    console.error('Manifest: missing name or short_name');
    ok = false;
  }
  if (!m.start_url) {
    console.error('Manifest: missing start_url');
    ok = false;
  }
  if (!Array.isArray(m.icons) || m.icons.length === 0) {
    console.error('Manifest: icons missing or empty');
    ok = false;
  } else {
    m.icons.forEach(icon => {
      const p = path.join(__dirname, '..', icon.src || '');
      if (!fs.existsSync(p)) {
        console.warn('Manifest: icon not found ->', icon.src);
      }
    });
  }
  if (!ok) process.exit(2);
  console.log('Manifest check: basic checks passed');
} catch (e) {
  console.error('Manifest check failed:', e.message);
  process.exit(3);
}
