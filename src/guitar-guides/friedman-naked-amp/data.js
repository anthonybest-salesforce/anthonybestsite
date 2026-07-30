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
    title: `The Original`,
    dek: `Before it was ever a product, the Naked was one guy's favor for a friend — a one-off Marshall Dave Friedman built for guitar tech Billy Howerdel.`,
    body: [
      `Back in the late '90s, Billy Howerdel was working as a guitar tech for a murderers' row of acts — Fishbone, David Bowie, Smashing Pumpkins, Nine Inch Nails, Guns N' Roses. He'd fallen for the sound of a Naylor Superdrive 60, so he asked Dave Friedman to build him something that fused that Naylor preamp character with the power section of a 100-watt Marshall head — a 1978 JMP Super Lead, confirmed by Premier Guitar in two separate pieces seven years apart.`,
      `That amp — built for one guy, no name on it, nothing for sale — is what Howerdel plugged into to record A Perfect Circle's Mer de Noms in 2000. One of the defining rock guitar tones of that era, and it came out of a one-off that wasn't even called "Naked" yet.`,
      `Howerdel calls it his "Naked Head" in a 2022 Guitar World interview, and the story behind the name is the kind guitar nerds love: it started out sitting bare — no cabinet, no cosmetics, just the chassis out in the open. Naked.`,
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
      videos: [
        {
          title: `Rig Rundown — A Perfect Circle`,
          url: `https://www.youtube.com/watch?v=WxoHvr2ICYA`,
          source: `Premier Guitar, May 10 2017`,
          note: `Full rig walkthrough. Describes the Friedman-modded 1978 Marshall Super Lead reworked with a Naylor-style preamp — the same amp lineage as the Naked — though the video's own companion article doesn't use the "Naked" brand name. From my own direct viewing of the on-camera footage (not corroborated by the written article, which describes only one head-format amp): Howerdel's touring rig shown here includes two rack-mounted Naked units and the original modded Marshall head itself — all part of the same live setup — visible at the [37:03 mark](https://youtu.be/WxoHvr2ICYA?t=2223).`,
        },
        {
          title: `Riff Rundown — "Judith"`,
          url: `https://www.youtube.com/watch?v=AmxgaC9bp1E`,
          source: `Premier Guitar, Dec 23 2018`,
          note: `Riff/tutorial format; no dedicated amp discussion. I think the head shown on camera here may be a different unit than the one identified in the Rig Rundown video above — not confirmed, flagged for a closer side-by-side comparison.`,
        },
        {
          title: `Riff Rundown — "So Long, and Thanks for All the Fish"`,
          url: `https://www.youtube.com/watch?v=2n3JBz2OL5Q`,
          source: `Premier Guitar, Nov 18 2018`,
          note: `Riff/tutorial format; no dedicated amp discussion. I think the head shown on camera here may be a different unit than the one identified in the Rig Rundown video above — not confirmed, flagged for a closer side-by-side comparison.`,
        },
      ],
    },
  },
  {
    id: 'naked-original-run',
    kicker: 'ORIGINAL RUN · MK1',
    years: 'Late 1990s – 2000s',
    title: `Naked Amplifiers — The Original Run`,
    dek: `Word got around, and Friedman started building clones of Howerdel's amp under the "Naked Amplifiers" name — this is the circuit collectors now call the Mk1.`,
    body: [
      `Once people heard what Howerdel was getting out of that amp, Friedman put together a small clone run under the "Naked Amplifiers" name — roughly a dozen units total, mostly bound for Japan, with a handful staying in the US. This is the Mk1 circuit — the same one that carries through the all-black, ground-up run that came after it, even though that one was built completely differently.`,
      `These were kit-built by Metropoulos Amplification and finished to "Naked spec," with Friedman handling final quality control himself before anything shipped. Each one ran a tube-buffered effects loop tucked in after the treble control and EL34 power tubes biased hot, around 70%.`,
      `A limited reissue surfaced around 2010 through the retailer Tone Merchants, and original-run units still turn up on the resale market today. I've owned one myself — genuinely rare, and genuinely chased by anyone hunting that specific Marshall-meets-Naylor snarl.`,
    ],
    quote: {
      text: `There was a short period of time that I made a run of amps called Naked Amplifiers that were clones of that original amp.`,
      attribution: `Dave Friedman, Guitar.com interview`,
    },
    specs: [
      { label: `Unit count`, value: `Disputed — Friedman: "a few US + about a dozen for Japan"; Premier Guitar: ~12 total. A commonly cited "18" figure is unverified.` },
      { label: `Distribution`, value: `Primarily Japan, small US allotment; limited reissue via Tone Merchants, c. 2010` },
      { label: `Built by`, value: `Reportedly kit-built by Metropoulos Amplification, QC'd by Friedman (sourced by me + secondary forum accounts; not confirmed by Friedman directly)` },
      { label: `Phase inverter`, value: `Variants noted at 330V / 370V / stock 398V — per forum teardown, unverified against an official schematic` },
      { label: `FX loop`, value: `Tube-buffered, positioned after the treble control` },
      { label: `Power tubes`, value: `EL34, biased ~70%` },
    ],
    sources: [
      `Dave Friedman, interview — Guitar.com (https://guitar.com/features/interviews/dave-friedman-amplifiers/)`,
      `Premier Guitar, 2010 review (https://www.premierguitar.com/gear/rack-systems-brown-eye-and-naked-amplifier-reviews)`,
      `The Amp Garage forum, "Friedman Naked Amp schematic?" (https://ampgarage.com/forum/viewtopic.php?t=34633) — forum technical discussion, unverified against an official schematic; a 2024 post in this same thread states "the stock Naked MK1 that Metroamp built for Friedman" had a phase inverter around 398V, cited here for the Metro/Metropoulos claim`,
      `Rig-Talk forum, "New Friedman and Naked Amps Demo and Together" (https://www.rig-talk.com/forum/threads/new-friedman-and-naked-amps-demo-and-together.104565/) — a poster describes their own amp as "a Metro 2203 built by Metropoulos Amps" sent to Friedman for Naked-spec mods; an individual customer's project, not confirmed as the method for the whole commercial run`,
      `Metropoulos Amplification, company history (https://store.metropoulos.net/) — founding year (2004), used to flag the timeline tension against Friedman's "late '90s/early 2000s" dating of this run`,
      `My own firsthand account — describes this run as kit-built by "Metropolis" (likely Metropoulos), with Friedman doing quality control only; not independently confirmed by Friedman`,
    ],
    media: {
      photo: `PENDING — see image sourcing list, item 1 (Reverb listing)`,
      videos: [
        {
          title: `Friedman Naked Amp Very Rare Amp!`,
          url: `https://www.youtube.com/watch?v=pk6vQsP6qRI`,
          source: `TONE WARS`,
        },
      ],
    },
  },
  {
    id: 'ground-up-black-run',
    kicker: 'SECOND RUN · MK1',
    years: '~2014 (my own account; not independently dated)',
    title: `A Second Run — Built From the Ground Up`,
    dek: `A second run broke from the Metro-kit construction entirely — same Mk1 circuit, but all-black and built from the ground up on Friedman's own chassis and parts.`,
    body: [
      `This one's personal: I tracked down and owned one of these amps myself. It's a second run of the Mk1 circuit, distinct in construction from the original Metro-kit clones, finished entirely in black. Instead of starting from a modified Marshall chassis, Friedman built these from scratch on his own chassis and parts — by hand, himself.`,
      `It's a 100-watt, two-channel head: four 12AX7 preamp tubes, four EL34 power tubes, a bright switch, a 3-way saturation switch, and a tube-buffered effects loop with its own return-level control. Neat wrinkle — two footswitchable channels on a unit dated around 2014, a full six years before Friedman's Custom Shop Mk2 made two channels part of an updated circuit.`,
      `Rare doesn't begin to cover it. It took years of hunting to land one, and nothing like it had turned up for sale in ages.`,
    ],
    quote: {
      text: `Is this expensive... yes but this is also very rare. It took me several years to find one, and I have not seen one go up for sale in a long time.`,
      attribution: `From my own Reverb listing for this amp (sold)`,
    },
    specs: [
      { label: `Construction`, value: `Built from the ground up on Friedman's own chassis and parts — not a Marshall conversion — by my own account; unconfirmed independently` },
      { label: `Built by`, value: `Dave Friedman, personally, by my own account — contrasts with the first run's reported kit-built origin` },
      { label: `Finish`, value: `All-black` },
      { label: `Power`, value: `100W` },
      { label: `Channels`, value: `2, footswitchable — six years before the documented Mk2's 2-channel design; relationship, if any, unknown` },
      { label: `Tubes`, value: `4x 12AX7 preamp, 4x EL34 power` },
      { label: `Controls`, value: `Bass, treble, mid, presence, master, pre-amp gain, clean volume, shared global EQ, bright switch, 3-way saturation switch` },
      { label: `FX loop`, value: `Tube-buffered, with return level control` },
      { label: `Unit count`, value: `Unknown — only one confirmed example (mine); no other owners or listings found` },
    ],
    sources: [
      `Reverb, "Friedman Naked 2014 Black" (sold listing; https://reverb.com/item/29695395-friedman-naked-2014-black) — automated fetch blocked (403); full listing text provided directly by me — I was the seller`,
      `YouTube, "Friedman Naked Demo," Mark Day Guitar (https://www.youtube.com/watch?v=cG_tLsskGfU) — channel identity confirmed via YouTube oembed; in my opinion, the closest thing to an official demo of this era's amp`,
      `YouTube, "Friedman Naked - In the Mix," El Dorado Guitars (https://www.youtube.com/watch?v=wlRSld3hKxM) — channel identity confirmed via YouTube oembed; black-finish identification, mine`,
      `My own firsthand account — personal ownership and sale of this amp; my claim that it's a distinct ground-up, Friedman-built-himself second run could not be independently corroborated in this research (no other owners, press, interviews, or forum posts found describing a second/black Naked run)`,
    ],
    media: {
      photo: `PENDING — see image sourcing list (Reverb listing photos)`,
      videos: [
        {
          title: `Friedman Naked Demo`,
          url: `https://www.youtube.com/watch?v=cG_tLsskGfU`,
          source: `Mark Day Guitar`,
          note: `In my opinion, the closest thing to an official demo of this era's amp.`,
        },
        {
          title: `Friedman Naked - In the Mix`,
          url: `https://www.youtube.com/watch?v=wlRSld3hKxM`,
          source: `El Dorado Guitars`,
          note: `Black-finish identification, mine.`,
        },
      ],
    },
  },
  {
    id: 'naked-mk2',
    kicker: 'MK2',
    years: '2020',
    title: `Naked Mk2 — The Updated Custom Shop Build`,
    dek: `Twenty years later, Friedman's Custom Shop revisited the design with an updated circuit — a true one-off, and the only one ever built.`,
    body: [
      `In 2020, Friedman Amplification's Custom Shop built the Naked Mk2 — a genuinely updated circuit, distinct from the Mk1 used in the original run and the all-black ground-up amps that came before it: 100 watts, two footswitchable channels (clean and overdrive) sharing a single 3-band EQ, a wonderfully touchy Presence control, and a series effects loop. Cosmetically it leans hard into the late-'70s Marshall Super Lead look — big rocker Power and Standby switches, white piping instead of gold.`,
      `Confirmed: only one Mk2 was ever built. It made the rounds for a while, borrowed by a handful of other players — including YouTuber Reza Matrix, who put out a demo video that's since been set to private — before eventually being sold back to Dave Friedman himself. The one surviving public demo comes from Michael Nielsen of Big Hairy Guitars, who also had the amp on loan at one point.`,
    ],
    specs: [
      { label: `Circuit`, value: `Updated design — distinct from the Mk1 circuit shared by the original run and the all-black ground-up run` },
      { label: `Power`, value: `100W` },
      { label: `Channels`, value: `2, footswitchable (clean/overdrive), shared 3-band EQ` },
      { label: `Presence control`, value: `Notably sensitive, per demo commentary` },
      { label: `FX loop`, value: `Series` },
      { label: `Speaker options demoed`, value: `Celestion Alnico Cream (90W), Vintage 30` },
      { label: `Unit count`, value: `1 of 1, confirmed — only one Mk2 was ever built, by my own account` },
      { label: `Ownership`, value: `Borrowed by several players over time (including Reza Matrix and Michael Nielsen) before being sold back to Dave Friedman himself, by my own account` },
    ],
    sources: [
      `My Les Paul Forum, "NAD – Friedman Custom Shop (Limited Edition) – Naked MK2" (https://www.mylespaul.com/threads/nad-friedman-custom-shop-limited-edition-naked-mk2.442838/) — forum post, full text blocked on fetch, cited for the model name/year/framing only`,
      `Marshall Amp Forum, "Friedman Naked Mk2 vs. Bogner Modded Soldano SLO-100" (https://marshallforum.com/threads/friedman-naked-mk2-vs-bogner-modded-soldano-slo-100.123961/) — forum discussion`,
      `YouTube, "The Best Amp You CAN'T Get," Michael Nielsen - Big Hairy Guitars (https://www.youtube.com/watch?v=rOP7_M65c_c) — channel identity confirmed via YouTube oembed; the surviving public demo of this exact 1-of-1 unit, filmed while Nielsen had it on loan, by my own account`,
      `YouTube, Reza Matrix — demo of this specific Naked Mk2 unit, filmed while Matrix had it on loan; video has since been set to private and is no longer publicly viewable (as far as I know)`,
      `Rig-Talk forum, "Friedman Naked Mk II" (https://www.rig-talk.com/forum/threads/friedman-naked-mk-ii.211962/) — 2020 thread of forum members reacting to a demo video of this amp; one post references "reza rasp," consistent with Reza's involvement, though the thread itself doesn't state a unit count or confirm the video has since gone private`,
      `Reddit, r/GuitarAmps, "Can we agree that Friedman Naked is the best high-gain amp?" (https://www.reddit.com/r/GuitarAmps/comments/1jgnfbt/can_we_agree_that_friedman_naked_is_the_best_high/) — could not be fetched or independently verified in this research pass (blocked); included on my recommendation as a forum discussion referencing this amp`,
      `My own firsthand account — confirms this is a 1-of-1 build, the loan history to several players, and the eventual sale back to Dave Friedman; not independently corroborated beyond the surviving Nielsen video`,
    ],
    media: {
      photo: `PENDING — see image sourcing list`,
      videos: [
        {
          title: `The Best Amp You CAN'T Get`,
          url: `https://www.youtube.com/watch?v=rOP7_M65c_c`,
          source: `Michael Nielsen - Big Hairy Guitars`,
          note: `The surviving public demo of this 1-of-1 unit — filmed while Nielsen had the amp on loan, before it was eventually sold back to Dave Friedman.`,
        },
      ],
    },
  },
  {
    id: 'today',
    kicker: 'TODAY',
    years: '2020 – present',
    title: `Where It Stands Now`,
    dek: `The Naked has never been a standing catalog item — it shows up, sells out, and disappears again.`,
    body: [
      `You won't find the Naked in Friedman Amplification's current lineup — search "naked" on their site and you'll come up empty. It's never been a shelf item; it comes out in small batches and then vanishes again.`,
      `Original-run and Mk2 units still circulate among collectors — keep an eye on Reverb if you're hunting for one. Just don't expect a sticker price online; amps like this move through word of mouth and patience.`,
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
      videos: [],
    },
  },
];

window.GUIDE_RUNDOWNS = [];
