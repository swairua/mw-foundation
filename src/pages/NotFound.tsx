import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Accent, Eyebrow } from "@/components/ui";
import { Seo } from "@/lib/head";
import { pillarPath, pillars } from "@/lib/content";

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found" description="The page you were looking for has moved or no longer exists." path="/404" noindex />
      <section className="shell py-20 sm:py-28">
        <div className="max-w-3xl">
          <Eyebrow className="mb-6">Error 404</Eyebrow>
          <h1 className="text-display-lg"><Accent text="This page has *moved on.*" /></h1>
          <p className="mt-6 text-lead text-ink-soft">
            The page may have moved when we launched our new website. These links should help you find what you need.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/" className="btn btn-forest">Go to the home page <ArrowRight aria-hidden className="arrow" /></Link>
            <Link to="/news" className="btn btn-outline">News &amp; stories</Link>
            <Link to="/contact" className="btn btn-outline">Contact us</Link>
          </div>
          <h2 className="mt-16 text-eyebrow font-semibold uppercase text-ink-mute">Our work</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {pillars.map((p) => (
              <li key={p.slug}><Link to={pillarPath(p.slug)} className="chip">{p.name}</Link></li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
