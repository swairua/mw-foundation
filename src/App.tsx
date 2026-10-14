import { matchRoutes, useRoutes, type RouteObject } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Home from "@/pages/Home";
import { lazyPage } from "@/lib/lazy";

// Home ships in the main bundle; every other page is its own chunk.
const OurWork = lazyPage(() => import("@/pages/OurWork"));
const PillarPage = lazyPage(() => import("@/pages/Pillar"));
const WhoWeAre = lazyPage(() => import("@/pages/WhoWeAre"));
const News = lazyPage(() => import("@/pages/News"));
const StoryPage = lazyPage(() => import("@/pages/Story"));
const GetInvolved = lazyPage(() => import("@/pages/GetInvolved"));
const ThankYou = lazyPage(() => import("@/pages/ThankYou"));
const Contact = lazyPage(() => import("@/pages/Contact"));
const Legal = lazyPage(() => import("@/pages/Legal"));
const NotFound = lazyPage(() => import("@/pages/NotFound"));

type Handle = { preload?: () => Promise<unknown>; source?: string };
const page = (preload: () => Promise<unknown>, source: string): Handle => ({ preload, source });

export const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "our-work", element: <OurWork />, handle: page(OurWork.preload, "src/pages/OurWork.tsx") },
      // Pillar and story pages render NotFound for unknown slugs
      { path: "our-work/:slug", element: <PillarPage />, handle: { ...page(PillarPage.preload, "src/pages/Pillar.tsx"), also: NotFound.preload } },
      { path: "who-we-are", element: <WhoWeAre />, handle: page(WhoWeAre.preload, "src/pages/WhoWeAre.tsx") },
      { path: "news", element: <News />, handle: page(News.preload, "src/pages/News.tsx") },
      { path: "news/:slug", element: <StoryPage />, handle: { ...page(StoryPage.preload, "src/pages/Story.tsx"), also: NotFound.preload } },
      { path: "get-involved", element: <GetInvolved tab="donate" />, handle: page(GetInvolved.preload, "src/pages/GetInvolved.tsx") },
      { path: "get-involved/volunteer", element: <GetInvolved tab="volunteer" />, handle: page(GetInvolved.preload, "src/pages/GetInvolved.tsx") },
      { path: "get-involved/partner", element: <GetInvolved tab="partner" />, handle: page(GetInvolved.preload, "src/pages/GetInvolved.tsx") },
      { path: "thank-you", element: <ThankYou />, handle: page(ThankYou.preload, "src/pages/ThankYou.tsx") },
      { path: "contact", element: <Contact />, handle: page(Contact.preload, "src/pages/Contact.tsx") },
      { path: "privacy-policy", element: <Legal doc="privacy-policy" />, handle: page(Legal.preload, "src/pages/Legal.tsx") },
      { path: "terms-of-use", element: <Legal doc="terms-of-use" />, handle: page(Legal.preload, "src/pages/Legal.tsx") },
      { path: "*", element: <NotFound />, handle: page(NotFound.preload, "src/pages/NotFound.tsx") },
    ],
  },
];

const allPages = [OurWork, PillarPage, WhoWeAre, News, StoryPage, GetInvolved, ThankYou, Contact, Legal, NotFound];

/** Loads the page chunk(s) a URL needs. Called before hydration so markup matches. */
export async function preloadRoute(pathname: string) {
  const matches = matchRoutes(routes, pathname) ?? [];
  await Promise.all(
    matches.flatMap((m) => {
      const h = m.route.handle as (Handle & { also?: () => Promise<unknown> }) | undefined;
      return [h?.preload?.(), h?.also?.()].filter(Boolean);
    }),
  );
}

/** Source files of the chunks a URL needs (used by the prerenderer for <link rel="modulepreload">). */
export function routeSources(pathname: string): string[] {
  const matches = matchRoutes(routes, pathname) ?? [];
  return matches.map((m) => (m.route.handle as Handle | undefined)?.source).filter((s): s is string => Boolean(s));
}

export const preloadAllPages = () => Promise.all(allPages.map((p) => p.preload()));

export default function App() {
  return useRoutes(routes);
}
