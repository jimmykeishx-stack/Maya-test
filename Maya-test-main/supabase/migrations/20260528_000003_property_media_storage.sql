-- =========================
-- BUCKET
-- =========================
insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'property-media',
  'property-media',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- =========================
-- POLICIES: CLEAN RESET
-- =========================
alter table storage.objects enable row level security;

drop policy if exists "Public can read property media" on storage.objects;
drop policy if exists "Admins can upload property media" on storage.objects;
drop policy if exists "Admins can update property media" on storage.objects;
drop policy if exists "Admins can delete property media" on storage.objects;

-- =========================
-- PUBLIC READ
-- =========================
create policy "Public can read property media"
on storage.objects
for select
using (bucket_id = 'property-media');

-- =========================
-- ADMIN UPLOAD
-- =========================
create policy "Admins can upload property media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'property-media'
  and public.is_admin()
);

-- =========================
-- ADMIN UPDATE
-- =========================
create policy "Admins can update property media"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'property-media'
  and public.is_admin()
)
with check (
  bucket_id = 'property-media'
  and public.is_admin()
);

-- =========================
-- ADMIN DELETE
-- =========================
create policy "Admins can delete property media"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'property-media'
  and public.is_admin()
);