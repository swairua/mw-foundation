import { useEffect, useRef, type KeyboardEvent } from "react";
import { ArrowRight, ArrowUpRight, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

type FlapLink = {
  label: string;
  to: string;
};

type SectionContent = {
  eyebrow: string;
  title: string;
  description: string;
  accent: string;
  image: string;
  imageAlt: string;
  highlights: string[];
  callToAction: string;
  callToActionHref: string;
  parent?: FlapLink;
  childPages?: FlapLink[];
};

const ourWorkChildren: FlapLink[] = [
  { label: "Technology", to: "/tech-and-innovation" },
  { label: "Education and leadership", to: "/education" },
  { label: "Economic empowerment", to: "/economic-empowerment" },
  { label: "Persons with disability", to: "/disability-inclusion" },
  { label: "Wellness", to: "/wellness-and-mental-health" },
];

const sections: Record<string, SectionContent> = {
  "/our-work": {
    eyebrow: "What we do",
    title: "Progress is a practice.",
    description: "We create practical pathways to opportunity through technology, education, economic empowerment, wellness, and disability inclusion.",
    accent: "Focus areas",
    image: "https://mw-foundation.org/wp-content/uploads/elementor/thumbs/pexels-a-darmel-7710088-rf9uo56hrnrzgo3q46vmg1vebofrn12geh589vva34.jpg",
    imageAlt: "Young people learning together",
    highlights: ["Digital inclusion", "Education & leadership", "Women’s economic empowerment", "Wellness & disability inclusion"],
    callToAction: "Explore our focus areas",
    callToActionHref: "/tech-and-innovation",
    childPages: ourWorkChildren,
  },
  "/objectives": {
    eyebrow: "What we do",
    title: "Progress is a practice.",
    description: "Our work brings technology, education, leadership, economic empowerment, wellness, and inclusion closer to Kenya’s rural communities.",
    accent: "Our impact",
    image: "https://mw-foundation.org/wp-content/uploads/elementor/thumbs/pexels-a-darmel-7710088-rf9uo56hrnrzgo3q46vmg1vebofrn12geh589vva34.jpg",
    imageAlt: "Young people learning together",
    highlights: ["Digital inclusion", "Education & leadership", "Women’s economic empowerment", "Wellness & disability inclusion"],
    callToAction: "Explore our focus areas",
    callToActionHref: "/tech-and-innovation",
    parent: { label: "Our work", to: "/our-work" },
    childPages: ourWorkChildren,
  },
  "/who-we-are": {
    eyebrow: "Our story",
    title: "People at the heart of progress.",
    description: "Mercy Wanjau Foundation is a beacon of hope for inclusive growth and social transformation across Kenya’s rural communities.",
    accent: "Our point of view",
    image: "https://mw-foundation.org/wp-content/uploads/2022/08/home6-i1.png",
    imageAlt: "Community members gathered together",
    highlights: ["Community-led change", "Dignity in every opportunity", "Local work, shared impact", "A future where everyone belongs"],
    callToAction: "Read our vision",
    callToActionHref: "/#manifesto",
  },
  "/about-us": {
    eyebrow: "Our story",
    title: "People at the heart of progress.",
    description: "Our vision is to be a beacon of hope driving inclusive growth and social transformation across Kenya’s rural communities.",
    accent: "Our point of view",
    image: "https://mw-foundation.org/wp-content/uploads/2022/08/home6-i1.png",
    imageAlt: "Community members gathered together",
    highlights: ["Community-led change", "Dignity in every opportunity", "Local work, shared impact", "A future where everyone belongs"],
    callToAction: "Read our vision",
    callToActionHref: "/#manifesto",
    parent: { label: "Who we are", to: "/who-we-are" },
  },
  "/news": {
    eyebrow: "News & stories",
    title: "Stories of change, shared.",
    description: "Follow the people, partnerships, and everyday ideas that are bringing opportunity closer to communities across Kenya.",
    accent: "From the foundation",
    image: "https://mw-foundation.org/wp-content/uploads/2025/11/pexels-rethaferguson-3621954-740x416.jpg",
    imageAlt: "A woman smiling outdoors",
    highlights: ["Community voices", "Ideas in action", "Partners in progress", "Moments that matter"],
    callToAction: "Visit our current website",
    callToActionHref: "https://mw-foundation.org/",
  },
  "/news-and-stories": {
    eyebrow: "News & stories",
    title: "Stories of change, shared.",
    description: "Follow the people, partnerships, and everyday ideas that are bringing opportunity closer to communities across Kenya.",
    accent: "Featured stories",
    image: "https://mw-foundation.org/wp-content/uploads/2025/11/pexels-rethaferguson-3621954-740x416.jpg",
    imageAlt: "A woman smiling outdoors",
    highlights: ["Community voices", "Ideas in action", "Partners in progress", "Moments that matter"],
    callToAction: "Visit our current website",
    callToActionHref: "https://mw-foundation.org/",
    parent: { label: "News & stories", to: "/news" },
  },
  "/support": {
    eyebrow: "Get involved",
    title: "Let’s work together.",
    description: "Your time, partnership, and belief can help make opportunity more visible, more accessible, and more possible.",
    accent: "Take part",
    image: "https://mw-foundation.org/wp-content/uploads/elementor/thumbs/pexels-greta-hoffman-9705815-riyi0un2ufba8raynekbvh8yw0l39klkvdiwxb6ms0.jpg",
    imageAlt: "A woman working at a laptop",
    highlights: ["Donate to a good idea", "Volunteer your skills", "Partner for local impact", "Share the work"],
    callToAction: "Contact the foundation",
    callToActionHref: "mailto:info@mw-foundation.org",
  },
  "/contacts": {
    eyebrow: "Get involved",
    title: "Let’s work together.",
    description: "Your time, partnership, and belief can help make opportunity more visible, more accessible, and more possible.",
    accent: "Take part",
    image: "https://mw-foundation.org/wp-content/uploads/elementor/thumbs/pexels-greta-hoffman-9705815-riyi0un2ufba8raynekbvh8yw0l39klkvdiwxb6ms0.jpg",
    imageAlt: "A woman working at a laptop",
    highlights: ["Donate to a good idea", "Volunteer your skills", "Partner for local impact", "Share the work"],
    callToAction: "Contact the foundation",
    callToActionHref: "mailto:info@mw-foundation.org",
    parent: { label: "Support our mission", to: "/support" },
  },
  "/tech-and-innovation": {
    eyebrow: "Our work · 01",
    title: "Technology that opens doors.",
    description: "We help people build the digital confidence, access, and connections they need to learn, participate, and find new opportunity.",
    accent: "Technology",
    image: "https://mw-foundation.org/wp-content/uploads/elementor/thumbs/pexels-a-darmel-7710088-rf9uo56hrnrzgo3q46vmg1vebofrn12geh589vva34.jpg",
    imageAlt: "Young people learning together",
    highlights: ["Digital skills", "Access to knowledge", "Innovation for communities", "Connections that create opportunity"],
    callToAction: "Explore our work",
    callToActionHref: "/our-work",
    parent: { label: "All focus areas", to: "/our-work" },
    childPages: ourWorkChildren,
  },
  "/education": {
    eyebrow: "Our work · 02",
    title: "Curious minds. Courageous leaders.",
    description: "We nurture learning and leadership pathways that equip young people to shape a more inclusive and resilient future.",
    accent: "Education and leadership",
    image: "https://mw-foundation.org/wp-content/uploads/elementor/thumbs/pexels-n-voitkevich-7172820-rf9uo56hrnrzgo3q46vmg1vebofrn12geh589vva34.jpg",
    imageAlt: "Students learning together",
    highlights: ["Learning pathways", "Youth leadership", "Mentorship and confidence", "Skills for a changing world"],
    callToAction: "Explore our work",
    callToActionHref: "/our-work",
    parent: { label: "All focus areas", to: "/our-work" },
    childPages: ourWorkChildren,
  },
  "/economic-empowerment": {
    eyebrow: "Our work · 03",
    title: "Backing people to thrive.",
    description: "We support women and communities with practical skills, resources, and confidence to build more secure livelihoods.",
    accent: "Economic empowerment",
    image: "https://mw-foundation.org/wp-content/uploads/elementor/thumbs/pexels-greta-hoffman-9705815-riyi0un2ufba8raynekbvh8yw0l39klkvdiwxb6ms0.jpg",
    imageAlt: "A woman working at a laptop",
    highlights: ["Women’s enterprise", "Skills and resources", "Confidence to lead", "More resilient livelihoods"],
    callToAction: "Explore our work",
    callToActionHref: "/our-work",
    parent: { label: "All focus areas", to: "/our-work" },
    childPages: ourWorkChildren,
  },
  "/disability-inclusion": {
    eyebrow: "Our work · 04",
    title: "Every person belongs.",
    description: "We work toward communities where persons with disabilities can participate fully, contribute meaningfully, and access opportunity.",
    accent: "Disability inclusion",
    image: "https://mw-foundation.org/wp-content/uploads/elementor/thumbs/pexels-cottonbro-8527286-rf9uo56hrnrzgo3q46vmg1vebofrn12geh589vva34.jpg",
    imageAlt: "People sharing a moment together",
    highlights: ["Access and dignity", "Participation without barriers", "Community belonging", "Opportunity for all"],
    callToAction: "Explore our work",
    callToActionHref: "/our-work",
    parent: { label: "All focus areas", to: "/our-work" },
    childPages: ourWorkChildren,
  },
  "/wellness-and-mental-health": {
    eyebrow: "Our work · 05",
    title: "Wellbeing can flourish.",
    description: "We create space for physical and mental wellbeing, helping communities build resilience, care, and connection.",
    accent: "Wellness",
    image: "https://mw-foundation.org/wp-content/uploads/2025/11/pexels-rethaferguson-3621954-740x416.jpg",
    imageAlt: "A woman smiling outdoors",
    highlights: ["Mental wellbeing", "Healthy communities", "Resilience and care", "Connection that strengthens us"],
    callToAction: "Explore our work",
    callToActionHref: "/our-work",
    parent: { label: "All focus areas", to: "/our-work" },
    childPages: ourWorkChildren,
  },
};

export default function Placeholder() {
  const location = useLocation();
  const navigate = useNavigate();
  const dialogRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = location.pathname.replace(/\/$/, "") || "/";
  const content = sections[pathname];

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, [pathname]);

  if (!content) return null;

  const close = () => navigate("/");
  const trapFocus = (event: KeyboardEvent<HTMLElement>) => {
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

  const isExternal = content.callToActionHref.startsWith("http") || content.callToActionHref.startsWith("mailto:");

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

          {(content.parent || content.childPages) && (
            <nav aria-label="Related pages" className="mt-11 border-t border-forest/15 pt-7">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-forest/55">Continue exploring</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {content.parent && <Link to={content.parent.to} className="rounded border border-forest/15 px-4 py-3 text-sm font-semibold text-forest/70 transition hover:border-forest hover:bg-sand hover:text-forest">← {content.parent.label}</Link>}
                {content.childPages?.map((page) => <Link key={page.to} to={page.to} className={`rounded border px-4 py-3 text-sm font-semibold transition hover:border-forest hover:bg-sand ${page.to === pathname ? "border-saffron bg-saffron/20 text-forest" : "border-forest/15 text-forest/70"}`}>{page.label}</Link>)}
              </div>
            </nav>
          )}

          {isExternal ? (
            <a href={content.callToActionHref} target={content.callToActionHref.startsWith("http") ? "_blank" : undefined} rel={content.callToActionHref.startsWith("http") ? "noreferrer" : undefined} className="mt-10 inline-flex items-center gap-3 rounded-full bg-saffron px-6 py-4 text-sm font-bold text-forest transition hover:bg-forest hover:text-white">
              {content.callToAction}<ArrowUpRight size={17} aria-hidden="true" />
            </a>
          ) : (
            <Link to={content.callToActionHref} className="mt-10 inline-flex items-center gap-3 rounded-full bg-saffron px-6 py-4 text-sm font-bold text-forest transition hover:bg-forest hover:text-white">
              {content.callToAction}<ArrowRight size={17} aria-hidden="true" />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
