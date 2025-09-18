-- Supabase schema for waitlist
-- Run this in the Supabase SQL editor (or via psql against your project)

create extension if not exists citext;
create extension if not exists pgcrypto;

create table if not exists public.waitlist_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email citext not null unique,
  role text,
  usecase text,

  -- audit & marketing attribution
  ip inet,
  user_agent text,
  source text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,

  -- consent & lifecycle
  consent boolean not null default false,
  status text not null default 'pending',
  verify_token text unique,
  verified_at timestamptz
);

-- Helpful index for ordering by created_at
create index if not exists idx_waitlist_created_at on public.waitlist_submissions (created_at desc);

-- Enable RLS (backend uses service role and bypasses policies)
alter table public.waitlist_submissions enable row level security;

-- Optional: if you ever want to allow direct anonymous inserts from the frontend,
-- uncomment this policy. Not required when inserting from server with service role.
-- create policy "anon_can_insert_waitlist"
--   on public.waitlist_submissions
--   for insert
--   to anon
--   with check (true);

-- Basic email format guard (citext handles case)
do $$
begin
  if not exists (
    select 1 from information_schema.table_constraints
    where table_schema = 'public'
      and table_name = 'waitlist_submissions'
      and constraint_name = 'chk_waitlist_email_format'
  ) then
    alter table public.waitlist_submissions
      add constraint chk_waitlist_email_format
      check (email ~* '^[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}$');
  end if;
end$$;
