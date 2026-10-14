import { Link } from "react-router-dom";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { BrandIcon, Logo } from "./brand";
import { NewsletterForm } from "./forms";
import { T } from "./ui";
import { IS_PRODUCTION, pillarPath, pillars, site, telLink, whatsappLink } from "@/lib/content";
import { track } from "@/lib/analytics";

export function Footer() {
  const wa = whatsappLink("Hello Mercy Wanjau Foundation, ");
  const tel = telLink();
  const year = new Date().getFullYear();
  return (
    <footer className="on-dark bg-forest-950 text-cream-50/80">
      <div className="shell grid gap-10 border-b border-white/10 py-14 lg:grid-cols-12 lg:items-end lg:py-16">
        <div className="lg:col-span-6">
          <p className="eyebrow mb-4">Field notes</p>
          <h2 className="text-display-sm text-cream-50">
            Occasional updates from our work in <em className="accent text-gold-300">rural Kenya.</em>
          </h2>
        </div>
        <div className="lg:col-span-6">
          <NewsletterForm />
          <p className="mt-3 text-sm text-cream-50/60">
            No spam. Unsubscribe at any time. See our <Link to="/privacy-policy" className="underline underline-offset-4 hover:text-cream-50">privacy policy</Link>.
          </p>
        </div>
      </div>

      <div className="shell grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-12 lg:py-20">
        <div className="sm:col-span-2 lg:col-span-4">
          <Link to="/" className="-m-2 inline-block rounded-lg p-2">
            <Logo tone="light" />
            <span className="sr-only">, home</span>
          </Link>
          <p className="mt-6 max-w-sm text-[0.95rem] leading-relaxed">{site.tagline}</p>
          <ul className="mt-8 flex gap-2" aria-label="Social media">
            {site.social.map((s) => (
              <li key={s.name}>
                <a
                  href={s.url}
                  rel="me noopener noreferrer"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-cream-50/80 transition hover:border-gold-300 hover:text-gold-300"
                  aria-label={`${s.name} — ${s.handle}`}
                  onClick={() => track("Social click", { network: s.name, location: "footer" })}
                >
                  <BrandIcon name={s.name} className="h-[18px] w-[18px]" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Our work" className="lg:col-span-3">
          <h2 className="mb-5 text-eyebrow font-semibold uppercase text-gold-300">Our work</h2>
          <ul className="space-y-3 text-[0.95rem]">
            {pillars.map((p) => (
              <li key={p.slug}>
                <Link to={pillarPath(p.slug)} className="transition hover:text-cream-50">{p.name}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Foundation" className="lg:col-span-2">
          <h2 className="mb-5 text-eyebrow font-semibold uppercase text-gold-300">Foundation</h2>
          <ul className="space-y-3 text-[0.95rem]">
            <li><Link to="/who-we-are" className="transition hover:text-cream-50">Who we are</Link></li>
            <li><Link to="/news" className="transition hover:text-cream-50">News &amp; stories</Link></li>
            <li><Link to="/get-involved" className="transition hover:text-cream-50">Donate</Link></li>
            <li><Link to="/get-involved/volunteer" className="transition hover:text-cream-50">Volunteer</Link></li>
            <li><Link to="/get-involved/partner" className="transition hover:text-cream-50">Partner with us</Link></li>
            <li><Link to="/contact" className="transition hover:text-cream-50">Contact</Link></li>
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <h2 className="mb-5 text-eyebrow font-semibold uppercase text-gold-300">Contact</h2>
          <address className="space-y-4 text-[0.95rem] not-italic">
            <p className="flex gap-3">
              <MapPin aria-hidden className="mt-1 h-4 w-4 shrink-0 text-gold-300" />
              <span>{site.contact.address.join(", ")}</span>
            </p>
            <p className="flex gap-3">
              <Mail aria-hidden className="mt-1 h-4 w-4 shrink-0 text-gold-300" />
              <a href={`mailto:${site.contact.email}`} className="transition hover:text-cream-50">{site.contact.email}</a>
            </p>
            <p className="flex gap-3">
              <Phone aria-hidden className="mt-1 h-4 w-4 shrink-0 text-gold-300" />
              {tel ? <a href={tel} className="transition hover:text-cream-50">{site.contact.phone}</a> : <T value={site.contact.phone} />}
            </p>
            {wa ? (
              <a href={wa} className="inline-flex items-center gap-3 font-semibold text-cream-50 hover:text-gold-300" onClick={() => track("WhatsApp click", { location: "footer" })}>
                <BrandIcon name="WhatsApp" className="h-4 w-4 text-gold-300" /> Chat on WhatsApp
              </a>
            ) : (
              <p className="flex gap-3">
                <BrandIcon name="WhatsApp" className="mt-1 h-4 w-4 shrink-0 text-gold-300" />
                <T value={site.contact.whatsapp} />
              </p>
            )}
          </address>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="shell py-8 text-[0.82rem] leading-relaxed text-cream-50/60">
          <p className="max-w-4xl">{site.independenceStatement}</p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {year} {site.registration.legalName}. Registration no. <T value={site.registration.number} fallback="available on request" />.
            </p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              <li><Link to="/privacy-policy" className="hover:text-cream-50">Privacy</Link></li>
              <li><Link to="/terms-of-use" className="hover:text-cream-50">Terms of use</Link></li>
              {!IS_PRODUCTION && (
                <li>
                  <a href={site.previousSiteUrl} className="inline-flex items-center gap-1 hover:text-cream-50" rel="noopener noreferrer">
                    Visit previous site <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
