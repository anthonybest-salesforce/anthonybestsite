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

## Deploy workflow

Every change follows this process — **never commit directly to `main`**.

### 1. Create a feature branch

```bash
git checkout main && git pull origin main
git checkout -b your-branch-name
```

Use a short, descriptive name, e.g. `feat/add-tiktok-link`, `fix/nav-typo`, `content/update-putter-deck`.

### 2. Make your changes, then commit

```bash
git add .
git commit -m "feat: describe what changed and why"
```

### 3. Push the branch and open a PR

```bash
git push -u origin your-branch-name
gh pr create --title "Short description" --body "What changed and why"
```

Or open the PR in the GitHub UI at `github.com/anthonybest/anthonybestsite`.

### 4. Merge the PR into `main`

Review the diff in the PR, then merge (squash merge recommended for a clean history). Delete the feature branch after merging.

### 5. Heroku auto-deploys

Heroku is connected to this GitHub repo and deploys automatically when `main` is updated. No manual `git push heroku` needed. Monitor the build at the [Heroku dashboard](https://dashboard.heroku.com).

## Social links (on the homepage)

| Platform  | URL |
|-----------|-----|
| Instagram | https://instagram.com/itsanthonybest |
| LinkedIn  | https://linkedin.com/in/anthonylbest |
| YouTube   | https://youtube.com/c/anthonybestmusic |

## DNS

Full DNS record backup (including Google Workspace MX, DKIM, SPF, DMARC, and Salesforce records) is in [`docs/dns-backup.md`](docs/dns-backup.md). **Do not delete any of those records** — they keep Google Workspace email working.
