// Form handling shared by the Vercel function (api/forms.ts) and the local dev server.
// Flow: honeypot + timing check -> validation -> rate limit -> Supabase insert -> emails.
// No raw IP addresses are stored; only a salted hash used for rate limiting.
import crypto from "node:crypto";
import { z } from "zod";

export const FORM_TYPES = ["volunteer", "partner", "contact", "newsletter"] as const;
export type FormType = (typeof FORM_TYPES)[number];

export type SubmissionResult = {
  status: number;
  body: { ok: true } | { ok: false; error: string; fieldErrors?: Record<string, string> };
  type?: FormType;
};

const text = (max: number) =>
  z.string({ required_error: "Please complete this field." }).trim().max(max, `Please keep this under ${max} characters.`);
const required = (label: string, max: number, min = 2) =>
  text(max).min(min, `Please enter your ${label}.`);
const email = z.string({ required_error: "Please enter your email address." }).trim().toLowerCase().max(254).email("Please enter a valid email address.");
const phone = z
  .string({ required_error: "Please enter your phone number." })
  .trim()
  .max(30)
  .regex(/^[+()\d\s-]{7,30}$/, "Please enter a valid phone number, e.g. +254 712 345 678.");
const optionalPhone = z.union([z.literal(""), phone]).optional();
const consent = z
  .union([z.literal("on"), z.literal("true"), z.literal(true), z.literal("yes")], {
    errorMap: () => ({ message: "Please confirm we may use your details to respond." }),
  })
  .transform(() => true);

const schemas = {
  volunteer: z.object({
    name: required("full name", 120),
    email,
    phone,
    location: text(120).optional(),
    skills: text(600).min(2, "Tell us which skills you would like to offer."),
    availability: text(120).min(2, "Please choose your availability."),
    message: text(3000).optional(),
    consent,
  }),
  partner: z.object({
    organisation: required("organisation name", 160),
    name: required("name", 120),
    role: text(120).optional(),
    email,
    phone: optionalPhone,
    interest: text(120).min(2, "Please choose an area of interest."),
    message: text(4000).min(10, "Please tell us a little about the partnership you have in mind."),
    consent,
  }),
  contact: z.object({
    name: required("name", 120),
    email,
    phone: optionalPhone,
    topic: text(80).optional(),
    message: text(4000).min(10, "Please write a short message (at least 10 characters)."),
    consent,
  }),
  newsletter: z.object({
    email,
    name: text(120).optional(),
  }),
} satisfies Record<FormType, z.ZodTypeAny>;

const LABELS: Record<FormType, string> = {
  volunteer: "Volunteer application",
  partner: "Partnership enquiry",
  contact: "Contact message",
  newsletter: "Newsletter signup",
};

// ── Rate limiting ───────────────────────────────────────────
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const memoryHits = new Map<string, number[]>();

function hashIp(ip: string): string {
  const salt = process.env.RATE_LIMIT_SALT || "mwf-dev-salt";
  return crypto.createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

function memoryLimited(key: string): boolean {
  const now = Date.now();
  const hits = (memoryHits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  memoryHits.set(key, hits);
  if (memoryHits.size > 5000) memoryHits.clear();
  return hits.length > MAX_PER_WINDOW;
}

// ── Supabase (REST, service role — server only) ─────────────
function supabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? { url: url.replace(/\/$/, ""), key } : null;
}

async function supabaseLimited(ipHash: string): Promise<boolean> {
  const cfg = supabaseConfig();
  if (!cfg) return false;
  const since = new Date(Date.now() - WINDOW_MS).toISOString();
  const res = await fetch(
    `${cfg.url}/rest/v1/form_submissions?select=id&ip_hash=eq.${ipHash}&created_at=gte.${encodeURIComponent(since)}`,
    { headers: { apikey: cfg.key, Authorization: `Bearer ${cfg.key}`, Prefer: "count=exact", Range: "0-0" } },
  );
  const total = Number(res.headers.get("content-range")?.split("/")[1] ?? 0);
  return total >= MAX_PER_WINDOW;
}

async function supabaseInsert(table: string, row: Record<string, unknown>, upsertOn?: string): Promise<boolean> {
  const cfg = supabaseConfig();
  if (!cfg) return false;
  const res = await fetch(`${cfg.url}/rest/v1/${table}${upsertOn ? `?on_conflict=${upsertOn}` : ""}`, {
    method: "POST",
    headers: {
      apikey: cfg.key,
      Authorization: `Bearer ${cfg.key}`,
      "Content-Type": "application/json",
      Prefer: upsertOn ? "resolution=ignore-duplicates,return=minimal" : "return=minimal",
    },
    body: JSON.stringify(row),
  });
  if (!res.ok) console.error(`[forms] Supabase insert into ${table} failed`, res.status, await res.text());
  return res.ok;
}

// ── Email (Resend) ──────────────────────────────────────────
const esc = (s: unknown) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

async function sendEmail(msg: { to: string; subject: string; html: string; text: string; replyTo?: string }): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;
  if (!key || !from) return false;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [msg.to], subject: msg.subject, html: msg.html, text: msg.text, reply_to: msg.replyTo }),
  });
  if (!res.ok) console.error("[forms] Resend failed", res.status, await res.text());
  return res.ok;
}

function notificationEmail(type: FormType, data: Record<string, unknown>) {
  const rows = Object.entries(data)
    .filter(([k]) => k !== "consent")
    .map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#54655d;vertical-align:top">${esc(k)}</td><td style="padding:6px 0;white-space:pre-wrap">${esc(v)}</td></tr>`)
    .join("");
  const who = String(data.organisation ?? data.name ?? data.email);
  return {
    subject: `${LABELS[type]}: ${who}`.slice(0, 140),
    html: `<div style="font-family:Arial,sans-serif;color:#13261f;font-size:15px"><h2 style="font-size:18px">${esc(LABELS[type])}</h2><table>${rows}</table><p style="color:#54655d;font-size:13px">Sent from the form on mw-foundation.org. Reply to this email to respond directly.</p></div>`,
    text: `${LABELS[type]}\n\n${Object.entries(data).filter(([k]) => k !== "consent").map(([k, v]) => `${k}: ${v}`).join("\n")}`,
  };
}

const AUTO_REPLY: Record<FormType, { subject: string; body: string }> = {
  volunteer: {
    subject: "Thank you for offering to volunteer with the Mercy Wanjau Foundation",
    body: "Thank you for offering your time and skills. Our team reviews volunteer applications against current programme needs and will be in touch if there is a suitable role.",
  },
  partner: {
    subject: "Your partnership enquiry — Mercy Wanjau Foundation",
    body: "Thank you for your interest in partnering with the Foundation. A member of our partnerships team will review your enquiry and respond.",
  },
  contact: {
    subject: "We have received your message — Mercy Wanjau Foundation",
    body: "Thank you for getting in touch. We have received your message and will respond as soon as we can.",
  },
  newsletter: {
    subject: "You're subscribed to updates from the Mercy Wanjau Foundation",
    body: "Thank you for subscribing. We will send occasional updates from our work in rural Kenya. You can unsubscribe at any time by replying to any of our emails.",
  },
};

function autoReply(type: FormType, name?: unknown) {
  const { subject, body } = AUTO_REPLY[type];
  const greeting = name ? `Dear ${esc(name)},` : "Hello,";
  const fraud =
    "Please note: the Foundation never asks for payment in exchange for jobs, scholarships or support. If anyone asks you for money on our behalf, contact info@mw-foundation.org.";
  return {
    subject,
    html: `<div style="font-family:Arial,sans-serif;color:#13261f;font-size:15px;line-height:1.6"><p>${greeting}</p><p>${esc(body)}</p><p>Warm regards,<br>Mercy Wanjau Foundation<br><a href="https://mw-foundation.org" style="color:#235a47">mw-foundation.org</a></p><p style="color:#54655d;font-size:12px">${esc(fraud)}</p></div>`,
    text: `${name ? `Dear ${name},` : "Hello,"}\n\n${body}\n\nWarm regards,\nMercy Wanjau Foundation\nhttps://mw-foundation.org\n\n${fraud}`,
  };
}

// ── Main entry ──────────────────────────────────────────────
export async function handleSubmission(
  input: Record<string, unknown>,
  meta: { ip?: string; userAgent?: string },
): Promise<SubmissionResult> {
  const type = String(input.form_type ?? "") as FormType;
  if (!FORM_TYPES.includes(type)) return { status: 400, body: { ok: false, error: "Unknown form." } };

  // Honeypot (hidden field humans never see) and minimum fill time. Bots get a fake success.
  const started = Number(input.started_at);
  const tooFast = Number.isFinite(started) && started > 0 && Date.now() - started < 2500;
  if ((typeof input.website === "string" && input.website.trim() !== "") || tooFast) {
    return { status: 200, body: { ok: true }, type };
  }

  const parsed = schemas[type].safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return { status: 400, body: { ok: false, error: "Please check the highlighted fields.", fieldErrors }, type };
  }
  const data = parsed.data as Record<string, unknown>;

  const ipHash = hashIp(meta.ip || "unknown");
  if (memoryLimited(ipHash) || (await supabaseLimited(ipHash).catch(() => false))) {
    return {
      status: 429,
      body: { ok: false, error: "You have sent several messages in a short time. Please wait a few minutes, or email info@mw-foundation.org." },
      type,
    };
  }

  const { name, email: mail, phone: tel, organisation, consent: _c, ...rest } = data;
  const stored = await supabaseInsert("form_submissions", {
    form_type: type,
    name: name ?? null,
    email: mail,
    phone: tel || null,
    organisation: organisation ?? null,
    payload: rest,
    page: String(input.page ?? "").slice(0, 200) || null,
    ip_hash: ipHash,
    user_agent: String(meta.userAgent ?? "").slice(0, 300) || null,
    consent: type === "newsletter" ? true : Boolean(_c),
  }).catch(() => false);
  if (type === "newsletter") {
    await supabaseInsert("newsletter_subscribers", { email: mail, name: name || null, source: String(input.page ?? "") || null }, "email").catch(() => false);
  }

  const to = process.env.MAIL_TO || "info@mw-foundation.org";
  const notified = await sendEmail({ to, replyTo: String(mail), ...notificationEmail(type, data) }).catch(() => false);
  if (stored || notified) {
    await sendEmail({ to: String(mail), ...autoReply(type, name) }).catch(() => false);
    return { status: 200, body: { ok: true }, type };
  }

  if (!supabaseConfig() && !process.env.RESEND_API_KEY && process.env.NODE_ENV !== "production") {
    console.info(`[forms] (dev) ${LABELS[type]} received — configure Supabase/Resend to store and email it:`, data);
    return { status: 200, body: { ok: true }, type };
  }
  return {
    status: 502,
    body: { ok: false, error: "We could not send your message just now. Please try again, or email info@mw-foundation.org." },
    type,
  };
}
