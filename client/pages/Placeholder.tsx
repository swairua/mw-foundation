import { useEffect, useRef } from "react";
import { ArrowRight, ArrowUpRight, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

type FlapLink = {
  label: string;
  to: string;
};

type FoundationPage = {
  id: string;
  navigationLabel: string;
  path: string;
  aliases?: string[];
  sourceUrl: string;
  eyebrow: string;
  title: string;
  description: string;
  accent: string;
  image: string;
  imageAlt: string;
  highlights: string[];
  cta: FlapLink;
  parentId?: string;
  childIds?: string[];
};

const sourceSite = "https://mw-foundation.org";

export const foundationPages: FoundationPage[] = [
  {
    id: "our-work",
    navigationLabel: "Our work",
    path: "/our-work",
    aliases: ["/objectives"],
    sourceUrl: `${sourceSite}/objectives/`,
    eyebrow: "What we do",
    title: "Progress is a practice.",
    description: "We create practical pathways to opportunity through technology, education, economic empowerment, wellness, and disability inclusion.",
    accent: "Focus areas",
    image: "https://mw-foundation.org/wp-content/uploads/elementor/thumbs/pexels-a-darmel-7710088-rf9uo56hrnrzgo3q46vmg1vebofrn12geh589vva34.jpg",
    imageAlt: "Young people learning together",
    highlights: ["Digital inclusion", "Education & leadership", "Women’s economic empowerment", "Wellness & disability inclusion"],
    cta: { label: "Explore technology and innovation", to: "/tech-and-innovation" },
    childIds: ["technology", "education", "economic-empowerment", "disability-inclusion", "wellness"],
  },
  {
    id: "who-we-are",
    navigationLabel: "Who we are",
    path: "/who-we-are",
    aliases: ["/about-us"],
    sourceUrl: `${sourceSite}/about-us/`,
    eyebrow: "Our story",
    title: "People at the heart of progress.",
    description: "Mercy Wanjau Foundation is a beacon of hope for inclusive growth and social transformation across Kenya’s rural communities.",
    accent: "Our point of view",
    image: "https://mw-foundation.org/wp-content/uploads/2022/08/home6-i1.png",
    imageAlt: "Community members gathered together",
    highlights: ["Community-led change", "Dignity in every opportunity", "Local work, shared impact", "A future where everyone belongs"],
    cta: { label: "Read our vision", to: "/#manifesto" },
  },
  {
    id: "news",
    navigationLabel: "News & stories",
    path: "/news",
    aliases: ["/news-and-stories"],
    sourceUrl: `${sourceSite}/news-and-stories/`,
    eyebrow: "News & stories",
    title: "Stories of change, shared.",
    description: "Follow the people, partnerships, and everyday ideas that are bringing opportunity closer to communities across Kenya.",
    accent: "From the foundation",
    image: "https://mw-foundation.org/wp-content/uploads/2025/11/pexels-rethaferguson-3621954-740x416.jpg",
    imageAlt: "A woman smiling outdoors",
    highlights: ["Community voices", "Ideas in action", "Partners in progress", "Moments that matter"],
    cta: { label: "Visit the source site", to: `${sourceSite}/news-and-stories/` },
  },
  {
    id: "support",
    navigationLabel: "Support our mission",
    path: "/support",
    aliases: ["/contacts"],
    sourceUrl: `${sourceSite}/contacts/`,
    eyebrow: "Get involved",
    title: "Let’s work together.",
    description: "Your time, partnership, and belief can help make opportunity more visible, more accessible, and more possible.",
    accent: "Take part",
    image: "https://mw-foundation.org/wp-content/uploads/elementor/thumbs/pexels-greta-hoffman-9705815-riyi0un2ufba8raynekbvh8yw0l39klkvdiwxb6ms0.jpg",
    imageAlt: "A woman working at a laptop",
    highlights: ["Donate to a good idea", "Volunteer your skills", "Partner for local impact", "Share the work"],
    cta: { label: "Contact the foundation", to: "mailto:info@mw-foundation.org" },
  },
  {
    id: "technology",
    navigationLabel: "Technology",
    path: "/tech-and-innovation",
    sourceUrl: `${sourceSite}/tech-and-innovation/`,
    eyebrow: "Our work · 01",
    title: "Technology that opens doors.",
    description: "We help people build the digital confidence, access, and connections they need to learn, participate, and find new opportunity.",
    accent: "Technology",
    image: "https://mw-foundation.org/wp-content/uploads/elementor/thumbs/pexels-a-darmel-7710088-rf9uo56hrnrzgo3q46vmg1vebofrn12geh589vva34.jpg",
    imageAlt: "Young people learning together",
    highlights: ["Digital skills", "Access to knowledge", "Innovation for communities", "Connections that create opportunity"],
    cta: { label: "Explore all focus areas", to: "/our-work" },
    parentId: "our-work",
    childIds: ["technology", "education", "economic-empowerment", "disability-inclusion", "wellness"],
  },
  {
    id: "education",
    navigationLabel: "Education and leadership",
    path: "/education",
    sourceUrl: `${sourceSite}/education/`,
    eyebrow: "Our work · 02",
    title: "Curious minds. Courageous leaders.",
    description: "We nurture learning and leadership pathways that equip young people to shape a more inclusive and resilient future.",
    accent: "Education and leadership",
    image: "https://mw-foundation.org/wp-content/uploads/elementor/thumbs/pexels-n-voitkevich-7172820-rf9uo56hrnrzgo3q46vmg1vebofrn12geh589vva34.jpg",
    imageAlt: "Students learning together",
    highlights: ["Learning pathways", "Youth leadership", "Mentorship and confidence", "Skills for a changing world"],
    cta: { label: "Explore all focus areas", to: "/our-work" },
    parentId: "our-work",
    childIds: ["technology", "education", "economic-empowerment", "disability-inclusion", "wellness"],
  },
  {
    id: "economic-empowerment",
    navigationLabel: "Economic empowerment",
    path: "/economic-empowerment",
    sourceUrl: `${sourceSite}/economic-empowerment/`,
    eyebrow: "Our work · 03",
    title: "Backing people to thrive.",
    description: "We support women and communities with practical skills, resources, and confidence to build more secure livelihoods.",
    accent: "Economic empowerment",
    image: "https://mw-foundation.org/wp-content/uploads/elementor/thumbs/pexels-greta-hoffman-9705815-riyi0un2ufba8raynekbvh8yw0l39klkvdiwxb6ms0.jpg",
    imageAlt: "A woman working at a laptop",
    highlights: ["Women’s enterprise", "Skills and resources", "Confidence to lead", "More resilient livelihoods"],
    cta: { label: "Explore all focus areas", to: "/our-work" },
    parentId: "our-work",
    childIds: ["technology", "education", "economic-empowerment", "disability-inclusion", "wellness"],
  },
  {
    id: "disability-inclusion",
    navigationLabel: "Disability inclusion",
    path: "/disability-inclusion",
    sourceUrl: `${sourceSite}/disability-inclusion/`,
    eyebrow: "Our work · 04",
    title: "Every person belongs.",
    description: "We work toward communities where persons with disabilities can participate fully, contribute meaningfully, and access opportunity.",
    accent: "Disability inclusion",
    image: "https://mw-foundation.org/wp-content/uploads/elementor/thumbs/pexels-cottonbro-8527286-rf9uo56hrnrzgo3q46vmg1vebofrn12geh589vva34.jpg",
    imageAlt: "People sharing a moment together",
    highlights: ["Access and dignity", "Participation without barriers", "Community belonging", "Opportunity for all"],
    cta: { label: "Explore all focus areas", to: "/our-work" },
    parentId: "our-work",
    childIds: ["technology", "education", "economic-empowerment", "disability-inclusion", "wellness"],
  },
  {
    id: "wellness",
    navigationLabel: "Wellness and mental health",
    path: "/wellness-and-mental-health",
    sourceUrl: `${sourceSite}/wellness-and-mental-health/`,
    eyebrow: "Our work · 05",
    title: "Wellbeing can flourish.",
    description: "We create space for physical and mental wellbeing, helping communities build resilience, care, and connection.",
    accent: "Wellness",
    image: "https://mw-foundation.org/wp-content/uploads/2025/11/pexels-rethaferguson-3621954-740x416.jpg",
    imageAlt: "A woman smiling outdoors",
    highlights: ["Mental wellbeing", "Healthy communities", "Resilience and care", "Connection that strengthens us"],
    cta: { label: "Explore all focus areas", to: "/our-work" },
    parentId: "our-work",
    childIds: ["technology", "education", "economic-empowerment", "disability-inclusion", "wellness"],
  },
];

export const flapRoutePaths = foundationPages.flatMap((page) => [page.path, ...(page.aliases ?? [])]);

const pageById = new Map(foundationPages.map((page) => [page.id, page]));

export default function FlapPanel() {
  const location = useLocation();
  const navigate = useNavigate();
  const dialogRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = location.pathname.replace(/\/$/, "") || "/";
  const content = foundationPages.find((page) => [page.path, ...(page.aliases ?? [])].includes(pathname));

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, [pathname]);

  if (!content) return null;

  const parent = content.parentId ? pageById.get(content.parentId) : undefined;
  const childPages = content.childIds?.map((id) => pageById.get(id)).filter((page): page is FoundationPage => Boolean(page));
  const close = () => navigate("/");
  const trapFocus = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape") {
      close();
      return;
    }
    if (event.key !== "Tab") return;

    const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const isExternal = content.cta.to.startsWith("http") || content.cta.to.startsWith("mailto:");

  return (
    <div className="fixed inset-0 z-[60] lg:z-40" aria-label={`${content.eyebrow} panel`}>
      <button type="button" aria-label="Close section panel" className="section-flap-backdrop absolute inset-0 bg-forest/65 lg:bg-forest/55" onClick={close} />
      <section ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="section-flap-title" onKeyDown={trapFocus} className="section-flap absolute inset-y-0 right-0 flex w-full max-w-[720px] flex-col overflow-y-auto bg-ivory text-forest shadow-2xl lg:w-[min(58vw,720px)]">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-forest/10 bg-ivory/95 px-6 py-5 backdrop-blur lg:px-10">
          <Link to="/" className="text-xs font-bold uppercase tracking-[0.18em] text-forest/60 transition hover:text-forest">Mercy Wanjau Foundation</Link>
          <button ref={closeButtonRef} type="button" onClick={close} className="inline-flex min-h-12 items-center gap-2 rounded-full border border-forest/20 px-4 text-sm font-bold transition hover:border-forest hover:bg-forest hover:text-white" aria-label="Close section panel">
            <span>Close</span><X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="px-6 pb-12 pt-10 lg:px-10 lg:pb-16 lg:pt-14">
          <p className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-coral"><span className="h-px w-8 bg-coral" />{content.eyebrow}</p>
          <h1 id="section-flap-title" className="max-w-xl font-display text-5xl font-semibold leading-[0.9] tracking-[-0.055em] sm:text-6xl lg:text-7xl">{content.title}</h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-forest/65">{content.description}</p>

          <div className="mt-11 overflow-hidden bg-forest">
            <img src={content.image} alt={content.imageAlt} className="h-64 w-full object-cover opacity-85 mix-blend-luminosity sm:h-80" />
          </div>

          <div className="mt-11 border-t border-forest/15 pt-7">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-forest/55">{content.accent}</p>
            <ul className="mt-5 divide-y divide-forest/15 border-y border-forest/15">
              {content.highlights.map((highlight, index) => (
                <li key={highlight} className="flex items-center gap-4 py-4 text-base font-semibold"><span className="text-xs font-bold text-saffron">0{index + 1}</span>{highlight}</li>
              ))}
            </ul>
          </div>

          {(parent || childPages) && (
            <nav aria-label="Related pages" className="mt-11 border-t border-forest/15 pt-7">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-forest/55">Continue exploring</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {parent && <Link to={parent.path} className="rounded border border-forest/15 px-4 py-3 text-sm font-semibold text-forest/70 transition hover:border-forest hover:bg-sand hover:text-forest">← {parent.navigationLabel}</Link>}
                {childPages?.map((page) => <Link key={page.id} to={page.path} className={`rounded border px-4 py-3 text-sm font-semibold transition hover:border-forest hover:bg-sand ${page.id === content.id ? "border-saffron bg-saffron/20 text-forest" : "border-forest/15 text-forest/70"}`}>{page.navigationLabel}</Link>)}
              </div>
            </nav>
          )}

          {isExternal ? (
            <a href={content.cta.to} target={content.cta.to.startsWith("http") ? "_blank" : undefined} rel={content.cta.to.startsWith("http") ? "noreferrer" : undefined} className="mt-10 inline-flex items-center gap-3 rounded-full bg-saffron px-6 py-4 text-sm font-bold text-forest transition hover:bg-forest hover:text-white">
              {content.cta.label}<ArrowUpRight size={17} aria-hidden="true" />
            </a>
          ) : (
            <Link to={content.cta.to} className="mt-10 inline-flex items-center gap-3 rounded-full bg-saffron px-6 py-4 text-sm font-bold text-forest transition hover:bg-forest hover:text-white">
              {content.cta.label}<ArrowRight size={17} aria-hidden="true" />
            </Link>
          )}
          <a href={content.sourceUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-forest/60 underline decoration-forest/30 underline-offset-4 transition hover:text-forest">
            View this page on the source site <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>
      </section>
    </div>
  );
}
