# tamemj.com Portfolio Website

Modern, minimal, mobile-first portfolio website for an independent iOS developer. Built with Next.js App Router + Tailwind CSS and structured around apps (not a blog or resume).

## Features

- App-focused portfolio home page
- JSON-driven apps listing (`/data/apps.json`)
- Dynamic app detail page template (`/apps/[slug]`)
- Privacy policy page template
- Support page with FAQ + lightweight `mailto:` support form
- Contact page with `mailto:` form (no backend required)
- SEO-ready metadata, Open Graph tags, `robots.txt`, `sitemap.xml`, favicon
- Static export ready for fast hosting and GitHub Pages

## Tech Stack

- Next.js (App Router)
- React
- Tailwind CSS
- TypeScript

## Project Structure

```text
app/
  apps/
    [slug]/
  contact/
  privacy/
  support/
  globals.css
  layout.tsx
  page.tsx
components/
data/
  apps.json
lib/
public/
  images/
  robots.txt
  sitemap.xml
types/
```

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Add a New App

1. Add a new object to `data/apps.json`
2. Add an app icon and screenshots under `public/images/apps/<slug>/`
3. Rebuild the site (`npm run build`)
4. Update `public/sitemap.xml` with the new app URL

The `/apps` page and `/apps/[slug]` page are generated automatically from the JSON data.

## Deployment

Deployment configs included in this repo:

- `vercel.json`
- `netlify.toml`
- `.github/workflows/deploy-gh-pages.yml`
- `public/CNAME`
- `public/.nojekyll`

### Vercel

1. Push the project to GitHub/GitLab/Bitbucket
2. Import the repository in Vercel
3. Build command: `npm run build`
4. Output directory: `out` (because `output: "export"` is enabled)
5. Add custom domain `tamemj.com` in Vercel project settings
6. Redeploy after setting environment/domain settings if needed

### Netlify

1. Create a new site from your repository
2. Netlify will read `netlify.toml` automatically (`npm run build`, publish `out`)
3. If prompted manually:
   - Build command: `npm run build`
   - Publish directory: `out`
4. Add custom domain `tamemj.com`

### GitHub Pages (Static)

This project is configured for static export and includes a GitHub Actions workflow for Pages deploy.

1. Push to the `main` branch
2. In GitHub: `Settings` → `Pages`
3. Set Source to `GitHub Actions`
4. The workflow `.github/workflows/deploy-gh-pages.yml` will build and deploy `out/`
5. Set the custom domain to `tamemj.com`
6. Keep `public/CNAME` in the repo so the domain is preserved

If your default branch is not `main`, update the workflow trigger branch name.

## Notes for Future Scalability

- Add analytics later (Plausible, Umami, GA4) in `app/layout.tsx`
- Add a blog section with a new route group (e.g. `app/(content)/blog`)
- Add newsletter signup by replacing `mailto:` forms with API-backed forms
- Continue using `data/apps.json` or move to a CMS when app count grows

## Performance Notes

- Uses static export for fast global delivery
- The repo starts with no sample apps; add your own optimized assets under `public/images/apps/`
- `next/image` is used for lazy loading screenshots
- Prefer WebP/AVIF screenshots for production app assets
