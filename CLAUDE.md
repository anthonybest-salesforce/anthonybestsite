# CLAUDE.md

Project context and operating rules for Claude Code in this repo. See [README.md](README.md) for stack/structure details.

## The Council

This app is driven by a standing council responsible for its Recursive Self-Improvement (RSI) — the ongoing cycle of proposing, building, and reviewing improvements to the site. The council exists so decisions get more than one perspective before they're made.

**Members:**

1. **Dev** — implementation feasibility, code quality, technical debt, effort estimates
2. **Data Architect** — data structures, analytics/tracking design (e.g. GA4), content modeling, integrations
3. **UI Builder** — component structure, visual implementation, responsive/cross-browser concerns
4. **UX Designer** — user flows, information architecture, accessibility, interaction design
5. **PM** — scope, priority, tradeoffs, what ships vs. what waits, tying work back to goals
6. **QA** — what could break, edge cases, test coverage, regressions

**CTO** — chairs the council, owns and is accountable for all technical decisions on the app, and makes the final call when members disagree.

### Invocation

When the user says **"ask the council"** (or similar — "get the council's opinion," "what does the council think"), respond by giving a short opinion from each of the six roles on the question at hand, then close with a CTO synthesis: the decision, and why, informed by the roles' input. Keep each role's take brief (1-3 sentences) — the value is in the range of perspectives, not length.

Outside of an explicit "ask the council," default to normal single-voice responses; don't role-play the council unprompted.

## Deployment Process

Written by Dev, approved by PM (per the council process above).

**Feature branches**
- Branch off `main` for all work. Name by type: `feature/<short-name>`, `chore/<short-name>`, `docs/<short-name>`, `test/<short-name>`.
- Never commit directly to `main` — GitHub branch protection blocks direct pushes; every change lands via PR.

**Pull requests**
- Open a PR from the feature branch targeting `main` when the work is ready for review.
- Keep PRs scoped to one change/feature. Use the description to explain *why*, not just what changed.
- No CI status check currently gates merge — the smoke test workflow runs post-deploy, not pre-merge. Verify your change works before opening the PR; don't rely on CI to catch it.
- Branch protection requires a PR but does not currently require an approving review (`required_approving_review_count: 0`) — there's no enforced second reviewer. Acceptable for a single-maintainer repo; revisit if that changes.

**Merge process**
- Merge with `gh pr merge --merge --delete-branch` — a real merge commit, not squash or rebase, matching existing repo history.
- Delete the branch on merge; don't leave stale branches around.
- Force-pushes and branch deletion are disabled on `main` at the GitHub level — never attempt to rewrite `main` history.

**Deploy**
- The site runs on a Cloudflare Worker (`anthonybest-cos`), not Heroku — Heroku is fully decommissioned. See [README.md](README.md) for the architecture.
- Cloudflare Workers Builds push-to-deploy is connected to this repo (confirmed 2026-07-30) — merging a PR to `main` auto-deploys, same as Heroku used to. No manual `wrangler deploy` needed in the normal flow.
  - Note: the live Worker's asset cache can serve a stale `cf-cache-status: HIT` for a few seconds/minutes after deploy even with `max-age=0` — if a post-merge check looks stale, retry with a cache-busting query param before assuming the deploy didn't land.
- **When the user says "commit" or "commit and deploy," verify the change actually landed live** (cache-busted fetch of a changed file) rather than assuming the merge was enough — but the fallback if Workers Builds is ever found disconnected is `npm run build && npm run deploy`.
- After deploy, [.github/workflows/deploy.yml](.github/workflows/deploy.yml) polls the live URL and runs `tests/run_tests.sh` as a post-deploy smoke test. This is diagnostic only — a failure doesn't roll back or block anything; treat it as a signal to go check the live site.

## Documentation & Memory

Written by Dev, approved by PM (per the council process above). Three docs, three distinct jobs — don't let them blur together:

- **[README.md](README.md)** — stable reference: stack, structure, deploy, local dev. Read before starting work in this repo. Update it whenever setup, structure, or the deploy process changes, so it always reflects current reality, not history.
- **[SUMMARY.md](SUMMARY.md)** — chronological project log: status, decisions, session notes, corrections. Consult it for "what happened and why" on past work. Append to it (don't rewrite history) when a session produces a notable decision, fix, or status change.
- **[MEMORY.md](MEMORY.md)** — persistent, repo-committed, cross-agent memory. Because different tools and sessions work this repo over time, MEMORY.md lives in git (not in any single tool's private memory store) so every agent shares the same knowledge. It's topical, not chronological — conventions, gotchas, standing decisions that would otherwise get rediscovered the hard way each session.

**Rule:** before starting nontrivial work, read README.md, recent SUMMARY.md entries, and MEMORY.md for context. When work changes a stable fact, update README.md. When work reaches a notable milestone or decision, append to SUMMARY.md. When work reveals something a future agent needs to know that isn't captured by the other two, add it to MEMORY.md. Keep MEMORY.md entries short and prune ones that go stale.
