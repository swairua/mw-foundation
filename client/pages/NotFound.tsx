import { ArrowLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  return (
    <section className="flex min-h-[72vh] items-center bg-ivory px-6 pb-20 pt-40 lg:px-10">
        <div className="mx-auto w-full max-w-[1320px]">
          <p className="mb-6 text-xs font-bold uppercase tracking-[0.22em] text-clay">Route not found · {location.pathname}</p>
          <h1 className="font-display text-7xl font-semibold leading-none tracking-[-0.06em] text-forest sm:text-9xl">Not quite<br /><em className="font-serif font-normal text-clay">here.</em></h1>
          <p className="mt-8 max-w-md text-lg leading-relaxed text-forest/80">This page does not exist yet, but there is plenty of good work to explore.</p>
          <Link to="/" className="mt-10 inline-flex items-center gap-3 rounded-full bg-forest px-6 py-4 text-sm font-bold text-white transition hover:bg-saffron hover:text-forest"><ArrowLeft size={16} /> Return home</Link>
        </div>
    </section>
  );
};

export default NotFound;
