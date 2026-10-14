import { useEffect, useId, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { Logo } from "./brand";
import { pillarPath, pillars } from "@/lib/content";
import { cx, useScrolled } from "@/lib/hooks";
import { track } from "@/lib/analytics";

const NAV = [
  { label: "Home", to: "/" },
  { label: "Our Work", to: "/our-work", menu: true },
  { label: "Who We Are", to: "/who-we-are" },
  { label: "News & Stories", to: "/news" },
];

export function Header({ overlay }: { overlay: boolean }) {
  const scrolled = useScrolled(24);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const menuId = useId();
  const mobileId = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();

  const solid = !overlay || scrolled || mobileOpen;

  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen && !mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (menuOpen) menuButtonRef.current?.focus();
        setMenuOpen(false);
        setMobileOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (menuOpen && menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [menuOpen, mobileOpen]);

  useEffect(() => {
    document.documentElement.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [mobileOpen]);

  const linkBase = cx(
    "relative inline-flex h-11 items-center gap-1.5 px-1 text-[0.95rem] font-medium transition-colors",
    solid ? "text-ink-soft hover:text-forest-900" : "text-white/85 hover:text-white",
  );
  const active = cx("after:absolute after:inset-x-1 after:bottom-1.5 after:h-px", solid ? "text-forest-900 after:bg-gold-600" : "text-white after:bg-gold-300");

  return (
    <header
      className={cx(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,color] duration-300",
        solid ? "bg-cream-100 shadow-[0_1px_0_rgba(11,32,25,0.08)]" : "on-dark bg-transparent",
      )}
    >
      <div className="shell flex h-[var(--header-h)] items-center justify-between gap-6">
        <Link to="/" className="-m-2 rounded-lg p-2">
          <Logo tone={solid ? "dark" : "light"} />
          <span className="sr-only">, home</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) =>
            item.menu ? (
              <div
                key={item.to}
                ref={menuRef}
                className="relative"
                onMouseEnter={() => {
                  clearTimeout(closeTimer.current);
                  setMenuOpen(true);
                }}
                onMouseLeave={() => {
                  closeTimer.current = setTimeout(() => setMenuOpen(false), 180);
                }}
              >
                <button
                  ref={menuButtonRef}
                  type="button"
                  className={cx(linkBase, location.pathname.startsWith("/our-work") && active)}
                  aria-expanded={menuOpen}
                  aria-controls={menuId}
                  onClick={() => setMenuOpen((v) => !v)}
                >
                  {item.label}
                  <ChevronDown aria-hidden className={cx("h-4 w-4 transition-transform duration-200", menuOpen && "rotate-180")} />
                </button>
                <div
                  id={menuId}
                  hidden={!menuOpen}
                  className="absolute left-1/2 top-full w-[560px] -translate-x-1/2 pt-3"
                >
                  <div className="overflow-hidden rounded-card border border-forest-900/10 bg-cream-50 text-ink shadow-lift">
                    <ul className="grid gap-px bg-forest-900/[0.06] p-px">
                      {pillars.map((p) => (
                        <li key={p.slug}>
                          <Link to={pillarPath(p.slug)} className="group flex gap-4 bg-cream-50 px-5 py-4 transition-colors hover:bg-cream-100">
                            <span className="font-serif text-lg italic text-gold-700">{p.number}</span>
                            <span>
                              <span className="block font-semibold text-forest-900">{p.name}</span>
                              <span className="mt-0.5 block text-sm leading-snug text-ink-mute">{p.outcome}</span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link to="/our-work" className="flex items-center justify-between bg-forest-900 px-5 py-3.5 text-sm font-semibold text-cream-50 hover:bg-forest-800">
                      Overview of our work <ArrowRight aria-hidden className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <NavLink key={item.to} to={item.to} end={item.to === "/"} className={({ isActive }) => cx(linkBase, isActive && active)}>
                {item.label}
              </NavLink>
            ),
          )}
          <Link to="/get-involved" className="btn btn-gold btn-sm ml-1" onClick={() => track("Donate CTA", { location: "header" })}>
            Donate
          </Link>
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <Link to="/get-involved" className="btn btn-gold btn-sm px-4" onClick={() => track("Donate CTA", { location: "header-mobile" })}>
            Donate
          </Link>
          <button
            type="button"
            className={cx("inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors", solid ? "border-forest-900/20 text-forest-900" : "border-white/40 text-white")}
            aria-expanded={mobileOpen}
            aria-controls={mobileId}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X aria-hidden className="h-5 w-5" /> : <Menu aria-hidden className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        id={mobileId}
        hidden={!mobileOpen}
        className="fixed inset-x-0 bottom-0 top-[var(--header-h)] overflow-y-auto border-t border-forest-900/10 bg-cream-100 lg:hidden"
      >
        <nav aria-label="Mobile" className="shell flex min-h-full flex-col py-8">
          <ul className="divide-y divide-forest-900/10 border-y border-forest-900/10">
            {NAV.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) => cx("flex items-center justify-between py-4 text-[1.35rem] font-semibold tracking-[-0.01em]", isActive ? "text-forest-900" : "text-ink-soft")}
                >
                  {item.label}
                  <ArrowRight aria-hidden className="h-5 w-5 text-gold-700" />
                </NavLink>
                {item.menu && (
                  <ul className="-mt-1 grid gap-1 pb-4 pl-1">
                    {pillars.map((p) => (
                      <li key={p.slug}>
                        <Link to={pillarPath(p.slug)} className="flex min-h-[44px] items-center gap-3 text-[1rem] text-ink-soft">
                          <span className="w-6 font-serif italic text-gold-700">{p.number}</span>
                          {p.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
            <li>
              <NavLink to="/contact" className="flex items-center justify-between py-4 text-[1.35rem] font-semibold tracking-[-0.01em] text-ink-soft">
                Contact
                <ArrowRight aria-hidden className="h-5 w-5 text-gold-700" />
              </NavLink>
            </li>
          </ul>
          <div className="mt-8 grid gap-3">
            <Link to="/get-involved" className="btn btn-gold w-full">Donate</Link>
            <Link to="/get-involved/volunteer" className="btn btn-outline w-full">Volunteer or partner</Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
