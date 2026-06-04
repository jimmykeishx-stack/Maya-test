create table if not exists public.admins (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default timezone('utc'::text, now()),
  constraint admins_email_lowercase check (email = lower(email))
);

create unique index if not exists admins_email_unique_idx
on public.admins (email);

alter table public.admins enable row level security;

drop policy if exists "Authenticated admins can verify own access" on public.admins;

create policy "Authenticated admins can verify own access"
on public.admins
for select
to authenticated
using (id = auth.uid());

drop policy if exists "MVP admin can upload property media" on storage.objects;
drop policy if exists "Admins can upload property media" on storage.objects;
drop policy if exists "Admins can update property media" on storage.objects;
drop policy if exists "Admins can delete property media" on storage.objects;

create policy "Admins can upload property media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'property-media'
  and exists (
    select 1
    from public.admins
    where id = auth.uid()
  )
);

create policy "Admins can update property media"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'property-media'
  and exists (
    select 1
    from public.admins
    where id = auth.uid()
  )
)
with check (
  bucket_id = 'property-media'
  and exists (
    select 1
    from public.admins
    where id = auth.uid()
  )
);

create policy "Admins can delete property media"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'property-media'
  and exists (
    select 1
    from public.admins
    where id = auth.uid()
  )
);
