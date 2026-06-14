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
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  created_by uuid references auth.users(id) on delete set null
);

alter table public.properties add column if not exists location text;
alter table public.properties add column if not exists area_sqft integer;
alter table public.properties add column if not exists amenities text[] not null default '{}';
alter table public.properties add column if not exists status text not null default 'available';
alter table public.properties add column if not exists cover_image text;
alter table public.properties add column if not exists gallery_images text[] not null default '{}';
alter table public.properties add column if not exists created_by uuid references auth.users(id) on delete set null;

create index if not exists idx_properties_admin_search
on public.properties using gin (
  to_tsvector('english', coalesce(title, '') || ' ' || coalesce(location, '') || ' ' || coalesce(property_type, ''))
);

create index if not exists idx_properties_slug_unique
on public.properties (slug);

create index if not exists idx_properties_created_at
on public.properties (created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

drop trigger if exists set_properties_updated_at on public.properties;
create trigger set_properties_updated_at
before update on public.properties
for each row execute function public.set_updated_at();

alter table public.properties enable row level security;

drop policy if exists "Public can read property listings" on public.properties;
drop policy if exists "Admins can manage property listings" on public.properties;

create policy "Public can read property listings"
on public.properties
for select
using (coalesce(status, 'available') in ('available', 'rented', 'sold'));

create policy "Admins can manage property listings"
on public.properties
for all
to authenticated
using (
  exists (
    select 1
    from public.admins
    where admins.id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.admins
    where admins.id = auth.uid()
  )
);

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

drop policy if exists "Public can read property images bucket" on storage.objects;
drop policy if exists "Admins can upload property images bucket" on storage.objects;
drop policy if exists "Admins can update property images bucket" on storage.objects;
drop policy if exists "Admins can delete property images bucket" on storage.objects;

create policy "Public can read property images bucket"
on storage.objects
for select
using (bucket_id = 'property-images');

create policy "Admins can upload property images bucket"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'property-images'
  and exists (
    select 1
    from public.admins
    where admins.id = auth.uid()
  )
);

create policy "Admins can update property images bucket"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'property-images'
  and exists (
    select 1
    from public.admins
    where admins.id = auth.uid()
  )
)
with check (
  bucket_id = 'property-images'
  and exists (
    select 1
    from public.admins
    where admins.id = auth.uid()
  )
);

create policy "Admins can delete property images bucket"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'property-images'
  and exists (
    select 1
    from public.admins
    where admins.id = auth.uid()
  )
);
