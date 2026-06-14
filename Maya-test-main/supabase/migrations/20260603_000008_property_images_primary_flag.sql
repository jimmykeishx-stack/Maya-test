-- =========================
-- Ensure column exists
-- =========================
alter table public.property_images
  add column if not exists is_primary boolean default false;

-- =========================
-- Backfill primary from cover
-- =========================
update public.property_images
set is_primary = true
where coalesce(is_cover, false) = true
  and is_primary is distinct from true;

-- =========================
-- Enforce only one primary per property
-- =========================
create unique index if not exists idx_property_images_single_primary
  on public.property_images (property_id)
  where is_primary = true;