/* eslint-disable @typescript-eslint/no-explicit-any */
import { lazy, type ComponentType } from "react";

// Route-level code splitting that stays hydration-safe: once a page's module has
// been preloaded it renders synchronously (no Suspense flash, no hydration mismatch).
// Unloaded pages fall back to React.lazy during client-side navigation.
export function lazyPage<P extends object>(loader: () => Promise<{ default: ComponentType<P> }>) {
  let mod: { default: ComponentType<any> } | null = null;
  let promise: Promise<{ default: ComponentType<any> }> | null = null;
  const preload = () =>
    (promise ??= loader().then((m) => {
      mod = m;
      return m;
    }));
  const Lazy = lazy(preload) as ComponentType<any>;
  function Page(props: P) {
    const C = mod ? mod.default : Lazy;
    return <C {...(props as any)} />;
  }
  return Object.assign(Page, { preload });
}
