# Mercy Wanjau Foundation — mw-foundation.org

The Foundation's website: a fast, accessible, statically prerendered site. It runs on the Foundation's private LiteSpeed/PHP server (forms stored in MySQL) or on Vercel (forms stored in Supabase). See [Hosting](#hosting).

- **Stack:** Vite + React (running on Preact for a smaller bundle) + Tailwind CSS · prerendered to static HTML · forms via PHP + MySQL on the private server, or a Vercel function + Supabase · email via Resend or the server's mail
- **Pages:** Home · Our Work · 5 pillar pages (one template) · Who We Are · News & Stories + story template · Get Involved (Donate / Volunteer / Partner) · Contact · Privacy · Terms · Thank you · 404
- **Content:** Markdown and JSON files in [`content/`](content), editable in the browser at `/admin`

---

## Editing content (no code)

There are two ways to edit. Both end in the same place: a change to a file in this repository, which Vercel publishes automatically in about a minute.

### Option A — the content editor at `/admin` (recommended)

1. Go to **https://mw-foundation.org/admin**.
2. Sign in with a GitHub personal access token (one-time setup — see below).
3. Choose **News & Stories** or **Site content**, edit, and press **Save**.

**One-time setup for each editor:** on GitHub, open *Settings → Developer settings → Fine-grained tokens → Generate new token*, choose the repository `swairua/mw-foundation`, and grant **Contents: Read and write**. Paste the token into the sign-in screen. Use two-factor authentication on the GitHub account.

### Option B — edit files on GitHub

Open the file on github.com, click the pencil icon, edit, and commit.

### What lives where

| To change… | Edit | Notes |
|---|---|---|
| A story | `content/stories/<address>.md` | Frontmatter at the top (title, date, pillars, summary, cover photo), story text below in Markdown. The file name is the web address: `/news/<file-name>`. |
| Add a story | New file in `content/stories/` | Copy an existing story as a template. Set `featured: 1`–`3` to show it on the home page. |
| Home page impact numbers | `content/impact.json` | Enter each confirmed `value`. Until you do, the band shows the documented `interim` figure. |
| Pillar pages | `content/pillars.json` | Text, programmes, statuses, documented facts and photos. Do not change `slug` without adding a redirect. |
| Founder, principles, board, team, reports, policies | `content/about.json` | Put PDFs in `public/documents/` and set `file` to `/documents/name.pdf`. |
| Phone, WhatsApp, email, social links, registration number | `content/site.json` | The WhatsApp button appears automatically once a number is entered. |
| Paybill, account number, gift amounts, card/PayPal link | `content/donate.json` | |
| Partner logos | `content/partners.json` + files in `public/partners/` | The strip is hidden in production until at least one logo exists. |
| Photo alt text, captions, credits, crop focus | `content/media.json` | Every photo needs alt text. `focus` is the part of the photo kept when cropped (e.g. `"60% 40%"`). |
| Privacy policy, terms | `content/pages/*.md` | |

**Placeholders.** Any value that starts with `TODO` appears on the staging site as a highlighted placeholder and is hidden on the live site. Run `pnpm content:check` (or look at the build log) to list everything still outstanding. It exits with an error until the content is complete.

**Photos.** Add originals (JPG or PNG, ideally 2000 px or wider) to `content/images/`. The build creates sharp WebP versions at several sizes, a social-sharing crop, and strips camera metadata such as GPS location. Refer to a photo by its file name without the extension (e.g. `image: french-initiative-village-library`). Photos credited "Unsplash" or "Pexels" in `media.json` are licensed stock; replace them with the Foundation's own photography when available.

**Safeguarding.** Never name children in captions or alt text. Only publish photos of children with school or guardian consent; blur faces where appropriate (the French Initiative video is already blurred).

---

## Development

Requires Node 20+ and pnpm (`corepack enable` installs the pinned version).

```bash
pnpm install
pnpm dev            # http://localhost:8080 — forms work locally (logged to the console without Supabase/Resend keys)
pnpm build          # images → client build → server build → prerender every route to dist/client
pnpm build:server-host  # the same, plus .htaccess and the PHP form endpoint for the private server
pnpm preview        # serve the production build like Vercel does, http://localhost:4173
pnpm test           # form handling + colour-contrast tests
pnpm typecheck
pnpm content:check  # list placeholders and content errors
```

Copy `.env.example` to `.env.local` for local secrets.

### How it works

- `content/` holds all copy and data. `plugins/content.ts` compiles Markdown to HTML at build time, so no Markdown parser ships to browsers.
- `scripts/images.mjs` turns `content/images/*` into responsive WebP files in `public/img/` (git-ignored, rebuilt on every build).
- `scripts/prerender.mjs` renders every route to static HTML with its own title, description, canonical URL, Open Graph image and JSON-LD, then writes `sitemap.xml`, `robots.txt` and `rss.xml`. Each page hydrates with only the JavaScript it needs (route-level code splitting); story bodies are separate chunks.
- `api/forms.ts` is the single serverless endpoint for the volunteer, partner, contact and newsletter forms. The logic is in `api/_lib/forms.ts`: honeypot field, minimum fill time, validation (zod), rate limiting by salted IP hash (memory + Supabase), insert into Supabase, notification to the Foundation and auto-reply via Resend. Forms also work without JavaScript (native POST, then redirect to `/thank-you`).

### Analytics and events

Set `VITE_PLAUSIBLE_DOMAIN` (recommended, cookie-free) or `VITE_GA4_ID` (loads only after the visitor accepts the cookie notice). Custom events: `Donate CTA` (with `location`), `Donation frequency`, `Donation tier`, `Copy Paybill`, `Copy account number`, `Card donation click`, `Donation completed`, `Form submitted` / `Form error` (with `type`), `Newsletter signup`, `WhatsApp click`, `Video play`, `Share`, `Story filter`, `Social click`. In Plausible, add these as goals.

---

## Hosting

The build is plain static HTML, CSS and JavaScript plus one form endpoint, so it runs on either of two set-ups. The pages, redirects and security headers are identical on both (the server rules are generated from `vercel.json`).

| | Option A: private server (current) | Option B: Vercel |
|---|---|---|
| Web server | LiteSpeed/Apache with PHP 7.4+ (e.g. cPanel) | Vercel CDN |
| Forms | `api/forms.php` → MySQL | `api/forms.ts` → Supabase |
| Email | Resend API, or the server's own mail | Resend |
| Build | `pnpm build:server-host` | `pnpm build` (automatic on Vercel) |
| Deploys | GitHub Actions → SFTP/FTPS (`.github/workflows/deploy-server.yml`) | Automatic on every push; preview URL per branch |

### Option A — private server (LiteSpeed/Apache + PHP + MySQL)

1. **Database:** in the control panel create a MySQL database and user (the user needs only SELECT and INSERT), then import `hosting/mysql/schema.sql` in phpMyAdmin.
2. **Configuration:** copy `hosting/php/api/config.sample.php` to **one level above the web root** as `mwf-config.php` (e.g. `/home/<account>/mwf-config.php` when the site lives in `public_html`) and fill in the database, `mail_to`, `mail_from` and a random `rate_limit_salt`. It is never uploaded by the deploy and cannot be downloaded from the web. For reliable email add a Resend API key. Without one, the server's own `mail()` is used; then set up SPF/DKIM for the domain in the control panel so messages aren't marked as spam.
3. **Build and upload:**
   - **Automatic (recommended):** add the secrets listed at the top of `.github/workflows/deploy-server.yml` to GitHub environments named `staging` and `production`. Every push to `main`, including saves in `/admin`, rebuilds and uploads to staging. Production is a manual "Run workflow".
   - **Manual:** for staging run `VITE_SITE_ENV=staging VITE_SITE_URL=https://mw-foundation.ziratech.com pnpm build:server-host` (for production on mw-foundation.org use `VITE_SITE_ENV=production` and leave `VITE_SITE_URL` unset), then upload the *contents* of `dist/client/`, including the hidden `.htaccess` files, to the web root.
4. **Check:** open `/news/<any-story>` and an old address such as `/about-us/` (it should redirect to `/who-we-are`). Submit each form once, confirm the row appears in phpMyAdmin (`form_submissions`) and that the notification email arrives.

Notes:
- The site must sit at the root of its domain or subdomain. Staging is **mw-foundation.ziratech.com** (set `VITE_SITE_URL` to it so share previews and the QR code use that domain). Production will be **mw-foundation.org** once the domain is transferred from the previous developer; until then canonical links in production builds still point there, as the brief requires.
- `.htaccess` forces HTTPS and the bare domain, and sends HSTS with `includeSubDomains`. Make sure every subdomain (e.g. `mail.`, `webmail.`) has a valid certificate (cPanel AutoSSL) before launch. To build for a server without SSL, set `APACHE_FORCE_HTTPS=false`.
- **Back up the existing WordPress site before the first production upload.** The upload replaces the web root.
- Read submissions in phpMyAdmin (`form_submissions`; change `status` to `responded` when handled). Run the retention query in `schema.sql` monthly as a cron job.

### Option B — Vercel + Supabase

1. Import the repository in Vercel (framework preset **Other**; build settings come from `vercel.json`).
2. Set environment variables (**Settings → Environment Variables**):

   | Variable | Production | Preview (staging) |
   |---|---|---|
   | `VITE_SITE_ENV` | `production` | `staging` |
   | `VITE_PLAUSIBLE_DOMAIN` | `mw-foundation.org` | — |
   | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | ✓ | ✓ |
   | `RESEND_API_KEY`, `MAIL_FROM`, `MAIL_TO` | ✓ | ✓ |
   | `RATE_LIMIT_SALT` | random string | random string |

   Staging builds are `noindex` with a `Disallow: /` robots file, show content placeholders, and keep the "Visit previous site" link. Production builds hide placeholders.
3. **Supabase:** create a project (region close to Kenya, e.g. eu-west), then run `supabase/migrations/20261014000000_forms.sql` in the SQL editor. Submissions appear in **Table editor → form_submissions**. Row Level Security is on with no public policies, so only the server can read or write.
4. **Resend:** verify the domain `mw-foundation.org` (adds SPF and DKIM DNS records), then set `MAIL_FROM`, e.g. `Mercy Wanjau Foundation <hello@mw-foundation.org>`.
5. **Domain:** add `mw-foundation.org` and `www.mw-foundation.org` in Vercel (redirect `www` → apex) and update DNS at the registrar. All old WordPress addresses 301-redirect to their new pages (`vercel.json → redirects`, including every story).

### Launch checklist

- [ ] `pnpm content:check` passes, or remaining items are knowingly accepted
- [ ] Legal review of `content/pages/privacy-policy.md` and `terms-of-use.md`
- [ ] Paybill tested with a real KES 10 donation; the name on the confirmation matches `registeredName`
- [ ] Each form submitted once on production; the notification email arrives at `MAIL_TO` and the auto-reply is received
- [ ] `VITE_SITE_ENV=production` on the production environment only
- [ ] Google Search Console: verify the domain and submit `https://mw-foundation.org/sitemap.xml`
- [ ] Old WordPress site taken offline after DNS cut-over; spot-check a few old URLs redirect correctly

---

## Security and reputation (high-profile organisation)

The founder is a senior public official, so the site is built to reduce risk:

- **No public login or CMS on the website itself.** It is static HTML on a CDN; the old WordPress `wp-admin` attack surface is gone. Editing happens through GitHub, protected by each editor's two-factor authentication. Every change is a commit with an author, and can be reviewed and reverted.
- **Strict security headers** (`vercel.json`): HSTS, a Content-Security-Policy allowing only this site's own scripts (plus analytics when enabled), `frame-ancestors 'none'`, `nosniff`, a restrictive Permissions-Policy and a strict Referrer-Policy. The one inline script is pinned by hash; the build fails if it changes without updating the policy. The `/admin` editor loads a version-pinned script verified with Subresource Integrity.
- **Forms:** server-side validation, honeypot, timing check and rate limiting; same-origin check; no raw IP addresses stored; service keys never reach the browser; email content is escaped.
- **Anti-impersonation:** an "official channels" notice on the donate and contact pages and in every auto-reply warns that the Foundation never asks for payment for jobs or support. Tell people to check the Paybill name matches before paying.
- **Independence:** the footer and Who We Are page state that the Foundation is non-partisan, separate from any government office, and that gifts create no expectation of access or influence. Keep a gift acceptance and conflict-of-interest policy and publish it under Who We Are.
- **Privacy (Kenya Data Protection Act, 2019):** consent checkboxes on forms, data minimisation, 24-month retention (`purge_old_submissions()` in the migration), cookie-free analytics by default, and a privacy policy listing every processor. Register with the ODPC as a data controller and add the number to `site.json`.
- **Recommended at launch:**
  - Enable **DNSSEC** and **registrar lock** on the domain.
  - Add a **CAA** record allowing only Vercel's certificate authorities.
  - Publish **SPF, DKIM and DMARC** (`p=quarantine`, moving to `p=reject`) so nobody can send email pretending to be `@mw-foundation.org`.
  - On the **private server**: put the domain behind **Cloudflare** (free plan) for DDoS protection and edge caching, keep **ModSecurity/Imunify360** enabled in cPanel, and use SFTP rather than plain FTP.
  - On **Vercel**: turn on **deployment protection** for preview URLs.
  - Turn on the **Vercel Firewall** (Attack Challenge Mode can be switched on instantly if the site is targeted).
  - Require **pull-request review** on `main` if more than one person edits.
  - Set up uptime monitoring.
- `/.well-known/security.txt` tells researchers how to report vulnerabilities.

## Performance and accessibility

- Prerendered HTML with inlined CSS, two preloaded subset fonts (Latin only), responsive WebP images with explicit dimensions, the hero image preloaded at high priority, and route-split JavaScript (about 55 KB gzipped for the home page).
- Below-the-fold sections use `content-visibility: auto`. The video loads only when someone presses play. Animations use transform/opacity only, run a few cycles and stop, and are disabled for reduced-motion users.
- WCAG 2.2 AA: semantic headings, skip link, visible focus states, labelled form fields with inline errors and an error summary, sufficient colour contrast (see `tests/contrast.test.ts`), and alt text for every image.
- Lighthouse (mobile, simulated throttling, measured locally on a slow machine): performance 90–98, accessibility 100, best practices 100, SEO 100 on production builds. Staging scores 66–69 for SEO only because it is deliberately `noindex`.
