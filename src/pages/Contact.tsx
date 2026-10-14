import { Clock, Mail, MapPin, Newspaper, Phone } from "lucide-react";
import { Accent, Eyebrow, T } from "@/components/ui";
import { BrandIcon } from "@/components/brand";
import { Breadcrumbs, ExternalLink, OfficialChannels } from "@/components/sections";
import { ContactForm } from "@/components/involve";
import { Seo, breadcrumbLd, organizationLd } from "@/lib/head";
import { site, telLink, whatsappLink } from "@/lib/content";
import { track } from "@/lib/analytics";

export default function Contact() {
  const wa = whatsappLink("Hello Mercy Wanjau Foundation, ");
  const tel = telLink();
  return (
    <>
      <Seo
        title="Contact"
        description="Contact the Mercy Wanjau Foundation on Mbaruk Road, Nairobi, by email, phone or WhatsApp. Media, partnership and general enquiries."
        path="/contact"
        jsonLd={[breadcrumbLd([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }]), organizationLd()]}
      />
      <section className="section pt-6 sm:pt-8 lg:pt-10">
        <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Contact" }]} />
            <Eyebrow className="mb-6">Contact</Eyebrow>
            <h1 className="text-display-lg"><Accent text="Let's *talk.*" /></h1>
            <p className="mt-6 text-lead text-ink-soft">Collaboration starts with a conversation. Write, call or send us a WhatsApp message.</p>

            <ul className="mt-10 divide-y divide-forest-900/10 border-y border-forest-900/10">
              <li className="flex gap-4 py-5">
                <Mail aria-hidden className="mt-1 h-5 w-5 shrink-0 text-gold-700" />
                <div>
                  <p className="text-sm text-ink-mute">Email</p>
                  <a href={`mailto:${site.contact.email}`} className="text-[1.1rem] font-semibold text-forest-900 hover:text-forest-700">{site.contact.email}</a>
                </div>
              </li>
              <li className="flex gap-4 py-5">
                <Phone aria-hidden className="mt-1 h-5 w-5 shrink-0 text-gold-700" />
                <div>
                  <p className="text-sm text-ink-mute">Phone</p>
                  {tel ? <a href={tel} className="text-[1.1rem] font-semibold text-forest-900">{site.contact.phone}</a> : <p className="text-[1.1rem] font-semibold text-forest-900"><T value={site.contact.phone} /></p>}
                </div>
              </li>
              <li className="flex gap-4 py-5">
                <MapPin aria-hidden className="mt-1 h-5 w-5 shrink-0 text-gold-700" />
                <div>
                  <p className="text-sm text-ink-mute">Office</p>
                  <p className="text-[1.1rem] font-semibold text-forest-900">{site.contact.address.join(", ")}</p>
                  <ExternalLink href={site.contact.mapsUrl} className="mt-1 text-sm font-medium text-forest-700 underline underline-offset-4">Open in Google Maps</ExternalLink>
                </div>
              </li>
              <li className="flex gap-4 py-5">
                <Clock aria-hidden className="mt-1 h-5 w-5 shrink-0 text-gold-700" />
                <div>
                  <p className="text-sm text-ink-mute">Hours</p>
                  <p className="text-[1.05rem] text-forest-900"><T value={site.contact.hours} fallback="By appointment" /></p>
                </div>
              </li>
            </ul>

            <div className="mt-8">
              {wa ? (
                <a href={wa} rel="noopener noreferrer" className="btn btn-forest w-full sm:w-auto" onClick={() => track("WhatsApp click", { location: "contact" })}>
                  <BrandIcon name="WhatsApp" className="h-5 w-5" /> Chat with us on WhatsApp
                </a>
              ) : (
                <p className="flex items-center gap-3 rounded-full border border-dashed border-forest-900/25 px-5 py-3 text-sm text-ink-soft">
                  <BrandIcon name="WhatsApp" className="h-5 w-5 text-forest-700" /> WhatsApp chat: <T value={site.contact.whatsapp} fallback="coming soon" />
                </p>
              )}
            </div>

            <div className="mt-10 rounded-card border border-forest-900/10 bg-cream-50 p-6">
              <div className="flex gap-4">
                <Newspaper aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-forest-700" />
                <div className="text-[0.95rem] leading-relaxed text-ink-soft">
                  <p className="font-semibold text-forest-900">Media enquiries</p>
                  <p className="mt-1">
                    For interviews, approved photographs and the founder's official biography, email <a href={`mailto:${site.contact.mediaEmail}?subject=Media%20enquiry`} className="font-medium text-forest-700 underline underline-offset-4">{site.contact.mediaEmail}</a> with "Media enquiry" in the subject line.
                  </p>
                </div>
              </div>
            </div>
            <ul className="mt-8 flex gap-2" aria-label="Social media">
              {site.social.map((s) => (
                <li key={s.name}>
                  <a href={s.url} rel="me noopener noreferrer" aria-label={`${s.name} — ${s.handle}`} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-forest-900/15 text-forest-900 transition hover:border-forest-900 hover:bg-forest-900 hover:text-cream-50">
                    <BrandIcon name={s.name} className="h-[18px] w-[18px]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-card border border-forest-900/10 bg-cream-50 p-6 shadow-soft sm:p-10">
              <h2 className="text-[1.5rem] tracking-[-0.015em]">Send us a message</h2>
              <p className="mb-8 mt-1 text-ink-soft">We read every message. Fields marked * are required.</p>
              <ContactForm />
            </div>
            <OfficialChannels className="mt-6" />
          </div>
        </div>
      </section>
    </>
  );
}
