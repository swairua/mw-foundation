// One-off: builds public/og/og-default.jpg (1200x630) from the hero photo.
// Run with `node scripts/og-default.mjs` after changing the hero image; the
// output is committed because text rendering depends on locally installed fonts.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const hero = path.join(root, "content/images/french-initiative-village-library.jpg");
const mark = fs.readFileSync(path.join(root, "content/brand/logo-mark.svg"), "utf8").replace(/^<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");

const W = 1200;
const H = 630;
const overlay = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="#0b2019" stop-opacity="0.94"/>
      <stop offset="0.42" stop-color="#0b2019" stop-opacity="0.82"/>
      <stop offset="0.7" stop-color="#0b2019" stop-opacity="0.2"/>
      <stop offset="1" stop-color="#0b2019" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <svg x="72" y="70" width="64" height="58" viewBox="228 276 146 132" fill="#D2B35D">${mark}</svg>
  <text x="152" y="100" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="25" font-weight="700" letter-spacing="3.5" fill="#fdfbf7">MERCY WANJAU</text>
  <text x="153" y="126" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="15" font-weight="600" letter-spacing="7" fill="#e6cf8e">FOUNDATION</text>
  <text x="72" y="368" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="74" font-weight="700" letter-spacing="-2" fill="#ffffff">Opening doors,</text>
  <text x="72" y="452" font-family="Georgia, 'Times New Roman', serif" font-size="78" font-style="italic" fill="#e6cf8e">close to home.</text>
  <text x="74" y="540" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="25" fill="#fdfbf7" fill-opacity="0.86">Education, digital skills and opportunity for rural Kenya</text>
  <rect x="74" y="566" width="56" height="2" fill="#d2b35d"/>
</svg>`;

fs.mkdirSync(path.join(root, "public/og"), { recursive: true });
await sharp(hero)
  .resize(W, H, { fit: "cover", position: "right" })
  .composite([{ input: Buffer.from(overlay) }])
  .jpeg({ quality: 84, mozjpeg: true })
  .toFile(path.join(root, "public/og/og-default.jpg"));
console.log("wrote public/og/og-default.jpg");
