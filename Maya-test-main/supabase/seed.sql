insert into public.locations (county, city, area, nearby_landmarks)
values
  ('Nairobi', 'Nairobi', 'Westlands', array['Sarit Centre', 'Museum Hill']),
  ('Nairobi', 'Nairobi', 'Karen', array['Karen Hub', 'The Waterfront']),
  ('Nairobi', 'Nairobi', 'Kilimani', array['Yaya Centre', 'Dennis Pritt Road']),
  ('Nairobi', 'Nairobi', 'Riverside', array['Riverside Drive', 'School Lane']),
  ('Nairobi', 'Nairobi', 'Kileleshwa', array['Kasuku Centre', 'Laikipia Road']),
  ('Nairobi', 'Nairobi', 'Runda', array['UN Avenue', 'Two Rivers']),
  ('Nairobi', 'Nairobi', 'Upper Hill', array['Britam Towers', 'Hospital Road']),
  ('Nairobi', 'Nairobi', 'Gigiri', array['UN Complex', 'Village Market']),
  ('Nairobi', 'Nairobi', 'Mombasa Road', array['JKIA corridor', 'Southern Bypass']),
  ('Kiambu', 'Nairobi Metro', 'Ruaka', array['Two Rivers', 'Limuru Road'])
on conflict do nothing;

do $$
<<seed_data>>
declare
  advisor_id uuid;
  property_id uuid;
  amenity_id uuid;
  item jsonb;
  property_index integer;
  image_url text;
  image_index integer;
  amenity_label text;
  amenity_slug text;
  properties_json jsonb := $maya_properties$
[
  {
    "id": "mh-westlands-skyline",
    "slug": "the-skyline-reserve-westlands",
    "title": "The Skyline Reserve",
    "location": "Westlands",
    "type": "Penthouse",
    "listingType": "sale",
    "segment": "residential",
    "Status": "available",
    "mandateType": "exclusive",
    "price": 145000000,
    "priceSuffix": "",
    "bedrooms": 4,
    "bathrooms": 5,
    "sqft": 4800,
    "highlight": "Private rooftop deck with skyline plunge pool",
    "blurb": "A dramatic glass-wrapped penthouse with skyline dining terraces and concierge-level arrival.",
    "description": "Positioned above Westlands with uninterrupted dusk views, this residence suits buyers seeking architectural presence, premium entertaining, and a globally polished Nairobi address.",
    "metrics": [
      { "label": "Bedrooms", "value": "4" },
      { "label": "Bathrooms", "value": "5" },
      { "label": "Size", "value": "4,800 sqft" }
    ],
    "coverImage": "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1600&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1600&q=80"
    ],
    "amenities": ["Sky lounge", "Private lift lobby", "Wine room", "Plunge pool", "Concierge", "Backup power"],
    "features": ["Double-height entertaining salon", "Chef's kitchen with separate scullery", "Primary suite with skyline bath", "Private rooftop dining terrace"],
    "agentNote": "Exclusive mandate with private viewing windows available for qualified buyers.",
    "youtubeVideoId": "ScMzIvxBSi4"
  },
  {
    "id": "mh-karen-courtyard",
    "slug": "the-courtyard-house-karen",
    "title": "The Courtyard House",
    "location": "Karen",
    "type": "Villa",
    "listingType": "sale",
    "segment": "residential",
    "Status": "available",
    "mandateType": "exclusive",
    "price": 210000000,
    "priceSuffix": "",
    "bedrooms": 5,
    "bathrooms": 6,
    "sqft": 7200,
    "highlight": "Garden pavilion with heated pool and wellness studio",
    "blurb": "A secluded family estate balancing warm stone textures, landscaped privacy, and resort-scale living.",
    "description": "Designed for graceful family life, the residence blends indoor calm with entertaining scale, all within a richly planted Karen compound with discreet security and polished hospitality.",
    "metrics": [
      { "label": "Bedrooms", "value": "5" },
      { "label": "Bathrooms", "value": "6" },
      { "label": "Size", "value": "7,200 sqft" }
    ],
    "coverImage": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?auto=format&fit=crop&w=1600&q=80"
    ],
    "amenities": ["Heated pool", "Detached studio", "Landscaped acre", "Cinema room", "Staff wing", "Solar backup"],
    "features": ["Stone-lined arrival court", "Formal dining and entertainment wing", "Garden-facing family lounge", "Primary dressing gallery"],
    "agentNote": "Ideal for investors abroad planning a primary move or a long-hold Nairobi home.",
    "youtubeVideoId": "ysz5S6PUM-U"
  },
  {
    "id": "mh-kilimani-atelier",
    "slug": "atelier-residences-kilimani",
    "title": "Atelier Residences",
    "location": "Kilimani",
    "type": "Apartment",
    "listingType": "sale",
    "segment": "residential",
    "Status": "sold",
    "mandateType": "open",
    "price": 38500000,
    "priceSuffix": "guide",
    "bedrooms": 3,
    "bathrooms": 3,
    "sqft": 2100,
    "highlight": "Curated interiors with club-floor wellness access",
    "blurb": "A refined city residence once favored for its soft automation and elegant everyday planning.",
    "description": "This home is retained in the archive to show the caliber of sale-side sourcing and transaction support Maya Haven has delivered for design-conscious Nairobi buyers.",
    "metrics": [
      { "label": "Bedrooms", "value": "3" },
      { "label": "Bathrooms", "value": "3" },
      { "label": "Size", "value": "2,100 sqft" }
    ],
    "coverImage": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1505692952047-1a78307da8f2?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1600&q=80"
    ],
    "amenities": ["Residents' lounge", "Smart home controls", "Gym", "Sauna", "Rooftop terrace", "EV parking"],
    "features": ["Gallery-like entry corridor", "Integrated kitchen appliances", "Pocket-door study nook", "Sunset-facing balcony"],
    "agentNote": "Sold listing retained as a reference point for Maya Haven's advisory and closing support."
  },
  {
    "id": "mh-riverside-riverhouse",
    "slug": "riverhouse-collection-riverside",
    "title": "Riverhouse Collection",
    "location": "Riverside",
    "type": "Residence",
    "listingType": "rent",
    "segment": "residential",
    "Status": "available",
    "mandateType": "exclusive",
    "price": 620000,
    "priceSuffix": "per month",
    "bedrooms": 4,
    "bathrooms": 4,
    "sqft": 3600,
    "highlight": "Embassy-grade address with private residents' spa",
    "blurb": "A serene riverside residence where architectural restraint meets diplomatic privacy.",
    "description": "Tailored for executives, diplomatic households, and families relocating from abroad, Riverhouse Collection prioritizes security, calm proportions, and an elevated arrival experience.",
    "metrics": [
      { "label": "Bedrooms", "value": "4" },
      { "label": "Bathrooms", "value": "4" },
      { "label": "Size", "value": "3,600 sqft" }
    ],
    "coverImage": "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1600&q=80"
    ],
    "amenities": ["Residents' spa", "Boardroom lounge", "Pet garden", "Concierge", "Backup generator", "Water treatment"],
    "features": ["Embassy-grade drop-off", "Formal reception living room", "Soft oak and stone palette", "Quiet study suite"],
    "agentNote": "Strong fit for investors abroad and globally mobile households landing in Nairobi before a long-term purchase decision.",
    "youtubeVideoId": "aqz-KE-bpKQ"
  },
  {
    "id": "mh-kileleshwa-observatory",
    "slug": "observatory-lofts-kileleshwa",
    "title": "Observatory Lofts",
    "location": "Kileleshwa",
    "type": "Apartment",
    "listingType": "sale",
    "segment": "residential",
    "Status": "available",
    "mandateType": "open",
    "price": 42500000,
    "priceSuffix": "",
    "bedrooms": 3,
    "bathrooms": 3,
    "sqft": 2300,
    "highlight": "Panoramic corner terraces and curated co-working suite",
    "blurb": "A smartly composed residence for households balancing hosting, remote work, and city leisure.",
    "description": "The lofts elevate everyday living with generous glazing, restrained materials, and flexible social spaces in one of Nairobi's best-connected premium districts.",
    "metrics": [
      { "label": "Bedrooms", "value": "3" },
      { "label": "Bathrooms", "value": "3" },
      { "label": "Size", "value": "2,300 sqft" }
    ],
    "coverImage": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1505692952047-1a78307da8f2?auto=format&fit=crop&w=1600&q=80"
    ],
    "amenities": ["Co-working suite", "Sky garden", "Pilates studio", "Pet wash", "Coffee salon", "Smart access"],
    "features": ["Corner entertainment terrace", "Dedicated media wall", "Walk-through dressing room", "Soft-lit kitchen island"],
    "agentNote": "Well suited to international property investors who need a premium city foothold with investment resilience."
  },
  {
    "id": "mh-runda-manor",
    "slug": "the-runda-manor",
    "title": "The Runda Manor",
    "location": "Runda",
    "type": "Villa",
    "listingType": "sale",
    "segment": "residential",
    "Status": "available",
    "mandateType": "exclusive",
    "price": 260000000,
    "priceSuffix": "",
    "bedrooms": 6,
    "bathrooms": 7,
    "sqft": 9100,
    "highlight": "Grand reception manor with guest pavilion and mature gardens",
    "blurb": "A landmark family estate with sculpted lawns, formal entertaining rooms, and uncompromising presence.",
    "description": "The Runda Manor is designed for generational hosting, diplomatic entertaining, and quietly powerful living, with every room scaled for ceremony and calm in equal measure.",
    "metrics": [
      { "label": "Bedrooms", "value": "6" },
      { "label": "Bathrooms", "value": "7" },
      { "label": "Size", "value": "9,100 sqft" }
    ],
    "coverImage": "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1600&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80"
    ],
    "amenities": ["Guest pavilion", "Home office wing", "Pool house", "Chef's kitchen", "Security command room", "Wine cellar"],
    "features": ["Cathedral-height arrival foyer", "Garden-facing family kitchen", "Private guest suite cluster", "Sunken firepit terrace"],
    "agentNote": "An exclusive mandate ideal for multigenerational ownership and ambassadorial entertaining."
  },
  {
    "id": "mh-westlands-oriel",
    "slug": "oriel-suites-westlands",
    "title": "Oriel Suites",
    "location": "Westlands",
    "type": "Apartment",
    "listingType": "rent",
    "segment": "residential",
    "Status": "rented",
    "mandateType": "open",
    "price": 280000,
    "priceSuffix": "per month",
    "bedrooms": 2,
    "bathrooms": 2,
    "sqft": 1550,
    "highlight": "Serviced executive leasing with hotel-caliber wellness floor",
    "blurb": "A sophisticated furnished residence built for expat arrival, flexibility, and five-star routine.",
    "description": "Retained in the rental archive to demonstrate the standard of furnished executive leasing, onboarding support, and relocation guidance Maya Haven can coordinate.",
    "metrics": [
      { "label": "Bedrooms", "value": "2" },
      { "label": "Bathrooms", "value": "2" },
      { "label": "Size", "value": "1,550 sqft" }
    ],
    "coverImage": "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1600&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1505692952047-1a78307da8f2?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1600&q=80"
    ],
    "amenities": ["Furnished packages", "Wellness floor", "Housekeeping", "Airport transfer desk", "Business lounge", "24/7 concierge"],
    "features": ["Fully dressed interiors", "Quiet work-from-home alcove", "Hotel-style utility pantry", "Sunset-facing balcony"],
    "agentNote": "Rented reference listing that reflects Maya Haven's expat housing and tenancy sourcing approach."
  },
  {
    "id": "mh-ruaka-greens",
    "slug": "ruaka-greens-affordable-homes",
    "title": "Ruaka Greens",
    "location": "Ruaka",
    "type": "Residence",
    "listingType": "sale",
    "segment": "affordable-housing",
    "Status": "available",
    "mandateType": "open",
    "price": 12800000,
    "priceSuffix": "",
    "bedrooms": 2,
    "bathrooms": 2,
    "sqft": 980,
    "highlight": "Entry-level home ownership with secure community planning",
    "blurb": "A dependable affordable-housing option for buyers seeking structure, access, and realistic long-term ownership.",
    "description": "Ruaka Greens is positioned for first-time homeowners, investor-backed family purchases, and buyers balancing affordability with clean management and clear due diligence support.",
    "metrics": [
      { "label": "Bedrooms", "value": "2" },
      { "label": "Bathrooms", "value": "2" },
      { "label": "Size", "value": "980 sqft" }
    ],
    "coverImage": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1505692952047-1a78307da8f2?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1600&q=80"
    ],
    "amenities": ["Children's play court", "Managed parking", "Water storage", "Perimeter security", "Retail kiosk", "Community green"],
    "features": ["Flexible starter-home layout", "Mortgage-friendly pricing band", "Commuter access to Nairobi", "Document-ready transaction support"],
    "agentNote": "Suitable for affordable homeownership and investor-backed family purchases."
  },
  {
    "id": "mh-kayole-tenants",
    "slug": "new-dawn-courts-affordable-rentals",
    "title": "New Dawn Courts",
    "location": "Kilimani",
    "type": "Townhouse",
    "listingType": "rent",
    "segment": "affordable-housing",
    "Status": "available",
    "mandateType": "open",
    "price": 85000,
    "priceSuffix": "per month",
    "bedrooms": 3,
    "bathrooms": 2,
    "sqft": 1250,
    "highlight": "Managed family rentals with reliable maintenance support",
    "blurb": "An affordable housing rental option built for dependable occupancy, practical layouts, and clear tenant support.",
    "description": "This collection serves growing families and institutional clients needing well-managed rental stock within an accessible monthly band and a cleaner placement process.",
    "metrics": [
      { "label": "Bedrooms", "value": "3" },
      { "label": "Bathrooms", "value": "2" },
      { "label": "Size", "value": "1,250 sqft" }
    ],
    "coverImage": "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1505692952047-1a78307da8f2?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80"
    ],
    "amenities": ["On-call maintenance", "Shared courtyard", "Tenant vetting support", "Visitor parking", "Water reserve", "Managed refuse collection"],
    "features": ["Practical family floor plans", "Reliable monthly management", "Tenant sourcing support", "Consistent maintenance coordination"],
    "agentNote": "A useful option for landlords, NGOs, and clients needing affordable rental stock."
  },
  {
    "id": "mh-upperhill-exchange",
    "slug": "upper-hill-exchange-office-suites",
    "title": "Upper Hill Exchange",
    "location": "Upper Hill",
    "type": "Office Suite",
    "listingType": "rent",
    "segment": "commercial",
    "Status": "available",
    "mandateType": "exclusive",
    "price": 420000,
    "priceSuffix": "per month",
    "bedrooms": null,
    "bathrooms": 2,
    "sqft": 2800,
    "highlight": "Grade-A office suites with reception visibility and executive meeting rooms",
    "blurb": "A polished Upper Hill workspace for firms wanting strong address value, clean fit-out, and managed landlord communication.",
    "description": "Upper Hill Exchange supports law firms, advisory practices, and regional offices seeking a premium Nairobi commercial base with trusted leasing representation.",
    "metrics": [
      { "label": "Meeting Rooms", "value": "2" },
      { "label": "Parking Bays", "value": "6" },
      { "label": "Size", "value": "2,800 sqft" }
    ],
    "coverImage": "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=80"
    ],
    "amenities": ["Reception lobby", "Backup generator", "High-speed fibre", "Secure parking", "Boardroom access", "On-site cafe"],
    "features": ["Executive reception frontage", "Flexible fit-out planning", "Dedicated client parking", "Professional building management"],
    "agentNote": "Exclusive commercial leasing mandate with guided site visits and document support.",
    "youtubeVideoId": "M7lc1UVf-VE"
  },
  {
    "id": "mh-gigiri-pavilion",
    "slug": "gigiri-pavilion-commercial-holdings",
    "title": "Gigiri Pavilion",
    "location": "Gigiri",
    "type": "Mixed-Use",
    "listingType": "sale",
    "segment": "commercial",
    "Status": "archived",
    "mandateType": "open",
    "price": 185000000,
    "priceSuffix": "guide",
    "bedrooms": null,
    "bathrooms": 4,
    "sqft": 6400,
    "highlight": "Mixed-use asset near diplomatic and NGO corridors",
    "blurb": "An archived commercial reference for buyers evaluating long-hold mixed-use opportunities near Gigiri.",
    "description": "Held in the archive as a signal of Maya Haven's access to commercial opportunities, including mixed-use assets requiring deeper diligence and multi-party review.",
    "metrics": [
      { "label": "Retail Frontage", "value": "2 bays" },
      { "label": "Office Levels", "value": "3" },
      { "label": "Size", "value": "6,400 sqft" }
    ],
    "coverImage": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80"
    ],
    "amenities": ["Street visibility", "Dual-use zoning profile", "Parking apron", "Security office", "Roof terrace", "Back-office stores"],
    "features": ["Diplomatic-area access", "Mixed-use rent roll potential", "Tenant reconfiguration flexibility", "Suitable for deeper investment review"],
    "agentNote": "Archived commercial stock retained for mandate and sourcing reference."
  },
  {
    "id": "mh-mombasa-trade-hub",
    "slug": "mombasa-road-trade-hub",
    "title": "Trade Hub Retail Deck",
    "location": "Mombasa Road",
    "type": "Retail Space",
    "listingType": "rent",
    "segment": "commercial",
    "Status": "available",
    "mandateType": "open",
    "price": 310000,
    "priceSuffix": "per month",
    "bedrooms": null,
    "bathrooms": 2,
    "sqft": 2400,
    "highlight": "High-visibility retail frontage with logistics adjacency",
    "blurb": "A commercial leasing option for operators needing visibility, flow, and practical support around Mombasa Road.",
    "description": "Trade Hub Retail Deck fits regional brands, auto-related retail, and service-led commercial tenants seeking a smart Nairobi logistics corridor presence.",
    "metrics": [
      { "label": "Retail Bays", "value": "3" },
      { "label": "Parking Bays", "value": "8" },
      { "label": "Size", "value": "2,400 sqft" }
    ],
    "coverImage": "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1600&q=80",
    "gallery": [
      "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=1600&q=80"
    ],
    "amenities": ["Road frontage", "Staff facilities", "Loading access", "Security lighting", "Signage rights", "High-volume parking"],
    "features": ["Strong drive-by exposure", "Operational fit for regional tenants", "Access to logistics corridor", "Useful for tenant sourcing mandates"],
    "agentNote": "Commercial rental stock suited to operators and investor-landlord conversations."
  }
]
$maya_properties$::jsonb;
begin
  insert into public.agents (
    full_name,
    title,
    email,
    phone_number,
    whatsapp_number,
    bio,
    license_number,
    earb_registration_number,
    territory,
    is_active
  )
  select
    'Maya Haven Advisory',
    'REAL ESTATE',
    'info@mayahaven.com',
    '+254720584744',
    '+254720584744',
    'A discreet advisory desk for property sourcing, investor support, and premium Nairobi real estate coordination.',
    null,
    'EARB Compliant',
    'Nairobi and Kenya growth corridors',
    true
  where not exists (
    select 1 from public.agents where email = 'info@mayahaven.com'
  );

  select id into advisor_id
  from public.agents
  where email = 'info@mayahaven.com'
  order by created_at asc
  limit 1;

  for item, property_index in
    select value, ordinality::integer
    from jsonb_array_elements(properties_json) with ordinality
  loop
    insert into public.properties (
      legacy_id,
      slug,
      title,
      description,
      property_type,
      listing_type,
      status,
      segment,
      mandate_type,
      price,
      currency,
      featured,
      price_suffix,
      area_sqft,
      bedrooms,
      bathrooms,
      location_label,
      highlight,
      blurb,
      agent_note,
      cover_image,
      youtube_video_id,
      metrics,
      features,
      agent_id,
      published_at
    )
    values (
      item->>'id',
      item->>'slug',
      item->>'title',
      item->>'description',
      item->>'type',
      (item->>'listingType')::public.property_listing_type,
      (item->>'Status')::public.property_status,
      (case when item->>'segment' = 'affordable-housing' then 'affordable_housing' else item->>'segment' end)::public.property_segment,
      (item->>'mandateType')::public.property_mandate_type,
      (item->>'price')::numeric,
      'KES',
      (item->>'Status') = 'available',
      nullif(item->>'priceSuffix', ''),
      (item->>'sqft')::integer,
      nullif(item->>'bedrooms', 'null')::integer,
      nullif(item->>'bathrooms', 'null')::integer,
      item->>'location',
      item->>'highlight',
      item->>'blurb',
      item->>'agentNote',
      item->>'coverImage',
      nullif(item->>'youtubeVideoId', ''),
      item->'metrics',
      array(select jsonb_array_elements_text(item->'features')),
      advisor_id,
      timezone('utc', now()) - make_interval(mins => property_index)
    )
    on conflict (slug) do update set
      legacy_id = excluded.legacy_id,
      title = excluded.title,
      description = excluded.description,
      property_type = excluded.property_type,
      listing_type = excluded.listing_type,
      segment = excluded.segment,
      mandate_type = excluded.mandate_type,
      price = excluded.price,
      currency = excluded.currency,
      featured = excluded.featured,
      price_suffix = excluded.price_suffix,
      area_sqft = excluded.area_sqft,
      bedrooms = excluded.bedrooms,
      bathrooms = excluded.bathrooms,
      location_label = excluded.location_label,
      highlight = excluded.highlight,
      blurb = excluded.blurb,
      agent_note = excluded.agent_note,
      cover_image = excluded.cover_image,
      youtube_video_id = excluded.youtube_video_id,
      metrics = excluded.metrics,
      features = excluded.features,
      agent_id = excluded.agent_id,
      published_at = excluded.published_at,
      updated_at = timezone('utc', now())
    returning id into seed_data.property_id;

    delete from public.property_images where property_images.property_id = seed_data.property_id;

    for image_url, image_index in
      select value, ordinality::integer
      from jsonb_array_elements_text(item->'gallery') with ordinality
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
      values (
        seed_data.property_id,
        image_url,
        image_url,
        item->>'title',
        image_index - 1,
        image_index = 1,
        image_index = 1
      );
    end loop;

    delete from public.property_amenities where property_amenities.property_id = seed_data.property_id;

    for amenity_label in
      select value from jsonb_array_elements_text(item->'amenities')
    loop
      amenity_slug := trim(both '-' from regexp_replace(lower(amenity_label), '[^a-z0-9]+', '-', 'g'));

      insert into public.amenities (slug, label, category)
      values (amenity_slug, amenity_label, 'property')
      on conflict (slug) do update set label = excluded.label
      returning id into amenity_id;

      insert into public.property_amenities (property_id, amenity_id)
      values (seed_data.property_id, amenity_id)
      on conflict (property_id, amenity_id) do nothing;
    end loop;

    if advisor_id is not null then
      insert into public.property_agents (property_id, agent_id, role)
      values (seed_data.property_id, advisor_id, 'primary')
      on conflict (property_id, agent_id) do update set role = excluded.role;
    end if;
  end loop;
end
$$;
