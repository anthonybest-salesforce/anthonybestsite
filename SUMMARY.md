# anthonybest.com — Migration Project Summary

**Date:** March 26, 2026 · **Last updated:** May 18, 2026
**Goal:** Move anthonybest.com from Squarespace to a static site on Heroku, managed via GitHub.

---

## Status

### ✅ DNS fully audited
Every DNS record on anthonybest.com has been documented in [`docs/dns-backup.md`](docs/dns-backup.md). This is the most critical piece — Google Workspace email depends on these records surviving the migration.

### ✅ Heroku static site scaffold built
`static.json`, `Procfile`, and the `src/` web root are all in place and deploy-ready.

### ✅ Homepage built — link-in-bio page
`src/index.html` is a single-page social link-in-bio site:
- Background: anthonybest.com hero photo (Squarespace CDN)
- Dark gradient overlay + frosted glass cards
- Logo: `ALB_Logo_White_Transparent.png` with spinning gold ring
- Name: ANTHONY BEST (Syne bold, all-caps)
- Tagline: YOUTUBER · MUSICIAN · COLLECTOR
- Cards: Instagram (`@itsanthonybest`), LinkedIn, YouTube
- Staggered fade-up entrance animations
- Fully responsive, single HTML file, no build step

### ✅ GitHub repo live
Repo: `github.com/anthonybest/anthonybestsite`

### ✅ Putter Advisory project page — `/projects/putter-advisory/`
`src/projects/putter-advisory/index.html` is a 9-slide interactive presentation deck:
- **Topic:** Data-driven Scotty Cameron Phantom 7.2 recommendation, upgrading from Studio Select Newport 2
- **Format:** Full-screen slide deck with keyboard/button navigation and dot indicators
- **Slides:** Cover · Existing weapon profile · Executive summary · Putting profile · Research data · Decision matrix · Recommendation · Risk register · Close
- **Design:** Dark `#0c0c0d` background, gold (`#c8a96e`) and orange (`#cc6633`) accents, Syne + DM Sans typography, staggered fade-up entry animations
- **Key finding:** Phantom 7.2 scores 94/100 in the decision matrix — highest MOI gain among the three stroke-compatible Phantom models, zero stroke disruption
- **Reference:** PUTT-2026-001 · Classification: Confidential

---

## Project structure

```
anthonybestsite/
├── Procfile                      ← web: bin/start-nginx-static
├── static.json                   ← root: src/, clean_urls, https_only
├── README.md
├── SUMMARY.md                    ← this file
├── src/                          ← deployed web root
│   ├── index.html                ← link-in-bio homepage
│   ├── ALB_Logo_White_Transparent.png
│   ├── projects/
│   │   └── putter-advisory/
│   │       └── index.html        ← 9-slide Phantom 7.2 advisory deck (PUTT-2026-001)
│   └── assets/
│       ├── images/
│       │   ├── favicon.ico
│       │   ├── home-main.jpg
│       │   └── logo.png
│       ├── css/
│       ├── js/
│       └── fonts/
├── docs/
│   └── dns-backup.md             ← full DNS record backup
└── clone/                        ← Squarespace snapshot (reference only)
```

---

## Full DNS record backup — anthonybest.com

**Registrar:** Squarespace
**Renews:** December 14, 2026 — $20/yr
**Domain lock:** OFF (ready to transfer)

### Squarespace defaults — DELETE these during migration
| Host | Type  | Data                   |
|------|-------|------------------------|
| @    | A     | 198.185.159.144        |
| @    | A     | 198.49.23.144          |
| @    | A     | 198.49.23.145          |
| @    | A     | 198.185.159.145        |
| www  | CNAME | ext-sq.squarespace.com |
| _domainconnect | CNAME | _domainconnect.domains.squarespace.com |

### Google Workspace MX — KEEP ALL (email routing)
| Host | Type | Priority | Data                    |
|------|------|----------|-------------------------|
| @    | MX   | 1        | aspmx.l.google.com      |
| @    | MX   | 5        | alt1.aspmx.l.google.com |
| @    | MX   | 5        | alt2.aspmx.l.google.com |
| @    | MX   | 10       | alt3.aspmx.l.google.com |
| @    | MX   | 10       | alt4.aspmx.l.google.com |

### Google Workspace auth — KEEP ALL (email authentication)
| Host              | Type | Data |
|-------------------|------|------|
| @                 | TXT  | v=spf1 include:_spf.google.com ~all |
| google._domainkey | TXT  | v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmVISZILBR17eO+MEALPpnK+T4kMumCZTuRoOdURjUNlNlEqQrmu6YDFvJWaa0c5nDZu6grHvjnEuiX/66qS+ZcsGtGhy3druEpyuduUd7vYTBazDO5ajKHQrnVp8kuBTbR700OTJrlFzLvYqmsUSqpKM4sDBkq2JihBnOrx+qqB71gtifoY4bF68zZAzistM5sYz2BlekfcYCpJ/zTBXsxzWaSUwH6THqk+mAWoQXu8i6ATagVL/gjjYm5bDfglkfsB+uOs3FVRUgxnarWaZfYdb/OCDlESPRuraZTHKApJt1fsaD4SVge0rG+q/plsxe6tVyD1QaaKpl0/JFqtE/wIDAQAB |
| _dmarc            | TXT  | v=DMARC1; p=reject; rua=mailto:postmaster@anthonybest.com, mailto:dmarc@anthonybest.com; pct=100; adkim=s; aspf=s. |
| @                 | TXT  | google-site-verification=fHV1YJCQk6T16e6TcrdIj2fixWnlyD4-_bBIoRd7YCc |

### Google hosted services — KEEP (mail/docs/calendar shortcuts)
| Host     | Type  | Data                 |
|----------|-------|----------------------|
| mail     | CNAME | ghs.googlehosted.com |
| docs     | CNAME | ghs.googlehosted.com |
| calendar | CNAME | ghs.googlehosted.com |

### Salesforce / Pardot — KEEP ALL (email campaigns)
| Host                                    | Type  | Data |
|-----------------------------------------|-------|------|
| reply.mcdo                              | CNAME | reply.mcdo.anthonybest.com.inbound.cdp2.8tgtt5.mx.salesforce.com |
| anonymous.mcdo                          | CNAME | anonymous.mcdo.anthonybest.com.inbound.cdp2.8tgtt5.mx.salesforce.com |
| fbl.mcdo                                | CNAME | fbl.mcdo.anthonybest.com.inbound.cdp2.8tgtt5.mx.salesforce.com |
| leave.mcdo                              | CNAME | leave.mcdo.anthonybest.com.inbound.cdp2.8tgtt5.mx.salesforce.com |
| bounce.mcdo                             | CNAME | bounce.mcdo.anthonybest.com.inbound.cdp2.8tgtt5.mx.salesforce.com |
| s1-e360-00dkx00000lqazd._domainkey.mcdo | CNAME | s1-e360-00dkx00000lqazd.mcdo.anthonybest.com.dkim.cdp2.8tgtt5.mx.salesforce.com |
| s2-e360-00dkx00000lqazd._domainkey.mcdo | CNAME | s2-e360-00dkx00000lqazd.mcdo.anthonybest.com.dkim.cdp2.8tgtt5.mx.salesforce.com |
| s3-e360-00dkx00000lqazd._domainkey.mcdo | CNAME | s3-e360-00dkx00000lqazd.mcdo.anthonybest.com.dkim.cdp2.8tgtt5.mx.salesforce.com |
| _dmarc.mcdo                             | TXT   | v=DMARC1;p=reject;adkim=r;aspf=r;pct=100; |

### Existing Heroku subdomains — KEEP
| Host | Type  | Data |
|------|-------|------|
| new  | CNAME | synthetic-shark-5qnqq5wba1ie8ii2lj2i5q3f.herokudns.com |
| se   | CNAME | molecular-apatosaurus-9zziowvdfj8cpclr5ivj6ier.herokudns.com |
| dse  | CNAME | systematic-arugula-ntjx4el88fk54b1usrklh7y1.herokudns.com |

---

## Remaining steps

1. **Point DNS to Heroku** — swap the four Squarespace A records and `www` CNAME to Heroku DNS targets
2. **Add custom domain in Heroku** — `heroku domains:add anthonybest.com www.anthonybest.com`
3. **Verify SSL** — Heroku ACM provisions automatically once DNS propagates
4. **Test email** — confirm Google Workspace mail still works after DNS cutover
5. **Cancel Squarespace** — only after email is verified working on the new DNS

## Key decisions still needed

- **Registrar for transfer:** Cloudflare (recommended — free, fast DNS) or stay at Squarespace?
- **GitHub repo visibility:** private or public?
