import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getConsent, needsConsent, setConsent } from "@/lib/analytics";

/** Compact, non-blocking notice. Analytics that set cookies (GA4) only load after "Accept". */
export function CookieNotice() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setOpen(getConsent() === null), 2500);
    return () => clearTimeout(t);
  }, []);
  if (!open) return null;

  const choose = (value: "granted" | "denied") => {
    setConsent(value);
    setOpen(false);
  };

  return (
    <section
      aria-label="Cookie notice"
      className="fixed inset-x-3 bottom-3 z-[60] flex flex-col gap-3 rounded-2xl border border-forest-900/10 bg-cream-50/[0.98] px-4 py-3 text-[0.85rem] leading-snug text-ink-soft shadow-lift sm:inset-x-auto sm:left-5 sm:bottom-5 sm:max-w-[30rem] sm:flex-row sm:items-center sm:gap-4"
    >
      <p className="flex-1">
        {needsConsent ? "We use analytics cookies, with your permission, to improve this site." : "We use cookie-free analytics to improve this site."}{" "}
        <Link to="/privacy-policy" className="font-medium text-forest-700 underline underline-offset-2">Privacy</Link>
      </p>
      <div className="flex shrink-0 gap-2">
        <button type="button" className="btn btn-forest min-h-[40px] px-4 text-[0.85rem]" onClick={() => choose("granted")}>
          {needsConsent ? "Accept" : "OK"}
        </button>
        <button type="button" className="btn btn-outline min-h-[40px] px-4 text-[0.85rem]" onClick={() => choose("denied")}>
          {needsConsent ? "Decline" : "Opt out"}
        </button>
      </div>
    </section>
  );
}
