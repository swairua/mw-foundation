import { Link, useParams } from "react-router-dom";
import { ArrowRight, HandHeart, HeartHandshake, UserRoundPlus } from "lucide-react";
import { Accent, ArrowLink, Eyebrow, Reveal } from "@/components/ui";
import { CtaBand, Facts, PageHero, StoryCard } from "@/components/sections";
import NotFound from "./NotFound";
import { Seo, breadcrumbLd } from "@/lib/head";
import { pillarBySlug, pillarPath, pillars, storiesForPillar, storyPath } from "@/lib/content";
import { track } from "@/lib/analytics";

export default function PillarPage() {
  const { slug = "" } = useParams();
  const pillar = pillarBySlug.get(slug);
  if (!pillar) return <NotFound />;

  const related = storiesForPillar(pillar.slug, 3);
  const others = pillars.filter((p) => p.slug !== pillar.slug);
  const path = pillarPath(pillar.slug);
  const heroImage = ("heroImage" in pillar && pillar.heroImage) || pillar.image;
  const help = [
    { key: "donate", title: "Donate", icon: HandHeart, text: pillar.help.donate, to: "/get-involved", cta: "Give to this work" },
    { key: "volunteer", title: "Volunteer", icon: UserRoundPlus, text: pillar.help.volunteer, to: "/get-involved/volunteer", cta: "Offer your skills" },
    { key: "partner", title: "Partner", icon: HeartHandshake, text: pillar.help.partner, to: "/get-involved/partner", cta: "Talk to us" },
  ];

  return (
    <>
      <Seo
        title={pillar.name}
        description={pillar.outcome}
        path={path}
        image={heroImage}
        jsonLd={[breadcrumbLd([{ name: "Home", path: "/" }, { name: "Our Work", path: "/our-work" }, { name: pillar.name, path }])]}
      />
      <PageHero
        crumbs={[{ name: "Home", path: "/" }, { name: "Our Work", path: "/our-work" }, { name: pillar.name }]}
        eyebrow={`Pillar ${pillar.number}`}
        title={pillar.name}
        lead={pillar.lead}
        image={heroImage}
      >
        <Link to="/get-involved" className="btn btn-gold" onClick={() => track("Donate CTA", { location: `pillar-${pillar.slug}` })}>
          Support this work <ArrowRight aria-hidden className="arrow" />
        </Link>
        <Link to="/get-involved/partner" className="btn btn-outline">Partner with us</Link>
      </PageHero>

      {pillar.facts.length > 0 && (
        <section aria-label="At a glance" className="border-b border-forest-900/10 bg-cream-50">
          <div className="shell py-12">
            <Facts facts={pillar.facts} />
          </div>
        </section>
      )}

      <section className="section">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
              <Eyebrow className="mb-5">Overview</Eyebrow>
              <h2 className="text-display-sm">
                <Accent text="Why this *matters.*" />
              </h2>
            </div>
          </div>
          <div className="lg:col-span-8">
            <div className="space-y-6 text-[1.125rem] leading-[1.8] text-ink-soft">
              {pillar.overview.map((p, i) => (
                <p key={i} className={i === 0 ? "text-lead text-forest-900" : ""}>{p}</p>
              ))}
            </div>
            <h3 className="mt-14 text-eyebrow font-semibold uppercase text-ink-mute">Where we focus</h3>
            <ul className="mt-5 grid gap-px overflow-hidden rounded-card border border-forest-900/10 bg-forest-900/10 sm:grid-cols-2">
              {pillar.focus.map((f) => (
                <li key={f} className="flex gap-3 bg-cream-50 p-5 text-[0.98rem] leading-snug text-forest-900">
                  <span aria-hidden className="mt-[0.45em] h-[6px] w-[6px] shrink-0 rotate-45 bg-gold-600" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section border-t border-forest-900/10 bg-cream-150" aria-labelledby="programmes-heading">
        <div className="shell">
          <Eyebrow className="mb-5">Programmes</Eyebrow>
          <h2 id="programmes-heading" className="text-display-md">
            <Accent text="What we are *doing.*" />
          </h2>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {pillar.programmes.map((pr, i) => (
              <Reveal as="article" key={pr.title} delay={i * 80} className="flex flex-col rounded-card border border-forest-900/10 bg-cream-50 p-7 sm:p-8">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-gold-700">{pr.status || "Programme"}</p>
                <h3 className="mt-4 text-[1.35rem] leading-snug tracking-[-0.01em]">{pr.title}</h3>
                <p className="mt-3 leading-relaxed text-ink-soft">{pr.text}</p>
                {"story" in pr && pr.story && (
                  <div className="mt-auto pt-6">
                    <ArrowLink to={storyPath(pr.story)}>Read the story</ArrowLink>
                  </div>
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="help-heading">
        <div className="shell">
          <Eyebrow className="mb-5">How you can help</Eyebrow>
          <h2 id="help-heading" className="max-w-3xl text-display-md">
            <Accent text={`Strengthen *${pillar.name}.*`} />
          </h2>
          <div className="mt-12 grid gap-px overflow-hidden rounded-card border border-forest-900/10 bg-forest-900/10 md:grid-cols-3">
            {help.map((h) => (
              <Link
                key={h.key}
                to={h.to}
                onClick={() => h.key === "donate" && track("Donate CTA", { location: `pillar-help-${pillar.slug}` })}
                className="group flex flex-col bg-cream-50 p-7 transition-colors hover:bg-white sm:p-9"
              >
                <h.icon aria-hidden className="h-7 w-7 text-gold-700" strokeWidth={1.5} />
                <h3 className="mt-8 text-[1.4rem]">{h.title}</h3>
                <p className="mt-3 leading-relaxed text-ink-soft">{h.text}</p>
                <span className="mt-auto inline-flex items-center gap-2 pt-8 font-semibold text-forest-900">
                  {h.cta} <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section border-t border-forest-900/10" aria-labelledby="related-heading">
          <div className="shell">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <Eyebrow className="mb-5">News &amp; stories</Eyebrow>
                <h2 id="related-heading" className="text-display-md">
                  <Accent text={`More on *${pillar.name.toLowerCase()}.*`} />
                </h2>
              </div>
              <ArrowLink to={`/news?pillar=${pillar.slug}`}>All {pillar.name} stories</ArrowLink>
            </div>
            <div className="mt-12 grid gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {related.map((s) => (
                <StoryCard key={s.slug} story={s} />
              ))}
            </div>
          </div>
        </section>
      )}

      <nav aria-label="Other pillars" className="border-t border-forest-900/10 bg-cream-50">
        <div className="shell py-12">
          <p className="text-eyebrow font-semibold uppercase text-ink-mute">Other pillars</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {others.map((p) => (
              <li key={p.slug}>
                <Link to={pillarPath(p.slug)} className="chip">
                  <span className="font-serif italic text-gold-700">{p.number}</span> {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <CtaBand />
    </>
  );
}
