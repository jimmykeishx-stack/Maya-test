-- =========================
-- Extensions
-- =========================
create extension if not exists pgcrypto;

-- =========================
-- Core Table
-- =========================
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),

  title text,
  slug text unique,
  description text,

  property_type text,
  listing_type text,

  price numeric,
  location text,

  bedrooms integer,
  bathrooms integer,
  area_sqft integer,

  amenities text[] default '{}',

  featured boolean default false,
  status text default 'available',

  cover_image text,
  gallery_images text[] default '{}',

  location_label text,

  published_at timestamptz,
  soft_deleted_at timestamptz,

  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now()),

  created_by uuid references auth.users(id) on delete set null
);

-- =========================
-- Indexes
-- =========================
create index if not exists idx_properties_location
  on public.properties (location);

create index if not exists idx_properties_status
  on public.properties (status);

create index if not exists idx_properties_listing_type
  on public.properties (listing_type);

create index if not exists idx_properties_created_at
  on public.properties (created_at desc);

create index if not exists idx_properties_search
  on public.properties using gin (
    to_tsvector(
      'english',
      coalesce(title, '') || ' ' ||
      coalesce(location, '') || ' ' ||
      coalesce(property_type, '')
    )
  );

-- =========================
-- Trigger: updated_at
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
-- Data cleanup (safe defaults)
-- =========================
update public.properties
set title = 'Untitled Property'
where title is null or title = '';

update public.properties
set description = 'Property details will be updated by Maya Haven.'
where description is null or description = '';

update public.properties
set property_type = 'Residence'
where property_type is null or property_type = '';

-- Slug generation
update public.properties
set slug =
  lower(
    regexp_replace(
      regexp_replace(
        coalesce(nullif(slug, ''), title, id::text),
        '[^a-zA-Z0-9]+',
        '-',
        'g'
      ),
      '(^-|-$)',
      '',
      'g'
    )
  )
where slug is null or slug = '';

-- Fix duplicate slugs
with ranked as (
  select
    id,
    slug,
    row_number() over (partition by slug order by created_at nulls last, id) as rn
  from public.properties
)
update public.properties p
set slug = ranked.slug || '-' || left(p.id::text, 8)
from ranked
where p.id = ranked.id
  and ranked.rn > 1;

-- Location fallback
update public.properties
set location = coalesce(location, location_label)
where location is null or location = '';

update public.properties
set location_label = coalesce(location_label, location)
where location_label is null or location_label = '';

-- Cover + gallery normalization
update public.properties
set cover_image = null
where cover_image = '';

update public.properties
set gallery_images = '{}'
where gallery_images is null;

update public.properties
set amenities = '{}'
where amenities is null;

update public.properties
set featured = false
where featured is null;

-- If gallery empty but cover exists
update public.properties
set gallery_images = array[cover_image]
where cover_image is not null
  and cover_image <> ''
  and cardinality(gallery_images) = 0;

-- =========================
-- Constraints (safe add)
-- =========================
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'properties_price_non_negative'
  ) then
    alter table public.properties
    add constraint properties_price_non_negative
    check (price is null or price >= 0);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'properties_area_non_negative'
  ) then
    alter table public.properties
    add constraint properties_area_non_negative
    check (area_sqft is null or area_sqft >= 0);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'properties_status_check'
  ) then
    alter table public.properties
    add constraint properties_status_check
    check (status in ('available', 'rented', 'sold', 'archived'));
  end if;
end $$;