create table if not exists public.owner_listing_submissions (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone_number text not null,
  email text not null,
  property_type text not null,
  location text not null,
  listing_type text not null,
  expected_price text not null,
  property_description text not null,
  ownership_confirmed boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.owner_listing_images (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.owner_listing_submissions(id) on delete cascade,
  file_name text not null,
  mime_type text,
  size integer not null,
  hash text not null,
  data_url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_owner_listing_submissions_created_at
on public.owner_listing_submissions (created_at desc);

create index if not exists idx_owner_listing_images_submission_sort
on public.owner_listing_images (submission_id, sort_order);

alter table public.owner_listing_submissions enable row level security;
alter table public.owner_listing_images enable row level security;

drop policy if exists "Anyone can submit owner listings" on public.owner_listing_submissions;
drop policy if exists "Admins can read owner listings" on public.owner_listing_submissions;
drop policy if exists "Anyone can upload owner listing images" on public.owner_listing_images;
drop policy if exists "Admins can read owner listing images" on public.owner_listing_images;

create policy "Anyone can submit owner listings"
on public.owner_listing_submissions
for insert
to anon, authenticated
with check (ownership_confirmed = true);

create policy "Admins can read owner listings"
on public.owner_listing_submissions
for select
to authenticated
using (public.is_admin());

create policy "Anyone can upload owner listing images"
on public.owner_listing_images
for insert
to anon, authenticated
with check (
  exists (
    select 1
    from public.owner_listing_submissions submissions
    where submissions.id = submission_id
  )
);

create policy "Admins can read owner listing images"
on public.owner_listing_images
for select
to authenticated
using (public.is_admin());

grant insert on public.owner_listing_submissions to anon, authenticated;
grant insert on public.owner_listing_images to anon, authenticated;
grant select on public.owner_listing_submissions to authenticated;
grant select on public.owner_listing_images to authenticated;
