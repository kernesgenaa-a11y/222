const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'assets', 'images');

async function run() {
  let sharp;
  try {
    sharp = require('sharp');
  } catch (e) {
    console.error('`sharp` is not installed. Run `npm install --save-dev sharp` then re-run this script.');
    process.exit(2);
  }

  const exts = ['.png', '.jpg', '.jpeg', '.webp', '.avif'];
  const files = fs.readdirSync(srcDir).filter(f => {
    const ext = path.extname(f).toLowerCase();
    return exts.includes(ext) && !f.includes('opt');
  });
  if (files.length === 0) {
    console.log('No image files found in', srcDir);
    return;
  }

  for (const f of files) {
    const inPath = path.join(srcDir, f);
    const name = path.parse(f).name;
    const outPath = path.join(srcDir, `${name}.webp`);
    try {
      await sharp(inPath)
        .resize({ withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(outPath);
      
      // Видалити оригінальний файл
      fs.unlinkSync(inPath);
      console.log('Converted and replaced', f, '→', path.relative(process.cwd(), outPath));
    } catch (err) {
      console.error('Failed to convert', f, err.message);
    }
  }
}

run().catch(e => { console.error(e); process.exit(1); });
