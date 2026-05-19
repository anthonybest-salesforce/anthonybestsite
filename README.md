# anthonybest.com

Personal site for Anthony Best — Youtuber, Musician, Collector.

## Stack

- **Host:** Heroku (static buildpack via `bin/start-nginx-static`)
- **Deploy:** Push to `main` → auto-deploys to Heroku
- **Web root:** `src/` (configured in `static.json`)
- **Font:** [Syne](https://fonts.google.com/specimen/Syne) via Google Fonts

## Project structure

```
anthonybestsite/
├── Procfile                      ← Heroku: web: bin/start-nginx-static
├── static.json                   ← Heroku static buildpack config (root: src/)
├── README.md
├── SUMMARY.md                    ← Migration notes & DNS backup
├── src/                          ← Deployed web root
│   ├── index.html                ← Link-in-bio page (homepage)
│   ├── ALB_Logo_White_Transparent.png
│   └── assets/
│       ├── images/
│       │   ├── favicon.ico
│       │   ├── home-main.jpg
│       │   └── logo.png
│       ├── css/
│       ├── js/
│       └── fonts/
├── docs/
│   └── dns-backup.md             ← Full DNS record backup (critical — preserves email)
└── clone/                        ← Squarespace site snapshot (reference only)
```

## Local development

```bash
npx serve src/
```

Then open [http://localhost:3000](http://localhost:3000).

## Deploy

Push to `main` — Heroku auto-deploys from GitHub.

```bash
git push origin main
```

A GitHub Action (`.github/workflows/deploy.yml`) runs a post-deploy smoke test against the live URL.

## Version stamping

Every commit triggers a local `post-commit` hook (`.githooks/post-commit`) that stamps the `<div class="version-badge">` in `src/index.html` with `v{rev-count} · {short-sha}` of that commit, then makes a follow-up `chore: stamp version badge ... [skip-stamp]` commit. Heroku auto-deploys the stamped version.

One-time setup after cloning:

```bash
git config core.hooksPath .githooks
```

## Social links (on the homepage)

| Platform  | URL |
|-----------|-----|
| Instagram | https://instagram.com/itsanthonybest |
| LinkedIn  | https://linkedin.com/in/anthonylbest |
| YouTube   | https://youtube.com/c/anthonybestmusic |

## DNS

Full DNS record backup (including Google Workspace MX, DKIM, SPF, DMARC, and Salesforce records) is in [`docs/dns-backup.md`](docs/dns-backup.md). **Do not delete any of those records** — they keep Google Workspace email working.
