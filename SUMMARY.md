# anthonybest.com — Migration Project Summary
**Date:** March 26, 2026  
**Goal:** Move anthonybest.com from Squarespace to a static site on Heroku, managed via GitHub.

---

## What's been done so far

### ✅ DNS fully audited
Every DNS record on anthonybest.com has been documented. See the DNS section below. This is the most critical piece — your Google Workspace email depends on these records surviving the migration.

### ✅ Project location confirmed
Your git repo should live at:
```
~/Sites/anthonybest-site
```
The folder and git repo were partially initialized. Run this to finish setup from scratch:

```bash
cd ~/Sites/anthonybest-site
git config user.email "anthony@anthonybest.com"
git config user.name "Anthony Best"
git checkout -b main
```

---

## Project structure to create

```
anthonybest-site/
├── static.json          ← Heroku static buildpack config
├── Procfile             ← Heroku process file
├── .gitignore
├── README.md
├── docs/
│   └── dns-backup.md   ← paste DNS records below here
├── src/                 ← DEPLOYED to Heroku (the live site)
│   ├── index.html
│   └── assets/
│       ├── css/main.css
│       ├── js/main.js
│       ├── images/
│       └── fonts/
└── clone/               ← Squarespace snapshot (reference only)
    └── assets/
        ├── css/
        ├── js/
        ├── images/
        └── fonts/
```

### static.json
```json
{
  "root": "src/",
  "clean_urls": true,
  "https_only": true,
  "headers": {
    "/**": {
      "Cache-Control": "public, max-age=3600"
    }
  }
}
```

### Procfile
```
web: bin/boot
```

### .gitignore
```
.DS_Store
node_modules/
*.log
.env
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

## Next steps (in order)

1. **Create GitHub repo** — go to github.com/new, name it `anthonybest-site`, private, no template
2. **Push local repo to GitHub:**
   ```bash
   cd ~/Sites/anthonybest-site
   git remote add origin git@github.com:anthonybest/anthonybest-site.git
   git push -u origin main
   ```
3. **Create Heroku app** — go to heroku.com, new app, name it `anthonybest`
4. **Add static buildpack** in Heroku: `heroku-buildpack-static`
5. **Connect GitHub → Heroku** auto-deploy in Heroku dashboard
6. **Clone the live site** — use `wget` to mirror anthonybest.com into `clone/`
7. **Build src/ version** — clean static rebuild from the clone
8. **Test on .herokuapp.com** before touching DNS
9. **Transfer domain** from Squarespace to Cloudflare (free, fast)
10. **Re-add all DNS records** at Cloudflare using the table above
11. **Verify email works** before cancelling Squarespace

---

## Key decisions still needed

- **Registrar for transfer:** Cloudflare (recommended — free, fast DNS) or Namecheap?
- **Heroku app name:** `anthonybest` or something else?
- **GitHub repo visibility:** private or public?
