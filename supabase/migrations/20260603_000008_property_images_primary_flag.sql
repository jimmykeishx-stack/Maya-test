alter table public.property_images
  add column if not exists is_primary boolean not null default false;

update public.property_images
set is_primary = true
where is_cover = true
  and is_primary = false;

create unique index if not exists idx_property_images_single_primary
  on public.property_images (property_id)
  where is_primary;
