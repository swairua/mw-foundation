import "./styles/global.css";
import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App, { preloadAllPages, preloadRoute } from "./App";
import { preloadForPath } from "./lib/bodies";

const container = document.getElementById("root")!;
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Prerendered pages are hydrated; the dev server renders from scratch.
const prerendered = container.firstElementChild !== null;
const path = window.location.pathname;

Promise.all([preloadRoute(path), preloadForPath(path)])
  .catch(() => undefined)
  .then(() => {
    if (prerendered) hydrateRoot(container, app);
    else createRoot(container).render(app);
    // Fetch the remaining (small) page chunks when the browser is idle, so later navigation is instant.
    const idle = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 3000));
    const warm = () => idle(() => void preloadAllPages().catch(() => undefined));
    if (document.readyState === "complete") warm();
    else window.addEventListener("load", warm, { once: true });
  });
