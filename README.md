# avirup171.github.io

Personal site of **Avirup Basu**, built with [Astro](https://astro.build) and deployed to GitHub Pages by GitHub Actions.

Live: https://avirupbasu.com (also reachable at avirup171.github.io, which redirects)

## Editing content

Everything you'd normally change lives in `src/data/`. Edit the JSON, commit, push to `main`, and the site redeploys.

| File | What it holds |
|---|---|
| `profile.json` | Name, title, bio paragraphs, meta description, expertise tags, profile links (these also become schema.org `sameAs`) |
| `links.json` | Posts on external platforms: `title`, `url`, `platform`, `date` (YYYY-MM-DD), `summary` (1–2 sentences), `featured` (optional) |
| `projects.json` | Hobby projects: `name`, `summary`, `tech` (list), `repo`, `url` + `urlLabel` (e.g. a download link), `image` + `imageAlt` (screenshot in `src/assets/projects/`), `featured` — all but `name`/`summary` optional |
| `books.json` | Books: `title`, `publisher`, `year`, `isbn` (optional), `url` (optional), `summary` |
| `reviews.json` | Testimonials: `name`, `role`, `quote`, `link` (optional) |

Example `links.json` entry:

```json
[
  {
    "title": "Why we wrote our edge runtime in Rust",
    "url": "https://dev.to/avirup171/...",
    "platform": "DEV",
    "date": "2026-11-02",
    "summary": "One or two sentences about the post. This is the text search engines index.",
    "featured": true
  }
]
```

Example `projects.json` entry with a screenshot:

```json
{
  "name": "My project",
  "summary": "One or two sentences on what it does and what it's built with.",
  "tech": ["Rust", "React"],
  "repo": "https://github.com/avirup171/my-project",
  "image": "../assets/projects/my-project.jpg",
  "imageAlt": "Describe what the screenshot shows"
}
```

Projects and testimonials appear in the order they're listed in their file (featured projects first). Links are sorted by date and books by year.

Sections with no entries (for example Testimonials while `reviews.json` is `[]`) are hidden automatically, and drop out of the nav.

Every file is validated at build time. A typo, a missing field or a bad URL fails `npm run build` with a message naming the field, so a broken entry never reaches the live site.

## Commands

```bash
npm install
npm run dev       # local dev server at http://localhost:4321
npm run build     # validate data + static build to dist/
npm run preview   # serve the build locally
```

Requires Node 22.23.4 or newer.

## One-time GitHub setup

In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**. After that, every push to `main` deploys.

## Still to do

- [ ] Add real posts to `src/data/links.json`.
- [ ] Add testimonials to `src/data/reviews.json` (only with permission from the person quoted).
- [ ] Set `companyUrl` in `profile.json` once the Kernopy website URL is final.
- [ ] Optionally set `email` in `profile.json` to show it under Contact.
- [ ] Regenerate `public/og.png` (1200×630) if the title or tagline changes.
