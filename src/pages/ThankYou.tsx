import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Accent, Eyebrow } from "@/components/ui";
import { BrandIcon } from "@/components/brand";
import { StoryCard } from "@/components/sections";
import { Seo } from "@/lib/head";
import { featuredStories, SITE_URL } from "@/lib/content";
import { useHydrated } from "@/lib/hooks";

const COPY: Record<string, { title: string; text: string }> = {
  donation: {
    title: "Thank you for *your gift.*",
    text: "Your generosity goes straight into programmes for rural communities. Your M-PESA confirmation message is your receipt. If you would like a formal acknowledgement, email us with your transaction code.",
  },
  volunteer: { title: "Thank you for *offering your time.*", text: "We have received your application and emailed you a confirmation. We will be in touch if there is a suitable role." },
  partner: { title: "Thank you for *reaching out.*", text: "Your enquiry is with our partnerships team, and a confirmation is on its way to your inbox." },
  contact: { title: "Thank you. *We'll be in touch.*", text: "Your message has been sent and a confirmation is on its way to your inbox." },
  newsletter: { title: "You're *subscribed.*", text: "Thank you for following our work. Updates from the field will arrive occasionally — never spam." },
};

export default function ThankYou() {
  const hydrated = useHydrated();
  const [params] = useSearchParams();
  const type = hydrated ? params.get("type") ?? "contact" : "contact";
  const copy = COPY[type] ?? COPY.contact;
  const shareText = `I support the Mercy Wanjau Foundation's work in rural Kenya. ${SITE_URL}`;

  return (
    <>
      <Seo title="Thank you" description="Thank you for supporting the Mercy Wanjau Foundation." path="/thank-you" noindex />
      <section className="border-b border-forest-900/10">
        <div className="shell py-16 sm:py-24 lg:py-28">
          <div className="max-w-3xl">
            <CheckCircle2 aria-hidden className="h-12 w-12 text-forest-700" strokeWidth={1.4} />
            <Eyebrow className="mb-5 mt-8">Received</Eyebrow>
            <h1 className="text-display-lg"><Accent text={copy.title} /></h1>
            <p className="mt-6 text-lead text-ink-soft">{copy.text}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href={`https://wa.me/?text=${encodeURIComponent(shareText)}`} rel="noopener noreferrer" className="btn btn-forest">
                <BrandIcon name="WhatsApp" className="h-4 w-4" /> Share on WhatsApp
              </a>
              <Link to="/news" className="btn btn-outline">Read our stories <ArrowRight aria-hidden className="arrow" /></Link>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="shell">
          <h2 className="text-display-sm">While you're here</h2>
          <div className="mt-10 grid gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {featuredStories().map((s) => <StoryCard key={s.slug} story={s} />)}
          </div>
        </div>
      </section>
    </>
  );
}
