// Minimal head manager. During prerendering <Seo> writes into a collector that
// the build script injects into each HTML file; in the browser it updates the
// document head on client-side navigation.
import { createContext, useContext, useEffect } from "react";
import { IS_PRODUCTION, SITE_URL, site } from "./content";
import { ogImageUrl, getMedia } from "./images";

export type HeadData = {
  title: string;
  description: string;
  canonical: string;
  image: string;
  imageAlt: string;
  type: "website" | "article";
  robots: string;
  jsonLd: object[];
  publishedTime?: string;
  preload?: { srcset: string; sizes: string; href: string };
};

export type HeadCollector = { data: HeadData | null };
export const HeadContext = createContext<HeadCollector | null>(null);

type SeoProps = {
  title?: string;
  description: string;
  path: string;
  image?: string | null;
  imageAlt?: string;
  type?: "website" | "article";
  jsonLd?: object[];
  noindex?: boolean;
  publishedTime?: string;
  preload?: HeadData["preload"];
};

const SUFFIX = "Mercy Wanjau Foundation";

export function buildHead(p: SeoProps): HeadData {
  const canonicalPath = p.path === "/" ? "/" : p.path.replace(/\/$/, "");
  const image = p.image ? ogImageUrl(p.image) : "/og/og-default.jpg";
  return {
    title: p.title ? `${p.title} | ${SUFFIX}` : `${SUFFIX} | Opportunity for rural Kenya`,
    description: p.description,
    canonical: `${SITE_URL}${canonicalPath}`,
    image: `${SITE_URL}${image}`,
    imageAlt: p.imageAlt ?? (p.image ? getMedia(p.image).alt ?? SUFFIX : "Children reading outside the Mitahato Village French Library, Kirinyaga County"),
    type: p.type ?? "website",
    robots: !IS_PRODUCTION || p.noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large",
    jsonLd: p.jsonLd ?? [],
    publishedTime: p.publishedTime,
    preload: p.preload,
  };
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Serialises head data to tags (build time). */
export function renderHead(d: HeadData): string {
  const tags = [
    `<title>${esc(d.title)}</title>`,
    `<meta name="description" content="${esc(d.description)}" data-head>`,
    `<meta name="robots" content="${d.robots}" data-head>`,
    `<link rel="canonical" href="${esc(d.canonical)}" data-head>`,
    `<meta property="og:site_name" content="${SUFFIX}" data-head>`,
    `<meta property="og:locale" content="en_KE" data-head>`,
    `<meta property="og:type" content="${d.type}" data-head>`,
    `<meta property="og:title" content="${esc(d.title)}" data-head>`,
    `<meta property="og:description" content="${esc(d.description)}" data-head>`,
    `<meta property="og:url" content="${esc(d.canonical)}" data-head>`,
    `<meta property="og:image" content="${esc(d.image)}" data-head>`,
    `<meta property="og:image:width" content="1200" data-head>`,
    `<meta property="og:image:height" content="630" data-head>`,
    `<meta property="og:image:alt" content="${esc(d.imageAlt)}" data-head>`,
    `<meta name="twitter:card" content="summary_large_image" data-head>`,
    `<meta name="twitter:site" content="${site.social[0].handle}" data-head>`,
    `<meta name="twitter:title" content="${esc(d.title)}" data-head>`,
    `<meta name="twitter:description" content="${esc(d.description)}" data-head>`,
    `<meta name="twitter:image" content="${esc(d.image)}" data-head>`,
  ];
  if (d.publishedTime) tags.push(`<meta property="article:published_time" content="${d.publishedTime}" data-head>`);
  if (d.preload) tags.push(`<link rel="preload" as="image" href="${d.preload.href}" imagesrcset="${d.preload.srcset}" imagesizes="${d.preload.sizes}" fetchpriority="high">`);
  for (const obj of d.jsonLd) {
    tags.push(`<script type="application/ld+json" data-head>${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`);
  }
  return tags.join("\n    ");
}

function setMeta(attr: "name" | "property", key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    el.setAttribute("data-head", "");
    document.head.appendChild(el);
  }
  el.content = value;
}

function applyHead(d: HeadData) {
  document.title = d.title;
  setMeta("name", "description", d.description);
  setMeta("name", "robots", d.robots);
  setMeta("property", "og:type", d.type);
  setMeta("property", "og:title", d.title);
  setMeta("property", "og:description", d.description);
  setMeta("property", "og:url", d.canonical);
  setMeta("property", "og:image", d.image);
  setMeta("property", "og:image:alt", d.imageAlt);
  setMeta("name", "twitter:title", d.title);
  setMeta("name", "twitter:description", d.description);
  setMeta("name", "twitter:image", d.image);
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = d.canonical;
  document.head.querySelectorAll('script[type="application/ld+json"][data-head]').forEach((n) => n.remove());
  for (const obj of d.jsonLd) {
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.setAttribute("data-head", "");
    s.textContent = JSON.stringify(obj);
    document.head.appendChild(s);
  }
}

export function Seo(props: SeoProps) {
  const collector = useContext(HeadContext);
  const data = buildHead(props);
  if (import.meta.env.SSR && collector) collector.data = data;
  const key = JSON.stringify(data);
  useEffect(() => {
    applyHead(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return null;
}

// ── Structured data helpers ─────────────────────────────────
export const organizationLd = () => ({
  "@context": "https://schema.org",
  "@type": "NGO",
  "@id": `${SITE_URL}/#organization`,
  name: site.name,
  alternateName: site.shortName,
  url: SITE_URL,
  logo: `${SITE_URL}/icon-512.png`,
  image: `${SITE_URL}/og/og-default.jpg`,
  description: site.description,
  email: site.contact.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.contact.address[0],
    addressLocality: "Nairobi",
    addressCountry: "KE",
  },
  areaServed: { "@type": "Country", name: "Kenya" },
  founder: { "@type": "Person", name: "Mercy Wanjau" },
  sameAs: site.social.map((s) => s.url),
});

export const websiteLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: site.name,
  publisher: { "@id": `${SITE_URL}/#organization` },
  inLanguage: "en-KE",
});

export const breadcrumbLd = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: `${SITE_URL}${it.path === "/" ? "" : it.path}`,
  })),
});
