/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_ENV?: "production" | "staging" | "development";
  readonly VITE_SITE_URL?: string;
  readonly VITE_PLAUSIBLE_DOMAIN?: string;
  readonly VITE_GA4_ID?: string;
}

declare module "virtual:stories" {
  export type StoryMeta = {
    slug: string;
    title: string;
    date: string;
    kind: string;
    pillars: string[];
    excerpt: string;
    image: string | null;
    imageAlt: string | null;
    standfirst: string | null;
    featured: number | null;
    gallery: string[];
    video: string | null;
    readingMinutes: number;
    legacySlug: string | null;
  };
  export const stories: StoryMeta[];
}

declare module "*.md?html" {
  const html: string;
  export default html;
}

interface Window {
  plausible?: ((event: string, options?: { props?: Record<string, string | number | boolean> }) => void) & { q?: unknown[] };
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
}
