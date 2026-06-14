-- =========================
-- ADMIN CHECK FUNCTION
-- =========================
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public, pg_temp
stable
as $$
  select exists (
    select 1
    from public.admins
    where id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- =========================
-- ADMIN TABLE SECURITY
-- =========================
alter table public.admins enable row level security;

alter table public.admins
add constraint if not exists admins_id_fk
foreign key (id) references auth.users(id) on delete cascade;

-- Ensure primary key exists
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'admins_pkey'
  ) then
    alter table public.admins add primary key (id);
  end if;
end $$;

drop policy if exists "Authenticated admins can verify own access" on public.admins;

create policy "Authenticated admins can verify own access"
on public.admins
for select
to authenticated
using (id = auth.uid());

-- =========================
-- PROPERTIES RLS
-- =========================
alter table public.properties enable row level security;

drop policy if exists "Admins can manage property listings" on public.properties;

create policy "Admins can manage property listings"
on public.properties
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- =========================
-- STORAGE BUCKETS
-- =========================
insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values
  (
    'property-images',
    'property-images',
    true,
    10485760,
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  ),
  (
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
-- STORAGE POLICIES
-- =========================
alter table storage.objects enable row level security;

drop policy if exists "Public can read property image buckets" on storage.objects;

create policy "Public can read property image buckets"
on storage.objects
for select
using (bucket_id in ('property-images', 'property-media'));

drop policy if exists "Admins can upload property image buckets" on storage.objects;

create policy "Admins can upload property image buckets"
on storage.objects
for insert
to authenticated
with check (
  bucket_id in ('property-images', 'property-media')
  and public.is_admin()
);

drop policy if exists "Admins can update property image buckets" on storage.objects;

create policy "Admins can update property image buckets"
on storage.objects
for update
to authenticated
using (
  bucket_id in ('property-images', 'property-media')
  and public.is_admin()
)
with check (
  bucket_id in ('property-images', 'property-media')
  and public.is_admin()
);

drop policy if exists "Admins can delete property image buckets" on storage.objects;

create policy "Admins can delete property image buckets"
on storage.objects
for delete
to authenticated
using (
  bucket_id in ('property-images', 'property-media')
  and public.is_admin()
);