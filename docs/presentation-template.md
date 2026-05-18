# Presentation Deck Template

A standalone HTML presentation template used for advisory/analysis decks delivered on anthonybest.com. No build step, no framework — a single `.html` file with all CSS and JS inlined.

**Reference implementation:** `src/projects/putter-advisory/index.html`

---

## Design System

### Fonts
```html
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
```
- **Syne** — all headings, labels, slide numbers, callouts, badges
- **DM Sans** — all body copy, muted descriptions

### CSS Variables
```css
:root {
  --bg:          #0c0c0d;              /* page/slide background */
  --bg2:         rgba(8,8,10,0.88);   /* overlay backgrounds */
  --card-bg:     rgba(8,8,10,0.52);   /* card/pill backgrounds */
  --text:        #e8e4dc;             /* primary text */
  --muted:       rgba(232,228,220,0.45); /* secondary/body text */
  --gold:        #c8a96e;             /* primary accent */
  --gold-dim:    rgba(200,169,110,0.45); /* dimmed gold */
  --gold-faint:  rgba(200,169,110,0.08); /* very faint gold bg */
  --orange:      #cc6633;             /* warning / CTA accent */
  --orange-dim:  rgba(204,102,51,0.14);
  --border:      rgba(200,169,110,0.16); /* gold-tinted borders */
  --border-f:    rgba(255,255,255,0.055); /* faint white borders */
}
```

### Color Usage Rules
| Context | Color |
|---|---|
| Slide numbers, eyebrow labels, accent borders | `--gold` |
| Body text, descriptions | `--muted` |
| Warnings, risk indicators, CTA hover | `--orange` |
| Card/pill backgrounds | `--card-bg` |
| Dividers, cell borders | `--border-f` |
| Gold tinted borders, badges | `--border` |

---

## Deck Structure

### Outer Shell
```html
<body>
  <div class="deck">
    <!-- slides go here, one per id="sN" -->
  </div>

  <div class="controls">
    <button class="btn" onclick="go(-1)">← Prev</button>
    <div class="dots" id="dts"></div>
    <div class="ctr" id="ctr">1 / N</div>
    <button class="btn" onclick="go(1)">Next →</button>
  </div>

  <script>/* navigation JS */</script>
</body>
```

### Deck CSS
```css
html,body { background:var(--bg); color:var(--text); font-family:'DM Sans',sans-serif; height:100%; overflow:hidden }
.deck     { width:100vw; height:100vh; position:relative; overflow:hidden }
.slide    { position:absolute; inset:0; display:flex; flex-direction:column; opacity:0; pointer-events:none; transition:opacity .5s ease }
.slide.active { opacity:1; pointer-events:all }
.gold-rule { height:2px; background:linear-gradient(90deg,var(--gold),rgba(200,169,110,0)); flex-shrink:0 }
```

### Navigation JavaScript
```javascript
const sl = document.querySelectorAll('.slide');
const dEl = document.getElementById('dts');
const ct  = document.getElementById('ctr');
let c = 0, n = sl.length;
ct.textContent = `1 / ${n}`;
sl.forEach((_,i) => {
  const d = document.createElement('div');
  d.className = 'd' + (i===0 ? ' on' : '');
  d.onclick = () => gt(i);
  dEl.appendChild(d);
});
function gt(i) {
  sl[c].classList.remove('active'); dEl.children[c].classList.remove('on');
  c = Math.max(0, Math.min(i, n-1));
  sl[c].classList.add('active'); dEl.children[c].classList.add('on');
  ct.textContent = `${c+1} / ${n}`;
  sl[c].querySelectorAll('.a').forEach(e => { e.style.animation='none'; e.offsetHeight; e.style.animation='' });
  if (window.innerWidth <= 768) window.scrollTo({ top:0, behavior:'instant' });
}
function go(d) { gt(c+d) }
document.addEventListener('keydown', e => {
  if (e.key==='ArrowRight'||e.key==='ArrowDown') go(1);
  if (e.key==='ArrowLeft' ||e.key==='ArrowUp')   go(-1);
});
// Touch / swipe
let tx=0, ty=0;
document.addEventListener('touchstart', e => { tx=e.touches[0].clientX; ty=e.touches[0].clientY }, { passive:true });
document.addEventListener('touchend',   e => {
  const dx = e.changedTouches[0].clientX - tx;
  const dy = e.changedTouches[0].clientY - ty;
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
});
```

**Slide count is read dynamically** from `sl.length` — no hardcoded total to update when adding/removing slides.

### Entry Animation
Add class `a` to any element inside a slide to animate it in with a fade-up on activation:
```css
@keyframes fu { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
.slide.active .a { animation: fu .46s ease forwards; opacity:0 }
.slide.active .a:nth-child(1) { animation-delay:.04s }
.slide.active .a:nth-child(2) { animation-delay:.13s }
/* ... up to nth-child(6) at .44s */
```

---

## Slide Types

### Slide Numbering Convention
Every slide gets an `id="sN"` starting at `s1`. Visible labels use the `XX · Slide Title` format via the `.sn` class. Example: `02 · Executive Summary`.

---

### 1. Cover Slide (`#s1`)

Full-screen hero with decorative background, logo, tagline, large title, subtitle, and metadata row.

**HTML structure:**
```html
<div class="slide active" id="s1">
  <div class="cgrain"></div>  <!-- SVG noise grain overlay -->
  <div class="cglow"></div>   <!-- radial gold glow right side -->
  <div class="cline"></div>   <!-- vertical hairline right panel -->
  <div class="clogo">
    <img src="LOGO_URL" alt="Brand">
    <div class="cbrand">Name<span>Subtitle</span></div>
  </div>
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center">
    <div class="cey a">Category · Type · Year</div>
    <div class="ctitle a">Main Title with <em>Italic Gold</em></div>
    <div class="csub a">One paragraph subtitle / description.</div>
    <div class="cmeta a">
      <div><div class="ml">Label</div><div class="mv">Value</div></div>
      <!-- repeat for each meta item -->
    </div>
  </div>
  <div class="cfoot">footer text</div>
</div>
```

**Key CSS classes:**
| Class | Purpose |
|---|---|
| `.cgrain` | SVG fractal noise grain texture overlay |
| `.cglow` | Radial gold gradient glow on the right |
| `.cline` | Vertical hairline border, right panel |
| `.clogo` | Absolute top-right logo + brand name |
| `.cbrand` | Brand name (Syne 700) with subtitle span |
| `.cey` | Eyebrow label (Syne 600, gold, 10px, tracked) |
| `.ctitle` | Hero title (Syne 800, clamp 32–64px); `em` = italic gold |
| `.csub` | Subtitle paragraph (DM Sans, muted, 13px) |
| `.cmeta` | Flex row of metadata label/value pairs |
| `.ml` | Meta label (uppercase, muted, 10px) |
| `.mv` | Meta value (500 weight, 13px) |
| `.cfoot` | Absolute bottom-left footer text (very faint) |

---

### 2. Standard Content Slide

Used for most informational slides. Gold rule at top, `.inner` wrapper, `.sh` header bar.

**HTML structure:**
```html
<div class="slide" id="sN">
  <div class="gold-rule"></div>
  <div class="inner">
    <div class="sh">
      <div class="sn a">NN · Slide Title</div>
      <div class="st a">Two-line<br>Headline</div>
    </div>
    <!-- content -->
  </div>
</div>
```

**Key CSS classes:**
| Class | Purpose |
|---|---|
| `.inner` | `flex:1; padding:46px 9% 76px` — main content area |
| `.sh` | Header bar: `space-between`, bottom border |
| `.sn` | Slide number label (Syne 600, gold, 10px, tracked) |
| `.st` | Slide title (Syne 700, clamp 19–30px, max-width 58%) |

---

### 3. Three-Column Fact/Finding Grid (`.fg`)

Used for executive summaries, research findings, key metrics across three equal columns.

```html
<div class="fg a">
  <div class="fc">
    <div class="fn">Label · Category</div>
    <div class="ft">Card Title</div>
    <div class="fb">Body copy description with context and analysis.</div>
  </div>
  <!-- repeat ×3 -->
</div>
```

| Class | Purpose |
|---|---|
| `.fg` | `grid-template-columns: repeat(3,1fr); gap:12px` |
| `.fc` | Card: dark bg, faint border, gold top border 1.5px |
| `.fn` | Card label (Syne, gold, 9px, tracked) |
| `.ft` | Card title (Syne 700, 12px) |
| `.fb` | Card body (DM Sans, muted, 11px) |

---

### 4. Two-Column Stats Grid (`.yg`)

Used for player performance stats or two-column data cards with a large number callout.

```html
<div class="yg a">
  <div class="yc">
    <div class="yn">82%</div>
    <div class="yt">Stat Title</div>
    <div class="yb">Explanation of what this number means.</div>
  </div>
  <!-- repeat -->
</div>
```

| Class | Purpose |
|---|---|
| `.yg` | `grid-template-columns: 1fr 1fr; gap:16px` |
| `.yc` | Card container |
| `.yn` | Giant number (Syne 800, 38px, gold) |
| `.yt` | Stat title (Syne 700, 12px) |
| `.yb` | Body copy (muted, 11px) |

---

### 5. Research / Stat Cards (`.rg`)

Three-column grid of research-backed cards, typically with a large number and source label.

```html
<div class="rg a">
  <div class="rc">
    <div class="rsrc">Source / Method</div>
    <div class="rn"><span>7</span> pts</div>
    <div class="rb">What this statistic means in practice.</div>
  </div>
  <!-- repeat ×3 -->
</div>
```

| Class | Purpose |
|---|---|
| `.rg` | `grid-template-columns: repeat(3,1fr); gap:12px` |
| `.rc` | Card: dark bg, flex column, gap:5px |
| `.rsrc` | Source label (Syne 600, gold, 9px) |
| `.rn` | Large number, with `span` for gold accent |
| `.rb` | Body copy (muted, 11px) |

---

### 6. Decision Matrix Slide (`.mx-wrap`)

A two-column layout: criteria/legend sidebar on the left, scoring table on the right with pie chart indicators.

**Sidebar structure:**
```html
<div class="mx-wrap a">
  <div class="crit">
    <div class="ch">Criteria weights</div>
    <div class="ci"><span class="cw">30%</span> Criterion name</div>
    <!-- legend -->
    <div>
      <div style="display:flex;align-items:center;gap:6px"><span class="pc pc-full"></span> Dominant</div>
      <div style="display:flex;align-items:center;gap:6px"><span class="pc pc-hi"></span> Strong</div>
      <div style="display:flex;align-items:center;gap:6px"><span class="pc pc-mid"></span> Moderate</div>
      <div style="display:flex;align-items:center;gap:6px"><span class="pc pc-lo"></span> Eliminated</div>
    </div>
  </div>
  <table class="mx">
    <thead><tr>
      <th>Model</th><th>Criterion 1</th><!-- ... --><th>Score</th>
    </tr></thead>
    <tbody>
      <tr class="win"><!-- highlighted finalist row -->
        <td>Model Name <span class="wp">FINALIST</span></td>
        <td><span class="pc pc-full"></span><span class="pv pv-g">100%</span></td>
        <!-- ... -->
        <td><span class="sc sw">94</span></td>
      </tr>
      <tr><!-- eliminated row, dimmed -->
        <td style="color:rgba(232,228,220,0.25);font-style:italic">Model Name</td>
        <td><span class="pc pc-lo"></span><span class="pv pv-l">8%</span></td>
        <!-- ... -->
        <td><span class="sc" style="color:rgba(255,255,255,0.15)">41</span></td>
      </tr>
    </tbody>
  </table>
</div>
```

**Pie chart CSS classes:**
| Class | Visual | Usage |
|---|---|---|
| `.pc` | 16×16 circle | Base class, always paired with a tier class |
| `.pc-full` | Solid gold circle | Dominant advantage (100%) |
| `.pc-hi` | 83% gold fill via `conic-gradient` | Strong advantage (~83–99%) |
| `.pc-mid` | 50% gold fill | Moderate / partial (~40–60%) |
| `.pc-lo` | Empty circle, faint border | Eliminated / minimal |
| `.pc-na` | 12×1.5px dash | N/A — criterion not applicable |
| `.pv` | Percentage label (Syne 600, 10px) | Paired next to `.pc` |
| `.pv-g` | Gold color | Used for top-performer rows |
| `.pv-d` | Dimmed gold | Used for moderate rows |
| `.pv-l` | Very faint white | Used for eliminated rows |
| `.wp` | Gold badge (inline-block) | `FINALIST`, `SELECTED`, or status label |
| `.sc` | Score number (Syne 600) | Composite score column |
| `.sw` | Large score override (Syne 800, gold) | Finalist/highlighted scores |

---

### 7. Split-Panel Finalist/Product Slide

Two-column layout: left panel (`.rl`) has model identity, price, image; right panel (`.rright`) has pillars grid.

```html
<div class="slide" id="sN">
  <div class="gold-rule" style="position:absolute;top:0;left:0;right:0;z-index:2"></div>
  <div class="rl">
    <div class="rey a">NN · Label</div>
    <div class="rmod a">Brand Name<br><em>Model Name</em></div>
    <div class="rsub a">One or two sentence positioning statement.</div>
    <div class="a"><span class="rprice">$XXX · source.com</span></div>
    <div style="margin-top:18px" class="a">
      <a href="URL" target="_blank" style="...">View on Source.com →</a>
    </div>
    <div style="margin-top:auto;padding-top:24px;display:flex;align-items:flex-end;justify-content:center" class="a">
      <img src="PRODUCT_IMAGE_URL" alt="..." style="max-height:200px;max-width:100%;object-fit:contain;opacity:0.92">
    </div>
  </div>
  <div class="rright">
    <div class="rlbl a">Why X is an exceptional fit</div>
    <div class="rttl a">Four compounding strengths<br>that define this option.</div>
    <div class="pillars">
      <div class="pill a">
        <div class="pi">🎯</div>
        <div class="pt">Pillar Title</div>
        <div class="pb">Two to three sentence supporting argument.</div>
      </div>
      <!-- ×4 pillars -->
    </div>
  </div>
</div>
```

**CSS for the split-panel layout:**
```css
/* The slide itself needs flex-direction:row */
#sN { background:var(--bg); flex-direction:row }

.rl {
  width:40%; flex-shrink:0; padding:50px 42px;
  display:flex; flex-direction:column; justify-content:center;
  background:linear-gradient(160deg,rgba(200,169,110,0.07),rgba(200,169,110,0.015));
  border-right:.5px solid var(--border); position:relative;
}
.rl::before { /* gold gradient line across top of panel */
  content:''; position:absolute; top:0; left:0; right:0; height:2px;
  background:linear-gradient(90deg,var(--gold),transparent);
}
.rright { flex:1; padding:50px 42px; display:flex; flex-direction:column; justify-content:center }
```

**Note:** The gold-rule must be `position:absolute` and the slide must have `position:relative` in mobile CSS (see Mobile section).

| Class | Purpose |
|---|---|
| `.rey` | Panel eyebrow label (Syne 600, gold, 9px) |
| `.rmod` | Product name (Syne 800, clamp 28–50px); `em` = italic gold |
| `.rsub` | Positioning sentence (muted, 12px) |
| `.rprice` | Price badge (gold border, Syne 600, 12px) |
| `.rlbl` | Right panel label (Syne 600, gold, 9px) |
| `.rttl` | Right panel title (Syne 700, clamp 15–22px) |
| `.pillars` | `grid-template-columns: 1fr 1fr; gap:10px` — 2×2 grid |
| `.pill` | Pillar card (dark bg, faint border) |
| `.pi` | Pillar emoji icon (16px) |
| `.pt` | Pillar title (Syne 700, 11px) |
| `.pb` | Pillar body (muted, 11px) |

---

### 8. Risk Register Slide (`.risk-g`)

Three-column grid of risk cards with traffic-light severity indicators (red/gold/green top border).

```html
<div class="risk-g a">
  <div class="rsk hi"><!-- red top border -->
    <div class="rlv">High Risk</div>
    <div class="rtt">Risk Title</div>
    <div class="rbd">Description of the risk and its impact.</div>
    <div class="rmt"><strong>Mitigation</strong> What to do about it.</div>
  </div>
  <div class="rsk md"><!-- gold top border -->
    <!-- ... -->
  </div>
  <div class="rsk lo"><!-- green top border -->
    <!-- ... -->
  </div>
</div>
```

| Class | Top border color | Usage |
|---|---|---|
| `.rsk.hi` | `#e84444` red | High-impact risk |
| `.rsk.md` | `--gold` | Medium risk / consideration |
| `.rsk.lo` | `#44aa66` green | Low risk / mitigated |
| `.rlv` | Risk level label | Colored to match severity |
| `.rtt` | Risk title (Syne 700, 12px) | |
| `.rbd` | Risk description (muted, 11px) | |
| `.rmt` | Mitigation block (subtle bg) | `strong` for "Mitigation" label |

---

### 9. Close Slide (`#sN`)

Centered, full-bleed with decorative concentric rings and a CTA button.

```html
<div class="slide" id="sN">
  <div class="gold-rule" style="position:absolute;top:0;left:0;right:0;z-index:2"></div>
  <div class="crings">
    <span style="width:480px;height:480px"></span>
    <span style="width:680px;height:680px"></span>
    <span style="width:900px;height:900px"></span>
  </div>
  <div class="ci2">
    <span class="cgemclose">✦</span>
    <div class="cey2 a">Section · Close</div>
    <div class="ctitle2 a">Close headline with <em>italic gold</em> accent.</div>
    <div class="cbody a">Supporting paragraph. One to three sentences.</div>
    <a href="URL" class="ccta a">Call to Action →</a>
  </div>
  <div class="cfoot2">footer text</div>
</div>
```

**Required CSS:**
```css
#sN { background:var(--bg); justify-content:center; align-items:center; text-align:center; overflow:hidden }
.crings span { position:absolute; border-radius:50%; border:.5px solid rgba(200,169,110,0.065); transform:translate(-50%,-50%); top:50%; left:50% }
.ci2     { position:relative; z-index:2; max-width:550px }
.ctitle2 { font-family:'Syne',sans-serif; font-size:clamp(28px,4.4vw,54px); font-weight:800; line-height:1.06 }
.ctitle2 em { font-style:italic; color:var(--gold); font-weight:400 }
.cbody   { font-size:13px; color:var(--muted); line-height:1.72 }
.ccta    { display:inline-block; color:var(--gold); border:.5px solid var(--gold); font-family:'Syne',sans-serif; font-size:11px; font-weight:600; letter-spacing:.13em; text-transform:uppercase; padding:12px 30px; border-radius:2px; text-decoration:none; transition:all .22s }
.ccta:hover { background:var(--gold); color:var(--bg) }
```

---

## Reusable Components

### Gold-Border Primer Block
Used to introduce a concept before evidence. Two-column, gold left border.

```html
<div style="background:linear-gradient(135deg,rgba(200,169,110,0.07),rgba(200,169,110,0.02));border:.5px solid var(--border);border-left:2px solid var(--gold);padding:14px 20px;border-radius:2px;margin-bottom:16px;display:grid;grid-template-columns:1fr 1fr;gap:20px" class="a">
  <div>
    <div style="font-family:'Syne',sans-serif;font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:var(--gold);font-weight:600;margin-bottom:5px">Left panel label</div>
    <div style="font-size:11px;color:var(--muted);line-height:1.65">Left panel body copy.</div>
  </div>
  <div>
    <div style="font-family:'Syne',sans-serif;font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:var(--gold);font-weight:600;margin-bottom:5px">Right panel label</div>
    <div style="font-size:11px;color:var(--muted);line-height:1.65">Right panel body copy.</div>
  </div>
</div>
```

### Insight Block (`.insight`)
Full-width highlighted finding at the top of a slide.

```html
<div class="insight a">
  <div class="iey">Primary Finding</div>
  <div class="itxt">A short, bold summary statement that frames the slide's argument.</div>
</div>
```

### Why-Card (`.why-card`)
Gold left-border content card used in two-column layouts.

```html
<div class="why-card">
  <div class="why-head">Card heading</div>
  <div class="why-body">Body copy with optional <strong>bold emphasis</strong>.</div>
</div>
```

### Quote Block (`.ss-quote`)
Italic pull quote with attribution.

```html
<div class="ss-quote">
  "Quote text here."
  <cite>— Attribution, Context</cite>
</div>
```

### Upgrade/Warning Bar (`.upgrade-bar`)
Orange-accented alert bar for important caveats or calls to action.

```html
<div class="upgrade-bar">
  <strong>Why now?</strong> Explanation of the urgency or key point.
</div>
```

### Spec Grid (`.spec-grid`)
Two-column grid of key/value pairs for technical specifications.

```html
<div class="spec-grid">
  <div class="spec">
    <div class="spec-l">Label</div>
    <div class="spec-v">Value</div>
  </div>
  <!-- repeat -->
</div>
```

### Research Note (`.rnote`)
Footnote-style callout at the bottom of a slide.

```html
<div class="rnote a"><strong>Methodology:</strong> Explanation of data sources and caveats.</div>
```

### Bar Chart (MOI-style)
Horizontal progress bar for any comparative metric.

```html
<div class="moi-bar-track">
  <div class="moi-bar-fill" style="width:73%"></div>
</div>
```
```css
.moi-bar-track { height:5px; background:rgba(255,255,255,0.07); border-radius:2px; margin-bottom:10px }
.moi-bar-fill  { height:100%; border-radius:2px; background:var(--gold) }
```
Use `style="background:rgba(232,228,220,0.2)"` on `.moi-bar-fill` for a "baseline" bar in a dimmed style.

---

## Mobile Responsive Rules

All media query overrides go in a single `@media (max-width:768px)` block.

```css
@media (max-width:768px) {
  html,body { overflow:auto; height:auto }
  .deck     { height:auto; min-height:100svh }

  /* Slide model: absolute stack → display:none/flex */
  .slide        { position:static; display:none; opacity:1; pointer-events:all; transition:none }
  .slide.active { display:flex }
  .inner        { overflow:visible; padding:20px 5% 88px }

  /* Slides with absolutely-positioned children need position:relative */
  /* Add any slide ID that has position:absolute children (gold-rule, decorative) */
  #s1, #sN-cover, #sN-close { position:relative }

  /* Cover slide */
  #s1       { padding:24px 5% 88px; min-height:100svh; overflow:visible; justify-content:flex-start }
  .clogo    { position:static; margin-bottom:20px }
  .ctitle, .csub, .cmeta { max-width:100%; flex-wrap:wrap }
  .cfoot, .cfoot2 { display:none }

  /* Slide headers */
  .sh { flex-direction:column; gap:8px }
  .st { max-width:100% }

  /* All multi-column grids → single column */
  .ss-grid, .fg, .yg, .rg, .mx-wrap, .pillars, .risk-g { grid-template-columns:1fr }

  /* Decision matrix: horizontal scroll */
  table.mx { display:block; overflow-x:auto; -webkit-overflow-scrolling:touch; white-space:nowrap }

  /* Split-panel finalist slides: stacked */
  #sN-finalist { flex-direction:column }
  .rl    { width:100%; padding:24px 5% 20px; border-right:none; border-bottom:.5px solid var(--border); flex-shrink:1 }
  .rright { padding:20px 5% 0 }

  /* Close slide: scale down decorative rings */
  .crings span:nth-child(1) { width:200px !important; height:200px !important }
  .crings span:nth-child(2) { width:300px !important; height:300px !important }
  .crings span:nth-child(3) { width:400px !important; height:400px !important }

  /* Controls bar */
  .controls { max-width:calc(100vw - 24px); gap:8px; padding:8px 14px; bottom:12px }
}

@media (max-width:480px) {
  .btn      { padding:5px 10px; font-size:11px }
  .dots     { gap:4px }
  .d        { width:4px; height:4px }
  .ctr      { min-width:32px; font-size:10px }
  .controls { gap:6px; padding:7px 10px }
}
```

**Mobile gotchas:**
- Any slide that uses `position:absolute` children (gold-rule on split-panel slides, decorative elements on the close slide) must have `position:relative` added to the mobile rule.
- Inline `flex-direction:row` styles on content divs require `!important` overrides in the media query.
- Use `min-height:100svh` (not `vh`) to handle mobile browser chrome correctly.

---

## Recommended Slide Order

A 12–16 slide advisory deck typically follows this arc:

| # | Type | Purpose |
|---|---|---|
| 1 | Cover | Title, client, classification |
| 2 | Context | Current state / existing product / why this matters |
| 3 | Executive Summary | Primary finding + 3 supporting cards |
| 4 | Why This Matters | Player/client stats that validate the analysis |
| 5 | The Shortlist | What was researched, methodology overview |
| 6 | Decision Matrix | Scored comparison of all evaluated options |
| 7–11 | Criteria Deep Dives | One slide per scoring criterion |
| 12–14 | Finalist Deep Dives | One split-panel slide per shortlisted option |
| 15 | Risk Register | Objections, risks, mitigations |
| 16 | Close | CTA, fitting/testing recommendation |

---

## File Naming & Deployment

- Live file path: `src/projects/<project-slug>/index.html`
- Accessible at: `anthonybest.com/projects/<project-slug>/`
- All assets (fonts, images) are loaded from external URLs — no local assets
- Single file, no build step required
- Deploy via `git push heroku main`
