# MishStore — Ready-to-deploy Static E‑commerce Site

This is a fully static, ready-to-deploy single-page commercial website for MishStore (HTML, CSS, JS). It includes:
- `index.html` — main page
- `styles.css` — responsive styling
- `app.js` — interactivity: search, sort, product modal, cart stored in localStorage, theme toggle
- Uses Unsplash image URLs for product images (replace with your own images for production)

## How to run locally
1. Unzip the project.
2. Open `index.html` in your browser OR serve the folder with a static server (recommended):
   ```bash
   npx serve .
   ```

## Deploy to GitHub + Vercel
1. Create a new GitHub repository and push the project files.
2. In Vercel, import the repository.
   - Framework: **Other**
   - Root: `/`
   - Build: none (static)
3. Deploy — Vercel will host the static site and give you a live URL.

## Customize
- Replace product images in `app.js` (the `img` fields) with your own hosted image URLs or add an `assets/` folder and update paths.
- Integrate a CMS or a JSON API for dynamic product management.
- For real payments, integrate Stripe, PayPal or another payment gateway on the server-side.

---
If you’d like, I can:
- Replace Unsplash images with uploaded images you provide.
- Push this project to a new GitHub repo for you and deploy to Vercel (you’ll need to connect your GitHub account to Vercel).
- Add SEO meta tags, sitemap, and structured data.
