import { ArrowDown, ArrowRight, ArrowUpRight, CirclePlay } from "lucide-react";
import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";

const heroImage = "https://mw-foundation.org/wp-content/uploads/2022/08/home6-i1.png";
const programs = [
  { number: "01", title: "Digital inclusion", text: "Opening pathways to knowledge, connection, and opportunity through technology.", image: "https://mw-foundation.org/wp-content/uploads/elementor/thumbs/pexels-a-darmel-7710088-rf9uo56hrnrzgo3q46vmg1vebofrn12geh589vva34.jpg" },
  { number: "02", title: "Education & leadership", text: "Nurturing curious minds and courageous leaders for a changing world.", image: "https://mw-foundation.org/wp-content/uploads/elementor/thumbs/pexels-n-voitkevich-7172820-rf9uo56hrnrzgo3q46vmg1vebofrn12geh589vva34.jpg" },
  { number: "03", title: "Women’s economic empowerment", text: "Backing women with the skills, support, and confidence to thrive.", image: "https://mw-foundation.org/wp-content/uploads/elementor/thumbs/pexels-greta-hoffman-9705815-riyi0un2ufba8raynekbvh8yw0l39klkvdiwxb6ms0.jpg" },
  { number: "04", title: "Wellness", text: "Creating communities where physical and mental wellbeing can flourish.", image: "https://mw-foundation.org/wp-content/uploads/2025/11/pexels-rethaferguson-3621954-740x416.jpg" },
  { number: "05", title: "Disability inclusion", text: "Making sure every person can participate, contribute, and belong.", image: "https://mw-foundation.org/wp-content/uploads/elementor/thumbs/pexels-cottonbro-8527286-rf9uo56hrnrzgo3q46vmg1vebofrn12geh589vva34.jpg" },
];

export default function Index() {
  return (
    <SiteLayout>
      <section className="relative flex min-h-[720px] items-end overflow-hidden bg-forest px-6 pb-12 pt-36 text-white lg:min-h-[860px] lg:px-10 lg:pb-16">
        <img src={heroImage} alt="A community gathering in Kenya" className="absolute inset-0 h-full w-full object-cover object-center opacity-70 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/45 to-forest/25" />
        <div className="relative mx-auto grid w-full max-w-[1320px] gap-12 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <p className="mb-7 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-saffron"><span className="h-px w-9 bg-saffron" /> Inclusive growth, together</p>
            <h1 className="max-w-5xl font-display text-[4.4rem] font-semibold leading-[0.86] tracking-[-0.06em] sm:text-8xl lg:text-[9.5rem]">A future where <em className="font-serif font-normal text-saffron">everyone</em> belongs.</h1>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link to="/our-work" className="group inline-flex items-center gap-3 rounded-full bg-saffron px-6 py-4 text-sm font-bold text-forest transition hover:bg-white">Explore our work <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Link>
              <a href="#manifesto" className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-4 text-sm font-semibold text-white transition hover:border-white">Our vision <ArrowDown size={16} /></a>
            </div>
          </div>
          <div className="border-l border-white/35 pl-6 lg:mb-2">
            <p className="text-sm leading-relaxed text-white/75">Building stronger communities in Kenya through technology, education, leadership, economic empowerment, wellness and inclusion.</p>
            <div className="mt-7 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-white/55"><span className="h-2 w-2 rounded-full bg-saffron" /> Kenya, and beyond</div>
          </div>
        </div>
      </section>

      <section id="manifesto" className="bg-ivory px-6 py-24 lg:px-10 lg:py-36">
        <div className="mx-auto grid max-w-[1320px] gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-forest/55">Our point of view</p>
            <div className="mt-16 hidden items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-forest/50 lg:flex"><span className="h-px w-10 bg-saffron" /> 01 / 05</div>
          </div>
          <div>
            <h2 className="max-w-4xl font-display text-5xl font-semibold leading-[0.94] tracking-[-0.05em] text-forest sm:text-6xl lg:text-8xl">We believe change starts when people are <em className="font-serif font-normal text-saffron">seen,</em> supported and empowered.</h2>
            <div className="mt-12 grid gap-8 border-t border-forest/15 pt-7 sm:grid-cols-[1fr_auto] sm:items-end">
              <p className="max-w-lg text-base leading-relaxed text-forest/65">Our vision is to be a beacon of hope driving inclusive growth and social transformation across Kenya’s rural communities.</p>
              <Link to="/who-we-are" className="group inline-flex items-center gap-3 text-sm font-bold text-forest">More about us <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-sand px-6 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-[1320px]">
          <div className="mb-14 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div><p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-forest/55">Our focus areas</p><h2 className="max-w-2xl font-display text-5xl font-semibold leading-[0.9] tracking-[-0.05em] text-forest sm:text-7xl">Many paths.<br /><em className="font-serif font-normal text-coral">One shared purpose.</em></h2></div>
            <p className="max-w-xs text-sm leading-relaxed text-forest/60">We work at the intersection of opportunity, dignity, and community-led change.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {programs.map((program, index) => (
              <Link to="/our-work" key={program.number} className={`group relative min-h-[390px] overflow-hidden rounded-[2px] bg-forest ${index === 0 ? "lg:col-span-2" : ""}`}>
                <img src={program.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-65 transition duration-700 group-hover:scale-105 group-hover:opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/25 to-transparent" />
                <div className="relative flex h-full flex-col justify-between p-6 text-white lg:p-8"><span className="text-xs font-bold tracking-[0.2em] text-saffron">{program.number}</span><div><h3 className="max-w-sm font-display text-3xl font-semibold leading-none tracking-[-0.03em] sm:text-4xl">{program.title}</h3><p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">{program.text}</p><span className="mt-7 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-saffron">Discover <ArrowUpRight size={15} /></span></div></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-coral px-6 py-20 text-forest lg:px-10 lg:py-28">
        <div className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div><p className="mb-6 text-xs font-bold uppercase tracking-[0.22em] text-forest/60">A beacon of hope</p><h2 className="max-w-4xl font-display text-5xl font-semibold leading-[0.92] tracking-[-0.05em] sm:text-7xl lg:text-[7.2rem]">The work is local.<br /><em className="font-serif font-normal">The impact is shared.</em></h2></div>
          <CirclePlay size={68} strokeWidth={1} className="text-forest/60" />
        </div>
      </section>

      <section className="bg-ivory px-6 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-[1320px]">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-end"><div><p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-forest/55">Take part</p><h2 className="max-w-xl font-display text-5xl font-semibold leading-[0.92] tracking-[-0.05em] text-forest sm:text-7xl">There’s a role for <em className="font-serif font-normal text-saffron">you.</em></h2></div><p className="max-w-md text-base leading-relaxed text-forest/65">Sustainable change is a collective act. Join us in making opportunity more visible, accessible, and possible for more people.</p></div>
          <div className="mt-16 grid border-y border-forest/15 md:grid-cols-3">{[{ title: "Donate", text: "Help move a good idea into a real opportunity." }, { title: "Volunteer", text: "Bring your skills, energy, and perspective to the work." }, { title: "Partner", text: "Build something meaningful with us." }].map((item) => <Link to="/support" key={item.title} className="group border-b border-forest/15 p-7 transition hover:bg-sand md:border-b-0 md:border-r last:border-r-0"><div className="flex items-start justify-between"><h3 className="font-display text-3xl font-semibold text-forest">{item.title}</h3><ArrowUpRight size={20} className="text-forest/50 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></div><p className="mt-10 max-w-[220px] text-sm leading-relaxed text-forest/60">{item.text}</p></Link>)}</div>
        </div>
      </section>
    </SiteLayout>
  );
}
