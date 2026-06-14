-- =========================
-- Ensure property_images extension
-- =========================
alter table public.property_images
  add column if not exists is_primary boolean not null default false;

-- =========================
-- IMAGE + AMENITY SYNC
-- =========================
do $$
declare
  property_record record;
  media_url text;
  amenity_label text;
  amenity_slug text;
  amenity_id uuid;
begin

  -- Skip safely if tables don't exist
  if not exists (select 1 from information_schema.tables where table_name = 'property_images') then
    raise notice 'property_images table missing, skipping image sync';
    return;
  end if;

  if not exists (select 1 from information_schema.tables where table_name = 'amenities') then
    raise notice 'amenities table missing, skipping amenity sync';
  end if;

  if not exists (select 1 from information_schema.tables where table_name = 'property_amenities') then
    raise notice 'property_amenities table missing, skipping relation sync';
  end if;

  for property_record in
    select id, title, cover_image, gallery_images, amenities
    from public.properties
  loop

    -- =========================
    -- COVER IMAGE SYNC
    -- =========================
    if property_record.cover_image is not null
       and btrim(property_record.cover_image) <> '' then

      update public.property_images
      set is_cover = false,
          is_primary = false
      where property_id = property_record.id;

      insert into public.property_images (
        property_id,
        storage_path,
        public_url,
        alt_text,
        sort_order,
        is_cover,
        is_primary
      )
      select
        property_record.id,
        property_record.cover_image,
        property_record.cover_image,
        property_record.title,
        coalesce(
          (select max(sort_order) + 1
           from public.property_images
           where property_id = property_record.id),
          0
        ),
        true,
        true
      where not exists (
        select 1
        from public.property_images
        where property_id = property_record.id
          and public_url = property_record.cover_image
      );

    end if;

    -- =========================
    -- GALLERY SYNC
    -- =========================
    for media_url in
      select distinct btrim(value)
      from unnest(coalesce(property_record.gallery_images, array[]::text[])) as g(value)
      where btrim(value) <> ''
    loop

      insert into public.property_images (
        property_id,
        storage_path,
        public_url,
        alt_text,
        sort_order,
        is_cover,
        is_primary
      )
      select
        property_record.id,
        media_url,
        media_url,
        property_record.title,
        coalesce(
          (select max(sort_order) + 1
           from public.property_images
           where property_id = property_record.id),
          0
        ),
        false,
        false
      where not exists (
        select 1
        from public.property_images
        where property_id = property_record.id
          and public_url = media_url
      );

    end loop;

    -- =========================
    -- AMENITIES SYNC
    -- =========================
    for amenity_label in
      select distinct btrim(value)
      from unnest(coalesce(property_record.amenities, array[]::text[])) as a(value)
      where btrim(value) <> ''
    loop

      if exists (select 1 from information_schema.tables where table_name = 'amenities') then

        amenity_slug :=
          trim(both '-' from regexp_replace(lower(amenity_label), '[^a-z0-9]+', '-', 'g'));

        if amenity_slug <> '' then

          insert into public.amenities (slug, label, category)
          values (amenity_slug, amenity_label, 'property')
          on conflict (slug)
          do update set label = excluded.label
          returning id into amenity_id;

          if exists (select 1 from information_schema.tables where table_name = 'property_amenities') then
            insert into public.property_amenities (property_id, amenity_id)
            values (property_record.id, amenity_id)
            on conflict do nothing;
          end if;

        end if;
      end if;

    end loop;

  end loop;

end
$$;