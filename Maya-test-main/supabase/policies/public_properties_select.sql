alter table public.properties enable row level security;

drop policy if exists "Public can read properties" on public.properties;

create policy "Public can read properties"
on public.properties
for select
using (true);
