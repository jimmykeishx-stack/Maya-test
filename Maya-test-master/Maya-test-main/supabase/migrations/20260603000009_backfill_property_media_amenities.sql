alter table public.property_images
  add column if not exists is_primary boolean not null default false;

do $$
declare
  property_record record;
  media_url text;
  amenity_label text;
  amenity_slug text;
  amenity_id uuid;
begin
  for property_record in
    select
      id,
      title,
      cover_image,
      gallery_images,
      amenities
    from public.properties
  loop
    if property_record.cover_image is not null and btrim(property_record.cover_image) <> '' then
      update public.property_images
      set
        is_cover = false,
        is_primary = false
      where property_images.property_id = property_record.id
        and not (
          property_images.public_url = property_record.cover_image
          or property_images.storage_path = property_record.cover_image
        )
        and (property_images.is_cover = true or property_images.is_primary = true);

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
          (
            select max(existing_images.sort_order) + 1
            from public.property_images as existing_images
            where existing_images.property_id = property_record.id
          ),
          0
        ),
        true,
        true
      where not exists (
        select 1
        from public.property_images
        where property_images.property_id = property_record.id
          and (
            property_images.public_url = property_record.cover_image
            or property_images.storage_path = property_record.cover_image
          )
      );

      update public.property_images
      set
        is_cover = true,
        is_primary = true
      where property_images.property_id = property_record.id
        and (
          property_images.public_url = property_record.cover_image
          or property_images.storage_path = property_record.cover_image
        );
    end if;

    for media_url in
      select distinct btrim(value)
      from unnest(coalesce(property_record.gallery_images, array[]::text[])) as gallery(value)
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
          (
            select max(existing_images.sort_order) + 1
            from public.property_images as existing_images
            where existing_images.property_id = property_record.id
          ),
          0
        ),
        coalesce(media_url = property_record.cover_image, false),
        coalesce(media_url = property_record.cover_image, false)
      where not exists (
        select 1
        from public.property_images
        where property_images.property_id = property_record.id
          and (
            property_images.public_url = media_url
            or property_images.storage_path = media_url
          )
      );
    end loop;

    for amenity_label in
      select distinct btrim(value)
      from unnest(coalesce(property_record.amenities, array[]::text[])) as flat_amenities(value)
      where btrim(value) <> ''
    loop
      amenity_slug := trim(both '-' from regexp_replace(lower(amenity_label), '[^a-z0-9]+', '-', 'g'));

      if amenity_slug <> '' then
        insert into public.amenities (slug, label, category)
        values (amenity_slug, amenity_label, 'property')
        on conflict (slug) do update set label = excluded.label
        returning id into amenity_id;

        insert into public.property_amenities (property_id, amenity_id)
        values (property_record.id, amenity_id)
        on conflict (property_id, amenity_id) do nothing;
      end if;
    end loop;
  end loop;
end
$$;
