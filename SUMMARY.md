# anthonybest.com — Migration Project Summary

**Date:** March 26, 2026 · **Last updated:** May 18, 2026 (11:56 AM)
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
`src/projects/putter-advisory/index.html` is a 9-slide interactive presentation deck (handoff copy at `handoff/anthony_best_putter_deck_v2.html`):
- **Topic:** Data-driven Scotty Cameron Phantom 7.2 recommendation, upgrading from Studio Select Newport 2
- **Format:** Full-screen slide deck with keyboard/button navigation and dot indicators
- **Slides:** Cover · Existing weapon profile · Executive summary · Putting profile · Research data · Decision matrix · Recommendation · Risk register · Close
- **Design:** Dark `#0c0c0d` background, gold (`#c8a96e`) and orange (`#cc6633`) accents, Syne + DM Sans typography, staggered fade-up entry animations
- **Key finding:** Phantom 7.2 scores 94/100 in the decision matrix — highest MOI gain among the three stroke-compatible Phantom models, zero stroke disruption
- **Reference:** PUTT-2026-001 · Classification: Confidential

#### Updated May 18, 2026 (second pass) — pie chart decision matrix, font size increase, and spec corrections

**Decision matrix (slide 6) — all symbols replaced with pie charts:**
- Replaced every mixed checkmark / half-circle symbol (✓, ✓✓, ◑, ✗, —) with CSS conic-gradient pie charts in four visually distinct tiers: full gold (dominant advantage), 83% fill (strong), 50% fill (moderate), empty ring (eliminated)
- Percentage values displayed inline next to each pie for immediate quantitative reading (e.g. Phantom 7.2 Alignment: 100%, MOI: 100%; 9.2R Alignment: 45%)
- Legend added to the criteria panel — four rows with live mini-pie and label (Dominant / Strong / Moderate / Eliminated)
- Source note added to criteria panel: "Neck geometry confirmed via scottycameron.com official specifications. Plumbing-neck models screened first; all others eliminated in round one."
- OC models row retains high MOI pie (95%, full but opacity-dimmed) to show that forgiveness alone cannot rescue a neck-incompatible model — telling the right story visually
- Removed obsolete `.ck`, `.hf`, `.no` CSS classes; added `.pc`, `.pc-full`, `.pc-hi`, `.pc-mid`, `.pc-lo`, `.pc-na`, `.pv`, `.pv-g`, `.pv-d`, `.pv-l` pie chart classes

**Typography — all font sizes increased ~20% for legibility:**
- Every CSS class `font-size` value scaled up by 20% (e.g. body copy 11px → 13px, slide titles clamp lower bounds 19px → 23px, stat numbers 28px → 34px, cover title clamp 32px → 38px)
- All inline `font-size` values in HTML updated to match (data table labels, source footnotes, slide 8/9 model names, score pill secondary values, etc.)

**Phantom 5.2 spec correction (slide 9) — research-backed fix:**
- Official scottycameron.com specs confirmed: the 5.2 uses a **plumbing neck with medium toe flow**, identical to the 7.2 — not a "short slant neck" as previously stated
- Spec table corrected: Neck "Short slant neck" → "Plumbing neck"; Toe flow "Medium-low" → "Medium"
- Subtitle line corrected: "Compact Mallet · Medium-Low Toe Flow" → "Compact Mallet · Medium Toe Flow"
- First "WHY THE PHANTOM 7.2 IS PREFERRED" box rewritten: removed the false neck-difference argument; now accurately cites **head size and MOI** as the true differentiator — the 7.2's larger angular wings push mass further to the perimeter, producing meaningfully higher MOI than the 5.2's compact wingback design

#### Updated May 18, 2026 — corrected putter data, top-3 expansion, research additions, and product images

**Existing weapon corrected (slide 2):** The "existing weapon" was corrected from Studio Select Newport 2 to **Special Select Newport (2022)**. All changes:
- Badge updated to "✦ Special Select · 2022"; model name corrected throughout
- Specs corrected: Loft 3.5° (was 4°), Lie 70° (was 71°), Weights 2×35g fixed tungsten sole, Grip Pistolini Plus, Neck "Plumbing neck", Toe flow "Mid"
- Hero image updated to `/media/17447/product_pages__0000_2020-select-newport-hero.jpg` (Special Select Newport CDN)
- All three why-cards rewritten around the Special Select's actual design features: cascading concave sole, revamped plumbing neck, fixed tungsten sole weights vs. adjustable screws
- Quote and design lineage box updated to reflect Special Select Newport context
- All 12 occurrences of "Studio Select Newport 2" / "Studio Select" across slides 1, 3, 4, 5, 7, 10, and 11 replaced with "Special Select Newport"

**Deck expanded from 9 to 11 slides — top 3 options added:**
- **New slide 8 — Option 2: Phantom 9.2R** · Left panel: full specs, product image (`/media/2cmlwtyp/2026-sc-phantom-9-2r-hero.jpg`), score pill (81 vs 94). Right panel: 3 strength cards (identical plumbing neck geometry, highest MOI in range, same Carbon Steel insert) + "Why the 7.2 is preferred" section with 2 orange-accented boxes (head too large for blade-trained transition; diminishing forgiveness returns above this caliber threshold)
- **New slide 9 — Option 3: Phantom 5.2** · Left panel: full specs, product image (`/media/sicf0u3k/2026-sc-phantom-5-2-hero.jpg`), score pill (76 vs 94). Right panel: 3 strength cards (smallest head, same insert, lightest feel) + "Why the 7.2 is preferred" section with 2 orange-accented boxes (smaller head = significantly less perimeter MOI despite identical plumbing neck; lower MOI penalises off-centre contact more than the 7.2)
- Risk Register renumbered to slide 10, Close to slide 11
- JS slide counter now initializes dynamically (`ct.textContent = \`1 / ${n}\``) so total always reflects actual slide count
- Executive Summary (slide 3) Finding 02 updated to reference slides 7–9 explicitly; insight text updated to note top-3 structure; slide 7 eyebrow updated to "07 · Primary recommendation"

**Recommendation slide images:** Both primary product slides now carry official Scotty Cameron photography with `onerror` fallbacks:
- Slide 2: Special Select Newport hero (`/media/17447/product_pages__0000_2020-select-newport-hero.jpg`)
- Slide 7: Phantom 7.2 hero (`/media/ptag021j/2026-sc-phantom-7-2-hero.jpg`)
- Slides 8 & 9: Phantom 9.2R and 5.2 heroes respectively

**Research data enriched (slide 5, card 4):** "Consistency gap, quantified" card expanded with cited independent data:
- Mini data table: 82% vs 75% make rate inside 6 ft (mallet vs blade); 2.3 vs 2.6 three-putts per round (Shot Scope tracking)
- SAM PuttLab callout: mallets outperformed blades 62% of the time; face-to-path consistency higher for 100% of players tested (+15% advantage)
- Body copy explicitly attributes the 7-point make-rate gap to equipment and compounds to a 20-stroke seasonal gain
- Source footer: Shot Scope via MyGolfSpy (June 2025), Golf Digest / Club Champion SAM PuttLab (March 2024), MyGolfSpy Golf Lab (46,000+ putts, 2024)

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
│   │       └── index.html        ← 11-slide Phantom 7.2 advisory deck (PUTT-2026-001)
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
