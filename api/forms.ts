// POST /api/forms — Vercel serverless function (Node runtime).
// Accepts JSON (from the enhanced forms) or urlencoded bodies (no-JS fallback,
// which gets a 303 redirect to /thank-you or back to the form).
import type { IncomingMessage, ServerResponse } from "node:http";
import { handleSubmission } from "./_lib/forms.js";

type Req = IncomingMessage & { body?: unknown };

function first(v: string | string[] | undefined): string {
  return (Array.isArray(v) ? v[0] : v) ?? "";
}

async function readBody(req: Req): Promise<Record<string, unknown>> {
  if (req.body && typeof req.body === "object") return req.body as Record<string, unknown>;
  const raw = typeof req.body === "string" ? req.body : await new Promise<string>((resolve, reject) => {
    let data = "";
    req.on("data", (c) => {
      data += c;
      if (data.length > 100_000) reject(new Error("Body too large"));
    });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
  const type = first(req.headers["content-type"]);
  if (type.includes("application/json")) return JSON.parse(raw || "{}");
  return Object.fromEntries(new URLSearchParams(raw));
}

function send(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

function redirect(res: ServerResponse, location: string) {
  res.statusCode = 303;
  res.setHeader("Location", location);
  res.setHeader("Cache-Control", "no-store");
  res.end();
}

export default async function handler(req: Req, res: ServerResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return send(res, 405, { ok: false, error: "Method not allowed" });
  }

  // Same-origin check (basic CSRF protection for a cookie-less endpoint)
  const origin = first(req.headers.origin);
  const host = first(req.headers["x-forwarded-host"]) || first(req.headers.host);
  if (origin && host && new URL(origin).host !== host) {
    return send(res, 403, { ok: false, error: "Forbidden" });
  }

  let body: Record<string, unknown>;
  try {
    body = await readBody(req);
  } catch {
    return send(res, 400, { ok: false, error: "Invalid request." });
  }

  const ip = first(req.headers["x-forwarded-for"]).split(",")[0].trim() || req.socket.remoteAddress || "";
  const result = await handleSubmission(body, { ip, userAgent: first(req.headers["user-agent"]) });

  const isNativeForm = first(req.headers["content-type"]).includes("application/x-www-form-urlencoded") && !first(req.headers.accept).includes("application/json");
  if (isNativeForm) {
    const back = typeof body.page === "string" && body.page.startsWith("/") ? body.page : "/contact";
    return redirect(res, result.body.ok ? `/thank-you?type=${result.type ?? "contact"}` : `${back}?form_error=1#form-${result.type ?? "contact"}`);
  }
  return send(res, result.status, result.body);
}
