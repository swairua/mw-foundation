// Vite plugin that turns content/stories/*.md into data the app can import:
//   import { stories } from "virtual:stories"   -> metadata for every story (no bodies)
//   import html from "/content/stories/x.md?html" -> body compiled to HTML at build time
// Markdown is compiled here so no Markdown parser ships to the browser.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { Marked, type Tokens } from "marked";
import type { Plugin } from "vite";
import { getImage, getMedia, srcSet, imageUrl } from "../src/lib/images";

const ROOT = path.resolve(__dirname, "..");
const STORIES_DIR = path.join(ROOT, "content/stories");
const VIRTUAL_ID = "virtual:stories";
const RESOLVED_ID = "\0" + VIRTUAL_ID;

const escapeAttr = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const slugify = (s: string) =>
  s.toLowerCase().replace(/<[^>]+>/g, "").replace(/&[a-z]+;/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function figureHtml(href: string, alt: string): string {
  const img = getImage(href);
  if (!img) return "";
  const info = getMedia(href);
  const altText = alt || info.alt || "";
  const caption = info.caption ? `<figcaption>${escapeAttr(info.caption)}</figcaption>` : "";
  return (
    (img.w < 900 ? `<figure class="story-figure is-small" style="max-width:${img.w}px">` : `<figure class="story-figure">`) +
    `<img src="${imageUrl(href, 1200)}" srcset="${srcSet(href)}" sizes="(min-width: 960px) 880px, 100vw" ` +
    `width="${img.w}" height="${img.h}" alt="${escapeAttr(altText)}" loading="lazy" decoding="async" style="background:${img.color}">` +
    `${caption}</figure>`
  );
}

const marked = new Marked({
  gfm: true,
  renderer: {
    heading({ tokens, depth }: Tokens.Heading) {
      const text = this.parser.parseInline(tokens);
      const level = Math.min(Math.max(depth, 2), 4);
      return `<h${level} id="${slugify(text)}">${text}</h${level}>\n`;
    },
    paragraph({ tokens }: Tokens.Paragraph) {
      const meaningful = tokens.filter((t) => !(t.type === "text" && !t.raw.trim()));
      if (meaningful.length === 1 && meaningful[0].type === "image") {
        const t = meaningful[0] as Tokens.Image;
        return figureHtml(t.href, t.text) + "\n";
      }
      return `<p>${this.parser.parseInline(tokens)}</p>\n`;
    },
    image({ href, text }: Tokens.Image) {
      return figureHtml(href, text);
    },
    blockquote({ tokens }: Tokens.Blockquote) {
      let body = tokens.filter((t) => t.type !== "space");
      let cite = "";
      const last = body[body.length - 1];
      if (last && last.type === "paragraph" && /^[—–]\s/.test((last as Tokens.Paragraph).text)) {
        cite = this.parser.parseInline((last as Tokens.Paragraph).tokens).replace(/^[—–]\s*/, "");
        body = body.slice(0, -1);
      }
      return `<figure class="story-quote"><blockquote>${this.parser.parse(body)}</blockquote>${
        cite ? `<figcaption>${cite}</figcaption>` : ""
      }</figure>\n`;
    },
    link({ href, title, tokens }: Tokens.Link) {
      const text = this.parser.parseInline(tokens);
      const external = /^https?:\/\//.test(href) && !/^https?:\/\/(www\.)?mw-foundation\.org/.test(href);
      const t = title ? ` title="${escapeAttr(title)}"` : "";
      return external
        ? `<a href="${escapeAttr(href)}"${t} rel="noopener noreferrer">${text}</a>`
        : `<a href="${escapeAttr(href.replace(/^https?:\/\/(www\.)?mw-foundation\.org/, "") || "/")}"${t}>${text}</a>`;
    },
  },
});

export function renderMarkdown(md: string): string {
  return marked.parse(md, { async: false }) as string;
}

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

export function readStories(): StoryMeta[] {
  return fs
    .readdirSync(STORIES_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const { data, content } = matter(fs.readFileSync(path.join(STORIES_DIR, file), "utf8"));
      const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date ?? "");
      const words = content.split(/\s+/).filter(Boolean).length;
      return {
        slug: file.replace(/\.md$/, ""),
        title: String(data.title ?? ""),
        date,
        kind: String(data.kind ?? "Insight"),
        pillars: Array.isArray(data.pillars) ? data.pillars.map(String) : [],
        excerpt: String(data.excerpt ?? ""),
        image: data.image ? String(data.image) : null,
        imageAlt: data.imageAlt ? String(data.imageAlt) : null,
        standfirst: data.standfirst ? String(data.standfirst) : null,
        featured: typeof data.featured === "number" ? data.featured : null,
        gallery: Array.isArray(data.gallery) ? data.gallery.map(String) : [],
        video: data.video ? String(data.video) : null,
        readingMinutes: Math.max(1, Math.round(words / 220)),
        legacySlug: data.legacySlug ? String(data.legacySlug) : null,
      } satisfies StoryMeta;
    })
    .filter((s) => s.title && s.date && !s.slug.startsWith("_"))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function contentPlugin(): Plugin {
  return {
    name: "mwf-content",
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
    },
    load(id) {
      if (id === RESOLVED_ID) {
        fs.readdirSync(STORIES_DIR).forEach((f) => this.addWatchFile(path.join(STORIES_DIR, f)));
        return `export const stories = ${JSON.stringify(readStories())};`;
      }
      const [file, query] = id.split("?");
      if (query === "html" && file.endsWith(".md")) {
        this.addWatchFile(file);
        const { content } = matter(fs.readFileSync(file, "utf8"));
        return `export default ${JSON.stringify(renderMarkdown(content))};`;
      }
    },
    handleHotUpdate({ file, server }) {
      if (file.startsWith(STORIES_DIR.replace(/\\/g, "/")) || file.startsWith(STORIES_DIR)) {
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
        if (mod) server.moduleGraph.invalidateModule(mod);
      }
    },
  };
}
