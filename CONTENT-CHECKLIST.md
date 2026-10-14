# Content needed from the Mercy Wanjau Foundation

Everything below appears on the staging site as a highlighted placeholder, or as an interim figure or stock photo, until it is supplied. Send items to the web team, or enter them yourself at `/admin` (see the README). `pnpm content:check` lists anything still outstanding.

## Before launch — essential

| # | Item | Where it appears | Format / notes |
|---|---|---|---|
| 1 | **M-PESA Paybill number** and account number to use | Donate page | Confirm the business name shown on the M-PESA confirmation (currently "MERCY WANJAU FOUNDATION"). |
| 2 | **Official M-PESA QR code** (optional) | Donate page | PNG from the M-PESA Business portal. Until supplied, the page shows a QR code that opens the donate page on a phone. |
| 3 | **Card / PayPal donation links**: one-off and monthly | Donate page | A PayPal donate link, or a payment page from your bank or provider. Shows "coming soon" until supplied. |
| 4 | **Bank transfer details** for grants and major gifts | Donate page sidebar | Bank, branch, account name, account number, SWIFT. |
| 5 | **Phone number** and **WhatsApp number** | Footer, Contact, floating WhatsApp button | The WhatsApp button appears automatically once the number is entered. |
| 6 | **Registration details**: legal form (e.g. PBO, trust, CLG), registration number, registering authority | Footer, Who We Are, Donate | |
| 7 | **ODPC data controller registration number** | Who We Are | Kenya Data Protection Act, 2019. |
| 8 | **Headline impact numbers**: students reached, farmers supported, volunteers, counties, plus the date confirmed | Home page impact band | Whole numbers. Until supplied, the band shows documented figures (570 students, 42 farmers, 5 schools, monthly forums). |
| 9 | **Gift outcomes** for KES 1,000 / 5,000 / 10,000 | Donate page | Drafts are on staging: confirm or rewrite. Each must be true and costed. |
| 10 | **Legal review** of the Privacy Policy and Terms of Use | `/privacy-policy`, `/terms-of-use` | Updated drafts are based on the old site's text plus the new forms and processors. |

## Before launch — strongly recommended

| # | Item | Where it appears | Format / notes |
|---|---|---|---|
| 11 | **High-resolution photos** of programmes | Hero, pillar cards, stories | JPG at least 2000 px wide, the original files from the camera or phone (not WhatsApp-forwarded; WhatsApp shrinks them to about 500 px). Priority: French Initiative classrooms and library, Kirinyaga farmers, a wellness forum, the disability-inclusion programme, digital skills sessions. With consent; no children's names. |
| 12 | **Founder portrait** in high resolution | Who We Are, Home | At least 1200 px tall. Current portrait is 217 × 326 px. |
| 13 | **Founder statement**, 2–3 sentences on why she founded the Foundation | Who We Are | |
| 14 | **Board members**: name, role, one-line biography, photo | Who We Are | Square photo, at least 400 px. |
| 15 | **Team members**: name, role, one-line biography, photo | Who We Are | |
| 16 | **Partner and supporter logos**, only organisations that have agreed to be named | Home page partner strip | SVG preferred, or PNG with a transparent background. |

## Soon after launch

| # | Item | Where it appears | Format / notes |
|---|---|---|---|
| 17 | **Annual report** and **audited financial statements** | Who We Are → Governance | PDF. |
| 18 | **Policies**: safeguarding and child protection; gift acceptance and conflict of interest; anti-fraud and whistleblowing; code of conduct | Who We Are → Governance | PDF, or "available on request" (current setting). |
| 19 | **Office hours** | Contact | |
| 20 | **Media kit**: approved bio and photos for press | Contact → Media enquiries | |
| 21 | **Confirm stock photography** use until own photos arrive | Hero, four pillar cards, several articles | Licensed from Unsplash/Pexels; credited in `content/media.json`. |

## Accounts and access the Foundation should own

- [ ] GitHub account(s) for editors, with two-factor authentication, added to `swairua/mw-foundation`
- [ ] Hosting: SFTP/FTPS login and web-root path for staging and production (private server), or a Vercel project
- [ ] A MySQL database and user on the server for form submissions (or a Supabase project if using Vercel)
- [ ] Resend account with the `mw-foundation.org` domain verified
- [ ] Plausible Analytics (or Google Analytics 4) property
- [ ] Domain registrar login for `mw-foundation.org` (for DNS, DNSSEC and DMARC records)
