create table if not exists public.event_gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  excerpt text not null,
  image_url text not null,
  image_urls text[] not null default '{}',
  status public.blog_status not null default 'draft',
  event_date date,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_event_gallery_items_status_sort
on public.event_gallery_items (status, sort_order, event_date desc, created_at desc);

drop trigger if exists set_event_gallery_items_updated_at on public.event_gallery_items;
create trigger set_event_gallery_items_updated_at
before update on public.event_gallery_items
for each row execute function public.set_updated_at();

alter table public.event_gallery_items enable row level security;

drop policy if exists "Public can read published event gallery items" on public.event_gallery_items;
drop policy if exists "Admins can manage event gallery items" on public.event_gallery_items;

create policy "Public can read published event gallery items"
on public.event_gallery_items
for select
to anon, authenticated
using (status = 'published');

create policy "Admins can manage event gallery items"
on public.event_gallery_items
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());


grant select on public.event_gallery_items to anon, authenticated;
grant insert, update, delete on public.event_gallery_items to authenticated;

