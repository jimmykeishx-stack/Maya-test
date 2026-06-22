alter table public.event_gallery_items
add column if not exists image_urls text[] not null default '{}';

update public.event_gallery_items
set image_urls = array[image_url]
where cardinality(image_urls) = 0
  and image_url is not null;
