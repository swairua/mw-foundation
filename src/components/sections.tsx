import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, ChevronRight, GraduationCap, Link2, MapPinned, Play, ShieldCheck, Sprout, Users } from "lucide-react";
import { Accent, Eyebrow, Img, Placeholder, Reveal, T } from "./ui";
import { BrandIcon } from "./brand";
import { BeaconRings, PillarIcon } from "./graphics";
import { formatDate, partners, pillarBySlug, pillarPath, site, SITE_URL, storyPath, whatsappLink, IS_PRODUCTION, type Pillar, type Story } from "@/lib/content";
import { getMedia, imageUrl } from "@/lib/images";
import { cx, useInView, useScrolled } from "@/lib/hooks";
import { track } from "@/lib/analytics";

// ── Page hero for inner pages ───────────────────────────────
export function Breadcrumbs({ items }: { items: { name: string; path?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-mute">
        {items.map((it, i) => (
          <li key={it.name} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight aria-hidden className="h-3.5 w-3.5 opacity-60" />}
            {it.path ? (
              <Link to={it.path} className="hover:text-forest-900">{it.name}</Link>
            ) : (
              <span aria-current="page" className="text-forest-900">{it.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHero({
  eyebrow,
  title,
  lead,
  crumbs,
  image,
  imageCaption,
  children,
}: {
  eyebrow?: string;
  title: string;
  lead?: ReactNode;
  crumbs?: { name: string; path?: string }[];
  image?: string;
  imageCaption?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-forest-900/10">
      <div className="shell pb-14 pt-6 sm:pt-8 lg:pb-20 lg:pt-10">
        {/* Breadcrumbs sit directly under the header; the heading block is centred against the photo
            so there is no dead space and the heading, intro and actions stay above the fold. */}
        {crumbs && <Breadcrumbs items={crumbs} />}
        <div className={cx("grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16", crumbs ? "mt-2 lg:mt-4" : "pt-4")}>
          <div className={image ? "lg:col-span-6" : "lg:col-span-10"}>
            {eyebrow && <Eyebrow className="mb-5">{eyebrow}</Eyebrow>}
            <h1 className="text-display-lg">
              <Accent text={title} />
            </h1>
            {lead && <div className="mt-6 max-w-2xl text-lead text-ink-soft">{lead}</div>}
            {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
          </div>
          {image && (
            <figure className="lg:col-span-6">
              <div className="relative aspect-[3/2] overflow-hidden rounded-card bg-forest-100 shadow-soft lg:max-h-[calc(100svh-var(--header-h)-9rem)]">
                <Img src={image} fill priority sizes="(min-width: 1280px) 600px, (min-width: 1024px) 48vw, 100vw" />
              </div>
              {(imageCaption ?? getMedia(image).caption) && (
                <figcaption className="mt-3 flex items-center gap-2 text-sm text-ink-mute">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-600" aria-hidden />
                  {imageCaption ?? getMedia(image).caption}
                </figcaption>
              )}
            </figure>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Story cards ─────────────────────────────────────────────
export function StoryMetaLine({ story, className }: { story: Story; className?: string }) {
  const pillar = story.pillars[0] ? pillarBySlug.get(story.pillars[0]) : undefined;
  return (
    <p className={cx("flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.72rem] font-semibold uppercase tracking-[0.12em]", className ?? "text-gold-700")}>
      <span>{story.kind}</span>
      {pillar && (
        <>
          <span aria-hidden className="h-1 w-1 rounded-full bg-current opacity-50" />
          <span>{pillar.name}</span>
        </>
      )}
    </p>
  );
}

export function StoryCard({ story, size = "md", headingLevel = 3 }: { story: Story; size?: "lg" | "md" | "sm"; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  const image = story.image;
  return (
    <article className="group relative flex h-full flex-col">
      <div className={cx("relative overflow-hidden rounded-card bg-forest-100", size === "lg" ? "aspect-[16/11]" : "aspect-[3/2]")}>
        {image && (
          <Img
            src={image}
            alt={story.imageAlt ?? undefined}
            fill
            sizes={size === "lg" ? "(min-width: 1024px) 720px, 100vw" : "(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"}
            className="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        )}
      </div>
      <div className={cx("flex flex-1 flex-col", size === "sm" ? "pt-4" : "pt-6")}>
        <StoryMetaLine story={story} />
        <H className={cx("mt-3 leading-[1.18] tracking-[-0.015em]", size === "lg" ? "text-display-sm" : size === "sm" ? "text-lg" : "text-[1.3rem]")}>
          <Link to={storyPath(story.slug)} className="after:absolute after:inset-0 group-hover:text-forest-700">
            {story.title}
          </Link>
        </H>
        {size !== "sm" && <p className="mt-3 line-clamp-3 text-[0.98rem] leading-relaxed text-ink-soft">{story.standfirst ?? story.excerpt}</p>}
        <p className="mt-auto pt-5 text-sm text-ink-mute">
          <time dateTime={story.date}>{formatDate(story.date)}</time>
          <span aria-hidden> · </span>
          {story.readingMinutes} min read
        </p>
      </div>
    </article>
  );
}

// ── Pillar card (image + scrim) ─────────────────────────────
export function PillarCard({ pillar, className, sizes, tall }: { pillar: Pillar; className?: string; sizes: string; tall?: boolean }) {
  return (
    <article className={cx("group relative isolate overflow-hidden rounded-card bg-forest-900 text-white", tall ? "min-h-[440px]" : "min-h-[400px]", className)}>
      <Img src={pillar.image} alt="" fill sizes={sizes} className="-z-10 transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
      <div className="scrim-card absolute inset-0 -z-10" aria-hidden />
      <div className="flex h-full flex-col justify-between p-6 sm:p-8">
        <div className="flex items-start justify-between">
          <span className="font-serif text-2xl italic text-gold-300">{pillar.number}</span>
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-forest-950/30 text-gold-300">
            <PillarIcon name={pillar.icon} className="h-5 w-5" />
          </span>
        </div>
        <div>
          <h3 className="text-[1.65rem] leading-[1.08] tracking-[-0.02em] text-white sm:text-[1.9rem]">
            <Link to={pillarPath(pillar.slug)} className="after:absolute after:inset-0">{pillar.name}</Link>
          </h3>
          <p className="mt-3 max-w-md text-[0.98rem] leading-relaxed text-white/[0.88]">{pillar.outcome}</p>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold-300">
            Explore the pillar <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </article>
  );
}

// ── Animated counter ────────────────────────────────────────
export function Counter({ value, suffix = "" }: { value: number | null; suffix?: string }) {
  const [ref, inView] = useInView<HTMLSpanElement>({ rootMargin: "0px 0px -15% 0px" });
  const [display, setDisplay] = useState<number | null>(value);
  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (value == null || reduced()) return;
    // Below the fold: reset to zero so it can count up when seen
    const el = ref.current;
    if (el && el.getBoundingClientRect().top > window.innerHeight) setDisplay(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!inView || value == null || reduced()) {
      if (inView) setDisplay(value);
      return;
    }
    const start = performance.now();
    const duration = 1400;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setDisplay(Math.round(value * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, value]);

  if (value == null) {
    return (
      <span ref={ref} title="Figure to be confirmed by the Foundation">
        {IS_PRODUCTION ? "—" : "[X]"}
      </span>
    );
  }
  return (
    <span ref={ref} className="tabular" aria-label={`${value.toLocaleString("en-KE")}${suffix}`}>
      <span aria-hidden>
        {(display ?? value).toLocaleString("en-KE")}
        {suffix}
      </span>
    </span>
  );
}

// ── Facts strip (pillar pages) ──────────────────────────────
export function Facts({ facts, dark }: { facts: { value: string; label: string }[]; dark?: boolean }) {
  if (!facts.length) return null;
  return (
    <dl className={cx("grid divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0", dark ? "divide-white/10" : "divide-forest-900/10")}>
      {facts.map((f) => (
        <div key={f.label} className="flex flex-col py-6 sm:px-8 sm:py-2 sm:first:pl-0">
          <dt className={cx("order-2 mt-2 text-[0.95rem] leading-snug", dark ? "text-cream-50/75" : "text-ink-soft")}>{f.label}</dt>
          <dd className={cx("order-1 font-serif text-[3.25rem] italic leading-none tracking-[-0.02em]", dark ? "text-gold-300" : "text-forest-900")}>{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}

// ── Lazy video ──────────────────────────────────────────────
export function VideoBlock({ src, poster, title, caption }: { src: string; poster: string; title: string; caption?: string }) {
  const [playing, setPlaying] = useState(false);
  return (
    <figure>
      <div className="relative aspect-video overflow-hidden rounded-card bg-forest-900">
        {playing ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={src}
            poster={imageUrl(poster, 1200)}
            controls
            autoPlay
            playsInline
            preload="auto"
            aria-label={title}
          />
        ) : (
          <button
            type="button"
            className="group absolute inset-0 h-full w-full text-left"
            onClick={() => {
              setPlaying(true);
              track("Video play", { video: title });
            }}
          >
            <Img src={poster} alt="" fill sizes="(min-width: 1024px) 720px, 100vw" />
            <span className="absolute inset-0 bg-gradient-to-t from-forest-950/70 via-forest-950/10 to-transparent" aria-hidden />
            <span className="absolute bottom-5 left-5 flex items-center gap-4 sm:bottom-7 sm:left-7">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-500 text-forest-950 shadow-lift transition-transform duration-300 group-hover:scale-105 sm:h-[72px] sm:w-[72px]">
                <Play aria-hidden className="ml-1 h-6 w-6 fill-current" />
              </span>
              <span className="text-sm font-semibold text-white">
                Play video<span className="sr-only">: {title}</span> · 0:32
                <span className="block font-normal text-white/75">Loads only when you press play</span>
              </span>
            </span>
          </button>
        )}
      </div>
      {caption && <figcaption className="mt-4 max-w-2xl text-[0.95rem] leading-relaxed text-cream-50/70">{caption}</figcaption>}
    </figure>
  );
}

// ── Share links (no third-party scripts) ────────────────────
export function ShareLinks({ title, path }: { title: string; path: string }) {
  const url = `${SITE_URL}${path}`;
  const [copied, setCopied] = useState(false);
  const links = [
    { name: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}` },
    { name: "X", href: `https://x.com/intent/post?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}&via=mwfoundatn` },
    { name: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
  ];
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-sm font-semibold text-forest-900">Share</span>
      {links.map((l) => (
        <a
          key={l.name}
          href={l.href}
          rel="noopener noreferrer"
          target="_blank"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-forest-900/15 text-forest-900 transition hover:border-forest-900 hover:bg-forest-900 hover:text-cream-50"
          aria-label={`Share on ${l.name} (opens in a new tab)`}
          onClick={() => track("Share", { network: l.name, path })}
        >
          <BrandIcon name={l.name} className="h-4 w-4" />
        </a>
      ))}
      <button
        type="button"
        className="inline-flex h-11 items-center gap-2 rounded-full border border-forest-900/15 px-4 text-sm font-medium text-forest-900 transition hover:border-forest-900"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
            track("Share", { network: "copy", path });
          } catch {
            window.prompt("Copy this link", url);
          }
        }}
      >
        <Link2 aria-hidden className="h-4 w-4" />
        <span aria-live="polite">{copied ? "Link copied" : "Copy link"}</span>
      </button>
    </div>
  );
}

// ── Calls to action ─────────────────────────────────────────
export function CtaBand({
  title = "Help us bring *opportunity closer to home.*",
  text = "Give once or monthly, offer your skills, or bring your organisation alongside our work in rural Kenya.",
}: { title?: string; text?: string }) {
  return (
    <section className="on-dark relative overflow-hidden bg-forest-900">
      <BeaconRings className="-right-32 -top-32 h-[520px] w-[520px]" />
      <div className="shell relative grid gap-10 py-20 lg:grid-cols-12 lg:items-end lg:py-24">
        <div className="lg:col-span-7">
          <h2 className="text-display-md text-cream-50">
            <Accent text={title} />
          </h2>
          <p className="mt-6 max-w-xl text-lead text-cream-50/75">{text}</p>
        </div>
        <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
          <Link to="/get-involved" className="btn btn-gold" onClick={() => track("Donate CTA", { location: "cta-band" })}>
            Donate <ArrowRight aria-hidden className="arrow" />
          </Link>
          <Link to="/get-involved/volunteer" className="btn btn-outline-light">Volunteer</Link>
          <Link to="/get-involved/partner" className="btn btn-outline-light">Partner</Link>
        </div>
      </div>
    </section>
  );
}

export function OfficialChannels({ className }: { className?: string }) {
  return (
    <aside className={cx("flex gap-4 rounded-card border border-forest-900/10 bg-cream-50 p-5 text-sm leading-relaxed text-ink-soft", className)}>
      <ShieldCheck aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-forest-700" />
      <div>
        <p className="font-semibold text-forest-900">Official channels only</p>
        <p className="mt-1">{site.officialChannels}</p>
      </div>
    </aside>
  );
}

// ── Partners strip ──────────────────────────────────────────
export function PartnersStrip() {
  if (!partners.length && IS_PRODUCTION) return null;
  return (
    <section aria-labelledby="partners-heading" className="border-y border-forest-900/10 bg-cream-50">
      <div className="shell flex flex-col gap-8 py-12 lg:flex-row lg:items-center lg:gap-16">
        <h2 id="partners-heading" className="shrink-0 text-eyebrow font-semibold uppercase text-ink-mute">
          Working alongside
        </h2>
        {partners.length ? (
          <ul className="grid flex-1 grid-cols-2 items-center gap-x-10 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
            {partners.map((p) => (
              <li key={p.name} className="flex justify-center">
                {p.url ? (
                  <a href={p.url} rel="noopener noreferrer"><img src={p.logo} alt={p.name} className="max-h-12 w-auto opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0" loading="lazy" /></a>
                ) : (
                  <img src={p.logo} alt={p.name} className="max-h-12 w-auto opacity-80 grayscale" loading="lazy" />
                )}
              </li>
            ))}
          </ul>
        ) : (
          <ul className="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6" aria-label="Partner logos to be supplied">
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i} className="flex h-16 items-center justify-center rounded-lg border border-dashed border-forest-900/20 text-xs font-medium text-ink-mute">
                <Placeholder>Partner logo</Placeholder>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

// ── Floating WhatsApp (only once a number is configured) ────
export function WhatsAppButton() {
  const href = whatsappLink("Hello Mercy Wanjau Foundation, ");
  const scrolled = useScrolled(600);
  if (!href) return null;
  return (
    <a
      href={href}
      rel="noopener noreferrer"
      className={cx(
        "fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-forest-900 text-white shadow-lift transition-all duration-300 hover:bg-forest-800",
        scrolled ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
      aria-label="Chat with us on WhatsApp"
      onClick={() => track("WhatsApp click", { location: "floating" })}
    >
      <BrandIcon name="WhatsApp" className="h-6 w-6" />
    </a>
  );
}

export function ExternalLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a href={href} rel="noopener noreferrer" className={cx("inline-flex items-center gap-1", className)}>
      {children}
      <ArrowUpRight aria-hidden className="h-4 w-4" />
    </a>
  );
}

// ── Impact band (home) ──────────────────────────────────────
// Shows each confirmed headline figure; until the Foundation confirms one, shows
// the documented interim figure from a published field report instead.
type ImpactStat = {
  icon: string;
  value: number | null;
  suffix: string;
  label: string;
  context: string;
  interim: { value: number | string; label: string; context: string };
};

const IMPACT_ICONS: Record<string, typeof GraduationCap> = { graduation: GraduationCap, sprout: Sprout, users: Users, map: MapPinned };

export function ImpactBand({ stats, asOf }: { stats: ImpactStat[]; asOf: string }) {
  const allConfirmed = stats.every((s) => s.value != null);
  return (
    <section aria-labelledby="impact-heading" className="on-dark relative bg-forest-950 text-cream-50">
      <div className="shell">
        <h2 id="impact-heading" className="sr-only">Our impact so far</h2>
        <dl className="grid grid-cols-2 border-t border-white/10 lg:grid-cols-4">
          {stats.map((s, i) => {
            const shown = s.value != null ? { value: s.value, label: s.label, context: s.context, suffix: s.suffix } : { ...s.interim, suffix: "" };
            const Icon = IMPACT_ICONS[s.icon] ?? GraduationCap;
            // The editor may save figures as text; animate them when they are plain numbers
            const figure = typeof shown.value === "string" && /^\d+$/.test(shown.value) ? Number(shown.value) : shown.value;
            return (
              <Reveal
                key={s.label}
                delay={i * 90}
                className={cx(
                  "flex flex-col py-9 sm:py-11 lg:py-14",
                  i % 2 === 1 && "border-l border-white/10 pl-5 sm:pl-8",
                  i % 2 === 0 && "pr-4",
                  i >= 2 && "border-t border-white/10 lg:border-t-0",
                  i === 2 && "lg:border-l lg:pl-8",
                )}
              >
                <dt className="order-2 mt-4">
                  <span className="block text-[0.95rem] font-semibold leading-snug text-cream-50">{shown.label}</span>
                  <span className="mt-1 block text-[0.82rem] leading-snug text-cream-50/60">{shown.context}</span>
                </dt>
                <dd className="order-1">
                  <Icon aria-hidden className="mb-5 h-5 w-5 text-gold-300" strokeWidth={1.5} />
                  <span className="block font-serif text-[clamp(2.75rem,1.9rem+3.2vw,4.75rem)] italic leading-[0.9] tracking-[-0.02em] text-gold-300">
                    {typeof figure === "number" ? <Counter value={figure} suffix={shown.suffix} /> : figure}
                  </span>
                </dd>
              </Reveal>
            );
          })}
        </dl>
        <div className="flex flex-col gap-2 border-t border-white/10 py-5 text-xs text-cream-50/55 sm:flex-row sm:items-center sm:justify-between">
          <p>{allConfirmed ? <>Figures as at <T value={asOf} fallback="the latest report" />.</> : "Figures drawn from our published field reports."}</p>
          <Link to="/news" className="inline-flex items-center gap-1.5 font-semibold text-gold-300 hover:text-gold-200">
            Read the field reports <ArrowRight aria-hidden className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
