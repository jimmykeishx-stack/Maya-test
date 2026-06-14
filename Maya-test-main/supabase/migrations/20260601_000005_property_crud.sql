-- =========================
-- EXTENSION
-- =========================
create extension if not exists pgcrypto;

-- =========================
-- TABLE
-- =========================
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),

  title text not null,
  slug text unique not null,
  description text not null,

  property_type text not null,
  listing_type text not null,

  price numeric not null,

  location text,
  bedrooms integer,
  bathrooms integer,
  area_sqft integer,

  amenities text[] not null default '{}',

  featured boolean not null default false,
  status text not null default 'available',

  cover_image text,
  gallery_images text[] not null default '{}',

  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),

  created_by uuid references auth.users(id) on delete set null
);

-- =========================
-- INDEXES
-- =========================
create index if not exists idx_properties_admin_search
on public.properties using gin (
  to_tsvector(
    'english',
    coalesce(title, '') || ' ' ||
    coalesce(location, '') || ' ' ||
    coalesce(property_type, '')
  )
);

create index if not exists idx_properties_created_at
on public.properties (created_at desc);

-- =========================
-- UPDATED_AT TRIGGER
-- =========================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_properties_updated_at on public.properties;

create trigger set_properties_updated_at
before update on public.properties
for each row
execute function public.set_updated_at();

-- =========================
-- RLS
-- =========================
alter table public.properties enable row level security;

drop policy if exists "Public can read property listings" on public.properties;

create policy "Public can read property listings"
on public.properties
for select
using (status in ('available', 'rented', 'sold'));

drop policy if exists "Admins can manage property listings" on public.properties;

create policy "Admins can manage property listings"
on public.properties
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- =========================
-- STORAGE BUCKET
-- =========================
insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'property-images',
  'property-images',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- =========================
-- STORAGE POLICIES
-- =========================
alter table storage.objects enable row level security;

drop policy if exists "Public can read property images bucket" on storage.objects;

create policy "Public can read property images bucket"
on storage.objects
for select
using (bucket_id = 'property-images');

drop policy if exists "Admins can manage property images bucket" on storage.objects;

create policy "Admins can manage property images bucket"
on storage.objects
for all
to authenticated
using (
  bucket_id = 'property-images'
  and public.is_admin()
)
with check (
  bucket_id = 'property-images'
  and public.is_admin()
);