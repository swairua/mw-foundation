import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";

const navigation = [
  { label: "Our work", to: "/our-work" },
  { label: "Who we are", to: "/who-we-are" },
  { label: "News & stories", to: "/news" },
];

export function SiteLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ivory text-ink">
      <header className="absolute inset-x-0 top-0 z-50 border-b border-white/20 text-white">
        <div className="mx-auto flex h-24 max-w-[1320px] items-center justify-between px-6 lg:px-10">
          <Link to="/" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
            <img
              src="https://mw-foundation.org/wp-content/uploads/2025/10/cropped-MERCY-WANJAU-FOUNDATION-LOGO-BLACK-01-scaled-2-270x270.png"
              alt="Mercy Wanjau Foundation"
              className="h-12 w-12 rounded-full bg-white object-contain p-1"
            />
            <span className="max-w-[150px] text-[11px] font-bold uppercase leading-[1.1] tracking-[0.18em]">Mercy Wanjau<br />Foundation</span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
            {navigation.map((item) => (
              <NavLink key={item.to} to={item.to} className="text-sm font-medium text-white/80 transition hover:text-saffron">
                {item.label}
              </NavLink>
            ))}
            <Link to="/support" className="group flex items-center gap-2 rounded-full bg-saffron px-5 py-3 text-sm font-bold text-forest transition hover:bg-white">
              Support our mission <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </nav>

          <button type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} className="rounded-full border border-white/40 p-3 lg:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {menuOpen && (
          <nav className="border-t border-white/15 bg-forest px-6 py-6 lg:hidden" aria-label="Mobile navigation">
            <div className="flex flex-col gap-5">
              {navigation.map((item) => (
                <Link key={item.to} to={item.to} onClick={() => setMenuOpen(false)} className="text-lg font-medium text-white">
                  {item.label}
                </Link>
              ))}
              <Link to="/support" onClick={() => setMenuOpen(false)} className="w-fit rounded-full bg-saffron px-5 py-3 text-sm font-bold text-forest">Support our mission</Link>
            </div>
          </nav>
        )}
      </header>

      <main><Outlet /></main>

      <footer className="bg-forest text-white">
        <div className="mx-auto grid max-w-[1320px] gap-12 px-6 py-16 lg:grid-cols-[1.5fr_1fr_1fr] lg:px-10 lg:py-20">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-saffron text-lg font-black text-forest">MW</div>
              <span className="text-xs font-bold uppercase tracking-[0.16em]">Mercy Wanjau<br />Foundation</span>
            </div>
            <p className="max-w-sm text-2xl font-semibold leading-tight text-white/90">Because real change begins when people are seen, supported and empowered.</p>
          </div>
          <div>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-saffron">Explore</p>
            <div className="flex flex-col items-start gap-3 text-sm text-white/65">
              <Link to="/our-work" className="transition hover:text-white">Our work</Link>
              <Link to="/who-we-are" className="transition hover:text-white">Who we are</Link>
              <Link to="/news" className="transition hover:text-white">News & stories</Link>
              <Link to="/support" className="transition hover:text-white">Support our mission</Link>
            </div>
          </div>
          <div>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-saffron">Get in touch</p>
            <div className="space-y-3 text-sm text-white/65">
              <a href="mailto:info@mw-foundation.org" className="block transition hover:text-white">info@mw-foundation.org</a>
              <p>Mbaruk Road, Nairobi — Kenya</p>
              <a href="https://mw-foundation.org/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 pt-2 font-semibold text-white">Visit current website <ArrowUpRight size={15} /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 px-6 py-5 text-center text-xs text-white/40">© {new Date().getFullYear()} Mercy Wanjau Foundation. Building stronger communities in Kenya.</div>
      </footer>
    </div>
  );
}
