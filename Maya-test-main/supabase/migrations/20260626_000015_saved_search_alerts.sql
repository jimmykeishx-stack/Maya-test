create table if not exists public.saved_search_alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  session_id text,
  email text,
  phone_number text,
  whatsapp_number text,
  channels text[] not null default '{}',
  search_name text not null,
  filters jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_saved_search_alerts_created_at
on public.saved_search_alerts (created_at desc);

create index if not exists idx_saved_search_alerts_user_id
on public.saved_search_alerts (user_id)
where user_id is not null;

create index if not exists idx_saved_search_alerts_session_id
on public.saved_search_alerts (session_id)
where session_id is not null;

alter table public.saved_search_alerts enable row level security;

drop policy if exists "Anyone can create saved search alerts" on public.saved_search_alerts;
drop policy if exists "Users can read their saved search alerts" on public.saved_search_alerts;
drop policy if exists "Users can delete their saved search alerts" on public.saved_search_alerts;

create policy "Anyone can create saved search alerts"
on public.saved_search_alerts
for insert
to anon, authenticated
with check (
  array_length(channels, 1) > 0
  and (phone_number is not null or whatsapp_number is not null or email is not null)
);

create policy "Users can read their saved search alerts"
on public.saved_search_alerts
for select
to anon, authenticated
using (
  public.is_admin()
  or (auth.uid() is not null and user_id = auth.uid())
  or (auth.uid() is null and session_id is not null)
);

create policy "Users can delete their saved search alerts"
on public.saved_search_alerts
for delete
to anon, authenticated
using (
  public.is_admin()
  or (auth.uid() is not null and user_id = auth.uid())
);

grant insert, select, delete on public.saved_search_alerts to anon, authenticated;
