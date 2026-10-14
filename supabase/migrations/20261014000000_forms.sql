-- Form submissions and newsletter subscribers for mw-foundation.org.
-- Written only by the server (api/forms.ts) with the service-role key.
-- Row Level Security is enabled with NO public policies, so the anon key
-- cannot read or write these tables.

create extension if not exists pgcrypto;

create table if not exists public.form_submissions (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  form_type    text not null check (form_type in ('volunteer', 'partner', 'contact', 'newsletter')),
  name         text,
  email        text not null,
  phone        text,
  organisation text,
  payload      jsonb not null default '{}'::jsonb,
  page         text,
  consent      boolean not null default false,
  ip_hash      text,
  user_agent   text,
  status       text not null default 'new' check (status in ('new', 'in_progress', 'responded', 'archived', 'spam')),
  notes        text
);

comment on table public.form_submissions is 'Volunteer, partner, contact and newsletter submissions from the website. ip_hash is a salted SHA-256 used only for rate limiting.';

create index if not exists form_submissions_rate_idx on public.form_submissions (ip_hash, created_at desc);
create index if not exists form_submissions_type_idx on public.form_submissions (form_type, created_at desc);

create table if not exists public.newsletter_subscribers (
  email           text primary key,
  name            text,
  source          text,
  created_at      timestamptz not null default now(),
  unsubscribed_at timestamptz
);

alter table public.form_submissions enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- Data retention (Kenya Data Protection Act, 2019 — keep personal data no longer than necessary).
-- Run periodically (e.g. Supabase scheduled job) to remove handled submissions older than 24 months.
create or replace function public.purge_old_submissions() returns void
language sql security definer set search_path = public as $$
  delete from public.form_submissions
  where created_at < now() - interval '24 months'
    and status in ('responded', 'archived', 'spam');
$$;

revoke all on function public.purge_old_submissions() from public, anon, authenticated;
