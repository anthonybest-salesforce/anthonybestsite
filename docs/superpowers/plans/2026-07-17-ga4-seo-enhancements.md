# GA4 Tracking + SEO Enhancements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire Google Analytics 4 into every page of anthonybest.com and fix/enhance SEO signals (duplicate-content cleanup, robots.txt, sitemap, structured data, social meta tags) so the site is positioned to be the top Google result for "Anthony Best".

**Architecture:** Static HTML site, no build step, served by nginx (`config/nginx.conf.erb`) via Heroku's static buildpack, web root `src/`. Every page is a self-contained HTML file with inline `<style>`. GA4 is added as one shared `src/assets/js/analytics.js` file referenced by a single `<script>` tag on each page, rather than duplicating Google's boilerplate five times. All work happens on a feature branch and ships via a PR per this repo's documented deploy flow (`README.md` → "Deploy": PR → merge to `main` → Heroku auto-deploys → post-deploy smoke test runs in CI).

**Tech Stack:** Plain HTML/CSS/JS, nginx (ERB template), Python 3 stdlib (`unittest`) for the smoke-test suite in `tests/test_site.py`, `npx serve` for local preview (no nginx locally).

**Reference spec:** `docs/superpowers/specs/2026-07-17-ga4-seo-design.md`

---

## Before you start

Two things are true throughout this plan and matter for how you verify each task:

1. **Local preview ≠ production nginx.** `npx serve src -l 4100` serves the raw files but does not run `config/nginx.conf.erb` — no redirects, no security headers, no gzip. Anything that depends on the nginx config (the `/links` → `/` redirect) can only be verified for real once it's deployed; the existing `tests/test_site.py` suite already has this exact split (compare `TestHTTPSRedirect`/`TestSecurityHeaders`, which only pass against the live Heroku URL, with `TestContent`, which passes against any server). Follow that same split — don't try to make nginx-only behavior pass locally.
2. **`tests/test_site.py` defaults to the live production URL** (`BASE_URL` env var, defaults to the Heroku app URL) if you don't override it. When running it locally against `npx serve`, always set `BASE_URL=http://localhost:4100` explicitly so you never accidentally hit production.

---

### Task 1: Create the feature branch

**Files:** none (git operation only)

- [ ] **Step 1: Confirm you're starting from a clean, up-to-date `main`**

Run: `git status`
Expected: `On branch main`, `nothing to commit, working tree clean`

- [ ] **Step 2: Create and switch to the feature branch**

Run: `git checkout -b seo-ga4-enhancements`
Expected: `Switched to a new branch 'seo-ga4-enhancements'`

All subsequent tasks commit to this branch. Nothing gets pushed or merged until Task 11.

---

### Task 2: Shared GA4 loader script

**Files:**
- Create: `src/assets/js/analytics.js`
- Modify: `tests/test_site.py`

- [ ] **Step 1: Create the analytics loader**

Create `src/assets/js/analytics.js`:

```js
// Google Analytics 4 (gtag.js). The Measurement ID here is the single
// source of truth — every page loads GA by referencing this one file.
(function () {
  var MEASUREMENT_ID = 'G-GH4TDQ277N';

  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', MEASUREMENT_ID);
})();
```

- [ ] **Step 2: Check the JS is syntactically valid**

Run: `node --check src/assets/js/analytics.js`
Expected: no output, exit code 0

- [ ] **Step 3: Add a route test for the new file**

In `tests/test_site.py`, inside `class TestRoutes(unittest.TestCase):`, add this method (after `test_sitemap_xml`, before the class ends):

```python
    def test_analytics_js(self):
        self._assert_200("/assets/js/analytics.js", "Analytics script")
```

- [ ] **Step 4: Add a content test verifying the Measurement ID is real (not a placeholder)**

In `tests/test_site.py`, inside `class TestContent(unittest.TestCase):`, add this method (after `test_sitemap_is_xml`, before the class ends):

```python
    def test_analytics_js_has_measurement_id(self):
        _, _, body = fetch("/assets/js/analytics.js")
        text = body.decode("utf-8", errors="ignore")
        self.assertIn("G-GH4TDQ277N", text,
                      "analytics.js should contain the real GA4 Measurement ID")
```

- [ ] **Step 5: Verify locally**

```bash
pkill -f "serve src -l 4100" 2>/dev/null || true
npx serve src -l 4100 &
sleep 2
BASE_URL=http://localhost:4100 python3 tests/test_site.py 2>&1 | grep -E "test_analytics_js|FAIL|ERROR" || true
pkill -f "serve src -l 4100" 2>/dev/null || true
```

Expected: `test_analytics_js` and `test_analytics_js_has_measurement_id` both show as passing (no `FAIL`/`ERROR` lines for them). Other failures are expected right now (nginx-only tests) — ignore those.

- [ ] **Step 6: Commit**

```bash
git add src/assets/js/analytics.js tests/test_site.py
git commit -m "feat: add shared GA4 analytics loader"
```

---

### Task 3: Wire GA4 into the homepage and fix its canonical/OG/JSON-LD self-reference

**Files:**
- Modify: `src/index.html:4-18`, `src/index.html:39-51`
- Modify: `tests/test_site.py`

The homepage currently has a bug: its own `<link rel="canonical">`, `og:url`, and JSON-LD `WebPage.@id`/`url` all point to `/links` instead of `/`. This section fixes that, swaps the external `og:image` for a self-hosted one, and adds Twitter Card tags + the GA script tag.

- [ ] **Step 1: Replace the head meta block**

In `src/index.html`, find:

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Anthony Best</title>
  <meta name="description" content="Youtuber. Musician. Collector.">

  <!-- Open Graph -->
  <meta property="og:title" content="Anthony Best">
  <meta property="og:description" content="Youtuber. Musician. Collector.">
  <meta property="og:image" content="https://images.squarespace-cdn.com/content/v1/5b905fe15ffd207e641058e3/1570537599283-DRN61PPY106KAUPAEF8L/Home%2BMain.jpg?format=1500w">
  <meta property="og:url" content="https://anthonybest.com/links">
  <meta property="og:type" content="website">

  <link rel="icon" type="image/x-icon" href="/assets/images/favicon.ico">
  <link rel="canonical" href="https://anthonybest.com/links">
  <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml">
```

Replace with:

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="/assets/js/analytics.js"></script>
  <title>Anthony Best</title>
  <meta name="description" content="Youtuber. Musician. Collector.">

  <!-- Open Graph -->
  <meta property="og:title" content="Anthony Best">
  <meta property="og:description" content="Youtuber. Musician. Collector.">
  <meta property="og:image" content="https://anthonybest.com/assets/images/hero-bg.jpg">
  <meta property="og:url" content="https://anthonybest.com/">
  <meta property="og:type" content="website">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Anthony Best">
  <meta name="twitter:description" content="Youtuber. Musician. Collector.">
  <meta name="twitter:image" content="https://anthonybest.com/assets/images/hero-bg.jpg">

  <link rel="icon" type="image/x-icon" href="/assets/images/favicon.ico">
  <link rel="canonical" href="https://anthonybest.com/">
  <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml">
```

- [ ] **Step 2: Fix the WebPage JSON-LD block**

In `src/index.html`, find:

```html
  <!-- JSON-LD — WebPage schema -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://anthonybest.com/links",
    "name": "Anthony Best — Links",
    "url": "https://anthonybest.com/links",
    "description": "Youtuber. Musician. Collector.",
    "author": { "@id": "https://anthonybest.com/#person" },
    "publisher": { "@id": "https://anthonybest.com/#person" }
  }
  </script>
```

Replace with:

```html
  <!-- JSON-LD — WebPage schema -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://anthonybest.com/",
    "name": "Anthony Best",
    "url": "https://anthonybest.com/",
    "description": "Youtuber. Musician. Collector.",
    "author": { "@id": "https://anthonybest.com/#person" },
    "publisher": { "@id": "https://anthonybest.com/#person" }
  }
  </script>
```

- [ ] **Step 3: Add content tests**

In `tests/test_site.py`, inside `class TestContent(unittest.TestCase):`, add these methods:

```python
    def test_homepage_has_ga_script(self):
        _, _, body = fetch("/")
        text = body.decode("utf-8", errors="ignore")
        self.assertIn('/assets/js/analytics.js', text,
                      "Homepage should load the shared GA4 analytics script")

    def test_homepage_canonical_is_self(self):
        _, _, body = fetch("/")
        text = body.decode("utf-8", errors="ignore")
        self.assertIn('<link rel="canonical" href="https://anthonybest.com/">', text,
                      "Homepage canonical tag should point at itself, not /links")

    def test_homepage_og_image_is_self_hosted(self):
        _, _, body = fetch("/")
        text = body.decode("utf-8", errors="ignore")
        self.assertIn('og:image" content="https://anthonybest.com/assets/images/hero-bg.jpg"', text,
                      "Homepage og:image should be the self-hosted image, not the Squarespace CDN URL")

    def test_homepage_has_twitter_card(self):
        _, _, body = fetch("/")
        text = body.decode("utf-8", errors="ignore")
        self.assertIn('name="twitter:card" content="summary_large_image"', text,
                      "Homepage should have a Twitter Card meta tag")
```

- [ ] **Step 4: Verify locally**

```bash
pkill -f "serve src -l 4100" 2>/dev/null || true
npx serve src -l 4100 &
sleep 2
BASE_URL=http://localhost:4100 python3 tests/test_site.py 2>&1 | grep -E "test_homepage_has_ga_script|test_homepage_canonical_is_self|test_homepage_og_image_is_self_hosted|test_homepage_has_twitter_card|FAIL|ERROR" || true
pkill -f "serve src -l 4100" 2>/dev/null || true
```

Expected: all four new tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/index.html tests/test_site.py
git commit -m "fix: homepage canonical/OG/JSON-LD self-reference, add GA4 + Twitter Card"
```

---

### Task 4: Remove the duplicate `/links` page and redirect it

**Files:**
- Delete: `src/links/index.html`
- Modify: `config/nginx.conf.erb:59-63`
- Modify: `tests/test_site.py`

- [ ] **Step 1: Delete the stale duplicate page**

```bash
git rm src/links/index.html
```

- [ ] **Step 2: Add the 301 redirect to nginx**

In `config/nginx.conf.erb`, find:

```
    # ── Routing ───────────────────────────────────────────────────────────
    # Try: exact file → file.html (clean URLs) → directory index.html
    # Using $uri/index.html instead of $uri/ avoids nginx issuing an
    # external trailing-slash redirect (which would break the HTTPS check).
    location / {
```

Replace with:

```
    # ── Legacy redirects ─────────────────────────────────────────────────
    # /links was the old homepage URL before the link-in-bio redesign.
    # 301 it to the canonical homepage so bookmarks/backlinks still work
    # and search engines consolidate ranking signals onto a single URL.
    location = /links {
      return 301 /;
    }

    # ── Routing ───────────────────────────────────────────────────────────
    # Try: exact file → file.html (clean URLs) → directory index.html
    # Using $uri/index.html instead of $uri/ avoids nginx issuing an
    # external trailing-slash redirect (which would break the HTTPS check).
    location / {
```

- [ ] **Step 3: Add a post-deploy redirect test**

This can only be verified against real nginx (production), so it follows the same pattern as the existing `TestHTTPSRedirect` class. In `tests/test_site.py`, add a new class directly after `class TestHTTPSRedirect(unittest.TestCase):` and its methods (i.e. right before `class TestSecurityHeaders(unittest.TestCase):`):

```python
class TestLinksRedirect(unittest.TestCase):
    """/links is a legacy URL — nginx 301s it to the canonical homepage."""

    def test_links_redirects_to_home(self):
        status, headers, _ = fetch("/links", follow_redirects=False)
        self.assertEqual(status, 301, f"/links should return 301, got {status}")
        self.assertEqual(headers.get("Location", ""), "/",
                          "Location header should point at the homepage")


```

- [ ] **Step 4: Register the new class in the test runner**

In `tests/test_site.py`, find the `for cls in [...]` list near the bottom:

```python
    for cls in [
        TestLiveness,
        TestRoutes,
        TestCleanURLs,
        TestNotFound,
        TestHTTPSRedirect,
        TestSecurityHeaders,
        TestCacheHeaders,
        TestGzip,
        TestContent,
    ]:
```

Replace with:

```python
    for cls in [
        TestLiveness,
        TestRoutes,
        TestCleanURLs,
        TestNotFound,
        TestHTTPSRedirect,
        TestLinksRedirect,
        TestSecurityHeaders,
        TestCacheHeaders,
        TestGzip,
        TestContent,
    ]:
```

- [ ] **Step 5: Verify locally what you can**

`npx serve` doesn't run nginx, so `test_links_redirects_to_home` cannot pass locally — confirm instead that the file is gone and the site still serves:

```bash
pkill -f "serve src -l 4100" 2>/dev/null || true
npx serve src -l 4100 &
sleep 2
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4100/
test -f src/links/index.html && echo "STILL EXISTS (bug)" || echo "deleted OK"
pkill -f "serve src -l 4100" 2>/dev/null || true
```

Expected: homepage returns `200`, and `deleted OK` is printed. The actual 301 behavior gets verified by the post-deploy CI smoke test after this ships (Task 11's follow-up).

- [ ] **Step 6: Commit**

`git rm` in Step 1 already staged the deletion of `src/links/index.html` (and its now-empty parent directory, which git doesn't track separately).

```bash
git add config/nginx.conf.erb tests/test_site.py
git commit -m "fix: remove duplicate /links page, add 301 redirect to homepage"
```

---

### Task 5: Add `robots.txt`

**Files:**
- Create: `src/robots.txt`
- Modify: `tests/test_site.py`

- [ ] **Step 1: Create the file**

Create `src/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://anthonybest.com/sitemap.xml
```

- [ ] **Step 2: Add tests**

In `tests/test_site.py`, inside `class TestRoutes(unittest.TestCase):`, add:

```python
    def test_robots_txt(self):
        self._assert_200("/robots.txt", "robots.txt")
```

In `class TestContent(unittest.TestCase):`, add:

```python
    def test_robots_txt_references_sitemap(self):
        _, _, body = fetch("/robots.txt")
        text = body.decode("utf-8", errors="ignore")
        self.assertIn("Sitemap: https://anthonybest.com/sitemap.xml", text,
                      "robots.txt should reference the sitemap")
```

- [ ] **Step 3: Verify locally**

```bash
pkill -f "serve src -l 4100" 2>/dev/null || true
npx serve src -l 4100 &
sleep 2
curl -s http://localhost:4100/robots.txt
BASE_URL=http://localhost:4100 python3 tests/test_site.py 2>&1 | grep -E "test_robots_txt|FAIL|ERROR" || true
pkill -f "serve src -l 4100" 2>/dev/null || true
```

Expected: `robots.txt` content prints, both new tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/robots.txt tests/test_site.py
git commit -m "feat: add robots.txt"
```

---

### Task 6: Update `sitemap.xml`

**Files:**
- Modify: `src/sitemap.xml`
- Modify: `tests/test_site.py`

- [ ] **Step 1: Replace the sitemap contents**

Replace the entire contents of `src/sitemap.xml` with:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
          http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

  <!-- Homepage -->
  <url>
    <loc>https://anthonybest.com/</loc>
    <lastmod>2026-07-17</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>

  <url>
    <loc>https://anthonybest.com/projects</loc>
    <lastmod>2026-07-17</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://anthonybest.com/projects/putter-advisory</loc>
    <lastmod>2026-07-17</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>https://anthonybest.com/projects/shaft-advisory</loc>
    <lastmod>2026-07-17</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>

</urlset>
```

- [ ] **Step 2: Add tests**

In `tests/test_site.py`, inside `class TestContent(unittest.TestCase):`, add:

```python
    def test_sitemap_lists_projects(self):
        _, _, body = fetch("/sitemap.xml")
        text = body.decode("utf-8", errors="ignore")
        self.assertIn("<loc>https://anthonybest.com/projects</loc>", text)
        self.assertIn("<loc>https://anthonybest.com/projects/putter-advisory</loc>", text)
        self.assertIn("<loc>https://anthonybest.com/projects/shaft-advisory</loc>", text)

    def test_sitemap_has_no_links_entry(self):
        _, _, body = fetch("/sitemap.xml")
        text = body.decode("utf-8", errors="ignore")
        self.assertNotIn("<loc>https://anthonybest.com/links</loc>", text,
                          "sitemap.xml should not list the removed /links page")
```

- [ ] **Step 3: Verify locally**

```bash
pkill -f "serve src -l 4100" 2>/dev/null || true
npx serve src -l 4100 &
sleep 2
BASE_URL=http://localhost:4100 python3 tests/test_site.py 2>&1 | grep -E "test_sitemap|FAIL|ERROR" || true
pkill -f "serve src -l 4100" 2>/dev/null || true
```

Expected: all `test_sitemap*` tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/sitemap.xml tests/test_site.py
git commit -m "feat: update sitemap.xml with projects pages, drop /links"
```

---

### Task 7: GA4 + Open Graph/Twitter/JSON-LD on the projects index

**Files:**
- Modify: `src/projects/index.html:1-16`
- Modify: `tests/test_site.py`

- [ ] **Step 1: Replace the head block**

In `src/projects/index.html`, find:

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Projects — Anthony Best</title>
  <meta name="description" content="A collection of fun projects by Anthony Best.">

  <link rel="icon" type="image/x-icon" href="/assets/images/favicon.ico">
  <link rel="canonical" href="https://anthonybest.com/projects">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@300;400;500;700&display=swap" rel="stylesheet">
```

Replace with:

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="/assets/js/analytics.js"></script>
  <title>Projects — Anthony Best</title>
  <meta name="description" content="A collection of fun projects by Anthony Best.">

  <!-- Open Graph -->
  <meta property="og:title" content="Projects — Anthony Best">
  <meta property="og:description" content="A collection of fun projects by Anthony Best.">
  <meta property="og:image" content="https://anthonybest.com/assets/images/hero-bg.jpg">
  <meta property="og:url" content="https://anthonybest.com/projects">
  <meta property="og:type" content="website">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Projects — Anthony Best">
  <meta name="twitter:description" content="A collection of fun projects by Anthony Best.">
  <meta name="twitter:image" content="https://anthonybest.com/assets/images/hero-bg.jpg">

  <link rel="icon" type="image/x-icon" href="/assets/images/favicon.ico">
  <link rel="canonical" href="https://anthonybest.com/projects">

  <!-- JSON-LD — WebPage schema -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://anthonybest.com/projects",
    "name": "Projects — Anthony Best",
    "url": "https://anthonybest.com/projects",
    "description": "A collection of fun projects by Anthony Best.",
    "author": { "@id": "https://anthonybest.com/#person" },
    "publisher": { "@id": "https://anthonybest.com/#person" }
  }
  </script>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@300;400;500;700&display=swap" rel="stylesheet">
```

- [ ] **Step 2: Add tests**

In `tests/test_site.py`, inside `class TestContent(unittest.TestCase):`, add:

```python
    def test_projects_index_has_ga_script(self):
        _, _, body = fetch("/projects")
        text = body.decode("utf-8", errors="ignore")
        self.assertIn('/assets/js/analytics.js', text)

    def test_projects_index_references_person_entity(self):
        _, _, body = fetch("/projects")
        text = body.decode("utf-8", errors="ignore")
        self.assertIn('"@id": "https://anthonybest.com/#person"', text,
                      "Projects index JSON-LD should reference the Person entity")
```

- [ ] **Step 3: Verify locally**

```bash
pkill -f "serve src -l 4100" 2>/dev/null || true
npx serve src -l 4100 &
sleep 2
BASE_URL=http://localhost:4100 python3 tests/test_site.py 2>&1 | grep -E "test_projects_index|FAIL|ERROR" || true
pkill -f "serve src -l 4100" 2>/dev/null || true
```

Expected: both new tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/projects/index.html tests/test_site.py
git commit -m "feat: add GA4 + OG/Twitter/JSON-LD to projects index"
```

---

### Task 8: GA4 + full metadata on the Putter Advisory deck

**Files:**
- Modify: `src/projects/putter-advisory/index.html:1-8`
- Modify: `tests/test_site.py`

- [ ] **Step 1: Replace the head block**

In `src/projects/putter-advisory/index.html`, find:

```html
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Anthony Best — Putter Advisory</title>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
```

Replace with:

```html
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<script src="/assets/js/analytics.js"></script>
<title>Anthony Best — Putter Advisory</title>
<meta name="description" content="A data-driven case for replacing a Scotty Cameron Special Select Newport with a Phantom mallet putter — seven putters scored across five weighted criteria.">
<link rel="canonical" href="https://anthonybest.com/projects/putter-advisory">

<meta property="og:title" content="Anthony Best — Putter Advisory">
<meta property="og:description" content="A data-driven case for replacing a Scotty Cameron Special Select Newport with a Phantom mallet putter — seven putters scored across five weighted criteria.">
<meta property="og:image" content="https://anthonybest.com/assets/images/hero-bg.jpg">
<meta property="og:url" content="https://anthonybest.com/projects/putter-advisory">
<meta property="og:type" content="website">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Anthony Best — Putter Advisory">
<meta name="twitter:description" content="A data-driven case for replacing a Scotty Cameron Special Select Newport with a Phantom mallet putter — seven putters scored across five weighted criteria.">
<meta name="twitter:image" content="https://anthonybest.com/assets/images/hero-bg.jpg">

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://anthonybest.com/projects/putter-advisory",
  "name": "Anthony Best — Putter Advisory",
  "url": "https://anthonybest.com/projects/putter-advisory",
  "description": "A data-driven case for replacing a Scotty Cameron Special Select Newport with a Phantom mallet putter — seven putters scored across five weighted criteria.",
  "author": { "@id": "https://anthonybest.com/#person" },
  "publisher": { "@id": "https://anthonybest.com/#person" }
}
</script>

<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
```

- [ ] **Step 2: Add tests**

In `tests/test_site.py`, inside `class TestContent(unittest.TestCase):`, add:

```python
    def test_putter_advisory_has_ga_script(self):
        _, _, body = fetch("/projects/putter-advisory")
        text = body.decode("utf-8", errors="ignore")
        self.assertIn('/assets/js/analytics.js', text)

    def test_putter_advisory_has_canonical(self):
        _, _, body = fetch("/projects/putter-advisory")
        text = body.decode("utf-8", errors="ignore")
        self.assertIn('<link rel="canonical" href="https://anthonybest.com/projects/putter-advisory">', text)

    def test_putter_advisory_references_person_entity(self):
        _, _, body = fetch("/projects/putter-advisory")
        text = body.decode("utf-8", errors="ignore")
        self.assertIn('"@id": "https://anthonybest.com/#person"', text)
```

- [ ] **Step 3: Verify locally**

```bash
pkill -f "serve src -l 4100" 2>/dev/null || true
npx serve src -l 4100 &
sleep 2
BASE_URL=http://localhost:4100 python3 tests/test_site.py 2>&1 | grep -E "test_putter_advisory|FAIL|ERROR" || true
pkill -f "serve src -l 4100" 2>/dev/null || true
```

Expected: all three new tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/projects/putter-advisory/index.html tests/test_site.py
git commit -m "feat: add GA4 + full SEO metadata to putter advisory deck"
```

---

### Task 9: GA4 + full metadata on the Shaft Advisory deck (and its missing route tests)

**Files:**
- Modify: `src/projects/shaft-advisory/index.html:1-8`
- Modify: `tests/test_site.py`

This page currently has **no route test at all** in the smoke suite — only `putter-advisory` is checked. This task adds that alongside the metadata.

- [ ] **Step 1: Replace the head block**

In `src/projects/shaft-advisory/index.html`, find:

```html
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Anthony Best — Iron Shaft Advisory</title>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
```

Replace with:

```html
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<script src="/assets/js/analytics.js"></script>
<title>Anthony Best — Iron Shaft Advisory</title>
<meta name="description" content="A data-driven case for upgrading iron shafts from the Recoil Dart 94g to the Axiom 105 — swing-speed, spin-consistency, and smash-factor analysis.">
<link rel="canonical" href="https://anthonybest.com/projects/shaft-advisory">

<meta property="og:title" content="Anthony Best — Iron Shaft Advisory">
<meta property="og:description" content="A data-driven case for upgrading iron shafts from the Recoil Dart 94g to the Axiom 105 — swing-speed, spin-consistency, and smash-factor analysis.">
<meta property="og:image" content="https://anthonybest.com/assets/images/hero-bg.jpg">
<meta property="og:url" content="https://anthonybest.com/projects/shaft-advisory">
<meta property="og:type" content="website">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Anthony Best — Iron Shaft Advisory">
<meta name="twitter:description" content="A data-driven case for upgrading iron shafts from the Recoil Dart 94g to the Axiom 105 — swing-speed, spin-consistency, and smash-factor analysis.">
<meta name="twitter:image" content="https://anthonybest.com/assets/images/hero-bg.jpg">

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://anthonybest.com/projects/shaft-advisory",
  "name": "Anthony Best — Iron Shaft Advisory",
  "url": "https://anthonybest.com/projects/shaft-advisory",
  "description": "A data-driven case for upgrading iron shafts from the Recoil Dart 94g to the Axiom 105 — swing-speed, spin-consistency, and smash-factor analysis.",
  "author": { "@id": "https://anthonybest.com/#person" },
  "publisher": { "@id": "https://anthonybest.com/#person" }
}
</script>

<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
```

- [ ] **Step 2: Add the missing route + clean-URL tests**

In `tests/test_site.py`, inside `class TestRoutes(unittest.TestCase):`, add (next to `test_putter_advisory`):

```python
    def test_shaft_advisory(self):
        self._assert_200("/projects/shaft-advisory", "Shaft advisory deck")
```

Inside `class TestCleanURLs(unittest.TestCase):`, add (next to `test_putter_advisory_no_trailing_slash`):

```python
    def test_shaft_advisory_no_trailing_slash(self):
        status, _, _ = fetch("/projects/shaft-advisory")
        self.assertEqual(status, 200, "/projects/shaft-advisory (no slash) should return 200")
```

- [ ] **Step 3: Add content tests**

In `tests/test_site.py`, inside `class TestContent(unittest.TestCase):`, add:

```python
    def test_shaft_advisory_has_ga_script(self):
        _, _, body = fetch("/projects/shaft-advisory")
        text = body.decode("utf-8", errors="ignore")
        self.assertIn('/assets/js/analytics.js', text)

    def test_shaft_advisory_has_canonical(self):
        _, _, body = fetch("/projects/shaft-advisory")
        text = body.decode("utf-8", errors="ignore")
        self.assertIn('<link rel="canonical" href="https://anthonybest.com/projects/shaft-advisory">', text)

    def test_shaft_advisory_references_person_entity(self):
        _, _, body = fetch("/projects/shaft-advisory")
        text = body.decode("utf-8", errors="ignore")
        self.assertIn('"@id": "https://anthonybest.com/#person"', text)
```

- [ ] **Step 4: Verify locally**

```bash
pkill -f "serve src -l 4100" 2>/dev/null || true
npx serve src -l 4100 &
sleep 2
BASE_URL=http://localhost:4100 python3 tests/test_site.py 2>&1 | grep -E "test_shaft_advisory|FAIL|ERROR" || true
pkill -f "serve src -l 4100" 2>/dev/null || true
```

Expected: all new `test_shaft_advisory*` tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/projects/shaft-advisory/index.html tests/test_site.py
git commit -m "feat: add GA4 + full SEO metadata to shaft advisory deck, add missing route tests"
```

---

### Task 10: Full local regression pass

**Files:** none (verification only)

- [ ] **Step 1: Run the entire suite locally and review the summary**

```bash
pkill -f "serve src -l 4100" 2>/dev/null || true
npx serve src -l 4100 &
sleep 2
BASE_URL=http://localhost:4100 python3 tests/test_site.py 2>&1 | tail -40
pkill -f "serve src -l 4100" 2>/dev/null || true
```

Expected: every test **except** the nginx-only ones fails cleanly for a known, pre-existing reason (no nginx locally) — specifically `TestHTTPSRedirect.*`, `TestLinksRedirect.*`, `TestSecurityHeaders.*`, `TestCacheHeaders.*`, `TestGzip.*`. All `TestLiveness`, `TestRoutes`, `TestCleanURLs`, `TestNotFound` (except the 500-vs-404 nginx nuance doesn't apply here), and `TestContent` tests should pass, including every test added in Tasks 2–9.

If anything in `TestRoutes`/`TestContent` fails, stop and fix it before continuing — those must work on any static file server, not just nginx.

- [ ] **Step 2: Diff review**

```bash
git diff main --stat
```

Confirm the file list matches: `src/assets/js/analytics.js` (new), `src/index.html`, `src/links/index.html` (deleted), `config/nginx.conf.erb`, `src/robots.txt` (new), `src/sitemap.xml`, `src/projects/index.html`, `src/projects/putter-advisory/index.html`, `src/projects/shaft-advisory/index.html`, `tests/test_site.py`.

No commit in this task — it's a checkpoint before opening the PR.

---

### Task 11: Open the PR (per the documented deploy process)

**Files:** none (git/GitHub operation only)

Per `README.md`, this repo deploys by merging a PR to `main`, which triggers Heroku's auto-deploy, after which the `deploy.yml` GitHub Action runs the smoke-test suite against the live URL. **Do not merge this PR yourself** — pushing the branch and opening the PR is as far as this task goes; merging is the user's call since it triggers a real production deploy.

- [ ] **Step 1: Push the branch**

```bash
git push -u origin seo-ga4-enhancements
```

- [ ] **Step 2: Open the PR**

```bash
gh pr create --title "Add GA4 tracking and SEO enhancements" --body "$(cat <<'EOF'
## Summary
- Add shared GA4 (gtag.js) loader (`src/assets/js/analytics.js`, Measurement ID `G-GH4TDQ277N`) to every page
- Fix homepage canonical/og:url/JSON-LD, which incorrectly self-referenced `/links` instead of `/`
- Remove the stale duplicate `src/links/index.html`; add a real 301 (`/links` → `/`) in nginx
- Add `robots.txt`; update `sitemap.xml` to list `/projects` and both advisory decks instead of `/links`
- Add Open Graph, Twitter Card, and `WebPage` JSON-LD (referencing the existing `Person` entity) to `/projects` and both advisory decks, which previously had none
- Add corresponding smoke-test coverage in `tests/test_site.py`, including previously-missing route tests for `/projects/shaft-advisory`

## Test plan
- [x] `node --check` on the new analytics.js
- [x] Full `tests/test_site.py` run against `npx serve` locally — all non-nginx-dependent tests pass
- [ ] Post-merge: GitHub Actions `Smoke test (post-deploy)` workflow passes against the live Heroku URL (covers the `/links` redirect, security headers, etc. that can't be verified locally)
- [ ] Manual, post-deploy: resubmit `sitemap.xml` in Google Search Console and request removal/re-crawl of `/links` (GSC is already verified via the existing DNS TXT record — no new verification needed)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 3: Report the PR URL to the user and stop**

Do not merge. The user merges when ready, per the documented flow, which triggers the Heroku auto-deploy and the post-deploy smoke test.

---

## Spec coverage check

- GA4 on every page → Tasks 2, 3, 7, 8, 9
- `/links` duplicate-content fix (delete file, 301, fix homepage self-reference) → Task 4 (delete + redirect), Task 3 (canonical/OG/JSON-LD fix)
- `robots.txt` → Task 5
- `sitemap.xml` update → Task 6
- Homepage OG image self-hosting + Twitter Card → Task 3
- `/projects` OG/Twitter/JSON-LD → Task 7
- Putter/Shaft advisory full metadata (previously had none) → Tasks 8, 9
- PR-based deploy process → Tasks 1 (branch) and 11 (PR, no merge)
- GSC resubmission follow-up → noted in Task 11's PR body test plan
