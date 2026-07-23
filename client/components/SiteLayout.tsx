import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { focusPageByPath } from "@/pages/foundation-content";

const navigation = [
  { label: "Our work", to: "/our-work" },
  { label: "Who we are", to: "/who-we-are" },
  { label: "News & stories", to: "/news" },
];

const routeTitles: Record<string, string> = {
  "/": "Mercy Wanjau Foundation — Building stronger communities in Kenya",
  "/our-work": "Our work — Mercy Wanjau Foundation",
  "/who-we-are": "Who we are — Mercy Wanjau Foundation",
  "/news": "News & stories — Mercy Wanjau Foundation",
  "/support": "Support our mission — Mercy Wanjau Foundation",
};

function titleFor(pathname: string) {
  if (routeTitles[pathname]) return routeTitles[pathname];
  const focusPage = focusPageByPath.get(pathname);
  if (focusPage) return `${focusPage.label} — Mercy Wanjau Foundation`;
  return "Page not found — Mercy Wanjau Foundation";
}

export function SiteLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    document.title = titleFor(location.pathname);
    if (!location.hash) window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition hover:text-saffron ${
      isActive ? "text-saffron underline decoration-2 underline-offset-8" : "text-white/85"
    }`;

  return (
    <div className="min-h-screen bg-ivory text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-saffron focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-forest"
      >
        Skip to main content
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 text-white transition-colors duration-300 ${
          menuOpen || scrolled
            ? "bg-forest/95 shadow-lg shadow-forest/20 backdrop-blur-sm"
            : "bg-gradient-to-b from-forest/80 via-forest/30 to-transparent"
        }`}
      >
        <div className="mx-auto flex h-24 max-w-[1320px] items-center justify-between px-6 lg:px-10">
          <Link to="/" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
            <img
              src="/assets/images/logo-mark.png"
              alt=""
              width={48}
              height={48}
              className="h-12 w-12 rounded-full bg-white object-contain p-1.5"
            />
            <span className="max-w-[150px] text-[11px] font-bold uppercase leading-[1.1] tracking-[0.18em]">Mercy Wanjau<br />Foundation</span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
            {navigation.map((item) => (
              <NavLink key={item.to} to={item.to} className={navLinkClass}>
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
                <Link key={item.to} to={item.to} onClick={() => setMenuOpen(false)} className="py-1 text-lg font-medium text-white">
                  {item.label}
                </Link>
              ))}
              <Link to="/support" onClick={() => setMenuOpen(false)} className="w-fit rounded-full bg-saffron px-5 py-3 text-sm font-bold text-forest">Support our mission</Link>
            </div>
          </nav>
        )}
      </header>

      <main id="main"><Outlet /></main>

      <footer className="bg-forest text-white">
        <div className="mx-auto grid max-w-[1320px] gap-12 px-6 py-16 lg:grid-cols-[1.5fr_1fr_1fr] lg:px-10 lg:py-20">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <img
                src="/assets/images/logo-mark.png"
                alt=""
                width={48}
                height={48}
                className="h-12 w-12 rounded-full bg-white object-contain p-1.5"
              />
              <span className="text-xs font-bold uppercase tracking-[0.16em]">Mercy Wanjau<br />Foundation</span>
            </div>
            <p className="max-w-sm text-2xl font-semibold leading-tight text-white/90">Because real change begins when people are seen, supported and empowered.</p>
          </div>
          <div>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-saffron">Explore</p>
            <div className="flex flex-col items-start gap-3 text-sm text-white/70">
              <Link to="/our-work" className="py-0.5 transition hover:text-white">Our work</Link>
              <Link to="/who-we-are" className="py-0.5 transition hover:text-white">Who we are</Link>
              <Link to="/news" className="py-0.5 transition hover:text-white">News & stories</Link>
              <Link to="/support" className="py-0.5 transition hover:text-white">Support our mission</Link>
            </div>
          </div>
          <div>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-saffron">Get in touch</p>
            <div className="space-y-3 text-sm text-white/70">
              <a href="mailto:info@mw-foundation.org" className="block py-0.5 transition hover:text-white">info@mw-foundation.org</a>
              <p>Mbaruk Road, Nairobi — Kenya</p>
              <a href="https://mw-foundation.org/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 pt-2 font-semibold text-white">Visit current website <ArrowUpRight size={15} /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 px-6 py-5 text-center text-xs text-white/60">© {new Date().getFullYear()} Mercy Wanjau Foundation. Building stronger communities in Kenya.</div>
      </footer>
    </div>
  );
}
