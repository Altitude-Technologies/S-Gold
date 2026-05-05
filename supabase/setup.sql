-- =====================================================================
--  S Gold — Supabase one-time setup
--  Run this entire file in: Supabase Dashboard → SQL Editor → New query
-- =====================================================================

-- 1. Inventory table ---------------------------------------------------
create table if not exists public.gold_items (
  id uuid primary key default gen_random_uuid(),
  title             text    not null,
  category          text,
  karat             text,
  weight            numeric,
  market_value      numeric,
  hallmark_status   text,
  artisan_details   text,
  badge             text,
  availability      text    default 'In Stock',
  status            text    default 'draft',
  images            text[]  default '{}',
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

create index if not exists gold_items_status_idx on public.gold_items (status);
create index if not exists gold_items_created_idx on public.gold_items (created_at desc);

-- Auto-update updated_at on row updates
create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists gold_items_touch on public.gold_items;
create trigger gold_items_touch
  before update on public.gold_items
  for each row execute function public.touch_updated_at();

-- 2. Row Level Security policies --------------------------------------
alter table public.gold_items enable row level security;

-- Anyone (including anonymous visitors) can READ published items
drop policy if exists "public_read_published" on public.gold_items;
create policy "public_read_published"
  on public.gold_items for select
  using (status = 'published');

-- Authenticated admins can READ everything (drafts included)
drop policy if exists "auth_read_all" on public.gold_items;
create policy "auth_read_all"
  on public.gold_items for select
  to authenticated
  using (true);

-- Authenticated admins can INSERT / UPDATE / DELETE
drop policy if exists "auth_insert" on public.gold_items;
create policy "auth_insert"
  on public.gold_items for insert
  to authenticated
  with check (true);

drop policy if exists "auth_update" on public.gold_items;
create policy "auth_update"
  on public.gold_items for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "auth_delete" on public.gold_items;
create policy "auth_delete"
  on public.gold_items for delete
  to authenticated
  using (true);

-- 3. Storage bucket for product images --------------------------------
insert into storage.buckets (id, name, public)
values ('gold-images', 'gold-images', true)
on conflict (id) do nothing;

-- Anyone can view images
drop policy if exists "public_read_images" on storage.objects;
create policy "public_read_images"
  on storage.objects for select
  using (bucket_id = 'gold-images');

-- Authenticated admins can upload
drop policy if exists "auth_upload_images" on storage.objects;
create policy "auth_upload_images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'gold-images');

-- Authenticated admins can delete
drop policy if exists "auth_delete_images" on storage.objects;
create policy "auth_delete_images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'gold-images');

-- =====================================================================
--  Done. Now create your admin user:
--  Dashboard → Authentication → Users → "Add user" → email + password
-- =====================================================================
