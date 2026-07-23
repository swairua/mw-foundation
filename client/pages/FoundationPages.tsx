import { ArrowRight, ArrowUpRight, HandCoins, Handshake, Mail, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { contentArchive, focusPages, sourceSite, type FocusPage } from "./foundation-content";

const buttonClass = "inline-flex items-center gap-3 rounded-full bg-saffron px-6 py-4 text-sm font-bold text-forest transition hover:bg-forest hover:text-white";

function PageHero({ eyebrow, title, description, image, imageAlt }: Pick<FocusPage, "eyebrow" | "title" | "description" | "image" | "imageAlt">) {
  return (
    <section className="bg-forest px-6 pb-16 pt-40 text-white lg:px-10 lg:pb-24 lg:pt-48">
      <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[1fr_0.7fr] lg:items-end">
        <div><p className="mb-7 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-saffron"><span className="h-px w-9 bg-saffron" />{eyebrow}</p><h1 className="max-w-4xl font-display text-5xl font-semibold leading-[0.95] tracking-[-0.055em] sm:text-6xl lg:text-8xl">{title}</h1><p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/75">{description}</p></div>
        <img src={image} alt={imageAlt} className="h-72 w-full rounded-[2px] object-cover lg:h-96" />
      </div>
    </section>
  );
}

function RelatedPages({ current }: { current?: string }) {
  return <nav aria-label="Related pages" className="mt-20 border-t border-forest/15 pt-8"><p className="text-xs font-bold uppercase tracking-[0.2em] text-forest/70">Continue exploring</p><div className="mt-5 flex flex-wrap gap-3">{focusPages.map((page) => <Link key={page.id} to={page.path} className={`rounded border px-4 py-3 text-sm font-semibold transition hover:border-forest hover:bg-sand ${page.id === current ? "border-saffron bg-saffron/20 text-forest" : "border-forest/20 text-forest/80"}`}>{page.label}</Link>)}</div></nav>;
}

export function FocusPageView({ page }: { page: FocusPage }) {
  return <><PageHero {...page} /><section className="bg-ivory px-6 py-20 lg:px-10 lg:py-28"><div className="mx-auto grid max-w-[1320px] gap-14 lg:grid-cols-[0.7fr_1.3fr]"><div><p className="text-xs font-bold uppercase tracking-[0.22em] text-forest/70">{page.label}</p><p className="mt-5 text-2xl font-semibold leading-tight text-forest">Practical opportunity, designed around people.</p></div><div><p className="max-w-2xl text-xl leading-relaxed text-forest/80">{page.description}</p><ul className="mt-12 divide-y divide-forest/15 border-y border-forest/15">{page.highlights.map((highlight, index) => <li key={highlight} className="flex items-center gap-4 py-5 text-base font-semibold text-forest"><span className="text-xs font-bold text-clay">0{index + 1}</span>{highlight}</li>)}</ul><RelatedPages current={page.id} /></div></div></section><section className="bg-coral px-6 py-20 text-forest lg:px-10"><div className="mx-auto flex max-w-[1320px] flex-col gap-7 sm:flex-row sm:items-center sm:justify-between"><h2 className="max-w-2xl font-display text-4xl font-semibold leading-tight tracking-[-0.04em]">Help make opportunity more visible and possible.</h2><Link to="/support" className="inline-flex w-fit items-center gap-3 rounded-full bg-forest px-6 py-4 text-sm font-bold text-white transition hover:bg-saffron hover:text-forest">Support the mission <ArrowRight size={17} /></Link></div></section></>;
}

export function OurWorkPage() {
  const { objectives } = contentArchive.pages;
  return <><PageHero eyebrow="What we do" title="Progress is a practice." description={objectives.intro} image="/assets/images/economic-empowerment-women.jpg" imageAlt="Three women smiling as they work together at a laptop" /><section className="bg-sand px-6 py-20 lg:px-10 lg:py-28"><div className="mx-auto max-w-[1320px]"><p className="text-xs font-bold uppercase tracking-[0.22em] text-forest/70">Our focus areas</p><div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{focusPages.map((page) => <Link key={page.id} to={page.path} className="group bg-forest p-7 text-white transition hover:bg-forest/90"><p className="text-xs font-bold uppercase tracking-[0.18em] text-saffron">{page.label}</p><h2 className="mt-16 font-display text-3xl font-semibold leading-none">{page.title}</h2><p className="mt-5 text-sm leading-relaxed text-white/75">{page.description}</p><span className="mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-saffron">Explore <ArrowUpRight size={15} /></span></Link>)}</div></div></section></>;
}

export function WhoWeArePage() {
  const { about, home } = contentArchive.pages;
  return <><PageHero eyebrow="Our story" title="People at the heart of progress." description={about.mission} image="/assets/images/rural-community.jpg" imageAlt="Community members standing in a circle with their hands joined at the centre" /><section className="bg-ivory px-6 py-20 lg:px-10 lg:py-28"><div className="mx-auto grid max-w-[1320px] gap-14 lg:grid-cols-[0.7fr_1.3fr]"><p className="text-xs font-bold uppercase tracking-[0.22em] text-forest/70">Our point of view</p><div><h2 className="font-display text-4xl font-semibold leading-tight text-forest lg:text-5xl">{home.objectives}</h2><p className="mt-8 text-lg leading-relaxed text-forest/80">{home.vision}</p><h3 className="mt-14 text-xs font-bold uppercase tracking-[0.2em] text-forest/70">Our principles</h3><div className="mt-5 grid gap-3 sm:grid-cols-2">{home.principles.map((principle) => <div key={principle} className="border border-forest/20 p-4 text-sm font-semibold text-forest">{principle}</div>)}</div></div></div></section><section className="bg-sand px-6 py-20 lg:px-10 lg:py-28"><div className="mx-auto max-w-[1320px]"><p className="text-xs font-bold uppercase tracking-[0.22em] text-forest/70">Our founder</p><div className="mt-10 grid gap-10 lg:grid-cols-[auto_1fr] lg:gap-16"><img src="/assets/images/community-support.jpg" alt={`${about.founder.name}, ${about.founder.title} of the Mercy Wanjau Foundation`} width={300} height={300} loading="lazy" className="h-56 w-56 rounded-[2px] object-cover sm:h-64 sm:w-64" /><div><h2 className="font-display text-3xl font-semibold leading-tight tracking-[-0.03em] text-forest sm:text-4xl">{about.founder.name}</h2><p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-clay">{about.founder.title}</p><p className="mt-6 max-w-3xl text-base leading-relaxed text-forest/80">{about.founder.bio}</p></div></div><div className="mt-14 border-t border-forest/15 pt-8"><h3 className="text-xs font-bold uppercase tracking-[0.2em] text-forest/70">Our code of conduct</h3><div className="mt-5 flex flex-wrap gap-3">{about.codeOfConduct.map((item) => <span key={item} className="rounded-full border border-forest/20 px-4 py-2 text-sm font-semibold text-forest/80">{item}</span>)}</div><RelatedPages /></div></div></section></>;
}

export function NewsPage() {
  return <><PageHero eyebrow="News & stories" title="Stories of change, shared." description="Follow the people, partnerships, and everyday ideas bringing opportunity closer to communities across Kenya." image="/assets/images/healthcare-wellness.jpg" imageAlt="A smiling child looking at the camera" /><section className="bg-ivory px-6 py-20 lg:px-10 lg:py-28"><div className="mx-auto max-w-[1320px]"><p className="mb-10 max-w-2xl text-base leading-relaxed text-forest/80">These are the latest headlines from our programs. Full stories are published on our current site — <a href={sourceSite} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-bold text-forest underline decoration-saffron decoration-2 underline-offset-4 transition hover:text-clay">read them at mw-foundation.org <ArrowUpRight size={14} /></a></p><div className="grid gap-px bg-forest/15 md:grid-cols-2 lg:grid-cols-3">{contentArchive.pages.news.map((story) => <article key={story.title} className="bg-ivory p-7"><p className="text-xs font-bold uppercase tracking-[0.18em] text-clay">{new Date(story.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p><h2 className="mt-8 font-display text-2xl font-semibold leading-tight text-forest">{story.title}</h2><div className="mt-8 flex flex-wrap gap-2">{story.categories.map((category) => <span key={category} className="rounded-full bg-sand px-3 py-1 text-xs font-semibold text-forest/80">{category}</span>)}</div></article>)}</div></div></section></>;
}

export function SupportPage() {
  const { contact } = contentArchive;
  const supportPaths = [
    {
      icon: HandCoins,
      title: "Donate",
      text: "Give toward technology, education, wellness and inclusion programs in Kenya's rural communities. M-PESA and bank giving details are being finalised — email us and we will send them to you the same day.",
      cta: "Email us about giving",
      subject: "Donation — Mercy Wanjau Foundation",
    },
    {
      icon: Users,
      title: "Volunteer",
      text: "Bring your skills, energy, and perspective to the work — mentorship, digital skills training, events, or professional expertise.",
      cta: "Offer your time",
      subject: "Volunteering — Mercy Wanjau Foundation",
    },
    {
      icon: Handshake,
      title: "Partner",
      text: "Build something meaningful with us. We partner with organisations on digital inclusion, assistive technology, education and community wellness.",
      cta: "Start a conversation",
      subject: "Partnership — Mercy Wanjau Foundation",
    },
  ];
  return <><PageHero eyebrow="Get involved" title="Let’s work together." description="Your time, partnership, and belief can help make opportunity more visible, accessible, and possible." image="/assets/images/rural-community.jpg" imageAlt="Community members standing in a circle with their hands joined at the centre" /><section className="bg-ivory px-6 py-20 lg:px-10 lg:py-28"><div className="mx-auto max-w-[1320px]"><div className="grid gap-4 lg:grid-cols-3">{supportPaths.map((path) => <div key={path.title} className="flex flex-col border border-forest/15 bg-white/40 p-8"><path.icon size={28} strokeWidth={1.5} className="text-clay" aria-hidden="true" /><h2 className="mt-6 font-display text-3xl font-semibold text-forest">{path.title}</h2><p className="mt-4 flex-1 text-sm leading-relaxed text-forest/80">{path.text}</p><a href={`mailto:${contact.email}?subject=${encodeURIComponent(path.subject)}`} className="group mt-8 inline-flex w-fit items-center gap-2 text-sm font-bold text-forest">{path.cta} <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></a></div>)}</div><div className="mt-16 grid gap-10 border-t border-forest/15 pt-12 lg:grid-cols-[1fr_1.2fr]"><div><p className="text-xs font-bold uppercase tracking-[0.22em] text-forest/70">Reach us directly</p><h2 className="mt-6 font-display text-4xl font-semibold leading-tight text-forest">We answer every message.</h2></div><div className="space-y-5 text-forest/80"><a href={`mailto:${contact.email}`} className="flex items-center gap-4 border-b border-forest/15 pb-5 text-lg font-semibold text-forest"><Mail className="text-clay" aria-hidden="true" />{contact.email}</a><p className="flex items-center gap-4 border-b border-forest/15 pb-5 text-lg font-semibold text-forest"><MapPin className="text-clay" aria-hidden="true" />{contact.address}</p><a href={`mailto:${contact.email}`} className={`${buttonClass} mt-6`}>Contact the foundation <ArrowUpRight size={17} /></a></div></div></div></section></>;
}

export { sourceSite };
