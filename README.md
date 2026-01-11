Dentist website for Verhovskyj Olksandr

Local development
```
npm ci
npm run build    # bundle JS
npm run start    # serve at http://127.0.0.1:8080
npm run lint-html
npm run check-manifest
```

CI
- `ci-validate.yml` runs HTML validation, manifest checks and builds the bundle.
- `lighthouse.yml` runs Lighthouse against a served local instance and uploads artifacts.

Notes
- Lighthouse requires a headless browser — CI workflow uses an action that provides it.
- Image optimization: use `npm run optimize-images` (imagemin) to output optimized copies.
 - Image optimization: use `npm run optimize-images` to convert images to WebP/AVIF using `sharp`.

Optimize images (example)
```
npm install --save-dev sharp
npm run optimize-images
```

Example `picture` markup to use optimized assets:
```
<picture>
	<source type="image/avif" srcset="assets/images/opt/hero.avif">
	<source type="image/webp" srcset="assets/images/opt/hero.webp">
	<img src="assets/images/hero.png" alt="Головний банер" width="1200" height="600">
</picture>
```