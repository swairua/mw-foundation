// Story and page bodies are compiled to HTML at build time and code-split per file,
// so the home page never downloads article text. The server entry registers all
// bodies eagerly; the client loads the current one before hydrating.
const storyLoaders = import.meta.glob<string>("/content/stories/*.md", { query: "?html", import: "default" });
const pageLoaders = import.meta.glob<string>("/content/pages/*.md", { query: "?html", import: "default" });

const cache = new Map<string, string>();

const storyKey = (slug: string) => `/content/stories/${slug}.md`;
const pageKey = (slug: string) => `/content/pages/${slug}.md`;

export function registerBodies(map: Record<string, string>) {
  for (const [k, v] of Object.entries(map)) cache.set(k, v);
}

export function getStoryBody(slug: string): string | undefined {
  return cache.get(storyKey(slug));
}
export function getPageBody(slug: string): string | undefined {
  return cache.get(pageKey(slug));
}

async function load(key: string, loaders: Record<string, () => Promise<string>>) {
  if (cache.has(key)) return cache.get(key)!;
  const loader = loaders[key];
  if (!loader) return undefined;
  const html = await loader();
  cache.set(key, html);
  return html;
}

export const loadStoryBody = (slug: string) => load(storyKey(slug), storyLoaders);
export const loadPageBody = (slug: string) => load(pageKey(slug), pageLoaders);

/** Preload whatever body the current URL needs, so hydration matches the prerendered HTML. */
export async function preloadForPath(pathname: string) {
  const story = pathname.match(/^\/news\/([^/]+)\/?$/);
  if (story) await loadStoryBody(story[1]);
  const page = pathname.match(/^\/(privacy-policy|terms-of-use)\/?$/);
  if (page) await loadPageBody(page[1]);
}
