do $$
begin
  if not exists (select 1 from pg_type where typname = 'property_mandate_type') then
    create type public.property_mandate_type as enum ('exclusive', 'open');
  end if;
end
$$;

alter table public.properties
  add column if not exists legacy_id text,
  add column if not exists mandate_type public.property_mandate_type not null default 'open',
  add column if not exists price_suffix text,
  add column if not exists location_label text,
  add column if not exists highlight text,
  add column if not exists blurb text,
  add column if not exists agent_note text,
  add column if not exists cover_image text,
  add column if not exists youtube_video_id text,
  add column if not exists metrics jsonb,
  add column if not exists features text[] not null default '{}',
  add column if not exists published_at timestamptz,
  add column if not exists soft_deleted_at timestamptz;

alter table public.agents
  alter column profile_id drop not null,
  add column if not exists full_name text,
  add column if not exists title text,
  add column if not exists email text,
  add column if not exists phone_number text,
  add column if not exists whatsapp_number text,
  add column if not exists bio text,
  add column if not exists image_url text,
  add column if not exists is_active boolean not null default true;

create table if not exists public.property_agents (
  property_id uuid not null references public.properties(id) on delete cascade,
  agent_id uuid not null references public.agents(id) on delete cascade,
  role text not null default 'primary' check (role in ('primary', 'secondary')),
  created_at timestamptz not null default timezone('utc', now()),
  primary key (property_id, agent_id)
);

alter table public.property_agents enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'properties_legacy_id_unique'
      and conrelid = 'public.properties'::regclass
  ) then
    alter table public.properties add constraint properties_legacy_id_unique unique (legacy_id);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'properties_price_non_negative'
      and conrelid = 'public.properties'::regclass
  ) then
    alter table public.properties add constraint properties_price_non_negative check (price >= 0);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'properties_area_non_negative'
      and conrelid = 'public.properties'::regclass
  ) then
    alter table public.properties add constraint properties_area_non_negative check (area_sqft is null or area_sqft >= 0);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'properties_bedrooms_non_negative'
      and conrelid = 'public.properties'::regclass
  ) then
    alter table public.properties add constraint properties_bedrooms_non_negative check (bedrooms is null or bedrooms >= 0);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'properties_bathrooms_non_negative'
      and conrelid = 'public.properties'::regclass
  ) then
    alter table public.properties add constraint properties_bathrooms_non_negative check (bathrooms is null or bathrooms >= 0);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'property_images_property_sort_unique'
      and conrelid = 'public.property_images'::regclass
  ) then
    alter table public.property_images add constraint property_images_property_sort_unique unique (property_id, sort_order);
  end if;
end
$$;

create unique index if not exists idx_property_images_single_cover
  on public.property_images (property_id)
  where is_cover;

create index if not exists idx_properties_legacy_id on public.properties (legacy_id);
create index if not exists idx_properties_location_label on public.properties (location_label);
create index if not exists idx_properties_featured_published on public.properties (featured, published_at desc);
create index if not exists idx_properties_listing_segment_status on public.properties (listing_type, segment, status);
create index if not exists idx_property_images_property_order on public.property_images (property_id, sort_order);
create index if not exists idx_property_agents_agent on public.property_agents (agent_id);
create index if not exists idx_inquiries_property_created_at on public.inquiries (property_id, created_at desc);
create index if not exists idx_inquiries_email_created_at on public.inquiries (email, created_at desc);
create unique index if not exists idx_locations_unique_area on public.locations (country, county, city, area);

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'properties'
      and policyname = 'Public can read published property catalog'
  ) then
    create policy "Public can read published property catalog"
    on public.properties
    for select
    using (published_at is not null and soft_deleted_at is null);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'agents'
      and policyname = 'Public can read active agents'
  ) then
    create policy "Public can read active agents"
    on public.agents
    for select
    using (is_active = true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'property_agents'
      and policyname = 'Public can read property agents'
  ) then
    create policy "Public can read property agents"
    on public.property_agents
    for select
    using (true);
  end if;
end
$$;
