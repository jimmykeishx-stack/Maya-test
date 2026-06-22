grant select on public.event_gallery_items to anon, authenticated;
grant insert, update, delete on public.event_gallery_items to authenticated;

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
