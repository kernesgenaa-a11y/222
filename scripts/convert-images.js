const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'assets', 'images');
const outDir = path.join(srcDir, 'opt');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function run() {
  let sharp;
  try {
    sharp = require('sharp');
  } catch (e) {
    console.error('`sharp` is not installed. Run `npm install --save-dev sharp` then re-run this script.');
    process.exit(2);
  }

  const exts = ['.png', '.jpg', '.jpeg', '.webp', '.avif'];
  const files = fs.readdirSync(srcDir).filter(f => exts.includes(path.extname(f).toLowerCase()));
  if (files.length === 0) {
    console.log('No image files found in', srcDir);
    return;
  }

  for (const f of files) {
    const inPath = path.join(srcDir, f);
    const name = path.parse(f).name;
    const outWebp = path.join(outDir, `${name}.webp`);
    const outAvif = path.join(outDir, `${name}.avif`);
    try {
      await sharp(inPath)
        .resize({ withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(outWebp);
      await sharp(inPath)
        .resize({ withoutEnlargement: true })
        .avif({ quality: 50 })
        .toFile(outAvif);
      console.log('Converted', f, '→', path.relative(process.cwd(), outWebp), ',', path.relative(process.cwd(), outAvif));
    } catch (err) {
      console.error('Failed to convert', f, err.message);
    }
  }
}

run().catch(e => { console.error(e); process.exit(1); });
