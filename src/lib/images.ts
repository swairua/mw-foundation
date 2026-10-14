// Pure helpers shared by <Img> and the Markdown build plugin.
import manifest from "../generated/images.json";
import media from "../../content/media.json";

export type ImageEntry = { w: number; h: number; hash: string; widths: number[]; color: string };
export type MediaInfo = { alt?: string; caption?: string; credit?: string; focus?: string };

const images = manifest as Record<string, ImageEntry>;
const mediaInfo = media as unknown as Record<string, MediaInfo>;

/** Accepts "name", "name.jpg" or "/content/images/name.jpg" and returns the manifest key. */
export function imageKey(src: string): string {
  return src.split("/").pop()!.replace(/\.[a-z0-9]+$/i, "").toLowerCase();
}

export function getImage(src: string): (ImageEntry & { key: string }) | null {
  const key = imageKey(src);
  const entry = images[key];
  return entry ? { ...entry, key } : null;
}

export function getMedia(src: string): MediaInfo {
  return mediaInfo[imageKey(src)] ?? {};
}

export function imageUrl(src: string, width?: number): string {
  const img = getImage(src);
  if (!img) return "";
  const w = width ? img.widths.find((x) => x >= width) ?? img.widths[img.widths.length - 1] : img.widths[img.widths.length - 1];
  return `/img/${img.key}.${img.hash}.${w}.webp`;
}

export function srcSet(src: string): string {
  const img = getImage(src);
  if (!img) return "";
  return img.widths.map((w) => `/img/${img.key}.${img.hash}.${w}.webp ${w}w`).join(", ");
}

/** 1200x630 crop generated for social sharing. */
export function ogImageUrl(src: string): string {
  const img = getImage(src);
  return img ? `/og/${img.key}.${img.hash}.jpg` : "/og/og-default.jpg";
}
