// Typed access to the JSON content files in /content.
import siteJson from "@content/site.json";
import pillarsJson from "@content/pillars.json";
import aboutJson from "@content/about.json";
import donateJson from "@content/donate.json";
import impactJson from "@content/impact.json";
import partnersJson from "@content/partners.json";
import { stories as allStories, type StoryMeta } from "virtual:stories";

export type Pillar = (typeof pillarsJson.pillars)[number];
export type Story = StoryMeta;

export const site = siteJson;
export const pillars: Pillar[] = pillarsJson.pillars;
export const about = aboutJson;
export const donate = donateJson;
export const impact = impactJson;
export const partners = partnersJson.partners as { name: string; logo: string; url?: string }[];
export const stories: Story[] = allStories;

// The domain this build is served from. Defaults to the canonical domain in site.json;
// staging builds set VITE_SITE_URL (e.g. https://mw-foundation.ziratech.com) so social
// previews and share links point at files that exist on that server.
export const SITE_URL = (import.meta.env.VITE_SITE_URL || site.url).replace(/\/$/, "");
export const SITE_ENV = import.meta.env.VITE_SITE_ENV ?? (import.meta.env.DEV ? "development" : "staging");
export const IS_PRODUCTION = SITE_ENV === "production";

export const pillarBySlug = new Map(pillars.map((p) => [p.slug, p]));
export const storyBySlug = new Map(stories.map((s) => [s.slug, s]));

export function pillarPath(slug: string) {
  return `/our-work/${slug}`;
}
export function storyPath(slug: string) {
  return `/news/${slug}`;
}

export function featuredStories(): Story[] {
  return stories
    .filter((s) => s.featured)
    .sort((a, b) => (a.featured ?? 99) - (b.featured ?? 99))
    .slice(0, 3);
}

export function storiesForPillar(slug: string, limit?: number, exclude?: string): Story[] {
  const list = stories.filter((s) => s.pillars.includes(slug) && s.slug !== exclude);
  return limit ? list.slice(0, limit) : list;
}

export function relatedStories(story: Story, limit = 3): Story[] {
  const scored = stories
    .filter((s) => s.slug !== story.slug)
    .map((s) => ({ s, score: s.pillars.filter((p) => story.pillars.includes(p)).length * 10 + (s.kind === "Field report" ? 2 : 0) }))
    .sort((a, b) => b.score - a.score || b.s.date.localeCompare(a.s.date));
  return scored.slice(0, limit).map((x) => x.s);
}

// TODO convention: content values starting with "TODO" are placeholders.
export function isTodo(value: unknown): boolean {
  return typeof value === "string" && /^TODO\b/i.test(value.trim());
}
export function todoLabel(value: string): string {
  return value.replace(/^TODO:?\s*/i, "").trim() || "to be confirmed";
}
export function hasValue(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "" && !isTodo(value);
}

export function whatsappLink(message?: string): string | null {
  const digits = hasValue(site.contact.whatsapp) ? site.contact.whatsapp.replace(/\D/g, "") : "";
  if (digits.length < 10) return null;
  return `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}

export function telLink(): string | null {
  return hasValue(site.contact.phone) ? `tel:${site.contact.phone.replace(/[^\d+]/g, "")}` : null;
}

export function formatDate(iso: string, style: "long" | "short" = "long"): string {
  const d = new Date(`${iso}T12:00:00Z`);
  return d.toLocaleDateString("en-GB", style === "long" ? { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" } : { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

export function formatKes(amount: number): string {
  return `KES ${amount.toLocaleString("en-KE")}`;
}
