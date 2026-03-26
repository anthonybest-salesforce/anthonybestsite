# DNS Backup — anthonybest.com

**Registrar:** Squarespace
**Renews:** December 14, 2026 — $20/yr
**Domain lock:** OFF (ready to transfer)

---

## Squarespace defaults — DELETE these after migration cutover

| Host | Type | Data |
|------|------|------|
| @ | A | 198.185.159.144 |
| @ | A | 198.49.23.144 |
| @ | A | 198.49.23.145 |
| @ | A | 198.185.159.145 |
| www | CNAME | ext-sq.squarespace.com |
| _domainconnect | CNAME | _domainconnect.domains.squarespace.com |

---

## Google Workspace MX — KEEP ALL (email routing)

| Host | Type | Priority | Data |
|------|------|----------|------|
| @ | MX | 1 | aspmx.l.google.com |
| @ | MX | 5 | alt1.aspmx.l.google.com |
| @ | MX | 5 | alt2.aspmx.l.google.com |
| @ | MX | 10 | alt3.aspmx.l.google.com |
| @ | MX | 10 | alt4.aspmx.l.google.com |

---

## Google Workspace auth — KEEP ALL (email authentication)

| Host | Type | Data |
|------|------|------|
| @ | TXT | v=spf1 include:_spf.google.com ~all |
| google._domainkey | TXT | v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmVISZILBR17eO+MEALPpnK+T4kMumCZTuRoOdURjUNlNlEqQrmu6YDFvJWaa0c5nDZu6grHvjnEuiX/66qS+ZcsGtGhy3druEpyuduUd7vYTBazDO5ajKHQrnVp8kuBTbR700OTJrlFzLvYqmsUSqpKM4sDBkq2JihBnOrx+qqB71gtifoY4bF68zZAzistM5sYz2BlekfcYCpJ/zTBXsxzWaSUwH6THqk+mAWoQXu8i6ATagVL/gjjYm5bDfglkfsB+uOs3FVRUgxnarWaZfYdb/OCDlESPRuraZTHKApJt1fsaD4SVge0rG+q/plsxe6tVyD1QaaKpl0/JFqtE/wIDAQAB |
| _dmarc | TXT | v=DMARC1; p=reject; rua=mailto:postmaster@anthonybest.com, mailto:dmarc@anthonybest.com; pct=100; adkim=s; aspf=s. |
| @ | TXT | google-site-verification=fHV1YJCQk6T16e6TcrdIj2fixWnlyD4-_bBIoRd7YCc |

---

## Google hosted services — KEEP (mail/docs/calendar shortcuts)

| Host | Type | Data |
|------|------|------|
| mail | CNAME | ghs.googlehosted.com |
| docs | CNAME | ghs.googlehosted.com |
| calendar | CNAME | ghs.googlehosted.com |

---

## Salesforce / Pardot — KEEP ALL (email campaigns)

| Host | Type | Data |
|------|------|------|
| reply.mcdo | CNAME | reply.mcdo.anthonybest.com.inbound.cdp2.8tgtt5.mx.salesforce.com |
| anonymous.mcdo | CNAME | anonymous.mcdo.anthonybest.com.inbound.cdp2.8tgtt5.mx.salesforce.com |
| fbl.mcdo | CNAME | fbl.mcdo.anthonybest.com.inbound.cdp2.8tgtt5.mx.salesforce.com |
| leave.mcdo | CNAME | leave.mcdo.anthonybest.com.inbound.cdp2.8tgtt5.mx.salesforce.com |
| bounce.mcdo | CNAME | bounce.mcdo.anthonybest.com.inbound.cdp2.8tgtt5.mx.salesforce.com |
| s1-e360-00dkx00000lqazd._domainkey.mcdo | CNAME | s1-e360-00dkx00000lqazd.mcdo.anthonybest.com.dkim.cdp2.8tgtt5.mx.salesforce.com |
| s2-e360-00dkx00000lqazd._domainkey.mcdo | CNAME | s2-e360-00dkx00000lqazd.mcdo.anthonybest.com.dkim.cdp2.8tgtt5.mx.salesforce.com |
| s3-e360-00dkx00000lqazd._domainkey.mcdo | CNAME | s3-e360-00dkx00000lqazd.mcdo.anthonybest.com.dkim.cdp2.8tgtt5.mx.salesforce.com |
| _dmarc.mcdo | TXT | v=DMARC1;p=reject;adkim=r;aspf=r;pct=100; |

---

## Existing Heroku subdomains — KEEP

| Host | Type | Data |
|------|------|------|
| new | CNAME | synthetic-shark-5qnqq5wba1ie8ii2lj2i5q3f.herokudns.com |
| se | CNAME | molecular-apatosaurus-9zziowvdfj8cpclr5ivj6ier.herokudns.com |
| dse | CNAME | systematic-arugula-ntjx4el88fk54b1usrklh7y1.herokudns.com |
