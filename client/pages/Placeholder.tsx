import { useEffect, useRef } from "react";
import { ArrowRight, ArrowUpRight, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

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
};

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
    callToActionHref: "/",
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
};

export default function Placeholder() {
  const location = useLocation();
  const navigate = useNavigate();
  const dialogRef = useRef<HTMLDivElement>(null);
  const content = sections[location.pathname];

  useEffect(() => {
    dialogRef.current?.focus();
  }, [location.pathname]);

  if (!content) return null;

  const close = () => navigate("/");
  const trapFocus = (event: React.KeyboardEvent<HTMLDivElement>) => {
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
          <button type="button" onClick={close} className="inline-flex min-h-12 items-center gap-2 rounded-full border border-forest/20 px-4 text-sm font-bold transition hover:border-forest hover:bg-forest hover:text-white" aria-label="Close section panel">
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
