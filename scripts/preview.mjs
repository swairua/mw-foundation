// Serves the production build (dist/client) the way Vercel does: clean URLs,
// directory index files, vercel.json redirects/headers, gzip and the 404 page.
// Forms need `pnpm dev` (or `vercel dev`) — this server is static only.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist/client");
const port = Number(process.env.PORT) || 4173;
const config = JSON.parse(fs.readFileSync(path.join(root, "vercel.json"), "utf8"));

const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".svg": "image/svg+xml", ".webp": "image/webp", ".jpg": "image/jpeg", ".png": "image/png", ".ico": "image/x-icon",
  ".woff2": "font/woff2", ".mp4": "video/mp4", ".xml": "application/xml", ".txt": "text/plain", ".webmanifest": "application/manifest+json",
};

const toRegex = (source) =>
  new RegExp("^" + source.replace(/\/:path\*/g, "(?:/.*)?").replace(/:slug\*/g, ".*").replace(/\(\.\*\)/g, ".*") + "$");
const redirects = config.redirects.map((r) => ({ ...r, re: toRegex(r.source) }));
const headerRules = config.headers.map((h) => ({ re: new RegExp("^" + h.source.replace("(.*)", ".*") + "$"), headers: h.headers }));

function resolveFile(urlPath) {
  const clean = decodeURIComponent(urlPath).replace(/\/+$/, "") || "/";
  const candidates = clean === "/" ? ["index.html"] : [clean.slice(1), `${clean.slice(1)}.html`, `${clean.slice(1)}/index.html`];
  for (const c of candidates) {
    const p = path.join(dist, c);
    if (p.startsWith(dist) && fs.existsSync(p) && fs.statSync(p).isFile()) return p;
  }
  return null;
}

http
  .createServer((req, res) => {
    const url = new URL(req.url, `http://localhost:${port}`);
    if (url.pathname.startsWith("/api/")) {
      res.writeHead(501, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ ok: false, error: "Forms run under `pnpm dev` or on Vercel, not in static preview." }));
    }
    if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
      res.writeHead(308, { Location: url.pathname.replace(/\/+$/, "") + url.search });
      return res.end();
    }
    const redirect = redirects.find((r) => r.re.test(url.pathname));
    if (redirect) {
      res.writeHead(redirect.statusCode ?? 308, { Location: redirect.destination });
      return res.end();
    }
    let file = resolveFile(url.pathname);
    let status = 200;
    if (!file) {
      file = path.join(dist, "404.html");
      status = 404;
    }
    const ext = path.extname(file);
    const headers = { "Content-Type": TYPES[ext] ?? "application/octet-stream" };
    for (const rule of headerRules) if (rule.re.test(url.pathname)) for (const h of rule.headers) headers[h.key] = h.value;
    delete headers["Strict-Transport-Security"];
    delete headers["Content-Security-Policy"]; // upgrade-insecure-requests breaks plain-http localhost
    let body = fs.readFileSync(file);
    if (/text|javascript|json|xml|svg/.test(headers["Content-Type"]) && /gzip/.test(req.headers["accept-encoding"] ?? "")) {
      body = zlib.gzipSync(body);
      headers["Content-Encoding"] = "gzip";
    }
    res.writeHead(status, headers);
    res.end(body);
  })
  .listen(port, () => console.log(`Preview: http://localhost:${port}`));
