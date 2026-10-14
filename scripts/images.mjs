// Builds optimised images from content/images into public/img and writes
// src/generated/images.json (dimensions, widths, dominant colour) for <Img>.
//
// - Responsive WebP at 480–2400 px (never upscaled)
// - 1200x630 Open Graph crops in public/og
// - All metadata (EXIF, GPS location) is stripped — important for photos of
//   children and of the founder.
// - Favicons + web manifest icons from content/brand/logo-mark.svg
// - QR code linking to the donate page
// Outputs are content-hashed so they can be cached forever.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { renderSVG } from "uqr";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(root, "content/images");
const OUT = path.join(root, "public/img");
const OG = path.join(root, "public/og");
const GEN = path.join(root, "src/generated");
const WIDTHS = [480, 800, 1200, 1600, 2000, 2400];
// Domain encoded in the donate-page QR code (set VITE_SITE_URL for staging builds)
const SITE_URL = (process.env.VITE_SITE_URL || JSON.parse(fs.readFileSync(path.join(root, "content/site.json"), "utf8")).url).replace(/\/$/, "");

fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(OG, { recursive: true });
fs.mkdirSync(GEN, { recursive: true });

const keep = new Set();
const manifest = {};
const files = fs.readdirSync(SRC).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort();

const hex = (c) => "#" + [c.r, c.g, c.b].map((v) => v.toString(16).padStart(2, "0")).join("");

// Optional editorial crops from content/media.json, e.g. "crop": { "top": 0.15 } trims the
// top 15% (fractions of the original). Applied before every size so all uses match.
const media = JSON.parse(fs.readFileSync(path.join(root, "content/media.json"), "utf8"));

let built = 0;
for (const file of files) {
  const name = file.replace(/\.[^.]+$/, "").toLowerCase();
  const input = path.join(SRC, file);
  const original = fs.readFileSync(input);
  const crop = media[name]?.crop ?? null;
  const hash = crypto.createHash("sha1").update(original).update(JSON.stringify(crop)).digest("hex").slice(0, 8);
  let buf = await sharp(original).rotate().toBuffer();
  if (crop) {
    const m = await sharp(buf).metadata();
    const left = Math.round((crop.left ?? 0) * m.width);
    const top = Math.round((crop.top ?? 0) * m.height);
    const right = Math.round((crop.right ?? 0) * m.width);
    const bottom = Math.round((crop.bottom ?? 0) * m.height);
    buf = await sharp(buf).extract({ left, top, width: m.width - left - right, height: m.height - top - bottom }).toBuffer();
  }
  const meta = await sharp(buf).metadata();
  const w = meta.width;
  const h = meta.height;
  let widths = WIDTHS.filter((x) => x < w);
  if (w <= 2400) widths.push(w);
  widths = [...new Set(widths)].sort((a, b) => a - b);

  for (const width of widths) {
    const out = path.join(OUT, `${name}.${hash}.${width}.webp`);
    keep.add(out);
    if (fs.existsSync(out)) continue;
    await sharp(buf).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 72, effort: 5 }).toFile(out);
    built++;
  }

  const og = path.join(OG, `${name}.${hash}.jpg`);
  keep.add(og);
  if (!fs.existsSync(og)) {
    await sharp(buf).rotate().resize(1200, 630, { fit: "cover", position: sharp.strategy.attention }).jpeg({ quality: 80, mozjpeg: true }).toFile(og);
    built++;
  }

  const { dominant } = await sharp(buf).stats();
  manifest[name] = { w, h, hash, widths, color: hex(dominant) };
}

// Remove stale derivatives
for (const dir of [OUT, OG]) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (!keep.has(p) && !f.startsWith("og-default") && !f.startsWith("qr-")) fs.rmSync(p);
  }
}

fs.writeFileSync(path.join(GEN, "images.json"), JSON.stringify(manifest, null, 1) + "\n");

// Favicons and app icons from the logo mark (gold column on brand green)
const mark = fs.readFileSync(path.join(root, "content/brand/logo-mark.svg"), "utf8");
const markInner = mark.replace(/^<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
const iconSvg = (size, pad, radius) => {
  const inner = size - pad * 2;
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">` +
      `<rect width="${size}" height="${size}" rx="${radius}" fill="#15382c"/>` +
      `<svg x="${pad}" y="${pad}" width="${inner}" height="${inner}" viewBox="228 276 146 132" fill="#D2B35D">${markInner}</svg></svg>`,
  );
};
const pub = path.join(root, "public");
fs.writeFileSync(path.join(pub, "favicon.svg"), iconSvg(64, 10, 14));
await sharp(iconSvg(180, 30, 0)).png().toFile(path.join(pub, "apple-touch-icon.png"));
await sharp(iconSvg(192, 32, 0)).png().toFile(path.join(pub, "icon-192.png"));
await sharp(iconSvg(512, 86, 0)).png().toFile(path.join(pub, "icon-512.png"));
// .ico with an embedded 32px PNG (supported by all current browsers)
const png32 = await sharp(iconSvg(32, 4, 6)).png().toBuffer();
const ico = Buffer.alloc(22);
ico.writeUInt16LE(0, 0); ico.writeUInt16LE(1, 2); ico.writeUInt16LE(1, 4);
ico.writeUInt8(32, 6); ico.writeUInt8(32, 7); ico.writeUInt8(0, 8); ico.writeUInt8(0, 9);
ico.writeUInt16LE(1, 10); ico.writeUInt16LE(32, 12); ico.writeUInt32LE(png32.length, 14); ico.writeUInt32LE(22, 18);
fs.writeFileSync(path.join(pub, "favicon.ico"), Buffer.concat([ico, png32]));

// QR code: opens the donate page on a phone (for desktop visitors and printed material)
const qr = renderSVG(`${SITE_URL}/get-involved?utm_source=qr`, { ecc: "M", border: 2, whiteColor: "#ffffff", blackColor: "#0b2019" });
fs.writeFileSync(path.join(OUT, "qr-donate.svg"), qr);

console.log(`images: ${files.length} sources, ${built} new derivatives`);
