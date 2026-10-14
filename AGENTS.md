# Mercy Wanjau Foundation website — notes for AI agents and developers

Read `README.md` first. Key rules for working in this repo:

## Architecture

- Vite + React API on **Preact** (`preact/compat`, aliased in `vite.config.ts`). Write normal React code; don't add libraries that depend on React internals (e.g. react-dom-specific portals or concurrent features) without testing the build.
- Every route is **prerendered** by `scripts/prerender.mjs` using `src/entry-server.tsx`, then hydrated by `src/entry-client.tsx`. Anything that reads `window`, `localStorage`, the URL query or media queries must run in `useEffect` or behind `useHydrated()`, never during render. Otherwise prerender crashes or hydration mismatches.
- Routes live in `src/App.tsx` (`routes` array). Non-home pages are lazy chunks via `lazyPage()`. Add new routes there **and** in `routes()` in `src/entry-server.tsx` so they are prerendered and included in the sitemap.
- Content comes from `content/` only. Copy belongs in JSON/Markdown, not in components, wherever editors might change it. Strings starting with `TODO` are placeholders rendered by `<T value>`.
- Images: put originals in `content/images/`, add alt text in `content/media.json`, and reference them by file name without the extension through `<Img src="name" sizes="…" />`. Never link to `public/img` files directly.
- Forms: one endpoint, `/api/forms`. On Vercel it is `api/forms.ts` → `api/_lib/forms.ts`; on the private PHP server it is `hosting/php/api/forms.php` → `lib.php`. **Keep the two in sync** (same fields, rules and messages). Add a form type in both, then use `<SmartForm type="…">`.
- Hosting: `vercel.json` is the single source for redirects and security headers; `scripts/build-apache.mjs` turns it into `.htaccess` for the private server.

## Design system

- Colours, type scale and radii are in `tailwind.config.ts`; component classes (`.btn`, `.eyebrow`, `.chip`, `.prose-story`, …) in `src/styles/global.css`.
- On light backgrounds use `gold-700` for gold text. `gold-500` is for buttons and fills on dark backgrounds only. Add `on-dark` to dark sections so focus rings and eyebrows switch colour.
- Headings use italic serif accent words: `<Accent text="Plain words, *accent words.*" />`.
- Keep animations to transform/opacity, bounded (no infinite loops) and disabled under `prefers-reduced-motion`.

## Checks before committing

```bash
pnpm typecheck && pnpm test && pnpm build
```

The build fails if the inline script in `index.html` changes without updating the CSP hash in `vercel.json`.
