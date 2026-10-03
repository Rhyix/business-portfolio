# Deployment notes

Work that cannot be completed from inside the repository, because it depends on
information the project owner still has to supply. Nothing here is a bug; each
item is deliberately left unbuilt rather than filled with a placeholder that
would look production-ready without being correct.

These notes used to live as comments in `index.html` and were moved here so the
shipped HTML carries no internal status.

---

## 1. Production domain

The domain is undecided, and it is not present anywhere in the repository. Nine
metadata values depend on it. **One decision unblocks all nine.**

### `index.html`

Open Graph requires absolute URLs, so `og:url` and `og:image` are absent rather
than shipped as relative paths no platform can resolve. Once the domain is
fixed, add inside `<head>`:

```html
<link rel="canonical" href="https://DOMAIN/" />
<meta property="og:url" content="https://DOMAIN/" />
<meta property="og:image" content="https://DOMAIN/<social-card>" />
<meta property="og:image:alt" content="AETEX Tech Solution" />
<meta name="twitter:image" content="https://DOMAIN/<social-card>" />
```

`og:image` and `twitter:image` also depend on item 3 below.

### JSON-LD

The `Organization` block in `index.html` carries `name`, `description`, `email`
and `telephone`. `url` and `logo` still need absolute URLs and remain omitted
rather than invented. `address` stays out permanently: the business is remote,
and "Remote" is not a postal address — inventing one to satisfy the schema
would be worse than leaving it absent.

```jsonc
"url": "https://DOMAIN/",
"logo": "https://DOMAIN/brand/aetex-logo-1.png"
```

An `Organization` block without `url` is a foundation, not a working rich
result — search engines largely need it to tie the entity to the site.

### `public/robots.txt`

The file is deliberately limited to the public crawl policy and carries no
comments, so nothing about the project's internal state is served to visitors:

```
User-agent: *
Allow: /
```

Nothing is disallowed, and that is intentional. CSS, JavaScript and images all
have to be fetchable for a renderer to understand the page, and the demo
applications only exist once their JavaScript has run. The demos' inner pages
are kept out of the index with a `noindex` tag instead - see item 4 for why a
`Disallow` rule would not achieve the same thing.

**Blocked on the domain:** a `Sitemap` reference must be an absolute URL, so it
is left out rather than guessed. Once the domain is fixed, publish
`public/sitemap.xml` and append:

```
Sitemap: https://DOMAIN/sitemap.xml
```

### `public/sitemap.xml`

Not published. An XML sitemap requires absolute `<loc>` values, so publishing
one now would mean serving fabricated URLs from a live endpoint.

When the domain is known, it needs exactly these **8** entries. Every path below
is verified against the real route registry (`src/data/demos/*/navigation.ts`
and `src/App.tsx`) — do not add others:

```
/
/solutions/integrated-business-management-platform
/solutions/business-management-system
/solutions/human-resource-management
/solutions/recruitment-management
/solutions/inventory-management
/solutions/appointment-scheduling
/solutions/administrative-dashboard
```

Do **not** include hash fragments (`#home`, `#services`, …): they are part of
the same document and are not indexed separately. Do **not** include the 60 demo
sub-routes — see item 4. Do not invent `lastmod` dates.

---

## 2. Contact details and form delivery

### Contact details — resolved

`src/data/company.ts` now carries the real business details. Nothing here is
outstanding; the table is kept as a record of what the values are and where
they come from.

| Field | Value |
| --- | --- |
| `email` | `aetextechsolutions@gmail.com` |
| `phone` | `+63 961 394 6736` (links derive `tel:+639613946736`) |
| `location` | `Remote` — accurate, not a placeholder |

All twelve consumers — Contact, Footer, CallToAction, FormSuccess — read from
that one source, so these are changed in a single place.

### Form delivery — implemented, awaiting a key

The contact form posts directly to **Web3Forms**, which delivers the enquiry to
`aetextechsolutions@gmail.com`. All provider-specific code is isolated in
`src/lib/submitEnquiry.ts`.

A managed endpoint was chosen because it is the only arrangement that delivers
real mail while the deployment host is still undecided (item 1): it needs no
server, no serverless runtime and no verified sending domain, and it ships no
private credential. If a host is later chosen and you would rather own the
endpoint, rewriting that one module is the whole migration.

**No Gmail password, Gmail app password or SMTP credential is used anywhere in
this project, and none should ever be added.**

#### Required environment variable

```
VITE_WEB3FORMS_ACCESS_KEY=<key from the Web3Forms dashboard>
```

Set it in `.env.local`, which git ignores. `.env.example` documents it and is
committed; the real key never is.

This key is **client-visible by design** — the browser calls the provider
directly, so it is compiled into the bundle. That is not a leak. It authorises
one thing only: delivering a submission to the address it is registered
against. It cannot read mail, redirect delivery, or send anywhere else. It is
not a password, and nothing resembling one belongs in a `VITE_` variable, all
of which are readable by anyone who loads the site.

#### Status

External setup is complete. The account exists, the address is verified, and
the key is installed in `.env.local`.

An end-to-end test was run against the production build on 2026-10-03. A real
submission returned HTTP 200 and `{"success": true, "message": "Form submitted
successfully!"}`, with Web3Forms echoing back all five fields, the `replyto`
and the subject. A second submission with the honeypot deliberately filled was
rejected by the provider with HTTP 400 ("Honeypot Error"), and the form showed
a delivery failure rather than a success — confirming both directions.

**Provider acceptance is verified; final inbox receipt is confirmed by the
account owner**, since nothing in this repository can read the mailbox.

The failure behaviour is worth keeping in mind when changing this code: with no
key configured the form reports that the enquiry was not sent. It never reports
a success it has not been given, and that property is the point of the module.

#### If delivery ever needs re-establishing

1. Create a Web3Forms account using `aetextechsolutions@gmail.com`.
2. Verify that address.
3. Copy the access key into `.env.local`.
4. Re-run the end-to-end test and confirm the enquiry arrives.

---

## 3. Brand assets in the shapes the web needs

Two separate gaps, same root cause: the only artwork in the project is a wide
wordmark, and neither a social card nor a favicon is that shape.

### Social preview image

**A dedicated OG/social preview asset is required.**

The only images in the project are `public/brand/aetex-logo-1.png` and
`-2.png`, both 948×200 (4.74:1). Social cards want roughly 1200×630 (1.91:1).
Neither file is suitable, and the official artwork must not be cropped, padded
or stretched to fake one.

`twitter:card` therefore stays `summary`. `summary_large_image` without a valid
large image renders worse, not better. Until the asset exists, shared links show
no preview image.

### Favicon

`index.html` points `rel="icon"` at `/brand/aetex-logo-1.png`. That is real
brand artwork and it resolves correctly, but it is a stopgap: at 4.74:1 the
wordmark renders roughly 16x3px in a browser tab and is illegible there.

A **dedicated square brand mark** is the proper fix, and no official one exists.
The placeholder `public/favicon.svg` that previously filled this role (a dark
rounded square with a letter "A") was removed and is not a substitute — it was
generic scaffolding, not AETEX artwork.

As with the social card, do not crop, pad or letterbox the official wordmark to
manufacture one.

---

## 4. Demo route indexing (implemented — background)

The seven demos expose **67** crawlable URLs, not seven.

- The **7 demo root routes** stay indexable. They are genuine destinations,
  internally linked from the Solutions section, with distinct titles.
- The **60 sub-routes** receive `noindex, follow` via `DemoShell`.

Reasoning: `Dashboard`, `Reports` and `Settings` each appear in all seven demos,
and 43 of the 67 URLs share a title with another app, over tables of fictional
records with no standalone context — thin, duplicated content. `follow` is kept
so their links still lead crawlers back to the marketing page.

This is a `noindex` meta tag rather than a `robots.txt` `Disallow` on purpose:
`Disallow` stops crawlers reading the page at all, which also stops them seeing
the `noindex`, so pages already indexed can stay indexed.

Root detection reuses the same test `src/App.tsx` routes with
(`path === basePath`), plus trailing-slash tolerance, so the two cannot drift.

---

## 5. SPA fallback for demo routes

The seven demo routes are real history-API URLs. On a static host with no
rewrite rule, a direct visit or refresh returns a server 404 — verified:
serving `dist/` from a plain static server gives HTTP 404 for
`/solutions/inventory-management` while `/` returns 200.

No host has been chosen, and the options are mutually incompatible, so no
configuration is committed. Once the host is known:

| Host | Configuration |
| --- | --- |
| Vercel | `vercel.json`: `{"rewrites":[{"source":"/(.*)","destination":"/index.html"}]}` |
| Netlify / Cloudflare Pages | `public/_redirects`: `/*  /index.html  200` |
| Nginx | `try_files $uri $uri/ /index.html;` |
| Azure Static Web Apps | `staticwebapp.config.json` with a `navigationFallback` |
| GitHub Pages | `public/404.html` copied from `index.html`, **plus** `base: '/business-portfolio/'` in `vite.config.ts` unless a custom domain is attached — note this also changes every absolute asset path |

A GitHub *remote* does not imply GitHub *Pages*; Vercel and Netlify both deploy
from GitHub.
