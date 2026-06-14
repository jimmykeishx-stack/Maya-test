-- Allow CMS admins from public.admins to manage Maya Haven Insight posts.
-- The original blog_posts policy only checks the app_role JWT claim, while
-- the admin area authorizes users through public.admins.

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public, pg_temp
stable
as $$
  select exists (
    select 1
    from public.admins
    where id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

alter table public.blog_posts enable row level security;

drop policy if exists "Admins can manage blog posts via admins table" on public.blog_posts;

create policy "Admins can manage blog posts via admins table"
on public.blog_posts
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());