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

Heroku is connected to this GitHub repo via the native GitHub integration. It deploys automatically the moment a PR is merged to `main` — no manual `git push heroku` needed. Turnaround is typically under a minute.

### 1. Pull latest `main` and create a branch

```bash
git checkout main && git pull origin main
git checkout -b type/short-description
```

**Branch naming convention** (mirrors what's been used on this repo):

| Prefix | When to use | Example |
|--------|-------------|---------|
| `feat/` | New feature or page | `feat/add-tiktok-link` |
| `fix/` | Bug or content correction | `fix/nav-typo` |
| `content/` | Copy or media update | `content/update-putter-deck` |
| `docs/` | README / SUMMARY changes | `docs/deploy-workflow` |
| `test/` | Infra / integration tests | `test/native-github-deploy` |

### 2. Make changes and commit

Keep commits focused — one logical change per commit is ideal.

```bash
git add .
git commit -m "Short description of what changed and why"
```

### 3. Push and open a PR

```bash
git push -u origin type/short-description
gh pr create --title "Short description" --body "What changed and why"
```

Or open the PR directly in the [GitHub UI](https://github.com/anthonybest-salesforce/anthonybestsite/pulls).

### 4. Merge the PR

Review the diff, then merge using **"Merge pull request"** (standard merge commit — this is what PRs #3 and #4 used). GitHub will offer to delete the branch after merging; do it to keep the repo clean.

### 5. Heroku deploys automatically

Once `main` updates, Heroku picks up the change and deploys. Monitor progress at the [Heroku dashboard](https://dashboard.heroku.com). No further action needed.

## Social links (on the homepage)

| Platform  | URL |
|-----------|-----|
| Instagram | https://instagram.com/itsanthonybest |
| LinkedIn  | https://linkedin.com/in/anthonylbest |
| YouTube   | https://youtube.com/c/anthonybestmusic |

## DNS

Full DNS record backup (including Google Workspace MX, DKIM, SPF, DMARC, and Salesforce records) is in [`docs/dns-backup.md`](docs/dns-backup.md). **Do not delete any of those records** — they keep Google Workspace email working.
