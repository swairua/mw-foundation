import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import path from "node:path";
import { contentPlugin } from "./plugins/content";
import { devApiPlugin } from "./plugins/dev-api";

// The app is written against the React API but runs on Preact (preact/compat),
// which saves ~35 KB of gzipped JavaScript — significant on rural 3G connections.
export default defineConfig({
  plugins: [preact({ prerender: { enabled: false } }), contentPlugin(), devApiPlugin()],
  resolve: {
    alias: [
      { find: "@content", replacement: path.resolve(__dirname, "content") },
      { find: "@", replacement: path.resolve(__dirname, "src") },
      { find: /^react-dom\/client$/, replacement: "preact/compat/client" },
      { find: /^react-dom\/server$/, replacement: "preact/compat/server" },
      { find: /^react-dom$/, replacement: "preact/compat" },
      { find: /^react\/jsx-runtime$/, replacement: "preact/jsx-runtime" },
      { find: /^react\/jsx-dev-runtime$/, replacement: "preact/jsx-dev-runtime" },
      { find: /^react$/, replacement: "preact/compat" },
    ],
  },
  ssr: {
    // Bundle these so the React -> Preact aliases also apply in the prerender build
    noExternal: ["react-router", "react-router-dom", "@remix-run/router", "lucide-react"],
  },
  build: {
    outDir: "dist/client",
    manifest: true,
    assetsInlineLimit: 0,
    cssCodeSplit: false,
    rollupOptions: {
      onwarn(warning, warn) {
        // The SSR entry imports every story eagerly on purpose; the client build still splits them.
        if (warning.code === "INEFFECTIVE_DYNAMIC_IMPORT") return;
        warn(warning);
      },
    },
  },
  server: {
    port: 8080,
    fs: { deny: [".env", ".env.*", "**/.git/**"] },
  },
});
