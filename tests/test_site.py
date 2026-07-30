#!/usr/bin/env python3
"""
Smoke-test and regression suite for the anthonybest.com Heroku deployment.

Requires only the Python 3 standard library — no pip install needed.

Usage:
    python tests/test_site.py
    BASE_URL=https://anthonybest.com python tests/test_site.py

Exit codes:
    0  all tests passed
    1  one or more tests failed
"""

import os
import sys
import time
import urllib.request
import urllib.error
import unittest

# ── Configuration ─────────────────────────────────────────────────────────────

BASE_URL = os.environ.get(
    "BASE_URL", "https://anthonybest.com"
).rstrip("/")

# Derive the HTTP equivalent for redirect tests
HTTP_BASE = BASE_URL.replace("https://", "http://", 1)

# Per-request timeout in seconds
TIMEOUT = 20


# ── Helpers ───────────────────────────────────────────────────────────────────

class _NoRedirectHandler(urllib.request.HTTPRedirectHandler):
    """Raise instead of following a redirect so callers can inspect the 3xx."""
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        raise urllib.error.HTTPError(req.full_url, code, msg, headers, fp)


def fetch(path, *, follow_redirects=True, extra_headers=None, base=None):
    """
    GET ``(base or BASE_URL) + path`` and return (status, headers_dict, body_bytes).

    On a non-2xx/3xx response urllib raises HTTPError; we catch it and return
    the same tuple so callers can assert on the status code directly.
    """
    url = (base or BASE_URL) + path
    req = urllib.request.Request(url, headers=extra_headers or {})

    if follow_redirects:
        opener = urllib.request.build_opener()
    else:
        opener = urllib.request.build_opener(_NoRedirectHandler())

    try:
        resp = opener.open(req, timeout=TIMEOUT)
        return resp.status, dict(resp.headers), resp.read()
    except urllib.error.HTTPError as e:
        body = b""
        try:
            body = e.read()
        except Exception:
            pass
        return e.code, dict(e.headers), body


# ── Test classes ──────────────────────────────────────────────────────────────

class TestLiveness(unittest.TestCase):
    """Basic availability — the app is up and responding."""

    def test_homepage_returns_200(self):
        status, _, _ = fetch("/")
        self.assertEqual(status, 200, f"Homepage should return 200, got {status}")

    def test_homepage_returns_html(self):
        _, headers, _ = fetch("/")
        ct = headers.get("Content-Type", "")
        self.assertIn("text/html", ct, f"Homepage should return HTML, got Content-Type: {ct}")


class TestRoutes(unittest.TestCase):
    """Every known public URL returns 200."""

    def _assert_200(self, path, label):
        status, _, _ = fetch(path)
        self.assertEqual(status, 200, f"{label} ({path}) expected 200, got {status}")

    def test_homepage(self):
        self._assert_200("/", "Homepage")

    def test_sitemap_xml(self):
        self._assert_200("/sitemap.xml", "Sitemap")

    def test_analytics_js(self):
        self._assert_200("/assets/js/analytics.js", "Analytics script")

    def test_robots_txt(self):
        self._assert_200("/robots.txt", "robots.txt")

    def test_guitar_guides_index(self):
        self._assert_200("/guitar-guides/", "Guitar Guides index")

    def test_guitar_guides_friedman_naked_amp(self):
        self._assert_200("/guitar-guides/friedman-naked-amp/", "Friedman Naked Amp guide")


class TestNotFound(unittest.TestCase):
    """Unknown routes return 404, not a server error."""

    def test_random_path_is_404(self):
        status, _, _ = fetch("/this-page-does-not-exist-xyz")
        self.assertEqual(status, 404, f"Unknown route should return 404, got {status}")

    def test_unknown_project_is_404(self):
        status, _, _ = fetch("/projects/nonexistent-project-xyz")
        self.assertEqual(status, 404, f"Unknown project path should return 404, got {status}")

    def test_404_is_not_500(self):
        status, _, _ = fetch("/definitely-not-a-page")
        self.assertNotEqual(status, 500, "Unknown routes must not produce a 500 error")


class TestHTTPSRedirect(unittest.TestCase):
    """HTTP requests are redirected to HTTPS (nginx X-Forwarded-Proto enforcement)."""

    def test_http_redirects_to_https(self):
        status, headers, _ = fetch("/", follow_redirects=False, base=HTTP_BASE)
        self.assertIn(
            status, (301, 302, 307, 308),
            f"HTTP should redirect to HTTPS, got status {status}"
        )
        location = headers.get("Location", "")
        self.assertTrue(
            location.startswith("https://"),
            f"Redirect Location should start with https://, got: {location!r}"
        )

    def test_redirect_has_no_port_leak(self):
        """nginx port_in_redirect off — the redirect URL must not contain :NNNNN."""
        status, headers, _ = fetch("/", follow_redirects=False, base=HTTP_BASE)
        if status not in (301, 302, 307, 308):
            self.skipTest("No redirect received — cannot check for port leak")
        location = headers.get("Location", "")
        import re
        self.assertFalse(
            re.search(r":\d{4,5}/", location),
            f"Redirect Location should not contain a port number, got: {location!r}"
        )


class TestLinksRedirect(unittest.TestCase):
    """/links is a legacy URL — nginx 301s it to the canonical homepage."""

    def test_links_redirects_to_home(self):
        status, headers, _ = fetch("/links", follow_redirects=False)
        self.assertEqual(status, 301, f"/links should return 301, got {status}")
        self.assertEqual(headers.get("Location", ""), "/",
                          "Location header should point at the homepage")


class TestSecurityHeaders(unittest.TestCase):
    """nginx adds the three required security headers on every HTML response."""

    @classmethod
    def setUpClass(cls):
        _, cls.headers, _ = fetch("/")

    def test_x_content_type_options(self):
        val = self.headers.get("X-Content-Type-Options", "")
        self.assertEqual(
            val.lower(), "nosniff",
            f"X-Content-Type-Options should be 'nosniff', got: {val!r}"
        )

    def test_x_frame_options(self):
        val = self.headers.get("X-Frame-Options", "")
        self.assertEqual(
            val.upper(), "SAMEORIGIN",
            f"X-Frame-Options should be 'SAMEORIGIN', got: {val!r}"
        )

    def test_referrer_policy(self):
        val = self.headers.get("Referrer-Policy", "")
        self.assertEqual(
            val.lower(), "strict-origin-when-cross-origin",
            f"Referrer-Policy should be 'strict-origin-when-cross-origin', got: {val!r}"
        )

    def test_server_tokens_off(self):
        """nginx server_tokens off — Server header should not reveal the version."""
        server = self.headers.get("Server", "")
        import re
        self.assertFalse(
            re.search(r"nginx/[\d.]+", server),
            f"Server header should not expose nginx version, got: {server!r}"
        )


class TestCacheHeaders(unittest.TestCase):
    """Cache-Control values match the nginx location block rules."""

    def test_html_has_one_hour_cache(self):
        _, headers, _ = fetch("/")
        cc = headers.get("Cache-Control", "")
        self.assertIn("max-age=3600", cc,
                      f"HTML should have max-age=3600, got Cache-Control: {cc!r}")

    def test_css_has_one_week_cache(self):
        _, headers, _ = fetch("/assets/css/main.css")
        cc = headers.get("Cache-Control", "")
        self.assertIn("max-age=604800", cc,
                      f"CSS should have max-age=604800, got Cache-Control: {cc!r}")

    def test_image_has_thirty_day_cache(self):
        _, headers, _ = fetch("/assets/images/favicon.ico")
        cc = headers.get("Cache-Control", "")
        self.assertIn("max-age=2592000", cc,
                      f"Images should have max-age=2592000, got Cache-Control: {cc!r}")

    def test_html_does_not_have_long_cache(self):
        _, headers, _ = fetch("/")
        cc = headers.get("Cache-Control", "")
        self.assertNotIn("max-age=2592000", cc,
                         "HTML should not have the 30-day image/font cache duration")


class TestGzip(unittest.TestCase):
    """nginx gzip compression is active for compressible content types."""

    def test_html_served_gzipped(self):
        _, headers, _ = fetch("/", extra_headers={"Accept-Encoding": "gzip"})
        encoding = headers.get("Content-Encoding", "")
        self.assertEqual(
            encoding, "gzip",
            f"HTML should be served with gzip encoding, got: {encoding!r}"
        )

    def test_vary_accept_encoding_set(self):
        _, headers, _ = fetch("/", extra_headers={"Accept-Encoding": "gzip"})
        vary = headers.get("Vary", "")
        self.assertIn(
            "Accept-Encoding", vary,
            f"Vary header should include Accept-Encoding when gzip is active, got: {vary!r}"
        )


class TestContent(unittest.TestCase):
    """Key content is present in page bodies."""

    def test_homepage_has_branding(self):
        _, _, body = fetch("/")
        text = body.decode("utf-8", errors="ignore")
        self.assertIn("Anthony Best", text, "Homepage should contain 'Anthony Best'")

    def test_homepage_has_social_links(self):
        _, _, body = fetch("/")
        text = body.decode("utf-8", errors="ignore").lower()
        has_link = any(s in text for s in ["youtube", "instagram", "linkedin"])
        self.assertTrue(has_link, "Homepage should reference at least one social platform")

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

    def test_sitemap_is_xml(self):
        _, headers, body = fetch("/sitemap.xml")
        text = body.decode("utf-8", errors="ignore")
        self.assertIn("<?xml", text, "sitemap.xml should start with an XML declaration")
        self.assertIn("urlset", text, "sitemap.xml should contain a <urlset> element")
        ct = headers.get("Content-Type", "")
        self.assertTrue(
            "xml" in ct or "text" in ct,
            f"sitemap.xml should have an XML or text content-type, got: {ct!r}"
        )

    def test_analytics_js_has_measurement_id(self):
        _, _, body = fetch("/assets/js/analytics.js")
        text = body.decode("utf-8", errors="ignore")
        self.assertIn("G-GH4TDQ277N", text,
                      "analytics.js should contain the real GA4 Measurement ID")

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

    def test_robots_txt_references_sitemap(self):
        _, _, body = fetch("/robots.txt")
        text = body.decode("utf-8", errors="ignore")
        self.assertIn("Sitemap: https://anthonybest.com/sitemap.xml", text,
                      "robots.txt should reference the sitemap")

    def test_sitemap_has_no_links_entry(self):
        _, _, body = fetch("/sitemap.xml")
        text = body.decode("utf-8", errors="ignore")
        self.assertNotIn("<loc>https://anthonybest.com/links</loc>", text,
                          "sitemap.xml should not list the removed /links page")


# ── Entry point ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print(f"\n{'═' * 62}")
    print(f"  anthonybest.com · Site Test Suite")
    print(f"  Target: {BASE_URL}")
    print(f"{'═' * 62}\n")

    loader = unittest.TestLoader()
    suite = unittest.TestSuite()

    for cls in [
        TestLiveness,
        TestRoutes,
        TestNotFound,
        TestHTTPSRedirect,
        TestLinksRedirect,
        TestSecurityHeaders,
        TestCacheHeaders,
        TestGzip,
        TestContent,
    ]:
        suite.addTests(loader.loadTestsFromTestCase(cls))

    runner = unittest.TextTestRunner(verbosity=2, stream=sys.stdout)
    result = runner.run(suite)
    sys.exit(0 if result.wasSuccessful() else 1)
