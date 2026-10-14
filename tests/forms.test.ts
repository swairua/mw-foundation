import { afterEach, describe, expect, it, vi } from "vitest";
import { handleSubmission } from "../api/_lib/forms";

const meta = { ip: "203.0.113.7", userAgent: "vitest" };
const old = () => String(Date.now() - 60_000);

describe("handleSubmission", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("rejects unknown form types", async () => {
    const r = await handleSubmission({ form_type: "nope" }, meta);
    expect(r.status).toBe(400);
  });

  it("silently accepts honeypot submissions without storing them", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const r = await handleSubmission({ form_type: "contact", website: "http://spam.example", name: "x" }, meta);
    expect(r).toMatchObject({ status: 200, body: { ok: true } });
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  it("treats submissions completed in under 2.5 seconds as bots", async () => {
    const r = await handleSubmission({ form_type: "newsletter", email: "a@b.co", started_at: String(Date.now()) }, meta);
    expect(r.body.ok).toBe(true);
  });

  it("returns field errors for invalid input", async () => {
    const r = await handleSubmission({ form_type: "volunteer", name: "A", email: "not-an-email", started_at: old() }, meta);
    expect(r.status).toBe(400);
    expect(r.body.ok).toBe(false);
    if (!r.body.ok) {
      expect(r.body.fieldErrors).toHaveProperty("email");
      expect(r.body.fieldErrors).toHaveProperty("phone");
      expect(r.body.fieldErrors).toHaveProperty("consent");
    }
  });

  it("accepts a valid contact message in development without external services", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    const r = await handleSubmission(
      { form_type: "contact", name: "Wanjiru Kamau", email: "wanjiru@example.com", message: "I would like to learn more about the French Initiative.", consent: "on", started_at: old() },
      { ...meta, ip: "203.0.113.8" },
    );
    expect(r).toMatchObject({ status: 200, body: { ok: true } });
    info.mockRestore();
  });

  it("rate limits repeated submissions from the same address", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    const body = { form_type: "newsletter", email: "reader@example.com", started_at: old() };
    const statuses: number[] = [];
    for (let i = 0; i < 7; i++) statuses.push((await handleSubmission(body, { ...meta, ip: "198.51.100.42" })).status);
    expect(statuses.slice(0, 5).every((s) => s === 200)).toBe(true);
    expect(statuses.at(-1)).toBe(429);
    info.mockRestore();
  });
});
