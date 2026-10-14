// Serves api/*.ts during `pnpm dev` so forms work locally without the Vercel CLI.
import { loadEnv, type Plugin } from "vite";

export function devApiPlugin(): Plugin {
  return {
    name: "mwf-dev-api",
    apply: "serve",
    configureServer(server) {
      const env = loadEnv(server.config.mode, server.config.root, "");
      for (const [k, v] of Object.entries(env)) if (!(k in process.env)) process.env[k] = v;

      server.middlewares.use("/api/forms", async (req, res) => {
        try {
          const mod = await server.ssrLoadModule("/api/forms.ts");
          await mod.default(req, res);
        } catch (err) {
          server.config.logger.error(String(err));
          res.statusCode = 500;
          res.end(JSON.stringify({ ok: false, error: "Dev server error" }));
        }
      });
    },
  };
}
