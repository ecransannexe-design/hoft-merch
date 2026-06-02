-- ============================================================
-- HOFT Merchandising — Supabase Schema
-- Run this in the Supabase SQL Editor (one shot)
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ─── visits ────────────────────────────────────────────────
create table public.visits (
  id                  uuid primary key default uuid_generate_v4(),
  created_at          timestamptz not null default now(),
  local_id            text unique,          -- dedup key from the device
  store_name          text not null,
  representative_name text not null,
  visit_date          date not null default current_date,
  latitude            numeric(10, 7),
  longitude           numeric(10, 7),
  comments            text,
  signature_url       text,
  synced_at           timestamptz
);

create index visits_rep_idx   on public.visits (representative_name);
create index visits_store_idx on public.visits (store_name);
create index visits_date_idx  on public.visits (visit_date desc);

-- ─── visit_answers ─────────────────────────────────────────
-- Stores all yes/no answers AND missing-product rows.
-- question values: 'missing_stock' | 'correct_pricing' |
--                  'competitor_present' | 'missing_product'
create table public.visit_answers (
  id         uuid primary key default uuid_generate_v4(),
  visit_id   uuid not null references public.visits (id) on delete cascade,
  question   text not null,
  answer     text not null
);

create index visit_answers_visit_idx on public.visit_answers (visit_id);
create index visit_answers_q_idx     on public.visit_answers (question);

-- ─── visit_photos ──────────────────────────────────────────
create table public.visit_photos (
  id          uuid primary key default uuid_generate_v4(),
  visit_id    uuid not null references public.visits (id) on delete cascade,
  photo_type  text not null
               check (photo_type in ('bay_before','display_before','competitor','final')),
  photo_url   text not null,
  uploaded_at timestamptz not null default now()
);

create index visit_photos_visit_idx on public.visit_photos (visit_id);

-- ─── Row-Level Security ────────────────────────────────────
-- Permissive for MVP. Tighten before going to production
-- (add per-user policies once you add auth).

alter table public.visits        enable row level security;
alter table public.visit_answers enable row level security;
alter table public.visit_photos  enable row level security;

create policy "anon_all_visits"
  on public.visits for all using (true) with check (true);

create policy "anon_all_answers"
  on public.visit_answers for all using (true) with check (true);

create policy "anon_all_photos"
  on public.visit_photos for all using (true) with check (true);

-- ─── Storage buckets ───────────────────────────────────────
-- Create these in the Supabase Dashboard → Storage
-- or uncomment the lines below if you have the storage extension:
--
-- insert into storage.buckets (id, name, public) values ('visit-photos', 'visit-photos', true);
-- insert into storage.buckets (id, name, public) values ('signatures',   'signatures',   true);

-- Permissive storage policy (run after creating buckets):
-- create policy "public_visit_photos"
--   on storage.objects for all using (bucket_id = 'visit-photos') with check (bucket_id = 'visit-photos');
-- create policy "public_signatures"
--   on storage.objects for all using (bucket_id = 'signatures')   with check (bucket_id = 'signatures');
