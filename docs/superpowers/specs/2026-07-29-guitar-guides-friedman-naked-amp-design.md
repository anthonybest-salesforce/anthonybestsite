# Guitar Guides — Friedman "Naked" Amp — Design

**Date:** 2026-07-29
**Goal:** Add a new public "Guitar Guides" section to anthonybest.com, launching with a history page on the Friedman "Naked" amplifier lineage, styled as an extension of the existing homepage design system.

## Context

The site is a static public site under `src/` (link-in-bio homepage only today) served by a Cloudflare Worker with static-assets fallback (`worker/index.js`, `[assets] directory = "./dist"`), plus a separate gated `/admin` SPA backed by D1. On 2026-07-17 the site deliberately retired its only prior public multi-page content (`/projects/*` advisory decks) in favor of gating that kind of content behind `/admin`. Guitar Guides is a deliberate reversal of that for this specific content: public, indexed, and linked from the homepage — this is audience-facing history/collector content, not personal admin data (which already has a separate, private "guitar gear" inventory resource in the D1 backend — not to be confused with this).

Research on the amp's history was compiled via web search (Friedman's official site, Guitar.com, Premier Guitar, Guitar World, and several gear forums/Reverb/YouTube). Several facts are genuinely disputed between sources, and some details (an oft-cited "18 units" figure, exact Reverb pricing, the precise origin of the "Naked" name) could not be verified at all. Per instruction, conflicting facts are presented side by side rather than silently resolved, and unverifiable claims are flagged rather than invented.

## 1. Site structure / URLs

```
src/
  guitar-guides/
    index.html                                  → /guitar-guides/
    friedman-naked-amp/
      index.html                                → /guitar-guides/friedman-naked-amp/
      data.js                                    ← content; the only file touched for edits
  assets/
    css/guitar-guides.css                        ← shared template styles
    js/guitar-guide.js                            ← shared renderer (reads a page's data.js)
    images/guitar-guides/friedman-naked-amp/      ← reviewed images land here, git-committed
```

- `/guitar-guides/` is a hand-written landing page listing guides (one entry today — a static list, not data-driven; revisit if/when a second guide makes that worth it).
- Each guide is its own folder with its own `data.js` array; CSS/JS are shared across all guides.
- Cloudflare's static-assets serving handles directory-style URLs (`/guitar-guides/friedman-naked-amp/` → that folder's `index.html`) with no worker route changes needed — confirmed via `worker/index.js`'s `notFound` handler, which only intervenes on true 404s.
- Homepage (`src/index.html`) gets a 4th `.link-card` — "Guitar Guides" → `/guitar-guides/` — same markup/animation pattern as the existing YouTube/Instagram/LinkedIn cards.

## 2. Visual theme

Extends the homepage's existing design system — no new palette:

- Background: dark chassis (`#0c0c0d` / `--gold` / `--text` / card-glass tokens already defined in `src/index.html`'s inline `<style>`; promote the shared ones into `guitar-guides.css` as CSS custom properties rather than re-declaring).
- Cards: same frosted-glass `.link-card`-style treatment (blur, subtle border, gold left-bar accent) applied to era-history cards instead of link rows.
- Spec markers: a small gold dot (`●`) per spec label, in place of a literal knob graphic — a light nod to the amp-panel motif without introducing a second visual language.
- Theme tokens are declared under a `data-theme="studio"` attribute on the page root so a future alternate skin (a more literal chassis/cream-panel look, discussed and explicitly deferred) can be added later as a second attribute value without restructuring the CSS. **Only the "studio" (current homepage) skin ships now — no toggle UI, no second skin built yet.**
- Layout: hero (kicker "GUITAR GUIDES", title, one-line dek) followed by a vertical stack of era cards connected by a thin vertical gold-gradient line (echoes the homepage's divider-gem styling), one card per `data.js` entry.

## 3. Content — `data.js` entries

Schema per entry: `{ id, kicker, years, title, dek, body, quote?: { text, attribution }, specs: [{ label, value }], sources: [ "citation string" ], media: { photo, video } }`.

### Entry 1 — `original`

- **kicker:** "THE ORIGINAL AMP"
- **years:** "Late 1990s"
- **title:** "The Amp Before the Amp"
- **dek:** "Before there was a production 'Naked,' there was one guitar tech's custom-modified Marshall — built by Dave Friedman for Billy Howerdel."
- **body:** Billy Howerdel — then working as a guitar tech for acts including Fishbone, David Bowie, Smashing Pumpkins, Nine Inch Nails, and Guns N' Roses — had Dave Friedman build him a one-off amp in the late 1990s. Friedman took the preamp character of a Naylor Superdrive 60 that Howerdel loved and merged it with the power-amp section of a 100-watt Marshall head. That amp is what Howerdel used to record A Perfect Circle's debut, *Mer de Noms* (2000). **Sources disagree on the donor Marshall itself:** Premier Guitar's 2010 review identifies it as a 1978 JMP "Super Lead" 100-watt head, and Premier Guitar's own 2017 Rig Rundown coverage of Howerdel's live rig independently repeats the same 1978 Super Lead identification — two separate Premier Guitar pieces, six years apart, agreeing. A single 2008 forum post (unattributed to Friedman or Howerdel directly) instead describes a 1979 JMP 2203. Both claims are presented here rather than silently resolved, though the Super Lead claim now has the stronger paper trail. **On the "Naked" name:** Howerdel himself refers to this amp as the "Naked Head" in a November 2022 Guitar World interview — so the name is directly tied to him, not just the later commercial product — but the specific "bare, uncovered chassis" origin story for *why* it's called that still has no confirmed primary-source citation and is noted as received wisdom rather than documented fact.
- **quote:** `{ text: "He really loved this Naylor Superdrive 60 amplifier, but he wanted to merge it a little bit with his 100-watt Marshall.", attribution: "Dave Friedman, Guitar.com interview" }`
- **specs:**
  - `{ label: "Donor amp", value: "Disputed — 1978 Marshall JMP Super Lead 100W (Premier Guitar, 2010 & 2017) vs. 1979 JMP 2203 (unattributed forum post, unconfirmed)" }`
  - `{ label: "Preamp character", value: "Naylor Superdrive 60-style front end" }`
  - `{ label: "Power section", value: "100W Marshall" }`
  - `{ label: "Recorded", value: "A Perfect Circle, Mer de Noms (2000)" }`
- **sources:**
  - `"Dave Friedman, interview — Guitar.com, 'Dave Friedman talks motivation and sound' (https://guitar.com/features/interviews/dave-friedman-amplifiers/)"`
  - `"Premier Guitar, 'Rack Systems Brown Eye and Naked Amplifier Reviews,' Jordan Wagner, Aug. 17 2010 (https://www.premierguitar.com/gear/rack-systems-brown-eye-and-naked-amplifier-reviews)"`
  - `"Premier Guitar, 'Rig Rundown - A Perfect Circle,' May 10 2017 — article text: 'a Dave Friedman-modded 1978 100-watt Marshall Super Lead... reworked the preamp section to sound and react similarly to a 60-watt Naylor head' (video: https://www.youtube.com/watch?v=WxoHvr2ICYA, channel confirmed as Premier Guitar via YouTube oembed)"`
  - `"Guitar World, Billy Howerdel interview tied to 'What Normal Was,' reported Nov. 2022 (https://www.guitarworld.com/features/billy-howerdel-what-normal-was) — names the amp the 'Naked Head'; full article text not independently re-fetched, so treat as confirming the name/attribution but not as a verbatim quote"`
  - `"Rig-Talk forum, 'Naylor Dual 60 & Marshall mod by Dave Friedman' (https://www.rig-talk.com/forum/threads/naylor-dual-60-marshall-mod-by-dave-friedman.29506/) — forum post, unverified, cited only for the 2203 claim"`
  - `"Wikipedia, 'Billy Howerdel' — general biographical/timeline cross-check (https://en.wikipedia.org/wiki/Billy_Howerdel)"`
- **media:** `{ photo: "PENDING — see image sourcing list below", video: "PENDING" }` (the Rig Rundown video that documents this era lives in the new "Rig & Riff Rundown" section below rather than duplicated here)

### Entry 2 — `naked-original-run`

- **kicker:** "ORIGINAL RUN"
- **years:** "Late 1990s – 2000s"
- **title:** "Naked Amplifiers — The Original Run"
- **dek:** "Word got around. Friedman built a small clone run of Howerdel's amp under the 'Naked Amplifiers' name — how small, exactly, depends on who you ask."
- **body:** Off the back of Howerdel's amp, Friedman built a limited clone run branded "Naked Amplifiers." **Unit counts conflict between sources and are presented as-is rather than resolved:** Friedman's own recollection describes "a few amps for the US, and a small run of amps for Japan, like a dozen amps or so" — implying a total somewhat above a dozen; Premier Guitar's 2010 review instead describes the entire original run as "around a dozen." A commonly cited figure of 18 total units could not be verified against any source found in this research and should not be treated as confirmed. A later limited reissue was sold through the retailer Tone Merchants around 2010. Forum teardown discussion (unverified against an official schematic) describes phase-inverter voltage variants, a tube-buffered effects loop positioned after the treble control, and EL34 power tubes biased around 70%.
- **quote:** `{ text: "There was a short period of time that I made a run of amps called Naked Amplifiers that were clones of that original amp.", attribution: "Dave Friedman, Guitar.com interview" }`
- **specs:**
  - `{ label: "Unit count", value: "Disputed — Friedman: 'a few US + about a dozen for Japan'; Premier Guitar: ~12 total. A commonly cited '18' figure is unverified." }`
  - `{ label: "Distribution", value: "Primarily Japan, small US allotment; limited reissue via Tone Merchants, c. 2010" }`
  - `{ label: "Phase inverter", value: "Variants noted at 330V / 370V / stock 398V — per forum teardown, unverified against an official schematic" }`
  - `{ label: "FX loop", value: "Tube-buffered, positioned after the treble control" }`
  - `{ label: "Power tubes", value: "EL34, biased ~70%" }`
- **sources:**
  - `"Dave Friedman, interview — Guitar.com (https://guitar.com/features/interviews/dave-friedman-amplifiers/)"`
  - `"Premier Guitar, 2010 review (https://www.premierguitar.com/gear/rack-systems-brown-eye-and-naked-amplifier-reviews)"`
  - `"The Amp Garage forum, 'Friedman Naked Amp schematic?' (https://ampgarage.com/forum/viewtopic.php?t=34633) — forum technical discussion, unverified against an official schematic"`
- **media:** `{ photo: "PENDING — see image sourcing list below", video: "https://www.youtube.com/watch?v=pk6vQsP6qRI" }` ("Friedman Naked Amp Very Rare Amp!" — appears to show an original-run unit)

### Entry 3 — `naked-mk2`

- **kicker:** "LIMITED EDITION"
- **years:** "2020"
- **title:** "Naked MK2 — Custom Shop Limited Edition"
- **dek:** "Twenty years on, Friedman's Custom Shop revisited the design as a limited-edition MK2 — cosmetically styled as a nod to the late-'70s Marshalls that started it all."
- **body:** In 2020, Friedman Amplification's Custom Shop produced a limited-edition "Naked MK2": 100 watts, two footswitchable channels (clean/overdrive) sharing a single 3-band EQ, a notably sensitive Presence control, and a series effects loop. Cosmetically it nods to late-1970s Marshall Super Leads — large rocker Power/Standby switches, white piping instead of gold. Custom Shop demo units have been shown with a Celestion Alnico Cream (90W) speaker, a Vintage 30, and an optional bright-switch modification. No production-unit count for this run was found in any source; given the "Limited Edition" framing it was likely a small Custom Shop batch, but that is an inference, not a documented figure.
- **specs:**
  - `{ label: "Power", value: "100W" }`
  - `{ label: "Channels", value: "2, footswitchable (clean/overdrive), shared 3-band EQ" }`
  - `{ label: "Presence control", value: "Notably sensitive, per demo commentary" }`
  - `{ label: "FX loop", value: "Series" }`
  - `{ label: "Speaker options demoed", value: "Celestion Alnico Cream (90W), Vintage 30" }`
  - `{ label: "Unit count", value: "Not documented — likely a small Custom Shop batch; unconfirmed" }`
- **sources:**
  - `"My Les Paul Forum, 'NAD – Friedman Custom Shop (Limited Edition) – Naked MK2' (https://www.mylespaul.com/threads/nad-friedman-custom-shop-limited-edition-naked-mk2.442838/) — forum post, full text blocked on fetch, cited for the model name/year/framing only"`
  - `"Marshall Amp Forum, 'Friedman Naked Mk2 vs. Bogner Modded Soldano SLO-100' (https://marshallforum.com/threads/friedman-naked-mk2-vs-bogner-modded-soldano-slo-100.123961/) — forum discussion"`
  - `"YouTube, Friedman Amplification Custom Shop demo videos — see media list below for individual video citations of speaker/mod variants"`
- **media:** `{ photo: "PENDING — see image sourcing list below", video: "https://www.youtube.com/watch?v=CwH_Wc4Zq5g" }` (Custom Shop MK2 demo; four more MK2 demo videos are listed in the sourcing list below for optional secondary embeds)

### Entry 4 — `today`

- **kicker:** "TODAY"
- **years:** "2020 – present"
- **title:** "Where It Stands Now"
- **dek:** "The Naked has never been a standing catalog item — it surfaces, then disappears again."
- **body:** As of this research, the Naked does not appear in Friedman Amplification's current product catalog — a direct site search for "naked" on friedmanamplification.com returns no results, confirming it is not part of the standing lineup. Original-run and MK2 units do circulate on the resale market (a Reverb listing for a "Friedman Naked 2009" unit was located), but this research could not retrieve current asking prices — that page blocked automated access. Anyone quoting current resale pricing should check Reverb directly rather than relying on this page.
- **specs:**
  - `{ label: "Current catalog status", value: "Not listed on friedmanamplification.com (verified via direct site search)" }`
  - `{ label: "Resale market", value: "Circulates via Reverb/collectors; pricing not confirmed in this research pass" }`
- **sources:**
  - `"friedmanamplification.com — direct site search for 'naked', no results, checked 2026-07-29"`
  - `"Reverb listing, 'Friedman Naked 2009' (https://reverb.com/item/64661916-friedman-naked-2009) — existence confirmed, price/condition not retrievable (blocked)"`
  - `"Reverb, Friedman brand page (https://reverb.com/brand/friedman?product_type=amps) — general market context only, not Naked-specific pricing"`
- **media:** `{ photo: "PENDING — see image sourcing list below", video: "PENDING" }`

## 3a. Rig & Riff Rundown videos (new section on the guide page)

A dedicated section after the era timeline, titled "Watch: Rig & Riff Rundown" — Howerdel's gear discussed and played in his own words, distinct from the disputed-facts era cards above. Backed by a small `data.js` array (`RUNDOWN_VIDEOS`), rendered by `guitar-guide.js` as three video cards, each a real, verified YouTube embed:

- `{ title: "Rig Rundown — A Perfect Circle", url: "https://www.youtube.com/watch?v=WxoHvr2ICYA", source: "Premier Guitar, May 10 2017", note: "Full rig walkthrough. Describes the Friedman-modded 1978 Marshall Super Lead reworked with a Naylor-style preamp — the same amp lineage as the Naked — though the video's own text doesn't use the 'Naked' brand name. Per the site owner's direct viewing of the video's on-camera footage (not corroborated by the written companion article, which only describes one head-format amp): Howerdel owns more than one of these rack-mounted units, and two are part of his main touring rig alongside a two-input Marshall 2203 'Lead MkII' (identified by its front control panel layout). This detail is owner-sourced from the video itself, not from any text this research could independently fetch — flag with a 'per Rig Rundown video, timestamp TBD' citation on the page, and re-confirm the exact timestamp before treating it as settled." }`
- `{ title: "Riff Rundown — \"Judith\"", url: "https://www.youtube.com/watch?v=AmxgaC9bp1E", source: "Premier Guitar, Dec 23 2018", note: "Riff/tutorial format; no amp discussion." }`
- `{ title: "Riff Rundown — \"So Long, and Thanks for All the Fish\"", url: "https://www.youtube.com/watch?v=2n3JBz2OL5Q", source: "Premier Guitar, Nov 18 2018", note: "Riff/tutorial format; no amp discussion." }`

All three channel identities were confirmed via YouTube's oembed endpoint (author_name: "Premier Guitar") rather than search snippets alone, per the verification rule for this content.

**Explicitly excluded** (research couldn't clear these for use — noted here so a future pass knows what was considered and rejected, not just omitted silently):
- "5 Sounds That Built A Perfect Circle" (Premier Guitar channel) — the only date found for it could not be independently verified and looked like a possible search-summary artifact; excluded until the date and content are confirmed directly.
- Gibson TV's "Riff Lords: Billy Howerdel of A Perfect Circle" (https://www.youtube.com/watch?v=64IzbxVpV2E, April 4 2024) — a legitimate gear/riff format but a different channel/franchise (Gibson, not Premier Guitar) and no Friedman amp mention found; left out as out-of-scope for a "Rig & Riff Rundown" section specifically, available as a future addition if the site owner wants broader Howerdel video coverage.

## 4. Media handling

- **Video:** real YouTube URLs go directly into `media.video` (per-era) or `RUNDOWN_VIDEOS` (the Rig & Riff Rundown section, §3a) — `guitar-guide.js` renders them as standard YouTube iframe embeds (no hotlinking concern; this is normal embedding of YouTube's own player).
- **Photos:** none hotlinked from third-party sites. The numbered list below is handed to the site owner for licensing/attribution review before anything is downloaded and committed to `src/assets/images/guitar-guides/friedman-naked-amp/`. Until reviewed, `media.photo` stays `"PENDING"` with an inline comment in `data.js` pointing at the relevant numbered item.

**Image sourcing list (for review before download):**

1. Reverb listing photos — `https://reverb.com/item/64661916-friedman-naked-2009` — photos of a 2009-era original-run unit's chassis/cosmetics — Reverb listing photo, rights unclear (check with Reverb/seller) — suggested filename: `naked-original-run-2009-reverb.jpg`
2. Premier Guitar 2010 review photography — `https://www.premierguitar.com/gear/rack-systems-brown-eye-and-naked-amplifier-reviews` — editorial product photography from the magazine review (covers both Brown Eye and Naked — confirm which shots are the Naked before using) — magazine editorial photo, contact Premier Guitar re: reuse — suggested filename: `naked-review-2010-premierguitar.jpg`
3. Guitar FX Depot rig photo — `https://guitarfxdepot.com/rigs/billy-howerdels-guitar-rig/` — purported photo of Howerdel's live rig, possibly including the amp — gear-blog photo, sourcing/rights unclear, verify before use — suggested filename: `howerdel-live-rig-guitarfxdepot.jpg`

**Additional MK2 demo videos found (optional, not required for launch):**

- `https://www.youtube.com/watch?v=qrm2O4JnoqE` — MK2 with Vintage 30 speaker
- `https://www.youtube.com/watch?v=Ix3Un3ZfFM0` — MK2 with Celestion Alnico Cream
- `https://www.youtube.com/watch?v=8mRzm45X3IM` — MK2 bright-switch mod demo
- `https://www.youtube.com/watch?v=zwiTPMmc7qc` — MK2 vs. Custom 50 comparison

## 5. Homepage change

Add two new `.link-card` entries in `src/index.html`, after LinkedIn, before the closing `.cards` div — same markup pattern (icon bubble, platform/label text, arrow) as the existing three:

- **Guitar Guides** → `/guitar-guides/`. No new icon asset needed; use a simple text/emoji or inline SVG glyph consistent in weight with the existing three SVG icons (final glyph choice left to implementation).
- **Reverb** → `https://reverb.com/shop/anthony-best` (`target="_blank" rel="noopener noreferrer"`, matching the external-link pattern already used for YouTube/Instagram/LinkedIn). Reverb's brand icon (an "R" wordmark) can follow the same inline-SVG treatment as the existing three, or fall back to a simple glyph if a clean SVG isn't readily available — final call left to implementation.

Also add `https://reverb.com/shop/anthony-best` to the homepage's existing JSON-LD `Person.sameAs` array (`src/index.html`), alongside Instagram/LinkedIn/YouTube — same pattern, no new schema needed.

## 6. SEO / housekeeping

- Add `<link rel="canonical">`, Open Graph, Twitter Card, and (for the guide page) `Article`-type JSON-LD to both new pages, following the pattern already established on the homepage and documented in the GA4/SEO spec (`2026-07-17-ga4-seo-design.md`).
- Both new pages load the existing shared `/assets/js/analytics.js` (no new tracking file).
- Add both new URLs to `src/sitemap.xml` (`/guitar-guides/`, `/guitar-guides/friedman-naked-amp/`), `lastmod` 2026-07-29.
- Add two route checks to `tests/test_site.py`'s `TestRoutes` class (both new URLs return 200), matching the existing pattern.

## 7. Verification plan (no test framework beyond the existing smoke suite)

- `data.js` is valid JS: no trailing commas, matching brackets (mirrors the original spec's requirement).
- Open both new pages locally (`npx serve src/`) and confirm the renderer produces all four era cards correctly, YouTube embeds load, and the homepage's new card links correctly.
- Run `tests/test_site.py` locally against a local server or after deploy to confirm the two new routes return 200.
- Manual accessibility pass: alt text on any images once added, iframe `title` attributes on video embeds, contrast check (reuses homepage's already-adequate palette).

## Research gaps (not for the public page — flagged for the site owner)

These came back inconclusive and were deliberately left unresolved rather than guessed at; a future research pass could target them specifically:

1. The "18 units" figure could not be verified anywhere.
2. Several forum threads returned access errors (403/paywall) and were never actually read: Harmony Central ("Naked Amps - APC/Dave Friedman/RACKSystems"), the Fractal Audio Forum "Naked Poll" thread, My Les Paul Forum's MK2 NAD thread (full text), and a Gear Page thread on Howerdel's tone.
3. The full text of Guitar World's Dave Friedman feature (by Charlie Wilkins) was never directly retrieved — only search-indexed excerpts. The same is true of the separate Nov. 2022 Guitar World *Howerdel* interview (§3, Entry 1) — its "Naked Head" naming is usable, but treat any more specific claim from that article as needing a direct re-read first.
4. A Howerdel quote about "power tubes and biasing" is very likely real but its exact originating interview couldn't be pinned down — deliberately not used as an attributed quote anywhere in this content.
5. The "bare metal chassis" naming story has no primary-source confirmation, even though the name itself ("Naked Head") is now confirmed as Howerdel's own usage.
6. Current Reverb resale pricing for both the original run and the MK2 couldn't be captured (bot-blocked) — needs a manual look.
7. Whether the word "Naked" is actually spoken/shown on-camera in the 2017 Rig Rundown video wasn't verified (only the article text was checked) — a human re-watch could timestamp it if that matters for the page copy.
8. The multi-unit rack-mounted rig detail (two Naked-lineage units + a two-input 2203 Lead MkII in Howerdel's main touring rig, §3a) is owner-sourced from direct viewing of the Rig Rundown video — the written companion article describes only one head-format amp and doesn't corroborate it. Not independently verified by this research; a timestamp in the video would firm this up.
