# MEMORY.md

Persistent, cross-agent memory for this repo. Unlike [README.md](README.md) (stable reference) or [SUMMARY.md](SUMMARY.md) (chronological log), this is a topical knowledge base — read it before starting nontrivial work, and add to it when you learn something a future agent shouldn't have to rediscover. See the "Documentation & Memory" rule in [CLAUDE.md](CLAUDE.md) for how these three docs divide responsibility.

Keep entries short. Prune ones that go stale rather than leaving them to mislead.

## Conventions & Decisions

- **The Council** governs this app: Dev, Data Architect, UI Builder, UX Designer, PM, QA, chaired by a CTO. Full charter and the "ask the council" invocation rule are in [CLAUDE.md](CLAUDE.md).
- **Deployment**: feature branch → PR → merge commit (`gh pr merge --merge --delete-branch`, not squash) → push to `main` auto-deploys to Heroku. Full rules in [CLAUDE.md](CLAUDE.md).
- **Branch protection** on `main` requires a PR but not an approving review (`required_approving_review_count: 0`) — acceptable for a single-maintainer repo as of 2026-07-17; revisit if that changes.

## Gotchas

- [docs/dns-backup.md](docs/dns-backup.md) holds DNS records (Google Workspace MX, DKIM, SPF, DMARC, Salesforce) that keep email working — never delete or alter DNS-related config without checking against that doc first.
- The post-deploy smoke test ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)) is diagnostic only — it does not gate merges or deploys, and a failure doesn't roll anything back.
