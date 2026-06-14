# Maya Haven MVP Database Architecture

## Frontend Audit

The current UI needs dynamic records for:

- Property cards: title, slug, location, listing type, segment, status, mandate badge, price, bedrooms, bathrooms, size, cover image, short blurb.
- Property detail pages: gallery, highlight, long description, amenities, feature bullets, video ID, similar properties.
- Homepage property sections: featured, affordable housing, commercial.
- Search and filters: listing type, market segment, market status, location, bedrooms, bathrooms, property type, price, size sorting.
- Inquiry forms: full name, email, phone number, message, optional source and property reference.

The UI still consumes the existing `Property` TypeScript shape. The Supabase service maps normalized database rows into that shape so the visual components remain unchanged.

## Core Tables

- `properties`: canonical listing record with slug uniqueness, price, status, segment, mandate type, frontend copy fields, video metadata, SEO-ready fields, and soft delete support.
- `property_images`: ordered gallery images with a cover-image flag and cascade delete when a property is removed.
- `amenities`: normalized amenity labels with reusable slugs.
- `property_amenities`: many-to-many join table for listing amenities.
- `agents`: reusable advisor records. The MVP migration allows an agent without an auth profile because admin authentication is intentionally out of scope for now.
- `property_agents`: many-to-many assignment table for primary/secondary listing advisors.
- `inquiries`: buyer, tenant, and consultation inquiries captured separately from owner listing submissions.

## Query Strategy

- `getProperties()` fetches published, non-deleted property rows with media and amenities.
- `getFeaturedProperties()` fetches available properties ordered by featured and publish date.
- `getPropertyBySlug()` fetches one listing plus gallery and amenities for dynamic detail pages.
- `createInquiry()` inserts into Supabase and falls back to local JSON only when Supabase is not configured or unavailable.

## RLS Strategy

- Public visitors can read published property catalog content, property media, amenities, active agents, and property-agent assignments.
- Public visitors can insert inquiries.
- Admin authentication and privileged CRUD policies are intentionally deferred until the admin auth milestone.

## Setup

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Run the SQL migrations in `supabase/migrations`.
4. Run `supabase/seed.sql` to load the current Maya Haven property catalog.
5. Start the Next.js app. If Supabase variables are missing, the site falls back to the local mock dataset so development stays unblocked.
