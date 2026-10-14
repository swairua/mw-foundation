// Used only at build time by scripts/prerender.mjs to render every route to static HTML.
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App, { preloadAllPages, routeSources } from "./App";
import { HeadContext, renderHead, type HeadCollector } from "./lib/head";
import { registerBodies } from "./lib/bodies";
import { pillars, stories, SITE_URL, IS_PRODUCTION } from "./lib/content";

registerBodies(import.meta.glob<string>("/content/stories/*.md", { query: "?html", import: "default", eager: true }));
registerBodies(import.meta.glob<string>("/content/pages/*.md", { query: "?html", import: "default", eager: true }));

/** Loads every page chunk so renderToString can render synchronously. */
export async function prepare() {
  await preloadAllPages();
}

/** Source modules whose chunks a URL needs, for <link rel="modulepreload">. */
export function sourcesFor(url: string): string[] {
  const story = url.match(/^\/news\/([^/]+)$/);
  const doc = url.match(/^\/(privacy-policy|terms-of-use)$/);
  return [
    ...routeSources(url),
    ...(story ? [`content/stories/${story[1]}.md?html`] : []),
    ...(doc ? [`content/pages/${doc[1]}.md?html`] : []),
  ];
}

export function render(url: string) {
  const collector: HeadCollector = { data: null };
  const html = renderToString(
    <StrictMode>
      <HeadContext.Provider value={collector}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </HeadContext.Provider>
    </StrictMode>,
  );
  return { html, head: collector.data ? renderHead(collector.data) : "" };
}

/** Every URL to prerender. `priority`/`changefreq` feed sitemap.xml. */
export function routes() {
  const list: { path: string; priority: number; changefreq: string; lastmod?: string; sitemap?: boolean }[] = [
    { path: "/", priority: 1, changefreq: "weekly" },
    { path: "/our-work", priority: 0.9, changefreq: "monthly" },
    ...pillars.map((p) => ({ path: `/our-work/${p.slug}`, priority: 0.8, changefreq: "monthly" })),
    { path: "/who-we-are", priority: 0.8, changefreq: "monthly" },
    { path: "/news", priority: 0.8, changefreq: "weekly" },
    ...stories.map((s) => ({ path: `/news/${s.slug}`, priority: 0.6, changefreq: "yearly", lastmod: s.date })),
    { path: "/get-involved", priority: 0.9, changefreq: "monthly" },
    { path: "/get-involved/volunteer", priority: 0.7, changefreq: "monthly" },
    { path: "/get-involved/partner", priority: 0.7, changefreq: "monthly" },
    { path: "/contact", priority: 0.6, changefreq: "yearly" },
    { path: "/privacy-policy", priority: 0.2, changefreq: "yearly" },
    { path: "/terms-of-use", priority: 0.2, changefreq: "yearly" },
    { path: "/thank-you", priority: 0, changefreq: "never", sitemap: false },
  ];
  return list;
}

export const meta = { siteUrl: SITE_URL, isProduction: IS_PRODUCTION, stories: stories.map((s) => ({ slug: s.slug, title: s.title, date: s.date, excerpt: s.excerpt, legacySlug: s.legacySlug })) };
