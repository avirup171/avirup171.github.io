# CLAUDE.md — avirup171.github.io

Personal website for **Avirup Basu**, hosted on GitHub Pages. Read this before making any change.

## Purpose

- A personal hub: who Avirup is, what he works on, and links out to his writing.
- **No self-hosted blog posts.** Writing lives on external platforms; this site links to it.
- **Primary SEO goal:** rank #1 for "Avirup Basu" and act as the canonical identity page tying together all his profiles.
- **Secondary SEO goal:** surface his expertise (Rust, edge computing, Industrial IoT) through real indexable text.

## About the owner (for copy and structured data)

- CTO & Co-founder of **Kernopy**, an edge-to-cloud Industrial IoT platform built in Rust (edge runtime, Modbus/OPC-UA, tokio, MQTT). Based in Siliguri, West Bengal, India.
- The site presents him under Kernopy only: don't mention Blackspektro anywhere on the site.
- Previously at P360: IoT solutions and enterprise messaging for pharma; holds one patent.
- Hobby projects include Image Viewer (Tauri 2 + Rust + React desktop app, github.com/avirup171/image_viewer).
- Author of two books (*Building IoT Systems*, Apress 2025; *Intel Edison Projects*, Packt 2017); has published research papers.
- Username `avirup171` on GitHub, YouTube and most platforms; Instagram is `starbridger`.
- Do not invent facts, titles, dates, metrics or testimonials. Leave a clearly marked `TODO` placeholder instead.

## Stack (decided)

- **Astro 7** (Node ≥ 22.23.4), static output only (`output: 'static'`, the default). Zero client-side JS by default.
- No React unless a specific interactive component is needed. If one is, use `@astrojs/react` with an explicit `client:*` directive.
- **`@astrojs/sitemap`** for the sitemap.
- `build.inlineStylesheets: 'always'`: the one small stylesheet (`src/styles/global.css`) is inlined, so there are no render-blocking requests.
- Deployed to GitHub Pages via **GitHub Actions** (`withastro/action@v6` + `actions/deploy-pages@v5`). Pages source is set to "GitHub Actions".
- Repo is a **user site** (`avirup171.github.io`), served at the root, so no `base` path is needed.
- Custom domain: **https://avirupbasu.com** (apex is canonical; `www` and `avirup171.github.io` redirect to it). DNS at GoDaddy: four A + four AAAA records to GitHub Pages, `www` CNAME → `avirup171.github.io`. If the domain changes, update `site` in `astro.config.mjs`, `url` in `profile.json`, `public/robots.txt`, `public/og.png`, `public/CNAME`, and repo Settings → Pages. `public/CNAME` (containing `avirupbasu.com`) ships in every build: GitHub's docs say Actions deployments don't need it, but Astro's guide recommends it; it was added while debugging a 404 on the custom domain (Oct 2026). Keep it.

## Content model: everything configurable lives in JSON

All editable content is in `src/data/`. Pages read it **at build time** via content collections. Never fetch JSON in the browser, because crawlers and social previews must see fully rendered HTML.

| File | Contents |
|---|---|
| `profile.json` | name, title, jobTitle, company, companyUrl, location, url, image (path relative to the JSON file, i.e. `../assets/…`), tagline, description (homepage meta, ≤170 chars), bio[] (paragraphs), knowsAbout[], email, profiles[] `{label, url, writing}`. Every profile URL is emitted as `sameAs`; `writing: true` also lists it under Writing. |
| `links.json` | external posts: title, url, platform, date (ISO), summary, featured (bool) |
| `reviews.json` | testimonials: name, role, quote, link (optional) |
| `books.json` | books: title, publisher, year, isbn (optional), url (optional), summary |
| `projects.json` | hobby projects: name, summary, tech[], repo?, url?, urlLabel (default "Visit"), image? + imageAlt (required with image; images in `src/assets/projects/`), featured |

You can add more files later in the same pattern: `papers.json`, `talks.json`.

- Every data file has a schema in `src/content.config.ts` (`file()` loader + zod from `astro/zod`), so a malformed entry **fails the build**.
- JSON files carry no `id` fields; the parsers in `content.config.ts` assign ids at load time, prefixed with the entry's index so `inFileOrder()` in `lib/data.ts` preserves file order (reviews, projects).
- Astro's `file()` loader only *logs* JSON syntax errors, so `scripts/validate-json.mjs` runs as `prebuild` and fails the build on malformed JSON.
- Sort links by `date` descending; `featured` entries appear first in a highlighted block. Books by year descending. Projects: featured first, then file order.
- Every link entry needs a `summary` of 1–2 sentences. This is the site's indexable text.
- Sections with no entries are hidden and drop out of the header nav. Never add placeholder posts or testimonials.

## Structure

```
src/
  data/              profile.json, links.json, reviews.json, books.json, projects.json
  content.config.ts  collection schemas
  lib/data.ts        typed getters (sorting, featured split)
  layouts/Base.astro All <head> SEO lives here
  components/        Header, Footer, LinkCard, ReviewCard, BookCard, ProjectCard
  styles/global.css  the only stylesheet (system fonts, light/dark)
  assets/avirup.jpg  profile photo (astro:assets; JSON-LD uses an 800px JPEG of it)
  assets/projects/   project screenshots
  pages/index.astro  main page (plus 404.astro, noindex)
scripts/validate-json.mjs  prebuild JSON syntax check
public/              robots.txt, og.png (1200×630), favicon.svg, CNAME (custom domain)
.github/workflows/deploy.yml
```

## SEO requirements (non-negotiable)

`Base.astro` takes `profile`, plus an optional `title`, `description` and `noindex`, and must output:

- `<html lang="en">`, charset, viewport
- `<title>`: homepage `Avirup Basu — <title>`; other pages `<Page> | Avirup Basu`
- `<meta name="description">`: unique per page, about 150 characters
- `<link rel="canonical">` built from `Astro.site` + pathname
- Open Graph tags (`og:type`, `og:title`, `og:description`, `og:url`, `og:image`) and `twitter:card=summary_large_image`
- JSON-LD `@graph` containing:
  - `Person`, generated from `profile.json`: name, url, image, jobTitle, description, worksFor, knowsAbout, sameAs
  - `WebSite`, with `publisher` referencing the Person `@id`
- Sitemap link; `public/robots.txt` allows all and points to `sitemap-index.xml`

Do not add `Review`/`AggregateRating` schema for testimonials. Google ignores self-serving reviews, so show them as visible text only.

**On-page:**
- Exactly one `<h1>` (his name), with `<h2>` per section, in this order: About, Writing, Hobby projects, Books, Testimonials, Contact.
- There is no Music section: it was removed at his request. Don't add one back unless he asks.
- Use semantic HTML: `header`, `main`, `section`, `article`, `footer`.
- The photo uses `astro:assets` `<Image>` with `alt="Avirup Basu"` and explicit dimensions.
- External links to his own blogs are normal follow links (no `nofollow`). Profile links use `rel="me"`.
- Use system fonts or self-hosted fonts; no render-blocking third-party CSS or JS.
- Must be mobile-first and accessible: sufficient contrast, visible focus states, and `prefers-color-scheme` support.

## Quality bar before merging

- `npm run build` passes with no schema errors.
- Lighthouse scores 95+ on Performance, Accessibility, Best Practices and SEO (mobile).
- JSON-LD validates in Google's Rich Results Test or the Schema Markup Validator.
- The OG preview renders correctly (LinkedIn Post Inspector).
- `sitemap-index.xml` and `robots.txt` are reachable in the built output.

## Commands

```bash
npm install
npm run dev       # local dev server
npm run build     # JSON check + static build to dist/
npm run preview   # serve the build locally
```

## Don'ts

- Don't convert the site into an SPA or add client-side routing.
- Don't fetch content at runtime.
- Don't hardcode content in components if it belongs in `src/data/`.
- Don't add analytics, trackers or cookie banners without asking.
- Don't add dependencies that aren't clearly needed. Keep the build small and boring.

## Open decisions / TODO

- Posts for `links.json`; testimonials for `reviews.json`
- `companyUrl` for Kernopy
- Public profiles (DEV, Sessionize, Product Hunt, Thinkers360, book bios) describe him as "CEO & Founder"; this site says "CTO & Co-founder". Align them so search engines see one consistent identity.
- Whether to add papers or talks sections
