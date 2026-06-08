create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";
create extension if not exists "postgis";

create type public.app_role as enum ('user', 'agent', 'admin');
create type public.property_listing_type as enum ('sale', 'rent');
create type public.property_market_status as enum ('available', 'sold', 'rented', 'archived');
create type public.property_segment as enum ('residential', 'commercial', 'affordable_housing');
create type public.lead_status as enum ('new', 'contacted', 'viewing_scheduled', 'negotiating', 'converted', 'closed_lost');
create type public.viewing_status as enum ('pending', 'approved', 'rejected', 'rescheduled', 'completed');
create type public.notification_channel as enum ('in_app', 'email', 'sms', 'whatsapp');
create type public.notification_event as enum ('inquiry_received', 'property_approved', 'viewing_scheduled', 'new_matching_property', 'password_reset', 'listing_expiration');
create type public.blog_status as enum ('draft', 'published', 'archived');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.app_role not null default 'user',
  full_name text,
  phone_number text,
  avatar_url text,
  bio text,
  company_name text,
  country text default 'Kenya',
  city text,
  preferred_currency text default 'KES',
  marketing_opt_in boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.agents (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  license_number text,
  earb_registration_number text,
  territory text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  country text not null default 'Kenya',
  county text not null,
  city text not null,
  area text not null,
  nearby_landmarks text[] not null default '{}',
  coordinates geography(point, 4326),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  property_type text not null,
  listing_type public.property_listing_type not null,
  status text not null default 'available',
  segment public.property_segment not null default 'residential',
  price numeric(14,2) not null,
  currency text not null default 'KES',
  negotiable boolean not null default false,
  featured boolean not null default false,
  area_sqft integer,
  lot_area_sqft integer,
  bedrooms integer,
  bathrooms integer,
  parking_spaces integer,
  furnished boolean,
  year_built integer,
  floor_number integer,
  virtual_tour_url text,
  meta_title text,
  meta_description text,
  og_image_url text,
  search_document tsvector generated always as (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B')
  ) stored,
  location_id uuid references public.locations(id) on delete set null,
  agent_id uuid references public.agents(id) on delete set null,
  owner_profile_id uuid references public.profiles(id) on delete set null,
  published_at timestamptz,
  archived_at timestamptz,
  soft_deleted_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  storage_path text not null,
  public_url text,
  alt_text text,
  sort_order integer not null default 0,
  is_cover boolean not null default false,
  width integer,
  height integer,
  blur_hash text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.property_videos (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  provider text not null,
  embed_url text not null,
  title text,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.amenities (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  category text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.property_amenities (
  property_id uuid not null references public.properties(id) on delete cascade,
  amenity_id uuid not null references public.amenities(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (property_id, amenity_id)
);

create table if not exists public.saved_properties (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  unique (profile_id, property_id)
);

create table if not exists public.saved_searches (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  filters jsonb not null,
  channels public.notification_channel[] not null default array['email']::public.notification_channel[],
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references public.properties(id) on delete set null,
  profile_id uuid references public.profiles(id) on delete set null,
  source text not null,
  full_name text not null,
  email text not null,
  phone_number text not null,
  message text not null,
  lead_status public.lead_status not null default 'new',
  assigned_agent_id uuid references public.agents(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.lead_notes (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null references public.inquiries(id) on delete cascade,
  author_profile_id uuid references public.profiles(id) on delete set null,
  note text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.viewing_requests (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  requester_name text not null,
  requester_email text not null,
  requester_phone text not null,
  preferred_date date not null,
  preferred_time_slot text not null,
  notes text,
  status public.viewing_status not null default 'pending',
  assigned_agent_id uuid references public.agents(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade,
  event public.notification_event not null,
  title text not null,
  body text not null,
  channels public.notification_channel[] not null default array['in_app']::public.notification_channel[],
  read_at timestamptz,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references public.properties(id) on delete set null,
  profile_id uuid references public.profiles(id) on delete set null,
  rating numeric(2,1) not null check (rating >= 0 and rating <= 5),
  title text,
  body text not null,
  approved boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  author_profile_id uuid references public.profiles(id) on delete set null,
  slug text not null unique,
  title text not null,
  excerpt text not null,
  body text not null,
  status public.blog_status not null default 'draft',
  category text not null,
  tags text[] not null default '{}',
  featured_image_url text,
  seo_title text,
  seo_description text,
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  property_id uuid references public.properties(id) on delete set null,
  event_name text not null,
  session_id text,
  path text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_profile_id uuid references public.profiles(id) on delete set null,
  entity_name text not null,
  entity_id uuid,
  action text not null,
  changes jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.properties
  add column if not exists slug text,
  add column if not exists property_type text,
  add column if not exists listing_type text,
  add column if not exists status text not null default 'available',
  add column if not exists area_sqft integer,
  add column if not exists bedrooms integer,
  add column if not exists bathrooms integer,
  add column if not exists featured boolean not null default false,
  add column if not exists updated_at timestamptz not null default timezone('utc', now());
create index if not exists idx_properties_search_document on public.properties using gin (search_document);
create index if not exists idx_properties_title_trgm on public.properties using gin (title gin_trgm_ops);
create index if not exists idx_properties_segment_listing_status on public.properties (segment, listing_type, status);
create index if not exists idx_properties_price on public.properties (price);
create index if not exists idx_locations_coordinates on public.locations using gist (coordinates);
create index if not exists idx_inquiries_status_created_at on public.inquiries (lead_status, created_at desc);
create index if not exists idx_viewing_requests_status_created_at on public.viewing_requests (status, created_at desc);
create index if not exists idx_notifications_profile_created_at on public.notifications (profile_id, created_at desc);
create index if not exists idx_blog_posts_status_published_at on public.blog_posts (status, published_at desc);
create index if not exists idx_analytics_events_name_created_at on public.analytics_events (event_name, created_at desc);

create trigger set_profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger set_agents_updated_at before update on public.agents for each row execute function public.set_updated_at();
create trigger set_locations_updated_at before update on public.locations for each row execute function public.set_updated_at();
create trigger set_properties_updated_at before update on public.properties for each row execute function public.set_updated_at();
create trigger set_property_images_updated_at before update on public.property_images for each row execute function public.set_updated_at();
create trigger set_property_videos_updated_at before update on public.property_videos for each row execute function public.set_updated_at();
create trigger set_saved_searches_updated_at before update on public.saved_searches for each row execute function public.set_updated_at();
create trigger set_inquiries_updated_at before update on public.inquiries for each row execute function public.set_updated_at();
create trigger set_viewing_requests_updated_at before update on public.viewing_requests for each row execute function public.set_updated_at();
create trigger set_reviews_updated_at before update on public.reviews for each row execute function public.set_updated_at();
create trigger set_blog_posts_updated_at before update on public.blog_posts for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.agents enable row level security;
alter table public.locations enable row level security;
alter table public.properties enable row level security;
alter table public.property_images enable row level security;
alter table public.property_videos enable row level security;
alter table public.amenities enable row level security;
alter table public.property_amenities enable row level security;
alter table public.saved_properties enable row level security;
alter table public.saved_searches enable row level security;
alter table public.inquiries enable row level security;
alter table public.lead_notes enable row level security;
alter table public.viewing_requests enable row level security;
alter table public.notifications enable row level security;
alter table public.reviews enable row level security;
alter table public.blog_posts enable row level security;
alter table public.analytics_events enable row level security;
alter table public.audit_logs enable row level security;

create or replace function public.current_app_role()
returns public.app_role
language sql
stable
as $$
  select coalesce((auth.jwt() ->> 'app_role')::public.app_role, 'user'::public.app_role);
$$;

create policy "Public can read active properties"
on public.properties
for select
using (coalesce(status, 'available') in ('available', 'rented', 'sold'));

create policy "Agents and admins can manage properties"
on public.properties
for all
using (public.current_app_role() in ('agent', 'admin'))
with check (public.current_app_role() in ('agent', 'admin'));

create policy "Public can read property media"
on public.property_images
for select
using (true);

create policy "Public can read property videos"
on public.property_videos
for select
using (true);

create policy "Public can read amenities"
on public.amenities
for select
using (true);

create policy "Public can read property amenities"
on public.property_amenities
for select
using (true);

create policy "Users manage own profile"
on public.profiles
for all
using (auth.uid() = id or public.current_app_role() = 'admin')
with check (auth.uid() = id or public.current_app_role() = 'admin');

create policy "Users manage own saved properties"
on public.saved_properties
for all
using (profile_id = auth.uid() or public.current_app_role() = 'admin')
with check (profile_id = auth.uid() or public.current_app_role() = 'admin');

create policy "Users manage own saved searches"
on public.saved_searches
for all
using (profile_id = auth.uid() or public.current_app_role() = 'admin')
with check (profile_id = auth.uid() or public.current_app_role() = 'admin');

create policy "Users can create inquiries"
on public.inquiries
for insert
with check (true);

create policy "Agents and admins can read inquiries"
on public.inquiries
for select
using (public.current_app_role() in ('agent', 'admin'));

create policy "Users can create viewing requests"
on public.viewing_requests
for insert
with check (true);

create policy "Agents and admins can manage viewing requests"
on public.viewing_requests
for all
using (public.current_app_role() in ('agent', 'admin'))
with check (public.current_app_role() in ('agent', 'admin'));

create policy "Users read own notifications"
on public.notifications
for select
using (profile_id = auth.uid() or public.current_app_role() = 'admin');

create policy "Users update own notifications"
on public.notifications
for update
using (profile_id = auth.uid() or public.current_app_role() = 'admin')
with check (profile_id = auth.uid() or public.current_app_role() = 'admin');

create policy "Public can read published blog posts"
on public.blog_posts
for select
using (status = 'published');

create policy "Agents and admins can manage blog posts"
on public.blog_posts
for all
using (public.current_app_role() in ('agent', 'admin'))
with check (public.current_app_role() in ('agent', 'admin'));

create policy "Admins can read audit logs"
on public.audit_logs
for select
using (public.current_app_role() = 'admin');
