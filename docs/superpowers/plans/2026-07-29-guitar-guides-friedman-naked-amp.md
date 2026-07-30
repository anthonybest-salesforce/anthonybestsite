# Guitar Guides — Friedman "Naked" Amp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the public "Guitar Guides" section (landing page + the Friedman "Naked" amp guide) and add Guitar Guides + Reverb links to the homepage, per `docs/superpowers/specs/2026-07-29-guitar-guides-friedman-naked-amp-design.md`.

**Architecture:** Fully static, no build step — new files under `src/` only. A shared stylesheet and a shared vanilla-JS renderer are used by any future guide; each guide is its own folder with its own `data.js` (the only file touched for content edits/corrections later). The renderer reads two globals set by `data.js` — `window.GUIDE_ERAS` (era-by-era history cards) and `window.GUIDE_RUNDOWNS` (Rig/Riff Rundown video cards) — and injects DOM nodes into two empty containers in the page shell.

**Tech Stack:** Plain HTML/CSS/vanilla JS (matches the rest of `src/` — no framework, no build step). Python's `unittest` (already in `tests/test_site.py`) for route/content smoke tests.

---

## File Structure

```
src/
  index.html                                    [MODIFY] two new .link-cards + sameAs entry
  sitemap.xml                                    [MODIFY] two new <url> entries
  assets/
    css/guitar-guides.css                        [CREATE] shared template styles
    js/guitar-guide.js                            [CREATE] shared renderer
    images/guitar-guides/friedman-naked-amp/.gitkeep  [CREATE] placeholder for reviewed images
  guitar-guides/
    index.html                                   [CREATE] section landing page
    friedman-naked-amp/
      index.html                                 [CREATE] guide page shell
      data.js                                     [CREATE] guide content
tests/
  test_site.py                                    [MODIFY] two new route tests, two new content tests
```

## Setup

This continues on top of the design-spec work already committed to branch `docs/guitar-guides-friedman-naked-amp-design`. Rename it to reflect that it now covers implementation, not just the doc:

```bash
git branch -m docs/guitar-guides-friedman-naked-amp-design feature/guitar-guides-friedman-naked-amp
```

Throughout this plan, keep a local static server running in a separate terminal for manual checks and for the test suite to hit:

```bash
npx serve src/ -l 3000
```

(Leave this running. All `BASE_URL=http://localhost:3000 ...` commands below assume it's up.)

---

### Task 1: Homepage — Guitar Guides + Reverb cards

**Files:**
- Modify: `src/index.html:38-42` (JSON-LD `sameAs`), `src/index.html:802-816` (`.cards` block)

- [ ] **Step 1: Add the Reverb URL to the homepage's `Person.sameAs` JSON-LD**

In `src/index.html`, find (around line 38):

```html
    "sameAs": [
      "https://instagram.com/itsanthonybest",
      "https://linkedin.com/in/anthonylbest",
      "https://youtube.com/c/anthonybestmusic"
    ]
```

Replace with:

```html
    "sameAs": [
      "https://instagram.com/itsanthonybest",
      "https://linkedin.com/in/anthonylbest",
      "https://youtube.com/c/anthonybestmusic",
      "https://reverb.com/shop/anthony-best"
    ]
```

- [ ] **Step 2: Add the two new link-cards after LinkedIn**

In `src/index.html`, find the end of the LinkedIn card (around line 814):

```html
        </a>

      </div>
```

(the `</a>` closes the LinkedIn `.link-card`, the blank line, then `</div>` closes `.cards`). Replace with:

```html
        </a>

        <!-- Guitar Guides -->
        <a class="link-card" href="/guitar-guides/">
          <div class="card-icon">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="11" fill="none" stroke="#c8a96e" stroke-width="1.5"/>
              <text x="12" y="16.5" text-anchor="middle" font-family="Georgia, serif" font-size="11" fill="#c8a96e">G</text>
            </svg>
          </div>
          <div class="card-text">
            <span class="card-platform">Guitar Guides</span>
            <span class="card-label">Friedman "Naked" Amp history</span>
          </div>
          <span class="card-arrow">→</span>
        </a>

        <!-- Reverb -->
        <a class="link-card" href="https://reverb.com/shop/anthony-best" target="_blank" rel="noopener noreferrer">
          <div class="card-icon">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="11" fill="none" stroke="#c8a96e" stroke-width="1.5"/>
              <text x="12" y="16.5" text-anchor="middle" font-family="Georgia, serif" font-size="11" fill="#c8a96e">R</text>
            </svg>
          </div>
          <div class="card-text">
            <span class="card-platform">Reverb</span>
            <span class="card-label">Shop my gear</span>
          </div>
          <span class="card-arrow">→</span>
        </a>

      </div>
```

- [ ] **Step 3: Manually verify**

With `npx serve src/ -l 3000` running, open `http://localhost:3000/` in a browser. Confirm:
- Two new cards appear below LinkedIn, styled identically to the existing three.
- Clicking "Guitar Guides" navigates to `http://localhost:3000/guitar-guides/` (will 404 until Task 7 — that's expected right now).
- Clicking "Reverb" opens `https://reverb.com/shop/anthony-best` in a new tab.

- [ ] **Step 4: Commit**

```bash
git add src/index.html
git commit -m "Add Guitar Guides and Reverb cards to homepage"
```

---

### Task 2: Add smoke tests for the new routes and homepage content (red)

**Files:**
- Modify: `tests/test_site.py` (`TestRoutes` class, `TestContent` class)

- [ ] **Step 1: Add two new route tests to `TestRoutes`**

In `tests/test_site.py`, find:

```python
    def test_robots_txt(self):
        self._assert_200("/robots.txt", "robots.txt")
```

Add immediately after it (still inside `TestRoutes`):

```python

    def test_guitar_guides_index(self):
        self._assert_200("/guitar-guides/", "Guitar Guides index")

    def test_guitar_guides_friedman_naked_amp(self):
        self._assert_200("/guitar-guides/friedman-naked-amp/", "Friedman Naked Amp guide")
```

- [ ] **Step 2: Add two new content tests to `TestContent`**

In `tests/test_site.py`, find:

```python
    def test_homepage_has_social_links(self):
        _, _, body = fetch("/")
        text = body.decode("utf-8", errors="ignore").lower()
        has_link = any(s in text for s in ["youtube", "instagram", "linkedin"])
        self.assertTrue(has_link, "Homepage should reference at least one social platform")
```

Add immediately after it (still inside `TestContent`):

```python

    def test_homepage_links_to_guitar_guides(self):
        _, _, body = fetch("/")
        text = body.decode("utf-8", errors="ignore")
        self.assertIn("/guitar-guides/", text,
                      "Homepage should link to the Guitar Guides section")

    def test_homepage_links_to_reverb(self):
        _, _, body = fetch("/")
        text = body.decode("utf-8", errors="ignore")
        self.assertIn("reverb.com/shop/anthony-best", text,
                      "Homepage should link to the Reverb shop")
```

- [ ] **Step 3: Run the new tests and confirm the expected mix of pass/fail**

```bash
BASE_URL=http://localhost:3000 python3 -m unittest tests.test_site.TestRoutes tests.test_site.TestContent -v
```

Expected: `test_homepage_links_to_guitar_guides` and `test_homepage_links_to_reverb` **PASS** (Task 1 already added that content). `test_guitar_guides_index` and `test_guitar_guides_friedman_naked_amp` **FAIL** with a 404-related assertion error — those pages don't exist yet. This is the expected "red" state; Task 9 turns them green.

- [ ] **Step 4: Commit**

```bash
git add tests/test_site.py
git commit -m "Add (currently-failing) smoke tests for Guitar Guides routes"
```

---

### Task 3: Shared CSS template

**Files:**
- Create: `src/assets/css/guitar-guides.css`

- [ ] **Step 1: Write the stylesheet**

```css
/*
  Guitar Guides — shared template styles.
  Theme tokens mirror src/index.html's inline palette (--gold, --text, etc.),
  scoped under [data-theme="studio"] so a future alternate skin can be added
  later as a second data-theme value without restructuring this file. Only
  the "studio" skin exists today.
*/

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

[data-theme="studio"] {
  --gold: #c8a96e;
  --gold-dim: rgba(200, 169, 110, 0.45);
  --gold-faint: rgba(200, 169, 110, 0.10);
  --text: #e8e4dc;
  --muted: #cc6633;
  --card-bg: rgba(8, 8, 10, 0.52);
  --card-border: rgba(255, 255, 255, 0.09);
  --card-border-hover: rgba(255, 255, 255, 0.16);

  min-height: 100%;
  font-family: 'Syne', sans-serif;
  color: var(--text);
  background-color: #0c0c0d;
}

.gg-page {
  position: relative;
  min-height: 100vh;
  padding: 56px 24px 64px;
}

.gg-container {
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
}

/* ── Hero ── */
.gg-kicker {
  display: block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2.8px;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 10px;
}

.gg-title {
  font-size: 34px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: var(--text);
  line-height: 1.15;
  margin-bottom: 14px;
}

.gg-dek {
  font-size: 15px;
  line-height: 1.6;
  color: rgba(232, 228, 220, 0.72);
  margin-bottom: 40px;
}

/* ── Era timeline ── */
.gg-timeline {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.gg-timeline::before {
  content: '';
  position: absolute;
  left: 11px;
  top: 8px;
  bottom: 8px;
  width: 1px;
  background: linear-gradient(to bottom, transparent, var(--gold-dim) 15%, var(--gold-dim) 85%, transparent);
}

.gg-era {
  position: relative;
  padding-left: 34px;
}

.gg-era::before {
  content: '';
  position: absolute;
  left: 4px;
  top: 6px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #0c0c0d;
  border: 1px solid var(--gold-dim);
}

.gg-era-card {
  background: var(--card-bg);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid var(--card-border);
  border-radius: 14px;
  padding: 22px 24px;
  position: relative;
  overflow: hidden;
}

.gg-era-card::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 2px;
  background: var(--gold);
  border-radius: 14px 0 0 14px;
}

.gg-era-kicker {
  display: block;
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 2.8px;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 6px;
}

.gg-era-years {
  display: block;
  font-size: 11px;
  color: var(--gold);
  margin-bottom: 4px;
}

.gg-era-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 8px;
}

.gg-era-dek {
  font-size: 14px;
  line-height: 1.55;
  color: rgba(232, 228, 220, 0.78);
  margin-bottom: 14px;
}

.gg-era-body p {
  font-size: 13.5px;
  line-height: 1.7;
  color: rgba(232, 228, 220, 0.72);
  margin-bottom: 12px;
}

.gg-era-body p:last-child {
  margin-bottom: 0;
}

.gg-era-body strong {
  color: var(--text);
  font-weight: 700;
}

.gg-quote {
  border-left: 2px solid var(--gold-dim);
  padding: 4px 0 4px 16px;
  margin: 14px 0;
  font-size: 13.5px;
  font-style: italic;
  color: var(--text);
  line-height: 1.6;
}

.gg-quote cite {
  display: block;
  margin-top: 6px;
  font-size: 11px;
  font-style: normal;
  letter-spacing: 0.5px;
  color: var(--muted);
}

.gg-specs {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 24px;
  margin: 16px 0;
}

.gg-spec-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 3px;
}

.gg-spec-label::before {
  content: '●';
  font-size: 8px;
}

.gg-spec-value {
  font-size: 12.5px;
  line-height: 1.5;
  color: var(--text);
  max-width: 260px;
}

.gg-video {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  border-radius: 10px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.4);
  margin: 16px 0;
}

.gg-video iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

.gg-sources {
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid var(--card-border);
}

.gg-sources summary {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: var(--muted);
  cursor: pointer;
}

.gg-sources ul {
  list-style: none;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.gg-sources li {
  font-size: 11.5px;
  line-height: 1.5;
  color: rgba(232, 228, 220, 0.55);
  padding-left: 14px;
  position: relative;
}

.gg-sources li::before {
  content: '—';
  position: absolute;
  left: 0;
  color: rgba(232, 228, 220, 0.3);
}

/* ── Rundown videos section ── */
.gg-section-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text);
  margin: 48px 0 6px;
}

.gg-section-subtitle {
  font-size: 13px;
  color: rgba(232, 228, 220, 0.6);
  margin-bottom: 22px;
}

.gg-rundowns {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.gg-rundown-card {
  background: var(--card-bg);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid var(--card-border);
  border-radius: 14px;
  padding: 18px 20px;
}

.gg-rundown-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 4px;
}

.gg-rundown-source {
  font-size: 10.5px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 10px;
}

.gg-rundown-note {
  font-size: 12.5px;
  line-height: 1.6;
  color: rgba(232, 228, 220, 0.65);
  margin-top: 10px;
}

/* ── Landing page guide list ── */
.gg-guide-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.gg-guide-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 20px 22px;
  border-radius: 14px;
  background: var(--card-bg);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid var(--card-border);
  text-decoration: none;
  position: relative;
  overflow: hidden;
  transition: transform 0.22s cubic-bezier(.22,1,.36,1), border-color 0.22s ease;
}

.gg-guide-card::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 2px;
  background: var(--gold);
}

.gg-guide-card:hover {
  transform: translateY(-2px);
  border-color: var(--card-border-hover);
}

.gg-guide-card-kicker {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--muted);
}

.gg-guide-card-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--text);
}

.gg-guide-card-dek {
  font-size: 12.5px;
  line-height: 1.5;
  color: rgba(232, 228, 220, 0.65);
}

/* ── Footer / back link ── */
.gg-footer {
  margin-top: 48px;
  text-align: center;
}

.gg-back-link {
  font-size: 11px;
  letter-spacing: 1.5px;
  text-transform: lowercase;
  color: var(--muted);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: color 0.2s ease, border-color 0.2s ease;
}

.gg-back-link:hover {
  color: var(--text);
  border-bottom-color: rgba(232, 228, 220, 0.3);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/assets/css/guitar-guides.css
git commit -m "Add shared Guitar Guides template stylesheet"
```

---

### Task 4: Shared JS renderer

**Files:**
- Create: `src/assets/js/guitar-guide.js`

- [ ] **Step 1: Write the renderer**

```javascript
// Guitar Guides — shared renderer.
// Expects data.js to define window.GUIDE_ERAS (required) and
// window.GUIDE_RUNDOWNS (optional) before this script runs, and the page
// to contain empty #gg-timeline / #gg-rundowns containers.

(function () {
  'use strict';

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Escapes everything, then re-enables "**bold**" spans as <strong>.
  function renderInline(str) {
    return escapeHtml(str).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  }

  function youTubeEmbedUrl(url) {
    var match = String(url).match(/[?&]v=([^&]+)/);
    return match ? 'https://www.youtube.com/embed/' + match[1] : null;
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function elHtml(tag, className, html) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (html !== undefined) node.innerHTML = html;
    return node;
  }

  function renderVideoEmbed(url, title) {
    var embedUrl = youTubeEmbedUrl(url);
    if (!embedUrl) return null;
    var wrap = el('div', 'gg-video');
    var iframe = document.createElement('iframe');
    iframe.src = embedUrl;
    iframe.title = title || 'Video';
    iframe.loading = 'lazy';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    wrap.appendChild(iframe);
    return wrap;
  }

  function renderEra(era) {
    var card = el('div', 'gg-era-card');
    card.appendChild(el('span', 'gg-era-kicker', era.kicker));
    card.appendChild(el('span', 'gg-era-years', era.years));
    card.appendChild(el('h3', 'gg-era-title', era.title));
    card.appendChild(el('p', 'gg-era-dek', era.dek));

    var body = el('div', 'gg-era-body');
    var paragraphs = Array.isArray(era.body) ? era.body : [era.body];
    paragraphs.forEach(function (paragraph) {
      body.appendChild(elHtml('p', null, renderInline(paragraph)));
    });
    card.appendChild(body);

    if (era.quote && era.quote.text) {
      var quote = elHtml('blockquote', 'gg-quote', '&ldquo;' + renderInline(era.quote.text) + '&rdquo;');
      if (era.quote.attribution) {
        quote.appendChild(el('cite', null, era.quote.attribution));
      }
      card.appendChild(quote);
    }

    if (Array.isArray(era.specs) && era.specs.length) {
      var specs = el('div', 'gg-specs');
      era.specs.forEach(function (spec) {
        var item = el('div', 'gg-spec');
        item.appendChild(el('div', 'gg-spec-label', spec.label));
        item.appendChild(el('div', 'gg-spec-value', spec.value));
        specs.appendChild(item);
      });
      card.appendChild(specs);
    }

    if (era.media && era.media.video && era.media.video !== 'PENDING') {
      var videoEmbed = renderVideoEmbed(era.media.video, era.title);
      if (videoEmbed) card.appendChild(videoEmbed);
    }

    if (Array.isArray(era.sources) && era.sources.length) {
      var details = document.createElement('details');
      details.className = 'gg-sources';
      var summary = document.createElement('summary');
      summary.textContent = 'Sources (' + era.sources.length + ')';
      details.appendChild(summary);
      var list = document.createElement('ul');
      era.sources.forEach(function (source) {
        list.appendChild(el('li', null, source));
      });
      details.appendChild(list);
      card.appendChild(details);
    }

    var item = el('div', 'gg-era');
    item.appendChild(card);
    return item;
  }

  function renderRundown(video) {
    var card = el('div', 'gg-rundown-card');
    card.appendChild(el('div', 'gg-rundown-title', video.title));
    card.appendChild(el('div', 'gg-rundown-source', video.source));

    var embed = renderVideoEmbed(video.url, video.title);
    if (embed) card.appendChild(embed);

    if (video.note) {
      card.appendChild(elHtml('p', 'gg-rundown-note', renderInline(video.note)));
    }

    return card;
  }

  function init() {
    var timelineEl = document.getElementById('gg-timeline');
    if (timelineEl && Array.isArray(window.GUIDE_ERAS)) {
      window.GUIDE_ERAS.forEach(function (era) {
        timelineEl.appendChild(renderEra(era));
      });
    }

    var rundownsEl = document.getElementById('gg-rundowns');
    if (rundownsEl && Array.isArray(window.GUIDE_RUNDOWNS)) {
      window.GUIDE_RUNDOWNS.forEach(function (video) {
        rundownsEl.appendChild(renderRundown(video));
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
```

- [ ] **Step 2: Commit**

```bash
git add src/assets/js/guitar-guide.js
git commit -m "Add shared Guitar Guides renderer"
```

---

### Task 5: Guide content — `data.js`

**Files:**
- Create: `src/guitar-guides/friedman-naked-amp/data.js`

- [ ] **Step 1: Write the content file**

```javascript
// Friedman "Naked" amplifier — Guitar Guides content.
// window.GUIDE_ERAS: era-by-era history. window.GUIDE_RUNDOWNS: Rig/Riff
// Rundown videos. This is the only file to touch for content corrections
// or when new research comes in — see the design spec for sourcing notes:
// docs/superpowers/specs/2026-07-29-guitar-guides-friedman-naked-amp-design.md

window.GUIDE_ERAS = [
  {
    id: 'original',
    kicker: 'THE ORIGINAL AMP',
    years: 'Late 1990s',
    title: `The Amp Before the Amp`,
    dek: `Before there was a production "Naked," there was one guitar tech's custom-modified Marshall — built by Dave Friedman for Billy Howerdel.`,
    body: [
      `Billy Howerdel — then working as a guitar tech for acts including Fishbone, David Bowie, Smashing Pumpkins, Nine Inch Nails, and Guns N' Roses — had Dave Friedman build him a one-off amp in the late 1990s. Friedman took the preamp character of a Naylor Superdrive 60 that Howerdel loved and merged it with the power-amp section of a 100-watt Marshall head. That amp is what Howerdel used to record A Perfect Circle's debut, Mer de Noms (2000).`,
      `**Sources disagree on the donor Marshall itself:** Premier Guitar's 2010 review identifies it as a 1978 JMP "Super Lead" 100-watt head, and Premier Guitar's own 2017 Rig Rundown coverage of Howerdel's live rig independently repeats the same 1978 Super Lead identification — two separate Premier Guitar pieces, six years apart, agreeing. A single 2008 forum post (unattributed to Friedman or Howerdel directly) instead describes a 1979 JMP 2203. Both claims are presented here rather than silently resolved, though the Super Lead claim now has the stronger paper trail.`,
      `**On the "Naked" name:** Howerdel himself refers to this amp as the "Naked Head" in a November 2022 Guitar World interview — so the name is directly tied to him, not just the later commercial product — but the specific "bare, uncovered chassis" origin story for why it's called that still has no confirmed primary-source citation and is noted as received wisdom rather than documented fact.`,
    ],
    quote: {
      text: `He really loved this Naylor Superdrive 60 amplifier, but he wanted to merge it a little bit with his 100-watt Marshall.`,
      attribution: `Dave Friedman, Guitar.com interview`,
    },
    specs: [
      { label: `Donor amp`, value: `Disputed — 1978 Marshall JMP Super Lead 100W (Premier Guitar, 2010 & 2017) vs. 1979 JMP 2203 (unattributed forum post, unconfirmed)` },
      { label: `Preamp character`, value: `Naylor Superdrive 60-style front end` },
      { label: `Power section`, value: `100W Marshall` },
      { label: `Recorded`, value: `A Perfect Circle, Mer de Noms (2000)` },
    ],
    sources: [
      `Dave Friedman, interview — Guitar.com, "Dave Friedman talks motivation and sound" (https://guitar.com/features/interviews/dave-friedman-amplifiers/)`,
      `Premier Guitar, "Rack Systems Brown Eye and Naked Amplifier Reviews," Jordan Wagner, Aug. 17 2010 (https://www.premierguitar.com/gear/rack-systems-brown-eye-and-naked-amplifier-reviews)`,
      `Premier Guitar, "Rig Rundown - A Perfect Circle," May 10 2017 (https://www.premierguitar.com/videos/rig-rundown/a-perfect-circle) — article text: "a Dave Friedman-modded 1978 100-watt Marshall Super Lead... reworked the preamp section to sound and react similarly to a 60-watt Naylor head"`,
      `Guitar World, Billy Howerdel interview tied to "What Normal Was," reported Nov. 2022 (https://www.guitarworld.com/features/billy-howerdel-what-normal-was) — names the amp the "Naked Head"; full article text not independently re-fetched, so treat as confirming the name/attribution but not as a verbatim quote`,
      `Rig-Talk forum, "Naylor Dual 60 & Marshall mod by Dave Friedman" (https://www.rig-talk.com/forum/threads/naylor-dual-60-marshall-mod-by-dave-friedman.29506/) — forum post, unverified, cited only for the 2203 claim`,
      `Wikipedia, "Billy Howerdel" — general biographical/timeline cross-check (https://en.wikipedia.org/wiki/Billy_Howerdel)`,
    ],
    media: {
      photo: `PENDING — see image sourcing list, item 3 (guitarfxdepot.com rig photo)`,
      video: `PENDING`,
    },
  },
  {
    id: 'naked-original-run',
    kicker: 'ORIGINAL RUN',
    years: 'Late 1990s – 2000s',
    title: `Naked Amplifiers — The Original Run`,
    dek: `Word got around. Friedman built a small clone run of Howerdel's amp under the "Naked Amplifiers" name — how small, exactly, depends on who you ask.`,
    body: [
      `Off the back of Howerdel's amp, Friedman built a limited clone run branded "Naked Amplifiers."`,
      `**Unit counts conflict between sources and are presented as-is rather than resolved:** Friedman's own recollection describes "a few amps for the US, and a small run of amps for Japan, like a dozen amps or so" — implying a total somewhat above a dozen; Premier Guitar's 2010 review instead describes the entire original run as "around a dozen." A commonly cited figure of 18 total units could not be verified against any source found in this research and should not be treated as confirmed.`,
      `A later limited reissue was sold through the retailer Tone Merchants around 2010. Forum teardown discussion (unverified against an official schematic) describes phase-inverter voltage variants, a tube-buffered effects loop positioned after the treble control, and EL34 power tubes biased around 70%.`,
    ],
    quote: {
      text: `There was a short period of time that I made a run of amps called Naked Amplifiers that were clones of that original amp.`,
      attribution: `Dave Friedman, Guitar.com interview`,
    },
    specs: [
      { label: `Unit count`, value: `Disputed — Friedman: "a few US + about a dozen for Japan"; Premier Guitar: ~12 total. A commonly cited "18" figure is unverified.` },
      { label: `Distribution`, value: `Primarily Japan, small US allotment; limited reissue via Tone Merchants, c. 2010` },
      { label: `Phase inverter`, value: `Variants noted at 330V / 370V / stock 398V — per forum teardown, unverified against an official schematic` },
      { label: `FX loop`, value: `Tube-buffered, positioned after the treble control` },
      { label: `Power tubes`, value: `EL34, biased ~70%` },
    ],
    sources: [
      `Dave Friedman, interview — Guitar.com (https://guitar.com/features/interviews/dave-friedman-amplifiers/)`,
      `Premier Guitar, 2010 review (https://www.premierguitar.com/gear/rack-systems-brown-eye-and-naked-amplifier-reviews)`,
      `The Amp Garage forum, "Friedman Naked Amp schematic?" (https://ampgarage.com/forum/viewtopic.php?t=34633) — forum technical discussion, unverified against an official schematic`,
    ],
    media: {
      photo: `PENDING — see image sourcing list, item 1 (Reverb listing)`,
      video: `https://www.youtube.com/watch?v=pk6vQsP6qRI`,
    },
  },
  {
    id: 'naked-mk2',
    kicker: 'LIMITED EDITION',
    years: '2020',
    title: `Naked MK2 — Custom Shop Limited Edition`,
    dek: `Twenty years on, Friedman's Custom Shop revisited the design as a limited-edition MK2 — cosmetically styled as a nod to the late-'70s Marshalls that started it all.`,
    body: [
      `In 2020, Friedman Amplification's Custom Shop produced a limited-edition "Naked MK2": 100 watts, two footswitchable channels (clean/overdrive) sharing a single 3-band EQ, a notably sensitive Presence control, and a series effects loop. Cosmetically it nods to late-1970s Marshall Super Leads — large rocker Power/Standby switches, white piping instead of gold.`,
      `Custom Shop demo units have been shown with a Celestion Alnico Cream (90W) speaker, a Vintage 30, and an optional bright-switch modification. No production-unit count for this run was found in any source; given the "Limited Edition" framing it was likely a small Custom Shop batch, but that is an inference, not a documented figure.`,
    ],
    specs: [
      { label: `Power`, value: `100W` },
      { label: `Channels`, value: `2, footswitchable (clean/overdrive), shared 3-band EQ` },
      { label: `Presence control`, value: `Notably sensitive, per demo commentary` },
      { label: `FX loop`, value: `Series` },
      { label: `Speaker options demoed`, value: `Celestion Alnico Cream (90W), Vintage 30` },
      { label: `Unit count`, value: `Not documented — likely a small Custom Shop batch; unconfirmed` },
    ],
    sources: [
      `My Les Paul Forum, "NAD – Friedman Custom Shop (Limited Edition) – Naked MK2" (https://www.mylespaul.com/threads/nad-friedman-custom-shop-limited-edition-naked-mk2.442838/) — forum post, full text blocked on fetch, cited for the model name/year/framing only`,
      `Marshall Amp Forum, "Friedman Naked Mk2 vs. Bogner Modded Soldano SLO-100" (https://marshallforum.com/threads/friedman-naked-mk2-vs-bogner-modded-soldano-slo-100.123961/) — forum discussion`,
      `YouTube, Friedman Amplification Custom Shop demo videos — see the design spec's image/video sourcing notes for the additional demo links not embedded here`,
    ],
    media: {
      photo: `PENDING — see image sourcing list`,
      video: `https://www.youtube.com/watch?v=CwH_Wc4Zq5g`,
    },
  },
  {
    id: 'today',
    kicker: 'TODAY',
    years: '2020 – present',
    title: `Where It Stands Now`,
    dek: `The Naked has never been a standing catalog item — it surfaces, then disappears again.`,
    body: [
      `As of this research, the Naked does not appear in Friedman Amplification's current product catalog — a direct site search for "naked" on friedmanamplification.com returns no results, confirming it is not part of the standing lineup.`,
      `Original-run and MK2 units do circulate on the resale market (a Reverb listing for a "Friedman Naked 2009" unit was located), but this research could not retrieve current asking prices — that page blocked automated access. Anyone quoting current resale pricing should check Reverb directly rather than relying on this page.`,
    ],
    specs: [
      { label: `Current catalog status`, value: `Not listed on friedmanamplification.com (verified via direct site search)` },
      { label: `Resale market`, value: `Circulates via Reverb/collectors; pricing not confirmed in this research pass` },
    ],
    sources: [
      `friedmanamplification.com — direct site search for "naked", no results, checked 2026-07-29`,
      `Reverb listing, "Friedman Naked 2009" (https://reverb.com/item/64661916-friedman-naked-2009) — existence confirmed, price/condition not retrievable (blocked)`,
      `Reverb, Friedman brand page (https://reverb.com/brand/friedman?product_type=amps) — general market context only, not Naked-specific pricing`,
    ],
    media: {
      photo: `PENDING`,
      video: `PENDING`,
    },
  },
];

window.GUIDE_RUNDOWNS = [
  {
    title: `Rig Rundown — A Perfect Circle`,
    url: `https://www.youtube.com/watch?v=WxoHvr2ICYA`,
    source: `Premier Guitar, May 10 2017`,
    note: `Full rig walkthrough. Describes the Friedman-modded 1978 Marshall Super Lead reworked with a Naylor-style preamp — the same amp lineage as the Naked — though the video's own companion article doesn't use the "Naked" brand name. Per the site owner's direct viewing of the on-camera footage (not corroborated by the written article, which describes only one head-format amp): Howerdel owns more than one of these rack-mounted units, and two are part of his main touring rig alongside a two-input Marshall 2203 "Lead MkII." This detail is owner-sourced from the video itself — flagged with a timestamp-TBD citation until independently re-confirmed.`,
  },
  {
    title: `Riff Rundown — "Judith"`,
    url: `https://www.youtube.com/watch?v=AmxgaC9bp1E`,
    source: `Premier Guitar, Dec 23 2018`,
    note: `Riff/tutorial format; no amp discussion.`,
  },
  {
    title: `Riff Rundown — "So Long, and Thanks for All the Fish"`,
    url: `https://www.youtube.com/watch?v=2n3JBz2OL5Q`,
    source: `Premier Guitar, Nov 18 2018`,
    note: `Riff/tutorial format; no amp discussion.`,
  },
];
```

- [ ] **Step 2: Verify the file is syntactically valid JS**

```bash
node --check src/guitar-guides/friedman-naked-amp/data.js
```

Expected: no output, exit code 0. (If Node isn't available in this environment, open the file in a JS-aware editor and confirm no syntax-highlighting errors — matching brackets, no trailing commas, before moving on.)

- [ ] **Step 3: Commit**

```bash
git add src/guitar-guides/friedman-naked-amp/data.js
git commit -m "Add Friedman Naked Amp guide content"
```

---

### Task 6: Guide page shell

**Files:**
- Create: `src/guitar-guides/friedman-naked-amp/index.html`
- Create: `src/assets/images/guitar-guides/friedman-naked-amp/.gitkeep`

- [ ] **Step 1: Create the images placeholder directory**

```bash
mkdir -p src/assets/images/guitar-guides/friedman-naked-amp
touch src/assets/images/guitar-guides/friedman-naked-amp/.gitkeep
```

- [ ] **Step 2: Write the page shell**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="/assets/js/analytics.js"></script>
  <title>Friedman "Naked" Amp — A History | Guitar Guides</title>
  <meta name="description" content="The history of the Friedman 'Naked' amplifier lineage — from Billy Howerdel's original custom Marshall to the 2020 Custom Shop MK2.">

  <!-- Open Graph -->
  <meta property="og:title" content="Friedman &quot;Naked&quot; Amp — A History">
  <meta property="og:description" content="The history of the Friedman 'Naked' amplifier lineage — from Billy Howerdel's original custom Marshall to the 2020 Custom Shop MK2.">
  <meta property="og:image" content="https://anthonybest.com/assets/images/hero-bg.jpg">
  <meta property="og:url" content="https://anthonybest.com/guitar-guides/friedman-naked-amp/">
  <meta property="og:type" content="article">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Friedman &quot;Naked&quot; Amp — A History">
  <meta name="twitter:description" content="The history of the Friedman 'Naked' amplifier lineage — from Billy Howerdel's original custom Marshall to the 2020 Custom Shop MK2.">
  <meta name="twitter:image" content="https://anthonybest.com/assets/images/hero-bg.jpg">

  <link rel="icon" type="image/x-icon" href="/assets/images/favicon.ico">
  <link rel="canonical" href="https://anthonybest.com/guitar-guides/friedman-naked-amp/">

  <!-- JSON-LD — Article schema -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": "https://anthonybest.com/guitar-guides/friedman-naked-amp/#article",
    "headline": "Friedman \"Naked\" Amp — A History",
    "description": "The history of the Friedman 'Naked' amplifier lineage — from Billy Howerdel's original custom Marshall to the 2020 Custom Shop MK2.",
    "url": "https://anthonybest.com/guitar-guides/friedman-naked-amp/",
    "author": { "@id": "https://anthonybest.com/#person" },
    "publisher": { "@id": "https://anthonybest.com/#person" }
  }
  </script>

  <!-- Syne font -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@300;400;500;700&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="/assets/css/guitar-guides.css">
</head>
<body data-theme="studio">
  <div class="gg-page">
    <div class="gg-container">

      <span class="gg-kicker">Guitar Guides</span>
      <h1 class="gg-title">Friedman "Naked" Amp</h1>
      <p class="gg-dek">One guitar tech's custom Marshall, a small clone run mostly sold in Japan, and a 2020 Custom Shop revival — the story of an amp that's never been a standing catalog item.</p>

      <div class="gg-timeline" id="gg-timeline"></div>

      <h2 class="gg-section-title">Watch: Rig &amp; Riff Rundown</h2>
      <p class="gg-section-subtitle">Howerdel's gear discussed and played in his own words.</p>
      <div class="gg-rundowns" id="gg-rundowns"></div>

      <div class="gg-footer">
        <a class="gg-back-link" href="/guitar-guides/">&larr; all guitar guides</a>
      </div>

    </div>
  </div>

  <script src="data.js"></script>
  <script src="/assets/js/guitar-guide.js"></script>
</body>
</html>
```

- [ ] **Step 3: Manually verify rendering**

With `npx serve src/ -l 3000` running, open `http://localhost:3000/guitar-guides/friedman-naked-amp/`. Confirm:
- All four era cards render with kicker, years, title, dek, body paragraphs (with bold spans on the "Sources disagree..." / "On the 'Naked' name..." / "Unit counts conflict..." sentences), specs, and a collapsible sources list.
- The two quotes (entries 1 and 2) render as styled blockquotes with attribution.
- The two videos that have real URLs (`naked-original-run`'s and `naked-mk2`'s) render as playable embeds; entries with `media.video: 'PENDING'` show no video block.
- The "Watch: Rig & Riff Rundown" section renders three video cards, all playable.
- Open the browser console — no JS errors.

- [ ] **Step 4: Commit**

```bash
git add src/guitar-guides/friedman-naked-amp/index.html src/assets/images/guitar-guides/friedman-naked-amp/.gitkeep
git commit -m "Add Friedman Naked Amp guide page"
```

---

### Task 7: Guitar Guides landing page

**Files:**
- Create: `src/guitar-guides/index.html`

- [ ] **Step 1: Write the landing page**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="/assets/js/analytics.js"></script>
  <title>Guitar Guides | Anthony Best</title>
  <meta name="description" content="Deep-dive histories of notable guitars and amplifiers — researched, sourced, and updated as new information turns up.">

  <!-- Open Graph -->
  <meta property="og:title" content="Guitar Guides | Anthony Best">
  <meta property="og:description" content="Deep-dive histories of notable guitars and amplifiers — researched, sourced, and updated as new information turns up.">
  <meta property="og:image" content="https://anthonybest.com/assets/images/hero-bg.jpg">
  <meta property="og:url" content="https://anthonybest.com/guitar-guides/">
  <meta property="og:type" content="website">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Guitar Guides | Anthony Best">
  <meta name="twitter:description" content="Deep-dive histories of notable guitars and amplifiers — researched, sourced, and updated as new information turns up.">
  <meta name="twitter:image" content="https://anthonybest.com/assets/images/hero-bg.jpg">

  <link rel="icon" type="image/x-icon" href="/assets/images/favicon.ico">
  <link rel="canonical" href="https://anthonybest.com/guitar-guides/">

  <!-- Syne font -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@300;400;500;700&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="/assets/css/guitar-guides.css">
</head>
<body data-theme="studio">
  <div class="gg-page">
    <div class="gg-container">

      <span class="gg-kicker">Guitar Guides</span>
      <h1 class="gg-title">Guitar Guides</h1>
      <p class="gg-dek">Deep-dive histories of notable guitars and amplifiers — researched, sourced, and updated as new information turns up.</p>

      <div class="gg-guide-list">
        <a class="gg-guide-card" href="/guitar-guides/friedman-naked-amp/">
          <span class="gg-guide-card-kicker">Amp History</span>
          <span class="gg-guide-card-title">Friedman "Naked" Amp</span>
          <span class="gg-guide-card-dek">From Billy Howerdel's original custom Marshall to the 2020 Custom Shop MK2.</span>
        </a>
      </div>

      <div class="gg-footer">
        <a class="gg-back-link" href="/">&larr; anthonybest.com</a>
      </div>

    </div>
  </div>
</body>
</html>
```

- [ ] **Step 2: Manually verify**

Open `http://localhost:3000/guitar-guides/`. Confirm the one guide card renders and links correctly to the guide page, and the "back to anthonybest.com" link works.

- [ ] **Step 3: Commit**

```bash
git add src/guitar-guides/index.html
git commit -m "Add Guitar Guides landing page"
```

---

### Task 8: Sitemap

**Files:**
- Modify: `src/sitemap.xml`

- [ ] **Step 1: Add the two new URL entries**

In `src/sitemap.xml`, find:

```xml
  <!-- Homepage -->
  <url>
    <loc>https://anthonybest.com/</loc>
    <lastmod>2026-07-17</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>

</urlset>
```

Replace with:

```xml
  <!-- Homepage -->
  <url>
    <loc>https://anthonybest.com/</loc>
    <lastmod>2026-07-17</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Guitar Guides -->
  <url>
    <loc>https://anthonybest.com/guitar-guides/</loc>
    <lastmod>2026-07-29</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://anthonybest.com/guitar-guides/friedman-naked-amp/</loc>
    <lastmod>2026-07-29</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

</urlset>
```

- [ ] **Step 2: Commit**

```bash
git add src/sitemap.xml
git commit -m "Add Guitar Guides URLs to sitemap.xml"
```

---

### Task 9: Verify the smoke tests go green

**Files:**
- Test: `tests/test_site.py`

- [ ] **Step 1: Run the full route + content test classes**

```bash
BASE_URL=http://localhost:3000 python3 -m unittest tests.test_site.TestRoutes tests.test_site.TestContent -v
```

Expected: **all tests PASS**, including `test_guitar_guides_index` and `test_guitar_guides_friedman_naked_amp` (red in Task 2, green now that Tasks 6–7 built the pages).

- [ ] **Step 2: Run the complete existing suite for a regression check**

```bash
BASE_URL=http://localhost:3000 python3 tests/test_site.py
```

Expected: most tests pass; a handful (security headers, gzip, cache headers — `TestSecurityHeaders`, `TestGzip`, parts of `TestCacheHeaders`) are expected to **fail against a bare `npx serve` server**, since those depend on the production nginx/Cloudflare Worker config, not anything this plan touches. Confirm no *new* failures beyond that known set, and specifically confirm every `TestRoutes` and `TestContent` test passes.

- [ ] **Step 3: Final manual pass**

- Open `http://localhost:3000/` — both new cards present and working.
- Open `http://localhost:3000/guitar-guides/` — landing page renders, links to the guide.
- Open `http://localhost:3000/guitar-guides/friedman-naked-amp/` — full guide renders per Task 6's checklist.
- Check browser console on all three pages for JS errors — none expected.

- [ ] **Step 4: Commit (if any fixups were needed)**

```bash
git add -A
git commit -m "Fix up Guitar Guides rendering issues found in verification"
```

(Skip this commit if verification passed clean with no changes.)

---

## After This Plan

Per `CLAUDE.md`'s deployment process: push `feature/guitar-guides-friedman-naked-amp`, open a PR into `main`, verify locally (already done via this plan — no CI gate blocks merge), then `gh pr merge --merge --delete-branch`. The image-sourcing list and research-gaps list from the design spec are for the site owner's review, not part of this implementation — `media.photo` stays `"PENDING"` in `data.js` until real images are reviewed and added in a follow-up.
