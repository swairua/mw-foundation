import { Suspense, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CookieNotice } from "./CookieNotice";
import { WhatsAppButton } from "./sections";
import { initAnalytics, trackPageview } from "@/lib/analytics";

export function Layout() {
  const { pathname, hash } = useLocation();
  const first = useRef(true);
  const overlay = pathname === "/";

  useEffect(() => {
    initAnalytics();
  }, []);

  // On client-side navigation: scroll to top (or the anchor) and move focus to the
  // main region so screen-reader users hear the new page.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
      document.getElementById("main")?.focus({ preventScroll: true });
    }
    trackPageview();
  }, [pathname, hash]);

  return (
    <>
      <a href="#main" className="skip-link">Skip to main content</a>
      <Header overlay={overlay} />
      <main id="main" tabIndex={-1} className={overlay ? "outline-none" : "pt-[var(--header-h)] outline-none"}>
        <Suspense fallback={<div className="shell min-h-[60vh] py-24" aria-busy="true" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <WhatsAppButton />
      <CookieNotice />
    </>
  );
}
