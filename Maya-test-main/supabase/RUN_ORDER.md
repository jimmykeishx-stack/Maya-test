# Maya Haven Supabase SQL Run Order

Run these in Supabase Dashboard -> SQL Editor -> New Query.

1. Run `supabase/migrations/20260519_000001_core_platform.sql`.
2. Run `supabase/migrations/20260528_000002_frontend_mvp_content.sql`.
3. Run `supabase/migrations/20260528_000003_property_media_storage.sql`.
4. Run `supabase/migrations/20260531_000004_admin_auth.sql`.
5. Run `supabase/migrations/20260601_000005_property_crud.sql`.
6. Run `supabase/migrations/20260601_000006_admin_rls_storage_fix.sql`.
7. Run `supabase/migrations/20260601_000007_properties_form_schema_alignment.sql`.
8. Run `supabase/migrations/20260603_000008_property_images_primary_flag.sql`.
9. Run `supabase/migrations/20260603_000009_backfill_property_media_amenities.sql`.
10. Run `supabase/migrations/20260610_000010_blog_posts_admin_rls.sql`.
11. Run `supabase/migrations/20260614_000011_event_gallery_admin.sql`.
12. Run `supabase/migrations/20260614_000012_event_gallery_grants.sql`.
13. Run `supabase/seed.sql`.

Do not run the simplified `CREATE TABLE properties (...)` script for this project. The Maya Haven frontend requires normalized media, amenities, agents, property-agent assignments, and inquiry tables.

The storage migration creates the `property-media` bucket for admin-side image uploads. The admin auth migration then replaces the MVP upload policy with an admin-table policy tied to Supabase Auth.
The property CRUD migration creates the `property-images` bucket used by the production admin property form and adds admin-table RLS policies for property create, edit, delete, and image storage writes.
The admin RLS storage fix migration adds a secure `public.is_admin()` helper and resets Storage policies for both `property-images` and the legacy `property-media` bucket.
The properties form schema alignment migration adds any missing columns required by the admin property form and backfills compatible values without deleting existing rows.
The blog posts admin RLS migration lets authenticated users listed in `public.admins` manage Insight posts, matching the admin auth model used by property CRUD.
The event gallery migration creates the `event_gallery_items` table and lets admins manage published gallery cards from the admin area.
The event gallery grants migration fixes table privileges for existing databases where the table was created before grants were added.

After the SQL succeeds, restart the Next.js dev server so `.env.local` is loaded:

```bash
npm run dev -- -p 3006
```
