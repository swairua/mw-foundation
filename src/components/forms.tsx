import { createContext, useContext, useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { CheckCircle2, Loader2 } from "lucide-react";
import { track } from "@/lib/analytics";
import { cx, useHydrated } from "@/lib/hooks";

type FormType = "volunteer" | "partner" | "contact" | "newsletter";
type Status = "idle" | "submitting" | "success" | "error";

type FormCtx = { errors: Record<string, string>; dark: boolean };
const Ctx = createContext<FormCtx>({ errors: {}, dark: false });

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function clientValidate(form: HTMLFormElement): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const el of Array.from(form.elements) as (HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)[]) {
    if (!el.name || el.type === "hidden" || el.name === "website") continue;
    const label = el.dataset.label ?? el.name;
    const value = el.type === "checkbox" ? ((el as HTMLInputElement).checked ? "on" : "") : el.value.trim();
    if (el.required && !value) {
      errors[el.name] = el.type === "checkbox" ? "Please tick this box to continue." : `Please enter ${label}.`;
    } else if (value && el.type === "email" && !EMAIL_RE.test(value)) {
      errors[el.name] = "Please enter a valid email address, e.g. name@example.com.";
    } else if (value && el.type === "tel" && !/^[+()\d\s-]{7,30}$/.test(value)) {
      errors[el.name] = "Please enter a valid phone number, e.g. +254 712 345 678.";
    }
  }
  return errors;
}

export function SmartForm({
  type,
  children,
  submitLabel,
  success,
  dark = false,
  className,
  compact = false,
}: {
  type: FormType;
  children: ReactNode;
  submitLabel: string;
  success: ReactNode;
  dark?: boolean;
  className?: string;
  compact?: boolean;
}) {
  const hydrated = useHydrated();
  const { pathname, search } = useLocation();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [startedAt, setStartedAt] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => setStartedAt(String(Date.now())), []);
  useEffect(() => {
    if (hydrated && type !== "newsletter" && new URLSearchParams(search).get("form_error")) {
      setStatus("error");
      setMessage("We could not send your message. Please check your details and try again.");
    }
  }, [hydrated, search]);
  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const focusFirstError = (errs: Record<string, string>) => {
    const first = Object.keys(errs)[0];
    const el = first ? formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`) : null;
    if (el) el.focus();
    else summaryRef.current?.focus();
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const errs = clientValidate(form);
    setErrors(errs);
    if (Object.keys(errs).length) {
      setStatus("error");
      setMessage(Object.keys(errs).length > 1 ? `Please correct the ${Object.keys(errs).length} highlighted fields.` : "Please correct the highlighted field.");
      track("Form error", { type, reason: "validation" });
      requestAnimationFrame(() => focusFirstError(errs));
      return;
    }
    setStatus("submitting");
    setMessage("");
    const data = Object.fromEntries(new FormData(form).entries());
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);
    try {
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
        signal: controller.signal,
      });
      const body = await res.json().catch(() => ({ ok: false, error: "Unexpected response." }));
      if (res.ok && body.ok) {
        setStatus("success");
        track("Form submitted", { type });
        if (type === "newsletter") track("Newsletter signup", { page: pathname });
        return;
      }
      const fieldErrors = body.fieldErrors ?? {};
      setErrors(fieldErrors);
      setStatus("error");
      setMessage(body.error ?? "Something went wrong. Please try again.");
      track("Form error", { type, reason: String(res.status) });
      requestAnimationFrame(() => (Object.keys(fieldErrors).length ? focusFirstError(fieldErrors) : summaryRef.current?.focus()));
    } catch {
      setStatus("error");
      setMessage("The connection timed out. Your details have not been lost — please check your signal and press send again.");
      track("Form error", { type, reason: "network" });
      requestAnimationFrame(() => summaryRef.current?.focus());
    } finally {
      clearTimeout(timer);
    }
  }

  if (status === "success") {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className={cx("rounded-card p-6 outline-none sm:p-8", dark ? "bg-white/[0.06] text-cream-50" : "bg-forest-50 text-forest-900", className)}>
        <CheckCircle2 aria-hidden className={cx("mb-4 h-8 w-8", dark ? "text-gold-300" : "text-forest-700")} strokeWidth={1.6} />
        {success}
      </div>
    );
  }

  return (
    <Ctx.Provider value={{ errors, dark }}>
      <form
        ref={formRef}
        id={`form-${type}`}
        method="post"
        action="/api/forms"
        noValidate={hydrated}
        onSubmit={onSubmit}
        className={cx(compact ? "" : "grid gap-5", className)}
        aria-busy={status === "submitting"}
      >
        <input type="hidden" name="form_type" value={type} />
        <input type="hidden" name="page" value={pathname} />
        <input type="hidden" name="started_at" value={startedAt} />
        <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
          <label>
            Leave this field empty
            <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
          </label>
        </div>

        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          aria-live="assertive"
          className={cx(
            "outline-none",
            status === "error" && message
              ? cx("rounded-[10px] border px-4 py-3 text-sm font-medium", dark ? "border-[#f0a08c]/40 bg-[#f0a08c]/10 text-[#f6c3b5]" : "border-[#a1361f]/30 bg-[#a1361f]/[0.06] text-[#8c2d19]", compact && "mb-3")
              : "hidden",
          )}
        >
          {status === "error" ? message : null}
        </div>

        {children}

        <div className={compact ? "contents" : ""}>
          <button type="submit" className={cx("btn", dark ? "btn-gold" : "btn-forest", !compact && "w-full sm:w-auto")} disabled={status === "submitting"}>
            {status === "submitting" ? (
              <>
                <Loader2 aria-hidden className="animate-spin" /> Sending…
              </>
            ) : (
              submitLabel
            )}
          </button>
        </div>
      </form>
    </Ctx.Provider>
  );
}

type FieldProps = {
  name: string;
  label: string;
  required?: boolean;
  hint?: string;
  className?: string;
};

function useField(name: string, hint?: string) {
  const { errors, dark } = useContext(Ctx);
  const id = useId();
  const error = errors[name];
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
  return { id, error, describedBy, dark };
}

function FieldShell({ id, label, required, hint, error, dark, children, className }: FieldProps & { id: string; error?: string; dark: boolean; children: ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={id} className={cx("field-label", dark && "text-cream-50")}>
        {label}
        {required ? <span aria-hidden className={dark ? "text-gold-300" : "text-gold-700"}> *</span> : <span className={cx("ml-1 font-normal", dark ? "text-cream-50/60" : "text-ink-mute")}>(optional)</span>}
      </label>
      {children}
      {hint && <p id={`${id}-hint`} className={cx("field-hint", dark && "text-cream-50/65")}>{hint}</p>}
      {error && <p id={`${id}-error`} className={cx("field-error", dark && "text-[#f6c3b5]")}>{error}</p>}
    </div>
  );
}

export function TextField({
  name, label, required, hint, className, type = "text", autoComplete, placeholder, inputMode,
}: FieldProps & { type?: "text" | "email" | "tel"; autoComplete?: string; placeholder?: string; inputMode?: "text" | "email" | "tel" }) {
  const f = useField(name, hint);
  return (
    <FieldShell {...{ name, label, required, hint, className }} id={f.id} error={f.error} dark={f.dark}>
      <input
        id={f.id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        inputMode={inputMode}
        data-label={label.toLowerCase()}
        aria-invalid={f.error ? true : undefined}
        aria-describedby={f.describedBy}
        className="input"
        maxLength={type === "email" ? 254 : 200}
      />
    </FieldShell>
  );
}

export function TextArea({ name, label, required, hint, className, rows = 5, placeholder }: FieldProps & { rows?: number; placeholder?: string }) {
  const f = useField(name, hint);
  return (
    <FieldShell {...{ name, label, required, hint, className }} id={f.id} error={f.error} dark={f.dark}>
      <textarea
        id={f.id}
        name={name}
        rows={rows}
        required={required}
        placeholder={placeholder}
        data-label={label.toLowerCase()}
        aria-invalid={f.error ? true : undefined}
        aria-describedby={f.describedBy}
        className="input"
        maxLength={4000}
      />
    </FieldShell>
  );
}

export function SelectField({ name, label, required, hint, className, options }: FieldProps & { options: string[] }) {
  const f = useField(name, hint);
  return (
    <FieldShell {...{ name, label, required, hint, className }} id={f.id} error={f.error} dark={f.dark}>
      <select
        id={f.id}
        name={name}
        required={required}
        defaultValue=""
        data-label={`an option for ${label.toLowerCase()}`}
        aria-invalid={f.error ? true : undefined}
        aria-describedby={f.describedBy}
        className="input"
      >
        <option value="" disabled>
          Choose one…
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

export function ConsentField({ children }: { children: ReactNode }) {
  const f = useField("consent");
  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          id={f.id}
          name="consent"
          type="checkbox"
          required
          aria-invalid={f.error ? true : undefined}
          aria-describedby={f.error ? `${f.id}-error` : undefined}
          className="mt-0.5 h-5 w-5 shrink-0 rounded border-forest-900/30 accent-forest-800"
        />
        <label htmlFor={f.id} className={cx("text-sm leading-relaxed", f.dark ? "text-cream-50/80" : "text-ink-soft")}>
          {children}
        </label>
      </div>
      {f.error && <p id={`${f.id}-error`} className={cx("field-error ml-8", f.dark && "text-[#f6c3b5]")}>{f.error}</p>}
    </div>
  );
}

export function NewsletterForm({ dark = true, id = "newsletter" }: { dark?: boolean; id?: string }) {
  const f = `${id}-email`;
  return (
    <SmartForm
      type="newsletter"
      dark={dark}
      compact
      submitLabel="Subscribe"
      className="flex flex-col gap-3 sm:flex-row sm:items-start"
      success={<p className="font-semibold">You're subscribed. Thank you for following our work.</p>}
    >
      <div className="flex-1">
        <label htmlFor={f} className="sr-only">Email address</label>
        <input id={f} name="email" type="email" required autoComplete="email" placeholder="Your email address" data-label="your email address" className="input" />
      </div>
    </SmartForm>
  );
}
