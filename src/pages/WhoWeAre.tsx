import { Link } from "react-router-dom";
import { ArrowRight, Download, FileText, Home as HomeIcon, Landmark, Leaf, Lightbulb, Mail, Scale, ShieldCheck, Users } from "lucide-react";
import { Accent, Eyebrow, Img, Reveal, SectionHeading, T } from "@/components/ui";
import { CtaBand, PageHero } from "@/components/sections";
import { Seo, breadcrumbLd, organizationLd } from "@/lib/head";
import { about, hasValue, isTodo, site } from "@/lib/content";
import { SITE_URL } from "@/lib/content";

const ICONS: Record<string, typeof ShieldCheck> = { shield: ShieldCheck, users: Users, lightbulb: Lightbulb, scale: Scale, home: HomeIcon, leaf: Leaf };

function initials(name: string) {
  return isTodo(name) ? "" : name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("");
}

function PersonCard({ person }: { person: { name: string; role: string; bio: string; image: string } }) {
  return (
    <li className="flex gap-5 rounded-card border border-forest-900/10 bg-cream-50 p-6">
      <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-forest-100 font-serif text-xl italic text-forest-700">
        {person.image ? <Img src={person.image} alt="" fill sizes="64px" /> : initials(person.name) || <Users aria-hidden className="h-6 w-6 text-forest-700/60" strokeWidth={1.5} />}
      </div>
      <div>
        <h3 className="text-[1.1rem]"><T value={person.name} fallback="Name to be announced" /></h3>
        <p className="text-sm font-medium text-gold-700">{person.role}</p>
        <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft"><T value={person.bio} /></p>
      </div>
    </li>
  );
}

export default function WhoWeAre() {
  const { founder } = about;
  return (
    <>
      <Seo
        title="Who We Are"
        description="Founded by Mercy Wanjau, the Foundation works for inclusive growth in rural Kenya. Our mission, vision, principles, leadership and governance."
        path="/who-we-are"
        image="french-initiative-library-celebration"
        jsonLd={[
          breadcrumbLd([{ name: "Home", path: "/" }, { name: "Who We Are", path: "/who-we-are" }]),
          organizationLd(),
          {
            "@context": "https://schema.org",
            "@type": "Person",
            name: founder.name,
            jobTitle: "Founder, Mercy Wanjau Foundation",
            worksFor: { "@id": `${SITE_URL}/#organization` },
          },
        ]}
      />
      <PageHero
        crumbs={[{ name: "Home", path: "/" }, { name: "Who We Are" }]}
        eyebrow="Who we are"
        title="Seen, supported *and empowered.*"
        lead={`${about.belief} The Mercy Wanjau Foundation exists so that more people in rural Kenya are given that chance.`}
        image="french-initiative-library-celebration"
      />

      {/* Mission & vision */}
      <section className="section" aria-label="Mission and vision">
        <div className="shell grid gap-px overflow-hidden rounded-card border border-forest-900/10 bg-forest-900/10 lg:grid-cols-2">
          <div className="bg-cream-50 p-8 sm:p-12">
            <Eyebrow className="mb-6">Our mission</Eyebrow>
            <p className="text-display-sm font-semibold text-forest-900">{about.mission}</p>
          </div>
          <div className="on-dark bg-forest-900 p-8 sm:p-12">
            <Eyebrow className="mb-6">Our vision</Eyebrow>
            <p className="text-display-sm font-semibold text-cream-50">
              To be a <em className="accent text-gold-300">beacon of hope</em> driving inclusive growth and social transformation across Kenya's rural communities.
            </p>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="section border-t border-forest-900/10 bg-cream-150" aria-labelledby="founder-heading">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <figure className="mx-auto max-w-[320px] lg:mx-0">
              <div className="relative aspect-[2/3] overflow-hidden rounded-card bg-forest-100 shadow-soft">
                <Img src={founder.image} fill sizes="320px" />
              </div>
              <figcaption className="mt-4 text-sm text-ink-mute">{founder.name}, Founder</figcaption>
            </figure>
          </Reveal>
          <Reveal className="lg:col-span-8" delay={100}>
            <Eyebrow className="mb-5">Our founder</Eyebrow>
            <h2 id="founder-heading" className="text-display-md">{founder.name}</h2>
            <div className="mt-8 space-y-5 text-[1.0625rem] leading-[1.8] text-ink-soft">
              {founder.bio.map((p, i) => (
                <p key={i} className={i === 0 ? "text-lead text-forest-900" : ""}>{p}</p>
              ))}
              <p>{founder.why}</p>
            </div>
            {hasValue(founder.quote) ? (
              <figure className="story-quote">
                <blockquote><p>{founder.quote}</p></blockquote>
                <figcaption>{founder.name}</figcaption>
              </figure>
            ) : (
              <p className="mt-8"><T value={founder.quote} /></p>
            )}
          </Reveal>
        </div>
      </section>

      {/* Principles */}
      <section className="section" aria-labelledby="principles-heading">
        <div className="shell">
          <SectionHeading id="principles-heading" align="split" eyebrow="Core principles" title="What we *stand for.*" intro="Our principles guide every decision, partnership and programme." />
          <ul className="mt-14 grid border-l border-t border-forest-900/10 sm:grid-cols-2 lg:grid-cols-3">
            {about.principles.map((p) => {
              const Icon = ICONS[p.icon] ?? ShieldCheck;
              return (
                <li key={p.name} className="border-b border-r border-forest-900/10 p-7 sm:p-8">
                  <Icon aria-hidden className="h-6 w-6 text-gold-700" strokeWidth={1.5} />
                  <h3 className="mt-6 text-[1.2rem]">{p.name}</h3>
                  <p className="mt-2 text-[0.98rem] leading-relaxed text-ink-soft">{p.text}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Code of conduct */}
      <section className="section on-dark bg-forest-950 text-cream-50/80" aria-labelledby="conduct-heading">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow className="mb-5">Code of conduct</Eyebrow>
            <h2 id="conduct-heading" className="text-display-md text-cream-50">
              <Accent text="How we *behave.*" />
            </h2>
            <p className="mt-6">Everyone who works or volunteers with the Foundation commits to these standards.</p>
          </div>
          <ol className="grid gap-px overflow-hidden rounded-card bg-white/10 sm:grid-cols-2 lg:col-span-8">
            {about.codeOfConduct.map((c, i) => (
              <li key={c.name} className="bg-forest-950 p-6 sm:p-7">
                <span className="font-serif text-2xl italic text-gold-300">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 text-[1.1rem] text-cream-50">{c.name}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed">{c.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Leadership */}
      <section className="section" aria-labelledby="leadership-heading">
        <div className="shell">
          <SectionHeading id="leadership-heading" eyebrow="Leadership" title="Board and *team.*" intro="The people who govern the Foundation and lead its work." />
          <h3 className="mt-14 text-eyebrow font-semibold uppercase text-ink-mute">Board</h3>
          <ul className="mt-5 grid gap-4 md:grid-cols-2">
            {about.board.map((b, i) => <PersonCard key={i} person={b} />)}
          </ul>
          <h3 className="mt-12 text-eyebrow font-semibold uppercase text-ink-mute">Team</h3>
          <ul className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {about.team.map((t, i) => <PersonCard key={i} person={t} />)}
          </ul>
        </div>
      </section>

      {/* Governance */}
      <section className="section border-t border-forest-900/10 bg-cream-150" aria-labelledby="governance-heading">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Eyebrow className="mb-5">Governance &amp; accountability</Eyebrow>
            <h2 id="governance-heading" className="text-display-md">
              <Accent text="Open about *how we work.*" />
            </h2>
            <dl className="mt-10 divide-y divide-forest-900/10 border-y border-forest-900/10 text-[0.98rem]">
              {[
                ["Legal name", site.registration.legalName],
                ["Registered as", site.registration.type],
                ["Registration no.", site.registration.number],
                ["Registered office", site.registration.registeredOffice],
                ["Data controller reg.", site.registration.dataProtectionNumber],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[9.5rem_1fr] gap-4 py-4">
                  <dt className="text-ink-mute">{k}</dt>
                  <dd className="font-medium text-forest-900"><T value={v} fallback="Available on request" /></dd>
                </div>
              ))}
            </dl>
            <aside className="mt-8 flex gap-4 rounded-card border border-forest-900/10 bg-cream-50 p-6">
              <Landmark aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-forest-700" />
              <div className="text-[0.95rem] leading-relaxed text-ink-soft">
                <p className="font-semibold text-forest-900">Independence</p>
                <p className="mt-1">{site.independenceStatement}</p>
              </div>
            </aside>
          </div>
          <div className="lg:col-span-7">
            <h3 className="text-eyebrow font-semibold uppercase text-ink-mute">Reports</h3>
            <ul className="mt-5 grid gap-3">
              {about.governance.documents.map((d) => (
                <li key={d.name}>
                  {d.file ? (
                    <a href={d.file} className="group flex items-center gap-4 rounded-card border border-forest-900/10 bg-cream-50 p-5 transition hover:border-forest-900/30" download>
                      <FileText aria-hidden className="h-6 w-6 text-gold-700" strokeWidth={1.5} />
                      <span className="flex-1"><span className="block font-semibold text-forest-900">{d.name}</span><span className="text-sm text-ink-mute"><T value={d.detail} /> · PDF</span></span>
                      <Download aria-hidden className="h-5 w-5 text-forest-900 transition-transform group-hover:translate-y-0.5" />
                    </a>
                  ) : (
                    <div className="flex items-center gap-4 rounded-card border border-dashed border-forest-900/20 bg-cream-50/60 p-5">
                      <FileText aria-hidden className="h-6 w-6 text-ink-mute" strokeWidth={1.5} />
                      <span className="flex-1">
                        <span className="block font-semibold text-forest-900">{d.name}</span>
                        <span className="text-sm text-ink-mute"><T value={d.detail} /> · Coming soon</span>
                      </span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
            <h3 className="mt-10 text-eyebrow font-semibold uppercase text-ink-mute">Policies</h3>
            <ul className="mt-5 divide-y divide-forest-900/10 border-y border-forest-900/10">
              {about.governance.policies.map((p) => (
                <li key={p.name} className="flex items-center justify-between gap-4 py-4">
                  <span className="text-[0.98rem] text-forest-900">{p.name}</span>
                  {p.file ? (
                    p.file.startsWith("/") && !p.file.endsWith(".pdf") ? (
                      <Link to={p.file} className="link-arrow text-sm">Read <ArrowRight aria-hidden /></Link>
                    ) : (
                      <a href={p.file} className="link-arrow text-sm" download>Download <Download aria-hidden /></a>
                    )
                  ) : (
                    <a href={`mailto:${site.contact.email}?subject=${encodeURIComponent(`Request: ${p.name}`)}`} className="inline-flex items-center gap-2 text-sm font-medium text-ink-mute hover:text-forest-900">
                      <Mail aria-hidden className="h-4 w-4" /> Available on request
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <CtaBand title="Join us in *the work ahead.*" />
    </>
  );
}
