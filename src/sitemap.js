/**
 * Salesforce Marketing Cloud Personalization — Sitemap Configuration
 * Site: anthonybest.com
 *
 * SETUP INSTRUCTIONS:
 * 1. Replace YOUR_ACCOUNT and YOUR_DATASET below with your actual values
 *    from: Personalization Admin > Channels & Campaigns > Web > JavaScript Integration
 * 2. Paste this file into the Sitemap Editor inside the Personalization Visual Editor
 *    (accessible via the Salesforce Interactions SDK Launcher Chrome extension)
 * 3. The beacon snippet in index.html must load BEFORE this sitemap runs
 *
 * Beacon CDN URL format:
 *   //cdn.evgnet.com/beacon/YOUR_ACCOUNT/YOUR_DATASET/scripts/evergage.min.js
 */

SalesforceInteractions.init({
  cookieDomain: "anthonybest.com"
}).then(() => {

  const sitemapConfig = {

    // ─────────────────────────────────────────────────────────────────
    // GLOBAL — runs on every page
    // ─────────────────────────────────────────────────────────────────
    global: {
      contentZones: [
        { name: "global_banner", selector: "body" }
      ],
      onActionEvent: (actionEvent) => {
        // Attach any global attributes here (e.g. from a data layer)
        return actionEvent;
      }
    },

    // ─────────────────────────────────────────────────────────────────
    // PAGE TYPES — first isMatch() that returns true wins
    // ─────────────────────────────────────────────────────────────────
    pageTypes: [

      // ── HOME / LINKS PAGE ─────────────────────────────────────────
      {
        name: "home",
        isMatch: () =>
          window.location.pathname === "/" ||
          window.location.pathname === "/index.html" ||
          window.location.pathname === "/links" ||
          window.location.pathname === "/links/",
        interaction: {
          name: "Homepage"
        },
        contentZones: [
          { name: "home_hero",   selector: ".container" },
          { name: "home_cards",  selector: ".cards" }
        ],
        // Track clicks on each social card
        listeners: [

          // Instagram card click
          SalesforceInteractions.listener(
            "click",
            "a.link-card[href*='instagram']",
            () => {
              SalesforceInteractions.sendEvent({
                interaction: {
                  name: "Social Link Click",
                  attributes: {
                    platform: "Instagram",
                    url: "https://instagram.com/itsanthonybest"
                  }
                }
              });
            }
          ),

          // LinkedIn card click
          SalesforceInteractions.listener(
            "click",
            "a.link-card[href*='linkedin']",
            () => {
              SalesforceInteractions.sendEvent({
                interaction: {
                  name: "Social Link Click",
                  attributes: {
                    platform: "LinkedIn",
                    url: "https://linkedin.com/in/anthonylbest"
                  }
                }
              });
            }
          ),

          // YouTube card click
          SalesforceInteractions.listener(
            "click",
            "a.link-card[href*='youtube']",
            () => {
              SalesforceInteractions.sendEvent({
                interaction: {
                  name: "Social Link Click",
                  attributes: {
                    platform: "YouTube",
                    url: "https://youtube.com/c/anthonybestmusic"
                  }
                }
              });
            }
          )
        ]
      },

      // ── 404 / ERROR PAGE ──────────────────────────────────────────
      {
        name: "error_page",
        isMatch: () =>
          document.title.toLowerCase().includes("404") ||
          /\/404|\/not-found/.test(window.location.pathname),
        interaction: { name: "Error Page" }
      }

    ],

    // ─────────────────────────────────────────────────────────────────
    // DEFAULT — fires when no pageType matches above
    // ─────────────────────────────────────────────────────────────────
    pageTypeDefault: {
      interaction: { name: "Default Page" },
      contentZones: [
        { name: "default_content", selector: ".container" }
      ]
    }

  };

  SalesforceInteractions.initSitemap(sitemapConfig);

});
