import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Briefcase, Building2, CalendarClock, CreditCard, GraduationCap, HeartPulse, Landmark, Laptop, Megaphone, Package, School, Smartphone, Sprout } from "lucide-react";
import { Accent, Eyebrow, T } from "@/components/ui";
import { Breadcrumbs, OfficialChannels } from "@/components/sections";
import { CopyValue, PartnerForm, VolunteerForm } from "@/components/involve";
import { Seo, breadcrumbLd } from "@/lib/head";
import { donate, formatKes, hasValue, isTodo, site } from "@/lib/content";
import { cx } from "@/lib/hooks";
import { track } from "@/lib/analytics";

type Tab = "donate" | "volunteer" | "partner";

const TABS: { id: Tab; label: string; to: string }[] = [
  { id: "donate", label: "Donate", to: "/get-involved" },
  { id: "volunteer", label: "Volunteer", to: "/get-involved/volunteer" },
  { id: "partner", label: "Partner", to: "/get-involved/partner" },
];

const META: Record<Tab, { title: string; heading: string; lead: string; description: string; path: string }> = {
  donate: {
    title: "Donate",
    heading: "Give to work that *reaches rural Kenya.*",
    lead: "Give once or every month by M-PESA, card or PayPal. Every gift supports programmes across our five pillars.",
    description: "Donate to the Mercy Wanjau Foundation by M-PESA Paybill, card or PayPal, once or monthly, and see what your gift makes possible.",
    path: "/get-involved",
  },
  volunteer: {
    title: "Volunteer",
    heading: "Lend your skills *where they count.*",
    lead: "Mentors, language teachers, digital trainers, business coaches and mental-health professionals all have a place in our programmes.",
    description: "Volunteer with the Mercy Wanjau Foundation as a mentor, French instructor, digital skills trainer, business coach or wellness facilitator.",
    path: "/get-involved/volunteer",
  },
  partner: {
    title: "Partner with us",
    heading: "Build something *that lasts,* together.",
    lead: "We work with foundations, companies, schools and specialist institutions to fund, deliver and scale programmes for rural communities.",
    description: "Partner with the Mercy Wanjau Foundation: fund a cohort, host a digital lab, support a school library or open remote-work routes for graduates with disabilities.",
    path: "/get-involved/partner",
  },
};

export default function GetInvolved({ tab }: { tab: Tab }) {
  const m = META[tab];
  return (
    <>
      <Seo
        title={m.title}
        description={m.description}
        path={m.path}
        image={tab === "donate" ? "french-initiative-students-writing" : tab === "volunteer" ? "french-initiative-volunteers" : "kirinyaga-farmers-delegation"}
        jsonLd={[breadcrumbLd([{ name: "Home", path: "/" }, { name: "Get Involved", path: "/get-involved" }, ...(tab === "donate" ? [] : [{ name: m.title, path: m.path }])])]}
      />
      <section className="border-b border-forest-900/10">
        <div className="shell pb-10 pt-6 sm:pt-8 lg:pt-10">
          <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Get Involved" }]} />
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow className="mb-6">Get involved</Eyebrow>
              <h1 className="text-display-lg"><Accent text={m.heading} /></h1>
            </div>
            <p className="text-lead text-ink-soft lg:col-span-5">{m.lead}</p>
          </div>
          <nav aria-label="Ways to get involved" className="mt-12">
            <ul className="inline-flex w-full rounded-full border border-forest-900/15 bg-cream-50 p-1 sm:w-auto">
              {TABS.map((t) => (
                <li key={t.id} className="flex-1 sm:flex-none">
                  <Link
                    to={t.to}
                    aria-current={t.id === tab ? "page" : undefined}
                    preventScrollReset
                    className={cx(
                      "flex min-h-[44px] items-center justify-center rounded-full px-5 text-[0.95rem] font-semibold transition sm:px-8",
                      t.id === tab ? "bg-forest-900 text-cream-50 shadow-soft" : "text-ink-soft hover:text-forest-900",
                    )}
                  >
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>
      {tab === "donate" && <DonatePanel />}
      {tab === "volunteer" && <VolunteerPanel />}
      {tab === "partner" && <PartnerPanel />}
    </>
  );
}

// ── Donate ──────────────────────────────────────────────────
function DonatePanel() {
  const [frequency, setFrequency] = useState<"once" | "monthly">("once");
  const [amount, setAmount] = useState<number>(donate.defaultAmount);
  const [custom, setCustom] = useState("");
  const tier = donate.tiers.find((t) => t.amount === amount);
  const effective = custom ? Math.max(0, Math.round(Number(custom) || 0)) : amount;
  const { mpesa, card } = donate;
  const cardUrl = frequency === "monthly" ? card.monthlyUrl || card.url : card.url;

  return (
    <section className="section pt-12 lg:pt-16">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          {/* Step 1: frequency + amount */}
          <div className="rounded-card border border-forest-900/10 bg-cream-50 p-6 shadow-soft sm:p-9">
            <h2 className="text-[1.5rem] tracking-[-0.015em]">1. Choose your gift</h2>
            <div className="mt-6 grid grid-cols-2 gap-1 rounded-full bg-cream-200 p-1" role="group" aria-label="How often">
              {(["once", "monthly"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  aria-pressed={frequency === f}
                  onClick={() => {
                    setFrequency(f);
                    track("Donation frequency", { frequency: f });
                  }}
                  className={cx("min-h-[44px] rounded-full text-[0.95rem] font-semibold transition", frequency === f ? "bg-forest-900 text-cream-50 shadow-soft" : "text-ink-soft hover:text-forest-900")}
                >
                  {f === "once" ? "Give once" : "Give monthly"}
                </button>
              ))}
            </div>

            <fieldset className="mt-8">
              <legend className="field-label">Amount ({donate.currency})</legend>
              <div className="grid gap-3 sm:grid-cols-3">
                {donate.tiers.map((t) => {
                  const selected = !custom && amount === t.amount;
                  return (
                    <label
                      key={t.amount}
                      className={cx(
                        "relative flex cursor-pointer flex-col rounded-[12px] border p-4 transition focus-within:ring-2 focus-within:ring-forest-700/30",
                        selected ? "border-forest-900 bg-forest-900 text-cream-50" : "border-forest-900/15 bg-white hover:border-forest-900/40",
                      )}
                    >
                      <input
                        type="radio"
                        name="amount"
                        value={t.amount}
                        checked={selected}
                        onChange={() => {
                          setAmount(t.amount);
                          setCustom("");
                          track("Donation tier", { amount: t.amount, frequency });
                        }}
                        className="sr-only"
                      />
                      <span className="text-[1.25rem] font-semibold tabular">{formatKes(t.amount)}</span>
                      <span className={cx("mt-1 text-xs", selected ? "text-cream-50/75" : "text-ink-mute")}>{frequency === "monthly" ? "per month" : "one-off"}</span>
                    </label>
                  );
                })}
              </div>
              <div className="mt-3">
                <label htmlFor="custom-amount" className="sr-only">Other amount in Kenyan shillings</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-ink-mute">KES</span>
                  <input
                    id="custom-amount"
                    type="number"
                    inputMode="numeric"
                    min={50}
                    step={50}
                    placeholder="Other amount"
                    value={custom}
                    onChange={(e) => setCustom(e.target.value)}
                    onBlur={() => custom && track("Donation tier", { amount: "custom", frequency })}
                    className="input pl-14"
                  />
                </div>
              </div>
            </fieldset>

            <div className="mt-6 rounded-[12px] bg-cream-200/70 p-4 text-[0.95rem] leading-relaxed text-forest-900" aria-live="polite">
              {custom ? (
                <p>Thank you. Every shilling goes to programmes across our five pillars.</p>
              ) : tier ? (
                <p>
                  <span className="font-semibold">{formatKes(tier.amount)}{frequency === "monthly" ? " a month" : ""}</span> could fund <T value={tier.outcome} />
                  {!isTodo(tier.outcome) && "."}
                </p>
              ) : null}
            </div>
          </div>

          {/* Step 2: M-PESA */}
          <div className="mt-6 rounded-card border border-forest-900/10 bg-cream-50 p-6 shadow-soft sm:p-9">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h2 className="text-[1.5rem] tracking-[-0.015em]">2. Give by M-PESA</h2>
                <p className="mt-1 text-ink-soft">Fast, and the confirmation SMS is your receipt.</p>
              </div>
              <Smartphone aria-hidden className="h-8 w-8 shrink-0 text-gold-700" strokeWidth={1.4} />
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-[1fr_auto]">
              <div className="grid gap-3">
                <CopyValue label="Paybill (business) number" value={mpesa.paybill} event="Copy Paybill" />
                <CopyValue label="Account number" value={mpesa.account} event="Copy account number" />
                <div className="flex items-center justify-between rounded-[12px] border border-forest-900/12 bg-white px-4 py-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-mute">Amount</p>
                    <p className="mt-0.5 text-[1.35rem] font-semibold tabular text-forest-900">{effective ? formatKes(effective) : "Your choice"}</p>
                  </div>
                  {frequency === "monthly" && <span className="rounded-full bg-gold-200 px-3 py-1 text-xs font-semibold text-forest-950">Monthly</span>}
                </div>
              </div>
              <figure className="hidden w-[168px] flex-col items-center text-center md:flex">
                {mpesa.qrImage ? (
                  <img src={mpesa.qrImage} alt="Official M-PESA QR code for the Mercy Wanjau Foundation" width={168} height={168} className="rounded-[12px] border border-forest-900/10 bg-white p-2" />
                ) : (
                  <img src="/img/qr-donate.svg" alt="QR code that opens this donation page on your phone" width={168} height={168} className="rounded-[12px] border border-forest-900/10 bg-white p-2" />
                )}
                <figcaption className="mt-2 text-xs leading-snug text-ink-mute">
                  {mpesa.qrImage ? "Scan with the M-PESA app" : "Scan to open this page on your phone"}
                </figcaption>
              </figure>
            </div>

            <ol className="mt-8 grid gap-3 text-[0.95rem] text-ink-soft sm:grid-cols-2">
              {[
                "Open M-PESA and choose Lipa na M-PESA",
                "Select Pay Bill",
                "Enter the Paybill number above",
                `Enter account number ${mpesa.account}`,
                `Enter the amount${effective ? ` (${formatKes(effective)})` : ""}`,
                `Check the name reads ${mpesa.registeredName}, then enter your PIN`,
              ].map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-forest-900 text-xs font-semibold text-cream-50">{i + 1}</span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>

            {frequency === "monthly" && (
              <div className="mt-6 flex gap-3 rounded-[12px] border border-gold-600/30 bg-gold-200/40 p-4 text-[0.95rem] text-forest-900">
                <CalendarClock aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-gold-700" />
                <p>
                  <span className="font-semibold">Giving monthly by M-PESA?</span> Use <span className="font-semibold">M-PESA Ratiba</span> in the M-PESA app to set up a monthly standing order to the same Paybill and account number. You can pause or cancel it at any time.
                </p>
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 border-t border-forest-900/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-ink-mute">Sent your gift? Let us know so we can say thank you.</p>
              <Link
                to="/thank-you?type=donation"
                className="btn btn-forest btn-sm"
                onClick={() => track("Donation completed", { method: "mpesa", amount: effective, frequency })}
              >
                I have donated
              </Link>
            </div>
          </div>

          {/* Card / PayPal */}
          <div className="mt-6 rounded-card border border-forest-900/10 bg-cream-50 p-6 sm:p-9">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h2 className="text-[1.5rem] tracking-[-0.015em]">Or give by {card.label.toLowerCase()}</h2>
                <p className="mt-1 text-ink-soft">For supporters outside Kenya, or anyone who prefers a card.</p>
              </div>
              <CreditCard aria-hidden className="h-8 w-8 shrink-0 text-gold-700" strokeWidth={1.4} />
            </div>
            {cardUrl ? (
              <a
                href={cardUrl}
                rel="noopener noreferrer"
                className="btn btn-gold mt-6"
                onClick={() => track("Card donation click", { frequency, amount: effective })}
              >
                Continue to secure payment <ArrowRight aria-hidden className="arrow" />
              </a>
            ) : (
              <p className="mt-6 rounded-[12px] border border-dashed border-forest-900/20 p-4 text-[0.95rem] text-ink-soft">
                Card and PayPal giving is coming soon. In the meantime, please give by M-PESA or{" "}
                <a href={`mailto:${site.contact.email}?subject=Bank%20transfer%20details`} className="font-medium text-forest-700 underline underline-offset-4">ask us for bank transfer details</a>.
              </p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-5">
          <div className="space-y-6 lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
            <div className="on-dark rounded-card bg-forest-900 p-7 text-cream-50/80 sm:p-9">
              <h2 className="text-[1.35rem] text-cream-50">Where your gift goes</h2>
              <ul className="mt-6 space-y-4 text-[0.95rem]">
                {[
                  { icon: Laptop, text: "Digital skills, devices and mentorship" },
                  { icon: GraduationCap, text: "The French Initiative and school libraries" },
                  { icon: Sprout, text: "Training and inputs for women and farmers" },
                  { icon: HeartPulse, text: "Mental-health forums and wellness cohorts" },
                  { icon: BookOpen, text: "Assistive technology and inclusive learning" },
                ].map((r) => (
                  <li key={r.text} className="flex gap-3">
                    <r.icon aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-gold-300" strokeWidth={1.5} />
                    {r.text}
                  </li>
                ))}
              </ul>
              <p className="mt-6 border-t border-white/10 pt-6 text-sm">
                Want your gift to support one pillar? Email <a href={`mailto:${site.contact.email}`} className="text-gold-300 underline underline-offset-4">{site.contact.email}</a> after giving.
              </p>
            </div>

            <OfficialChannels />

            <div className="rounded-card border border-forest-900/10 bg-cream-50 p-6 text-[0.95rem] text-ink-soft">
              <div className="flex gap-4">
                <Landmark aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-forest-700" />
                <div>
                  <p className="font-semibold text-forest-900">Accountable giving</p>
                  <p className="mt-1">
                    {site.registration.legalName}, registration no. <T value={site.registration.number} fallback="available on request" />. Reports and policies are published on{" "}
                    <Link to="/who-we-are" className="font-medium text-forest-700 underline underline-offset-4">Who We Are</Link>.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-card border border-forest-900/10 bg-cream-50 p-6 text-[0.95rem] text-ink-soft">
              <div className="flex gap-4">
                <Building2 aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-forest-700" />
                <div>
                  <p className="font-semibold text-forest-900">Grants, major gifts and bank transfers</p>
                  <p className="mt-1">
                    {hasValue(donate.bank) ? donate.bank : <T value={donate.bank} fallback="Contact us for bank transfer details." />}
                  </p>
                  <Link to="/get-involved/partner" className="link-arrow mt-3 text-sm">Talk to our partnerships team <ArrowRight aria-hidden /></Link>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

// ── Volunteer ───────────────────────────────────────────────
const ROLES = [
  { icon: Laptop, title: "Digital mentor", text: "Guide young people and graduates with disabilities through digital skills and online work." },
  { icon: GraduationCap, title: "French language volunteer", text: "Support French classes, clubs and conversation practice in Kirinyaga schools." },
  { icon: BookOpen, title: "Literacy coach", text: "Help learners build reading habits as school libraries take shape." },
  { icon: HeartPulse, title: "Mental-health professional", text: "Facilitate or co-host our monthly online wellness forums." },
  { icon: Briefcase, title: "Business coach", text: "Mentor women entrepreneurs and farmers as they grow their enterprises." },
  { icon: Megaphone, title: "Communications & media", text: "Photography, video and writing that tell our communities' stories with dignity." },
];

function VolunteerPanel() {
  return (
    <section className="section pt-12 lg:pt-16">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <h2 className="text-display-sm">Where volunteers help</h2>
          <ul className="mt-8 grid gap-px overflow-hidden rounded-card border border-forest-900/10 bg-forest-900/10">
            {ROLES.map((r) => (
              <li key={r.title} className="flex gap-4 bg-cream-50 p-5">
                <r.icon aria-hidden className="mt-0.5 h-6 w-6 shrink-0 text-gold-700" strokeWidth={1.5} />
                <div>
                  <h3 className="text-[1.05rem]">{r.title}</h3>
                  <p className="mt-1 text-[0.95rem] leading-relaxed text-ink-soft">{r.text}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8 rounded-card border border-forest-900/10 bg-cream-150 p-6 text-[0.95rem] leading-relaxed text-ink-soft">
            <p className="font-semibold text-forest-900">What happens next</p>
            <p className="mt-2">
              We review every application against current programme needs and contact suitable volunteers for a conversation. Roles that involve children or vulnerable adults require references and a Certificate of Good Conduct, in line with our safeguarding policy.
            </p>
          </div>
        </div>
        <div className="lg:col-span-7">
          <div className="rounded-card border border-forest-900/10 bg-cream-50 p-6 shadow-soft sm:p-10">
            <h2 className="text-[1.5rem] tracking-[-0.015em]">Volunteer application</h2>
            <p className="mb-8 mt-1 text-ink-soft">Takes about three minutes. Fields marked * are required.</p>
            <VolunteerForm />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Partner ─────────────────────────────────────────────────
const ROUTES = [
  { icon: Landmark, title: "Fund a programme", text: "Back a cohort, a school library or a year of the French Initiative, with clear reporting on results." },
  { icon: Building2, title: "Corporate partnership", text: "CSR programmes, employee volunteering and skills-based support aligned to your business." },
  { icon: Laptop, title: "Technical partnership", text: "Open remote-work routes for digitally skilled graduates with disabilities, or support assistive technology." },
  { icon: School, title: "Schools and institutions", text: "Host programmes, libraries and clubs, or co-design inclusive learning." },
  { icon: Package, title: "In-kind support", text: "Devices, tablets, connectivity, learning materials or farm inputs for programme participants." },
];

function PartnerPanel() {
  return (
    <section className="section pt-12 lg:pt-16">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <h2 className="text-display-sm">Ways to partner</h2>
          <ul className="mt-8 grid gap-px overflow-hidden rounded-card border border-forest-900/10 bg-forest-900/10">
            {ROUTES.map((r) => (
              <li key={r.title} className="flex gap-4 bg-cream-50 p-5">
                <r.icon aria-hidden className="mt-0.5 h-6 w-6 shrink-0 text-gold-700" strokeWidth={1.5} />
                <div>
                  <h3 className="text-[1.05rem]">{r.title}</h3>
                  <p className="mt-1 text-[0.95rem] leading-relaxed text-ink-soft">{r.text}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8 rounded-card border border-forest-900/10 bg-cream-150 p-6 text-[0.95rem] leading-relaxed text-ink-soft">
            <p className="font-semibold text-forest-900">Our commitment to partners</p>
            <p className="mt-2">Agreed objectives, transparent budgets and regular reporting. Partnerships are reviewed under our gift acceptance and conflict-of-interest policy to protect the Foundation's independence.</p>
          </div>
        </div>
        <div className="lg:col-span-7">
          <div className="rounded-card border border-forest-900/10 bg-cream-50 p-6 shadow-soft sm:p-10">
            <h2 className="text-[1.5rem] tracking-[-0.015em]">Partnership enquiry</h2>
            <p className="mb-8 mt-1 text-ink-soft">Tell us a little about your organisation and what you have in mind.</p>
            <PartnerForm />
          </div>
        </div>
      </div>
    </section>
  );
}
