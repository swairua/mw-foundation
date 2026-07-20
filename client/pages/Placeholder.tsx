import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";

const pageCopy: Record<string, { eyebrow: string; title: string; text: string }> = {
  "/our-work": { eyebrow: "What we do", title: "Progress is a practice.", text: "Explore the work we are shaping across technology, education, economic empowerment, wellness, and disability inclusion." },
  "/who-we-are": { eyebrow: "Our story", title: "People at the heart of progress.", text: "We are building a movement for inclusive growth and social transformation across Kenya’s rural communities." },
  "/news": { eyebrow: "News & stories", title: "Stories of change, shared.", text: "This space will bring you closer to the people, partnerships, and ideas moving communities forward." },
  "/support": { eyebrow: "Get involved", title: "Let’s work together.", text: "Your time, partnership, and belief can help make opportunity more visible and more accessible." },
};

export default function Placeholder() {
  const location = useLocation();
  const copy = pageCopy[location.pathname] ?? { eyebrow: "Mercy Wanjau Foundation", title: "A page in the making.", text: "Continue prompting to shape this part of the foundation’s story." };

  return (
    <SiteLayout>
      <section className="flex min-h-[72vh] items-center bg-forest px-6 pb-20 pt-40 text-white lg:px-10">
        <div className="mx-auto w-full max-w-[1320px]">
          <p className="mb-7 text-xs font-bold uppercase tracking-[0.22em] text-saffron">{copy.eyebrow}</p>
          <h1 className="max-w-3xl font-display text-6xl font-semibold leading-[0.94] tracking-[-0.05em] sm:text-7xl lg:text-[8.5rem]">{copy.title}</h1>
          <div className="mt-12 flex flex-col justify-between gap-8 border-t border-white/20 pt-6 sm:flex-row sm:items-end">
            <p className="max-w-md text-lg leading-relaxed text-white/65">{copy.text}</p>
            <Link to="/" className="group inline-flex items-center gap-3 text-sm font-bold text-saffron">Back to home <ArrowUpRight size={17} className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
