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
      video: `PENDING`,
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
