import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Accent, Eyebrow, Reveal } from "@/components/ui";
import { Breadcrumbs, StoryCard } from "@/components/sections";
import { NewsletterForm } from "@/components/forms";
import { Seo, breadcrumbLd } from "@/lib/head";
import { pillars, stories } from "@/lib/content";
import { useHydrated } from "@/lib/hooks";
import { getImage } from "@/lib/images";
import { track } from "@/lib/analytics";

const PAGE = 9;

export default function News() {
  const hydrated = useHydrated();
  const [params, setParams] = useSearchParams();
  const requested = hydrated ? params.get("pillar") : null;
  const active = requested && pillars.some((p) => p.slug === requested) ? requested : "all";
  const [limit, setLimit] = useState(PAGE);

  const filtered = useMemo(() => (active === "all" ? stories : stories.filter((s) => s.pillars.includes(active))), [active]);
  // The large lead slot needs a sharp image; the field photos from WhatsApp are too small for it.
  const lead = filtered.find((s) => s.image && (getImage(s.image)?.w ?? 0) >= 1000) ?? filtered[0];
  const rest = filtered.filter((s) => s !== lead);
  const visible = rest.slice(0, limit);

  const choose = (slug: string) => {
    setLimit(PAGE);
    const next = new URLSearchParams(params);
    if (slug === "all") next.delete("pillar");
    else next.set("pillar", slug);
    setParams(next, { replace: true, preventScrollReset: true });
    track("Story filter", { pillar: slug });
  };

  const counts = Object.fromEntries(pillars.map((p) => [p.slug, stories.filter((s) => s.pillars.includes(p.slug)).length]));
  const activeName = pillars.find((p) => p.slug === active)?.name;

  return (
    <>
      <Seo
        title="News & Stories"
        description="Field reports and perspectives from the Mercy Wanjau Foundation's work in rural Kenya, from the French Initiative to Kirinyaga's farmers."
        path="/news"
        image="kirinyaga-farmers-delegation"
        jsonLd={[breadcrumbLd([{ name: "Home", path: "/" }, { name: "News & Stories", path: "/news" }])]}
      />
      <section className="border-b border-forest-900/10">
        <div className="shell pb-12 pt-10 sm:pt-14 lg:pb-16 lg:pt-20">
          <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "News & Stories" }]} />
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow className="mb-6">News &amp; stories</Eyebrow>
              <h1 className="text-display-lg">
                <Accent text="Notes from *the field.*" />
              </h1>
            </div>
            <p className="text-lead text-ink-soft lg:col-span-5">
              Field reports from our programmes, and perspectives on education, livelihoods, wellness and inclusion in Kenya.
            </p>
          </div>

          <div className="mt-12" role="group" aria-label="Filter stories by pillar">
            <ul className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
              <li>
                <button type="button" className="chip whitespace-nowrap" aria-pressed={active === "all"} onClick={() => choose("all")}>
                  All <span className="opacity-60">{stories.length}</span>
                </button>
              </li>
              {pillars.map((p) => (
                <li key={p.slug}>
                  <button type="button" className="chip whitespace-nowrap" aria-pressed={active === p.slug} onClick={() => choose(p.slug)}>
                    {p.name} <span className="opacity-60">{counts[p.slug]}</span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="sr-only" aria-live="polite">
              {activeName ? `Showing ${filtered.length} ${activeName} stories` : `Showing all ${filtered.length} stories`}
            </p>
          </div>
        </div>
      </section>

      <section className="section pt-14 lg:pt-20">
        <div className="shell">
          {lead && (
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-14">
              <div className="lg:col-span-7">
                <StoryCard story={lead} size="lg" headingLevel={2} />
              </div>
              <div className="hidden lg:col-span-5 lg:block">
                <p className="font-serif text-[1.75rem] italic leading-snug text-forest-900">“{lead.standfirst ?? lead.excerpt}”</p>
              </div>
            </div>
          )}

          <div className="mt-16 grid gap-x-8 gap-y-14 border-t border-forest-900/10 pt-14 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((s, i) => (
              <Reveal key={s.slug} delay={(i % 3) * 70}>
                <StoryCard story={s} headingLevel={2} />
              </Reveal>
            ))}
          </div>

          {rest.length > limit && (
            <div className="mt-16 flex justify-center">
              <button type="button" className="btn btn-outline" onClick={() => setLimit((l) => l + PAGE)}>
                Show more stories <span className="text-ink-mute">({rest.length - limit} more)</span>
              </button>
            </div>
          )}
          {filtered.length === 0 && <p className="text-lead text-ink-soft">No stories in this pillar yet.</p>}
        </div>
      </section>

      <section className="on-dark bg-forest-900">
        <div className="shell grid gap-8 py-16 lg:grid-cols-12 lg:items-center">
          <h2 className="text-display-sm text-cream-50 lg:col-span-6">
            <Accent text="New stories, *straight to your inbox.*" />
          </h2>
          <div className="lg:col-span-6">
            <NewsletterForm id="news-newsletter" />
          </div>
        </div>
      </section>
    </>
  );
}
