import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Accent, Eyebrow, Img, Reveal } from "@/components/ui";
import { KenyaMap, PillarIcon } from "@/components/graphics";
import { CtaBand, PageHero } from "@/components/sections";
import { Seo, breadcrumbLd } from "@/lib/head";
import { pillarPath, pillars } from "@/lib/content";

const APPROACH = [
  { title: "Listen first", text: "Programmes begin with what communities, schools and farmer groups tell us they need, not with a template." },
  { title: "Partner with specialists", text: "We work with service providers, educators and specialised institutions so that support is expert and accountable." },
  { title: "Equip, then step back", text: "Skills, tools and mentorship are designed to leave people more independent, not more reliant on us." },
  { title: "Prove it, then scale", text: "We start in Kirinyaga County, learn what works and design each model so it can travel to new counties." },
];

export default function OurWork() {
  return (
    <>
      <Seo
        title="Our Work"
        description="Five pillars of work in rural Kenya: Digital Inclusion, Education & Leadership, Women's Economic Empowerment, Wellness and Disability Inclusion."
        path="/our-work"
        image="french-initiative-classroom-a"
        jsonLd={[breadcrumbLd([{ name: "Home", path: "/" }, { name: "Our Work", path: "/our-work" }])]}
      />
      <PageHero
        crumbs={[{ name: "Home", path: "/" }, { name: "Our Work" }]}
        eyebrow="Our work"
        title="Practical programmes, *rooted in Kirinyaga,* built to grow."
        lead="We turn ideas into working programmes for rural communities, combining technology, education, livelihoods, wellness and inclusion so that each strengthens the others."
        image="french-initiative-classroom-a"
      />

      <section className="section" aria-label="The five pillars">
        <div className="shell space-y-20 lg:space-y-28">
          {pillars.map((p, i) => (
            <Reveal as="article" key={p.slug} className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-16">
              <div className={i % 2 ? "lg:order-2 lg:col-span-6 lg:col-start-7" : "lg:col-span-6"}>
                <Link to={pillarPath(p.slug)} className="group relative block aspect-[4/3] overflow-hidden rounded-card bg-forest-100" tabIndex={-1} aria-hidden>
                  <Img src={p.image} alt="" fill sizes="(min-width: 1024px) 600px, 100vw" className="transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
                </Link>
              </div>
              <div className={i % 2 ? "lg:order-1 lg:col-span-5 lg:col-start-1" : "lg:col-span-5 lg:col-start-8"}>
                <div className="flex items-center gap-4">
                  <p className="font-serif text-3xl italic text-gold-700">{p.number}</p>
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-forest-900/15 text-gold-700">
                    <PillarIcon name={p.icon} className="h-5 w-5" />
                  </span>
                </div>
                <h2 className="mt-3 text-display-sm">
                  <Link to={pillarPath(p.slug)} className="hover:text-forest-700">{p.name}</Link>
                </h2>
                <p className="mt-4 text-lead text-ink-soft">{p.outcome}</p>
                <ul className="mt-6 space-y-2.5 border-t border-forest-900/10 pt-6">
                  {p.focus.slice(0, 3).map((f) => (
                    <li key={f} className="flex gap-3 text-[0.98rem] text-ink-soft">
                      <span aria-hidden className="mt-[0.6em] h-[6px] w-[6px] shrink-0 rotate-45 bg-gold-600" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to={pillarPath(p.slug)} className="btn btn-outline mt-8">
                  Explore {p.name} <ArrowRight aria-hidden className="arrow" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section on-dark bg-forest-950 text-cream-50/80">
        <div className="shell">
          <div className="max-w-3xl">
            <Eyebrow className="mb-5">Our approach</Eyebrow>
            <h2 className="text-display-md text-cream-50">
              <Accent text="How a programme *takes shape.*" />
            </h2>
          </div>
          <ol className="mt-14 grid gap-px overflow-hidden rounded-card bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {APPROACH.map((a, i) => (
              <li key={a.title} className="bg-forest-950 p-7 sm:p-8">
                <span className="font-serif text-4xl italic text-gold-300">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-8 text-[1.2rem] text-cream-50">{a.title}</h3>
                <p className="mt-3 text-[0.98rem] leading-relaxed">{a.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="on-dark relative isolate overflow-hidden bg-forest-950 text-cream-50/80" aria-labelledby="kirinyaga-heading">
        <Img src="stock-mount-kenya" alt="" fill sizes="100vw" className="-z-20 opacity-60" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-950 via-forest-950/85 to-forest-950/40" aria-hidden />
        <div className="shell grid gap-14 py-24 lg:grid-cols-12 lg:items-center lg:py-32">
          <div className="lg:col-span-6">
            <Eyebrow className="mb-6">Kirinyaga and beyond</Eyebrow>
            <h2 id="kirinyaga-heading" className="text-display-md text-cream-50">
              <Accent text="Anchored locally, *designed to scale.*" />
            </h2>
            <p className="mt-6 text-lead">
              Kirinyaga County takes its name from Kĩrĩnyaga, the Kikuyu name for Mount Kenya. It is where our French Initiative classrooms, farmer networks and disability-inclusion work are rooted.
            </p>
            <p className="mt-5">
              Our online wellness forums already reach people wherever they are, and every programme model is built so partners can bring it to their own county.
            </p>
            <Link to="/get-involved/partner" className="btn btn-gold mt-9">
              Bring a programme to your county <ArrowRight aria-hidden className="arrow" />
            </Link>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <KenyaMap />
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
