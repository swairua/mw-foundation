// Lightweight brand graphics: no images to download beyond one cached SVG, no JS
// animation libraries. All motion is CSS and switches off for reduced-motion users.
import { Accessibility, BookOpen, HeartPulse, Laptop, Sprout, type LucideIcon } from "lucide-react";
import { cx, useInView } from "@/lib/hooks";
import { Reveal } from "./ui";

export const PILLAR_ICONS: Record<string, LucideIcon> = {
  laptop: Laptop,
  book: BookOpen,
  sprout: Sprout,
  heart: HeartPulse,
  accessibility: Accessibility,
};

export function PillarIcon({ name, className }: { name: string; className?: string }) {
  const Icon = PILLAR_ICONS[name] ?? BookOpen;
  return <Icon aria-hidden className={className} strokeWidth={1.5} />;
}

/** Concentric "beacon" rings that slowly radiate — a nod to the Foundation's vision. */
export function BeaconRings({ className }: { className?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} aria-hidden className={cx("pointer-events-none absolute", inView && "in-view", className)}>
      <span className="beacon-ring" style={{ animationDelay: "0s" }} />
      <span className="beacon-ring" style={{ animationDelay: "2s" }} />
      <span className="beacon-ring" style={{ animationDelay: "4s" }} />
      <span className="absolute inset-[38%] rounded-full border border-gold-500/25" />
    </div>
  );
}

/** Map of Kenya with Kirinyaga County highlighted and Nairobi marked. */
export function KenyaMap({ className, compact = false }: { className?: string; compact?: boolean }) {
  const [ref, inView] = useInView<HTMLElement>();
  return (
    <figure ref={ref} className={cx("relative", inView && "in-view", className)}>
      <div className="relative mx-auto aspect-[400/507] w-full max-w-[340px]">
        <img
          src="/graphics/kenya-map.svg"
          width={400}
          height={507}
          alt="Map of Kenya. Kirinyaga County, where the Foundation's programmes are anchored, is highlighted in central Kenya; Nairobi, home of the Foundation's office, lies to its south-west."
          loading="lazy"
          decoding="async"
          className="h-full w-full"
        />
        <span className="absolute" style={{ left: "42.4%", top: "57.6%" }}>
          <span className="map-pulse" aria-hidden />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-gold-500 px-3 py-1 text-[0.72rem] font-semibold text-forest-950 shadow-soft">
            Kirinyaga County
          </span>
        </span>
        <span className="absolute" style={{ left: "36.4%", top: "66.3%" }}>
          <span className="block h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-forest-950 bg-cream-50" aria-hidden />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 whitespace-nowrap text-[0.72rem] font-semibold text-cream-50/85">Nairobi office</span>
        </span>
      </div>
      {!compact && (
        <figcaption className="mt-5 text-center text-xs text-cream-50/50">County boundaries: geoBoundaries (public domain)</figcaption>
      )}
    </figure>
  );
}

/** 570 dots, one per French Initiative student — drawn with a single CSS background. */
export function StudentDots({ total = 570, columns = 38 }: { total?: number; columns?: number }) {
  const rows = Math.ceil(total / columns);
  return (
    <Reveal className="dot-sweep">
      <figure>
        <div
          role="img"
          aria-label={`${total} dots, one for each student in the French Initiative`}
          className="dot-matrix"
          style={{ aspectRatio: `${columns} / ${rows}` }}
        />
        <figcaption className="mt-3 flex items-center justify-between gap-4 text-xs text-cream-50/60">
          <span>Each dot is one student</span>
          <span className="tabular">{total} students · 5 schools</span>
        </figcaption>
      </figure>
    </Reveal>
  );
}
