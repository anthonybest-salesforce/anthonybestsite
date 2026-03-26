/**
 * Salesforce Einstein Personalization — Sitemap Configuration
 * Site: anthonybest.com
 *
 * SETUP:
 * 1. Replace YOUR_TENANT_ID in the beacon script tag in index.html
 *    (found in: Personalization Admin → Web SDK → JavaScript Integration)
 * 2. Paste this file into the Sitemap Editor in the Personalization
 *    Visual Editor (via the Salesforce Interactions SDK Launcher extension)
 *
 * CONTENT ZONES DEFINED:
 * ┌─────────────────────────┬──────────────────────────────────────────┐
 * │ Zone Name               │ Element / Purpose                        │
 * ├─────────────────────────┼──────────────────────────────────────────┤
 * │ announcement_bar        │ Full header bar container                │
 * │ announcement_text       │ Header bar message text                  │
 * │ announcement_cta        │ Header bar call-to-action link           │
 * │ home_hero               │ Main .container — logo/name/tagline area │
 * │ home_cards              │ .cards — social link card group          │
 * │ footer_featured         │ Featured content card above footer       │
 * │ footer_message          │ Optional personalized line in footer     │
 * │ popup_eyebrow           │ Popup label / category text              │
 * │ popup_headline          │ Popup main headline                      │
 * │ popup_body              │ Popup supporting body copy               │
 * │ popup_cta               │ Popup call-to-action link                │
 * │ popup_reason            │ Popup "why am I seeing this" explanation │
 * └─────────────────────────┴──────────────────────────────────────────┘
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
        // Header announcement bar (full zone)
        { name: "announcement_bar",  selector: "#pers-announcement-bar"  },
        // Sub-zones inside the bar (filled individually)
        { name: "announcement_text", selector: "#pers-announcement-text" },
        { name: "announcement_cta",  selector: "#pers-announcement-cta"  },
        // Popup zones
        { name: "popup_eyebrow",     selector: "#pers-popup-eyebrow"     },
        { name: "popup_headline",    selector: "#pers-popup-headline"     },
        { name: "popup_body",        selector: "#pers-popup-body"         },
        { name: "popup_cta",         selector: "#pers-popup-cta"          },
        { name: "popup_reason",      selector: "#pers-popup-reason"       }
      ],
      onActionEvent: (actionEvent) => {
        return actionEvent;
      }
    },

    // ─────────────────────────────────────────────────────────────────
    // PAGE TYPES
    // ─────────────────────────────────────────────────────────────────
    pageTypes: [

      // ── HOME / LINKS PAGE ─────────────────────────────────────────
      {
        name: "home",
        isMatch: () =>
          window.location.pathname === "/"            ||
          window.location.pathname === "/index.html"  ||
          window.location.pathname === "/links"       ||
          window.location.pathname === "/links/",

        interaction: {
          name: "Homepage"
        },

        contentZones: [
          // Main content column (logo + name + tagline area)
          { name: "home_hero",         selector: ".container"             },
          // Social link cards group
          { name: "home_cards",        selector: ".cards"                 },
          // Featured content card above footer
          { name: "footer_featured",   selector: "#pers-footer-featured"  },
          // Optional personalized footer message
          { name: "footer_message",    selector: "#pers-footer-message"   }
        ],

        // ── Social link click tracking ─────────────────────────────
        listeners: [

          // Instagram card
          SalesforceInteractions.listener(
            "click",
            "a.link-card[href*='instagram']",
            () => {
              SalesforceInteractions.sendEvent({
                interaction: {
                  name: "Social Link Click",
                  attributes: {
                    platform: "Instagram",
                    destinationUrl: "https://instagram.com/itsanthonybest"
                  }
                }
              });
            }
          ),

          // LinkedIn card
          SalesforceInteractions.listener(
            "click",
            "a.link-card[href*='linkedin']",
            () => {
              SalesforceInteractions.sendEvent({
                interaction: {
                  name: "Social Link Click",
                  attributes: {
                    platform: "LinkedIn",
                    destinationUrl: "https://linkedin.com/in/anthonylbest"
                  }
                }
              });
            }
          ),

          // YouTube card
          SalesforceInteractions.listener(
            "click",
            "a.link-card[href*='youtube']",
            () => {
              SalesforceInteractions.sendEvent({
                interaction: {
                  name: "Social Link Click",
                  attributes: {
                    platform: "YouTube",
                    destinationUrl: "https://youtube.com/c/anthonybestmusic"
                  }
                }
              });
            }
          ),

          // Announcement bar CTA click
          SalesforceInteractions.listener(
            "click",
            "#pers-announcement-cta",
            () => {
              SalesforceInteractions.sendEvent({
                interaction: { name: "Announcement Bar CTA Clicked" }
              });
            }
          ),

          // Popup CTA click
          SalesforceInteractions.listener(
            "click",
            "#pers-popup-cta",
            () => {
              SalesforceInteractions.sendEvent({
                interaction: { name: "Popup CTA Clicked" }
              });
            }
          ),

          // Featured footer card click
          SalesforceInteractions.listener(
            "click",
            "#pers-footer-featured a",
            () => {
              SalesforceInteractions.sendEvent({
                interaction: { name: "Footer Featured Card Clicked" }
              });
            }
          )
        ],

        // ── Personalization action handlers ────────────────────────
        // Called by Personalization campaigns after filling zones.
        // The sitemap triggers these via onActionEvent or rule actions.
        onActionEvent: (actionEvent) => {

          // Show announcement bar if Personalization filled it
          const barText = document.getElementById('pers-announcement-text');
          if (barText && barText.textContent.trim().length > 0) {
            if (window.ABPersonalization) {
              ABPersonalization.showBar();
            }
          }

          // Show popup if Personalization filled the headline zone
          const popupHeadline = document.getElementById('pers-popup-headline');
          if (popupHeadline && popupHeadline.textContent.trim().length > 0) {
            // Small delay so page animations settle first
            setTimeout(() => {
              if (window.ABPersonalization) {
                ABPersonalization.showPopup();
              }
            }, 2500);
          }

          return actionEvent;
        }
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
    // DEFAULT — fires when no pageType matches
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
