// Renders every route to static HTML after `vite build` + `vite build --ssr`.
// Writes dist/client/<route>/index.html, 404.html, sitemap.xml, robots.txt and rss.xml.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist/client");
const server = path.join(root, "dist/server");

const entry = fs.readdirSync(server).find((f) => /^entry-server\.(m?js)$/.test(f));
const { render, routes, meta, prepare, sourcesFor } = await import(pathToFileURL(path.join(server, entry)).href);
await prepare();

let template = fs.readFileSync(path.join(dist, "index.html"), "utf8");

// Vite manifest: maps source modules to built chunks, for per-page <link rel="modulepreload">.
const manifest = JSON.parse(fs.readFileSync(path.join(dist, ".vite/manifest.json"), "utf8"));
function modulepreloads(route) {
  const files = new Set([...template.matchAll(/(?:src|href)="\/(assets\/[^"]+\.js)"/g)].map((m) => m[1]));
  const already = new Set(files);
  const visit = (key) => {
    const chunk = manifest[key];
    if (!chunk || chunk.isEntry || files.has(chunk.file)) return;
    files.add(chunk.file);
    (chunk.imports ?? []).forEach(visit);
  };
  sourcesFor(route).forEach(visit);
  return [...files]
    .filter((f) => !already.has(f))
    .map((f) => `<link rel="modulepreload" crossorigin href="/${f}">`)
    .join("\n    ");
}

// The only inline script must match the hash allowed by the CSP in vercel.json.
const inline = template.match(/<script>([^<]*)<\/script>/);
if (inline) {
  const hash = crypto.createHash("sha256").update(inline[1]).digest("base64");
  const vercel = fs.readFileSync(path.join(root, "vercel.json"), "utf8");
  if (!vercel.includes(`sha256-${hash}`)) {
    console.error(`\n✖ The inline script in index.html changed. Update the CSP in vercel.json with 'sha256-${hash}'.\n`);
    process.exit(1);
  }
}

// Inline the stylesheet: one less render-blocking request on slow mobile networks.
const cssLink = template.match(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/);
if (cssLink) {
  const css = fs.readFileSync(path.join(dist, cssLink[1]), "utf8");
  if (css.length < 90_000) template = template.replace(cssLink[0], `<style>${css}</style>`);
}

// Preload the two Latin web fonts used above the fold.
const assets = fs.readdirSync(path.join(dist, "assets"));
const fonts = [/instrument-sans-latin-wght-normal.*\.woff2$/, /instrument-serif-latin-400-italic.*\.woff2$/]
  .map((re) => assets.find((f) => re.test(f)))
  .filter(Boolean)
  .map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin>`)
  .join("\n    ");

function write(route, html, head) {
  const page = template.replace("<!--app-head-->", `${fonts}\n    ${modulepreloads(route)}\n    ${head}`).replace("<!--app-html-->", html);
  const file = route === "/" ? path.join(dist, "index.html") : path.join(dist, route.slice(1), "index.html");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, page);
}

const list = routes();
for (const r of list) {
  const { html, head } = render(r.path);
  write(r.path, html, head);
}
{
  const { html, head } = render("/404");
  const page = template.replace("<!--app-head-->", `${fonts}\n    ${modulepreloads("/404")}\n    ${head}`).replace("<!--app-html-->", html);
  fs.writeFileSync(path.join(dist, "404.html"), page);
}

// sitemap.xml
const today = new Date().toISOString().slice(0, 10);
const urls = list
  .filter((r) => r.sitemap !== false)
  .map(
    (r) =>
      `  <url><loc>${meta.siteUrl}${r.path === "/" ? "/" : r.path}</loc><lastmod>${r.lastmod ?? today}</lastmod><changefreq>${r.changefreq}</changefreq><priority>${r.priority.toFixed(1)}</priority></url>`,
  )
  .join("\n");
fs.writeFileSync(path.join(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);

// robots.txt — staging builds are never indexed
fs.writeFileSync(
  path.join(dist, "robots.txt"),
  meta.isProduction
    ? `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /admin\nDisallow: /thank-you\n\nSitemap: ${meta.siteUrl}/sitemap.xml\n`
    : `# Staging build — not for indexing\nUser-agent: *\nDisallow: /\n`,
);

// rss.xml (latest 20 stories)
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const items = meta.stories
  .slice(0, 20)
  .map(
    (s) =>
      `    <item><title>${esc(s.title)}</title><link>${meta.siteUrl}/news/${s.slug}</link><guid>${meta.siteUrl}/news/${s.slug}</guid><pubDate>${new Date(`${s.date}T09:00:00+03:00`).toUTCString()}</pubDate><description>${esc(s.excerpt)}</description></item>`,
  )
  .join("\n");
fs.writeFileSync(
  path.join(dist, "rss.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>Mercy Wanjau Foundation — News &amp; Stories</title>\n    <link>${meta.siteUrl}/news</link>\n    <description>Field reports and perspectives from the Mercy Wanjau Foundation's work in rural Kenya.</description>\n    <language>en-ke</language>\n${items}\n  </channel>\n</rss>\n`,
);

fs.rmSync(path.join(dist, ".vite"), { recursive: true, force: true });
console.log(`prerendered ${list.length} routes + 404 (${meta.isProduction ? "production" : "staging"} build)`);
