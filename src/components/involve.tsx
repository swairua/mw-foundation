import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { ConsentField, SelectField, SmartForm, TextArea, TextField } from "./forms";
import { Link } from "react-router-dom";
import { isTodo } from "@/lib/content";
import { track } from "@/lib/analytics";
import { cx } from "@/lib/hooks";

export function CopyValue({ label, value, event }: { label: string; value: string; event: string }) {
  const [copied, setCopied] = useState(false);
  const placeholder = isTodo(value);
  const shown = placeholder ? "To be confirmed" : value;
  return (
    <div className="flex items-center justify-between gap-4 rounded-[12px] border border-forest-900/12 bg-white px-4 py-3">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-mute">{label}</p>
        <p className={cx("mt-0.5 truncate font-semibold tabular tracking-[0.04em]", placeholder ? "todo text-base" : "text-[1.35rem] text-forest-900")}>{shown}</p>
      </div>
      <button
        type="button"
        disabled={placeholder}
        className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full border border-forest-900/15 px-4 text-sm font-semibold text-forest-900 transition hover:border-forest-900 disabled:cursor-not-allowed disabled:opacity-40"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value);
          } catch {
            window.prompt(`Copy the ${label.toLowerCase()}`, value);
          }
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
          track(event);
        }}
        aria-label={`Copy ${label.toLowerCase()}`}
      >
        {copied ? <Check aria-hidden className="h-4 w-4 text-forest-700" /> : <Copy aria-hidden className="h-4 w-4" />}
        <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
      </button>
    </div>
  );
}

const CONSENT = (
  <>
    I agree that the Mercy Wanjau Foundation may store and use these details to respond to me, as described in the{" "}
    <Link to="/privacy-policy" className="font-medium underline underline-offset-4">privacy policy</Link>.
  </>
);

export function VolunteerForm() {
  return (
    <SmartForm
      type="volunteer"
      submitLabel="Send my application"
      success={
        <>
          <h3 className="text-[1.4rem]">Thank you for offering your time.</h3>
          <p className="mt-2 text-ink-soft">We have emailed you a confirmation. Our team reviews applications against current programme needs and will be in touch if there is a suitable role.</p>
        </>
      }
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField name="name" label="Full name" required autoComplete="name" />
        <TextField name="email" label="Email" type="email" required autoComplete="email" inputMode="email" />
        <TextField name="phone" label="Phone" type="tel" required autoComplete="tel" inputMode="tel" placeholder="+254 7XX XXX XXX" />
        <TextField name="location" label="County or town" autoComplete="address-level2" />
      </div>
      <TextArea name="skills" label="Skills you would like to offer" required rows={3} hint="For example: French, digital skills training, mentoring, counselling, business coaching, photography." />
      <SelectField
        name="availability"
        label="Availability"
        required
        options={["A few hours a month", "A few hours a week", "A one-off event or project", "Remote only", "Flexible"]}
      />
      <TextArea name="message" label="Anything else we should know?" rows={4} />
      <ConsentField>{CONSENT}</ConsentField>
    </SmartForm>
  );
}

export function PartnerForm() {
  return (
    <SmartForm
      type="partner"
      submitLabel="Send enquiry"
      success={
        <>
          <h3 className="text-[1.4rem]">Thank you. Your enquiry is with our partnerships team.</h3>
          <p className="mt-2 text-ink-soft">We have emailed you a confirmation and will respond to arrange a conversation.</p>
        </>
      }
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField name="organisation" label="Organisation" required autoComplete="organization" />
        <TextField name="name" label="Your name" required autoComplete="name" />
        <TextField name="role" label="Your role" autoComplete="organization-title" />
        <TextField name="email" label="Work email" type="email" required autoComplete="email" inputMode="email" />
        <TextField name="phone" label="Phone" type="tel" autoComplete="tel" inputMode="tel" className="sm:col-span-2" />
      </div>
      <SelectField
        name="interest"
        label="Area of interest"
        required
        options={[
          "Funding a programme or cohort",
          "Corporate partnership or CSR",
          "Technical partnership (e.g. remote work, assistive technology)",
          "Schools and education institutions",
          "In-kind support (devices, connectivity, farm inputs)",
          "Media or events",
          "Something else",
        ]}
      />
      <TextArea name="message" label="Tell us about the partnership you have in mind" required rows={5} />
      <ConsentField>{CONSENT}</ConsentField>
    </SmartForm>
  );
}

export function ContactForm() {
  return (
    <SmartForm
      type="contact"
      submitLabel="Send message"
      success={
        <>
          <h3 className="text-[1.4rem]">Thank you. Your message has been sent.</h3>
          <p className="mt-2 text-ink-soft">We have emailed you a confirmation and will reply as soon as we can.</p>
        </>
      }
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField name="name" label="Name" required autoComplete="name" />
        <TextField name="email" label="Email" type="email" required autoComplete="email" inputMode="email" />
        <TextField name="phone" label="Phone" type="tel" autoComplete="tel" inputMode="tel" />
        <SelectField
          name="topic"
          label="Topic"
          options={["General enquiry", "Media enquiry", "Programmes", "Donations", "Volunteering", "Partnerships", "Report a concern (safeguarding or fraud)"]}
        />
      </div>
      <TextArea name="message" label="Message" required rows={6} />
      <ConsentField>{CONSENT}</ConsentField>
    </SmartForm>
  );
}
