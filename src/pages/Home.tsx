import { Link } from "react-router-dom";
import { ArrowRight, HandHeart, HeartHandshake, Home as HomeIcon, Leaf, Lightbulb, Scale, ShieldCheck, Users, UserRoundPlus } from "lucide-react";
import { Accent, ArrowLink, Eyebrow, Img, Reveal, SectionHeading } from "@/components/ui";
import { ImpactBand, PartnersStrip, PillarCard, StoryCard, VideoBlock } from "@/components/sections";
import { BeaconRings, KenyaMap, StudentDots } from "@/components/graphics";
import { Seo, organizationLd, websiteLd } from "@/lib/head";
import { about, featuredStories, impact, pillars, storyPath } from "@/lib/content";
import { imageUrl, srcSet } from "@/lib/images";
import { track } from "@/lib/analytics";

const HERO = "stock-hero-mentor-classroom";
const HERO_SIZES = "100vw";

const PRINCIPLE_ICONS: Record<string, typeof ShieldCheck> = {
  shield: ShieldCheck,
  users: Users,
  lightbulb: Lightbulb,
  scale: Scale,
  home: HomeIcon,
  leaf: Leaf,
};

export default function Home() {
  const featured = featuredStories();
  const [lead, ...rest] = featured;
  const frenchStory = "the-french-initiative-opening-global-doors-for-kenyan-students";

  return (
    <>
      <Seo
        description="The Mercy Wanjau Foundation brings education, digital skills, livelihoods, wellness and disability inclusion to rural Kenya, anchored in Kirinyaga County."
        path="/"
        image={HERO}
        jsonLd={[organizationLd(), websiteLd()]}
        preload={{ href: imageUrl(HERO, 1200), srcset: srcSet(HERO), sizes: HERO_SIZES }}
      />

      {/* 1 · Hero — portrait screens stack photo over text so the children stay visible;
           landscape/desktop screens use a full-bleed photo with a side scrim. */}
      <section className="on-dark relative isolate overflow-hidden bg-forest-950 text-white landscape:flex landscape:min-h-[600px] landscape:items-end landscape:[height:100svh] landscape:max-h-[920px]">
        <div className="relative h-[calc(var(--header-h)+70vw)] max-h-[58svh] min-h-[320px] landscape:absolute landscape:inset-0 landscape:-z-10 landscape:h-full landscape:max-h-none">
          <Img src={HERO} fill priority sizes={HERO_SIZES} className="object-[80%_18%] landscape:object-[62%_14%]" style={{ objectPosition: undefined }} />
          <div className="scrim-hero absolute inset-0" aria-hidden />
        </div>
        <div className="shell relative w-full pb-12 pt-1 landscape:pb-16 landscape:pt-32 lg:pb-24">
          <div className="max-w-[44rem]">
            <p className="eyebrow mb-5 text-gold-300 landscape:mb-6">Beacon of hope</p>
            <h1 className="text-display-xl text-white text-shadow-soft">
              Opening doors, <em className="accent text-gold-300">close to home.</em>
            </h1>
            <p className="mt-5 max-w-[34rem] text-lead text-white/[0.88] landscape:mt-6">
              Education, digital skills and fair opportunity for families across rural Kenya.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 landscape:mt-9">
              <Link to="/get-involved" className="btn btn-gold" onClick={() => track("Donate CTA", { location: "hero" })}>
                Donate <ArrowRight aria-hidden className="arrow" />
              </Link>
              <Link to="/our-work" className="btn btn-outline-light">See our work</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2 · Impact band */}
      <ImpactBand stats={impact.stats} asOf={impact.asOf} />

      {/* 3 · About snapshot + where we work */}
      <section className="section">
        <div className="shell grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-16">
          <Reveal className="lg:col-span-7">
            <Eyebrow className="mb-6">Who we are</Eyebrow>
            <h2 className="text-display-md">
              Founded by Mercy Wanjau to bring the opportunities shaping Kenya&apos;s future <em className="accent text-gold-700">within reach of its villages.</em>
            </h2>
            <p className="mt-8 max-w-2xl text-lead text-ink-soft">
              Mercy Wanjau, a lawyer and public servant who helped shape Kenya&apos;s digital and regulatory landscape, set up the Foundation for the communities that national progress too often reaches last.
            </p>
            <p className="mt-5 max-w-2xl text-ink-soft">
              We work alongside schools, farmers, service providers and specialist institutions, beginning in Kirinyaga County and designing every programme so it can grow to new counties.
            </p>
            <div className="mt-9 flex max-w-2xl items-center gap-4 border-t border-forest-900/10 pt-6">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-forest-100">
                <Img src={about.founder.image} alt="" fill sizes="56px" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-forest-900">{about.founder.name}</p>
                <p className="text-sm text-ink-mute">Founder</p>
              </div>
              <ArrowLink to="/who-we-are">Our story</ArrowLink>
            </div>
          </Reveal>
          <Reveal className="lg:col-span-5" delay={120}>
            <div className="on-dark relative overflow-hidden rounded-card bg-forest-950 px-6 pb-8 pt-9 text-cream-50/80 sm:px-10">
              <BeaconRings className="-right-28 -top-28 h-80 w-80" />
              <p className="eyebrow relative">Where we work</p>
              <p className="relative mt-4 text-[1.35rem] font-semibold leading-snug text-cream-50">
                Anchored in Kirinyaga County, <em className="accent text-gold-300">designed to scale.</em>
              </p>
              <KenyaMap className="relative mt-6" />
              <p className="relative mt-4 border-t border-white/10 pt-4 text-sm leading-relaxed">
                Kirinyaga takes its name from Kĩrĩnyaga, the Kikuyu name for Mount Kenya, whose slopes the county shares. Our online wellness forums reach people across the country.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4 · Five pillars */}
      <section className="section border-t border-forest-900/10 bg-cream-150" aria-labelledby="pillars-heading">
        <div className="shell">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow className="mb-5">Our work</Eyebrow>
              <h2 id="pillars-heading" className="text-display-md">
                <Accent text="Five pillars, built around *rural realities.*" />
              </h2>
            </div>
            <p className="text-lead text-ink-soft lg:col-span-5">
              Each pillar starts with a need communities have named, and each is designed to work alongside the others.
            </p>
          </div>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-6 lg:gap-5">
            {pillars.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 80} className={i < 2 ? "lg:col-span-3" : "lg:col-span-2"}>
                <PillarCard
                  pillar={p}
                  tall={i < 2}
                  className="h-full"
                  sizes={i < 2 ? "(min-width: 1024px) 600px, (min-width: 640px) 50vw, 100vw" : "(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"}
                />
              </Reveal>
            ))}
          </div>
          <div className="mt-10">
            <ArrowLink to="/our-work">How we work across the five pillars</ArrowLink>
          </div>
        </div>
      </section>

      {/* 5 · Featured stories */}
      <section className="section" aria-labelledby="stories-heading">
        <div className="shell">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <Eyebrow className="mb-5">News &amp; stories</Eyebrow>
              <h2 id="stories-heading" className="text-display-md">
                <Accent text="From the *field.*" />
              </h2>
            </div>
            <ArrowLink to="/news">All news &amp; stories</ArrowLink>
          </div>
          <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-10">
            {lead && (
              <Reveal className="lg:col-span-7">
                <StoryCard story={lead} size="lg" />
              </Reveal>
            )}
            <div className="grid gap-12 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1 lg:gap-10">
              {rest.map((s, i) => (
                <Reveal key={s.slug} delay={100 + i * 100}>
                  <StoryCard story={s} size="sm" />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6 · Impact video */}
      <section className="on-dark section bg-forest-950 text-cream-50/80" aria-labelledby="video-heading">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-5">
            <Eyebrow className="mb-6">The French Initiative</Eyebrow>
            <h2 id="video-heading" className="text-display-md text-cream-50">
              570 students. Five schools. <em className="accent text-gold-300">One new language.</em>
            </h2>
            <p className="mt-6 text-lead">
              Launched in August 2025 in Kirinyaga County, the French Initiative gives learners who had never studied a foreign language a route to wider study, travel and work.
            </p>
            <div className="mt-10 max-w-md">
              <StudentDots />
            </div>
            <div className="mt-8">
              <Link to={storyPath(frenchStory)} className="link-arrow">
                Read the story <ArrowRight aria-hidden />
              </Link>
            </div>
          </div>
          <div className="lg:col-span-7">
            <VideoBlock
              src="/media/french-initiative-performance.mp4"
              poster="french-initiative-performance"
              title="French Initiative beneficiaries performing"
              caption="Beneficiaries of the French Initiative. The project continues to report growing enthusiasm and improved language skills, opening new educational pathways. Faces are blurred to protect the children."
            />
          </div>
        </div>
      </section>

      {/* 7 · Core principles */}
      <section className="section" aria-labelledby="principles-heading">
        <div className="shell">
          <SectionHeading id="principles-heading"
            align="split"
            eyebrow="Core principles"
            title="How we *work.*"
            intro="Six principles guide every decision, partnership and programme."
          />
          <ul className="mt-14 grid border-l border-t border-forest-900/10 sm:grid-cols-2 lg:grid-cols-3">
            {about.principles.map((p, i) => {
              const Icon = PRINCIPLE_ICONS[p.icon] ?? ShieldCheck;
              return (
                <Reveal as="li" key={p.name} delay={(i % 3) * 70} className="border-b border-r border-forest-900/10 p-7 sm:p-8">
                  <Icon aria-hidden className="h-6 w-6 text-gold-700" strokeWidth={1.5} />
                  <h3 className="mt-6 text-[1.2rem] tracking-[-0.01em]">{p.name}</h3>
                  <p className="mt-2 text-[0.98rem] leading-relaxed text-ink-soft">{p.text}</p>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* 8 · Partners */}
      <PartnersStrip />

      {/* 9 · Take part */}
      <section className="section" aria-labelledby="takepart-heading">
        <div className="shell">
          <SectionHeading id="takepart-heading"
            align="split"
            eyebrow="Take part"
            title="Bring your gift, your skills *or your network.*"
            intro="Every gift, application and enquiry goes directly to the Foundation's own team."
          />
          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Donate",
                text: "Give once or monthly by M-PESA, card or PayPal. Choose an amount and see what it makes possible.",
                to: "/get-involved",
                cta: "Give now",
                icon: HandHeart,
                featured: true,
              },
              {
                title: "Volunteer",
                text: "Mentor learners, teach French, coach a small business or lend professional expertise to our wellness forums.",
                to: "/get-involved/volunteer",
                cta: "Offer your skills",
                icon: UserRoundPlus,
              },
              {
                title: "Partner",
                text: "Fund a cohort, host a digital lab, open remote-work routes for graduates with disabilities, or support a school library.",
                to: "/get-involved/partner",
                cta: "Start a conversation",
                icon: HeartHandshake,
              },
            ].map((c, i) => (
              <Reveal key={c.title} delay={i * 90}>
                <Link
                  to={c.to}
                  onClick={() => c.featured && track("Donate CTA", { location: "take-part" })}
                  className={
                    "group flex h-full flex-col rounded-card p-7 transition duration-300 sm:p-9 " +
                    (c.featured ? "on-dark bg-forest-900 text-cream-50 hover:bg-forest-800" : "border border-forest-900/12 bg-cream-50 hover:border-forest-900/30 hover:shadow-soft")
                  }
                >
                  <c.icon aria-hidden className={c.featured ? "h-7 w-7 text-gold-300" : "h-7 w-7 text-gold-700"} strokeWidth={1.5} />
                  <h3 className={"mt-10 text-[1.75rem] tracking-[-0.02em] " + (c.featured ? "text-cream-50" : "")}>{c.title}</h3>
                  <p className={"mt-3 leading-relaxed " + (c.featured ? "text-cream-50/75" : "text-ink-soft")}>{c.text}</p>
                  <span className={"mt-auto inline-flex items-center gap-2 pt-8 font-semibold " + (c.featured ? "text-gold-300" : "text-forest-900")}>
                    {c.cta} <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
