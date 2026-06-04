create extension if not exists pgcrypto;

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  title text,
  slug text,
  description text,
  property_type text,
  listing_type text,
  price numeric,
  location text,
  bedrooms integer,
  bathrooms integer,
  area_sqft integer,
  amenities text[] default '{}',
  featured boolean default false,
  status text default 'available',
  cover_image text,
  gallery_images text[] default '{}',
  created_at timestamptz default timezone('utc'::text, now()),
  updated_at timestamptz default timezone('utc'::text, now()),
  created_by uuid references auth.users(id) on delete set null
);

-- Form fields.
alter table public.properties add column if not exists title text;
alter table public.properties add column if not exists slug text;
alter table public.properties add column if not exists description text;
alter table public.properties add column if not exists property_type text;
alter table public.properties add column if not exists listing_type text;
alter table public.properties add column if not exists price numeric;
alter table public.properties add column if not exists location text;
alter table public.properties add column if not exists bedrooms integer;
alter table public.properties add column if not exists bathrooms integer;
alter table public.properties add column if not exists area_sqft integer;
alter table public.properties add column if not exists amenities text[] default '{}';
alter table public.properties add column if not exists featured boolean default false;
alter table public.properties add column if not exists status text default 'available';
alter table public.properties add column if not exists cover_image text;
alter table public.properties add column if not exists gallery_images text[] default '{}';
alter table public.properties add column if not exists created_at timestamptz default timezone('utc'::text, now());
alter table public.properties add column if not exists updated_at timestamptz default timezone('utc'::text, now());
alter table public.properties add column if not exists created_by uuid references auth.users(id) on delete set null;

-- Compatibility fields used by existing public pages and the admin service.
alter table public.properties add column if not exists market_status text default 'available';
alter table public.properties add column if not exists location_label text;
alter table public.properties add column if not exists size_sqft integer;
alter table public.properties add column if not exists cover_image text;
alter table public.properties add column if not exists published_at timestamptz;
alter table public.properties add column if not exists soft_deleted_at timestamptz;

alter table public.properties alter column amenities set default '{}';
alter table public.properties alter column featured set default false;
alter table public.properties alter column status set default 'available';
alter table public.properties alter column gallery_images set default '{}';
alter table public.properties alter column created_at set default timezone('utc'::text, now());
alter table public.properties alter column updated_at set default timezone('utc'::text, now());

do $$
declare
  listing_type_udt text;
  market_status_udt text;
  status_udt text;
  price_data_type text;
  area_data_type text;
begin
  select udt_name
  into listing_type_udt
  from information_schema.columns
  where table_schema = 'public'
    and table_name = 'properties'
    and column_name = 'listing_type';

  select udt_name
  into market_status_udt
  from information_schema.columns
  where table_schema = 'public'
    and table_name = 'properties'
    and column_name = 'market_status';

  select udt_name
  into status_udt
  from information_schema.columns
  where table_schema = 'public'
    and table_name = 'properties'
    and column_name = 'status';

  select data_type
  into price_data_type
  from information_schema.columns
  where table_schema = 'public'
    and table_name = 'properties'
    and column_name = 'price';

  select data_type
  into area_data_type
  from information_schema.columns
  where table_schema = 'public'
    and table_name = 'properties'
    and column_name = 'area_sqft';

  update public.properties
  set title = coalesce(nullif(title, ''), 'Untitled Property')
  where title is null or title = '';

  update public.properties
  set description = coalesce(nullif(description, ''), 'Property details will be updated by Maya Haven.')
  where description is null or description = '';

  update public.properties
  set property_type = coalesce(nullif(property_type, ''), 'Residence')
  where property_type is null or property_type = '';

  update public.properties
  set slug = coalesce(
    nullif(
      lower(
        regexp_replace(
          regexp_replace(coalesce(nullif(slug, ''), title, id::text), '[^a-zA-Z0-9]+', '-', 'g'),
          '(^-|-$)',
          '',
          'g'
        )
      ),
      ''
    ),
    'property-' || left(id::text, 8)
  )
  where slug is null or slug = '';

  -- Prevent unique-index failures on existing duplicate slugs.
  with ranked_slugs as (
    select
      id,
      slug,
      row_number() over (partition by slug order by created_at nulls last, id) as duplicate_rank
    from public.properties
    where slug is not null
      and slug <> ''
  )
  update public.properties as properties
  set slug = ranked_slugs.slug || '-' || left(properties.id::text, 8)
  from ranked_slugs
  where properties.id = ranked_slugs.id
    and ranked_slugs.duplicate_rank > 1;

  update public.properties
  set area_sqft = coalesce(area_sqft, size_sqft)
  where area_sqft is null;

  update public.properties
  set location = coalesce(nullif(location, ''), nullif(location_label, ''))
  where location is null or location = '';

  update public.properties
  set location_label = coalesce(nullif(location_label, ''), nullif(location, ''))
  where location_label is null or location_label = '';

  update public.properties
  set size_sqft = coalesce(size_sqft, area_sqft)
  where size_sqft is null;

  update public.properties
  set cover_image = coalesce(nullif(cover_image, ''), nullif(cover_image, ''))
  where cover_image is null or cover_image = '';

  update public.properties
  set cover_image = coalesce(nullif(cover_image, ''), nullif(cover_image, ''))
  where cover_image is null or cover_image = '';

  update public.properties
  set gallery_images = array[cover_image]
  where cover_image is not null
    and cover_image <> ''
    and (gallery_images is null or cardinality(gallery_images) = 0);

  update public.properties
  set amenities = '{}'
  where amenities is null;

  update public.properties
  set gallery_images = '{}'
  where gallery_images is null;

  update public.properties
  set featured = false
  where featured is null;

  update public.properties
  set created_at = timezone('utc'::text, now())
  where created_at is null;

  update public.properties
  set updated_at = timezone('utc'::text, now())
  where updated_at is null;

  if status_udt in ('text', 'varchar', 'bpchar') then
    update public.properties
    set status = lower(coalesce(nullif(status::text, ''), 'available'))
    where status is null
       or status::text = ''
       or status::text <> lower(status::text);
  end if;

  if market_status_udt = 'property_market_status' then
    update public.properties
    set market_status = (
      case
        when lower(coalesce(status::text, market_status::text, 'available')) = 'sold' then 'sold'
        when lower(coalesce(status::text, market_status::text, 'available')) in ('rented', 'rent', 'leased') then 'rented'
        when lower(coalesce(status::text, market_status::text, 'available')) = 'archived' then 'archived'
        else 'available'
      end
    )::public.property_market_status
    where market_status is null
       or market_status::text <> lower(coalesce(status::text, market_status::text, 'available'));
  elsif market_status_udt in ('text', 'varchar', 'bpchar') then
    update public.properties
    set market_status = case
      when lower(coalesce(status::text, market_status::text, 'available')) = 'sold' then 'sold'
      when lower(coalesce(status::text, market_status::text, 'available')) in ('rented', 'rent', 'leased') then 'rented'
      when lower(coalesce(status::text, market_status::text, 'available')) = 'archived' then 'archived'
      else 'available'
    end
    where market_status is null
       or market_status::text = ''
       or market_status::text <> lower(coalesce(status::text, market_status::text, 'available'));
  end if;

  if listing_type_udt = 'property_listing_type' then
    update public.properties
    set listing_type = (
      case
        when lower(coalesce(listing_type::text, 'sale')) = 'rent' then 'rent'
        else 'sale'
      end
    )::public.property_listing_type
    where listing_type is null
       or listing_type::text = '';
  elsif listing_type_udt in ('text', 'varchar', 'bpchar') then
    update public.properties
    set listing_type = case
      when lower(coalesce(nullif(listing_type::text, ''), 'sale')) = 'rent' then 'rent'
      else 'sale'
    end
    where listing_type is null
       or listing_type::text = '';
  end if;

  if price_data_type in ('numeric', 'integer', 'bigint', 'smallint', 'real', 'double precision') then
    update public.properties
    set price = coalesce(price, 0)
    where price is null;
  end if;

  if area_data_type in ('numeric', 'integer', 'bigint', 'smallint', 'real', 'double precision') then
    update public.properties
    set area_sqft = null
    where area_sqft is not null
      and area_sqft < 0;
  end if;
end
$$;

create unique index if not exists idx_properties_slug_unique
on public.properties (slug);

create index if not exists idx_properties_form_location
on public.properties (location);

create index if not exists idx_properties_form_status
on public.properties (status);

create index if not exists idx_properties_form_listing_type
on public.properties (listing_type);

create index if not exists idx_properties_form_created_at
on public.properties (created_at desc);

create index if not exists idx_properties_admin_search
on public.properties using gin (
  to_tsvector(
    'english',
    coalesce(title, '') || ' ' || coalesce(location, '') || ' ' || coalesce(property_type, '')
  )
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

drop trigger if exists set_properties_updated_at on public.properties;
create trigger set_properties_updated_at
before update on public.properties
for each row execute function public.set_updated_at();

do $$
declare
  status_udt text;
  price_data_type text;
  area_data_type text;
begin
  select udt_name
  into status_udt
  from information_schema.columns
  where table_schema = 'public'
    and table_name = 'properties'
    and column_name = 'status';

  select data_type
  into price_data_type
  from information_schema.columns
  where table_schema = 'public'
    and table_name = 'properties'
    and column_name = 'price';

  select data_type
  into area_data_type
  from information_schema.columns
  where table_schema = 'public'
    and table_name = 'properties'
    and column_name = 'area_sqft';

  if status_udt in ('text', 'varchar', 'bpchar') and not exists (
    select 1
    from pg_constraint
    where conname = 'properties_form_status_check'
      and conrelid = 'public.properties'::regclass
  ) then
    alter table public.properties
      add constraint properties_form_status_check
      check (lower(status::text) in ('available', 'rented', 'sold', 'archived'))
      not valid;
  end if;

  if price_data_type in ('numeric', 'integer', 'bigint', 'smallint', 'real', 'double precision') and not exists (
    select 1
    from pg_constraint
    where conname = 'properties_form_price_non_negative'
      and conrelid = 'public.properties'::regclass
  ) then
    alter table public.properties
      add constraint properties_form_price_non_negative
      check (price is null or price >= 0)
      not valid;
  end if;

  if area_data_type in ('numeric', 'integer', 'bigint', 'smallint', 'real', 'double precision') and not exists (
    select 1
    from pg_constraint
    where conname = 'properties_form_area_non_negative'
      and conrelid = 'public.properties'::regclass
  ) then
    alter table public.properties
      add constraint properties_form_area_non_negative
      check (area_sqft is null or area_sqft >= 0)
      not valid;
  end if;
end
$$;
