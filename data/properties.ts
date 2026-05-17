export type Property = {
  id: string;
  slug: string;
  title: string;
  location: "Westlands" | "Karen" | "Kilimani" | "Riverside" | "Kileleshwa" | "Runda";
  type: "Apartment" | "Penthouse" | "Residence" | "Villa";
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  highlight: string;
  blurb: string;
  description: string;
  status: "For Sale" | "For Rent" | "For Lease";
  coverImage: string;
  gallery: string[];
  amenities: string[];
  features: string[];
  agentNote: string;
};

export const properties: Property[] = [
  {
    id: "mh-westlands-skyline",
    slug: "the-skyline-reserve-westlands",
    title: "The Skyline Reserve",
    location: "Westlands",
    type: "Penthouse",
    price: 145000000,
    bedrooms: 4,
    bathrooms: 5,
    sqft: 4800,
    highlight: "Private rooftop deck with skyline plunge pool",
    blurb: "A dramatic glass-wrapped penthouse with skyline dining terraces and hotel-level concierge access.",
    description:
      "Positioned above Westlands with uninterrupted dusk views, this penthouse is tailored for buyers who want architectural presence, layered hospitality, and a polished arrival experience.",
    status: "For Sale",
    coverImage:
      "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1600&q=80"
    ],
    amenities: ["Sky lounge", "Private lift lobby", "Wine room", "Plunge pool", "Concierge", "Backup power"],
    features: [
      "Statement double-height salon",
      "Chef's kitchen with scullery",
      "Temperature-controlled wine display",
      "Primary suite with skyline bath"
    ],
    agentNote: "Ideal for international executives and collectors seeking a signature Nairobi address."
  },
  {
    id: "mh-karen-courtyard",
    slug: "the-courtyard-house-karen",
    title: "The Courtyard House",
    location: "Karen",
    type: "Villa",
    price: 210000000,
    bedrooms: 5,
    bathrooms: 6,
    sqft: 7200,
    highlight: "Garden pavilion with heated pool and wellness studio",
    blurb: "A secluded family estate balancing warm stone textures, landscaped privacy, and resort-scale living.",
    description:
      "Conceived for graceful family life, the residence blends indoor calm with entertaining scale, all set within a richly planted Karen compound with secure, understated grandeur.",
    status: "For Sale",
    coverImage:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?auto=format&fit=crop&w=1600&q=80"
    ],
    amenities: ["Heated pool", "Detached studio", "Landscaped acre", "Cinema room", "Staff wing", "Solar backup"],
    features: [
      "Stone-lined arrival court",
      "Grand formal dining room",
      "Indoor-outdoor family lounge",
      "Primary dressing gallery"
    ],
    agentNote: "A rare Karen option for diplomatic families and long-term lifestyle buyers."
  },
  {
    id: "mh-kilimani-atelier",
    slug: "atelier-residences-kilimani",
    title: "Atelier Residences",
    location: "Kilimani",
    type: "Apartment",
    price: 38500000,
    bedrooms: 3,
    bathrooms: 3,
    sqft: 2100,
    highlight: "Curated interiors with club floor wellness access",
    blurb: "A refined city residence designed for young wealth, soft automation, and elegant everyday living.",
    description:
      "Atelier Residences offers a tailored urban rhythm in Kilimani, with sculpted finishes, deep balconies, and wellness-forward amenity spaces suited to modern global professionals.",
    status: "For Sale",
    coverImage:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1505692952047-1a78307da8f2?auto=format&fit=crop&w=1600&q=80"
    ],
    amenities: ["Residents' lounge", "Smart home controls", "Gym", "Sauna", "Rooftop terrace", "EV parking"],
    features: [
      "Gallery-like entry corridor",
      "Pocket-door study nook",
      "Integrated kitchen appliances",
      "Sunset-facing balcony"
    ],
    agentNote: "A strong fit for founder-led households and premium city investors."
  },
  {
    id: "mh-riverside-riverhouse",
    slug: "riverhouse-collection-riverside",
    title: "Riverhouse Collection",
    location: "Riverside",
    type: "Residence",
    price: 96000000,
    bedrooms: 4,
    bathrooms: 4,
    sqft: 3600,
    highlight: "Embassy-grade address with private residents' spa",
    blurb: "A serene riverside residence where architectural restraint meets diplomatic privacy.",
    description:
      "This Riverside address is built for buyers who prioritize calm proportions, layered security, and a gracious home office presence without compromising on hospitality and warmth.",
    status: "For Lease",
    coverImage:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1600&q=80"
    ],
    amenities: ["Residents' spa", "Boardroom lounge", "Pet garden", "Concierge", "Backup generator", "Water treatment"],
    features: [
      "Embassy-grade drop-off",
      "Formal reception living room",
      "Soft oak and stone palette",
      "Quiet study suite"
    ],
    agentNote: "Popular with diplomatic tenants and buyers seeking security without visual heaviness."
  },
  {
    id: "mh-kileleshwa-observatory",
    slug: "observatory-lofts-kileleshwa",
    title: "Observatory Lofts",
    location: "Kileleshwa",
    type: "Apartment",
    price: 42500000,
    bedrooms: 3,
    bathrooms: 3,
    sqft: 2300,
    highlight: "Panoramic corner terraces and curated co-working suite",
    blurb: "A smartly composed residence for owners who split life between hosting, remote work, and city leisure.",
    description:
      "The lofts elevate everyday living with generous glazing, restrained materials, and flexible social spaces, all within one of Nairobi's most connected lifestyle districts.",
    status: "For Sale",
    coverImage:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1505692952047-1a78307da8f2?auto=format&fit=crop&w=1600&q=80"
    ],
    amenities: ["Co-working suite", "Sky garden", "Pilates studio", "Pet wash", "Coffee salon", "Smart access"],
    features: [
      "Corner entertainment terrace",
      "Dedicated media wall",
      "Walk-through dressing room",
      "Soft-lit kitchen island"
    ],
    agentNote: "A versatile option for returnees and design-conscious families."
  },
  {
    id: "mh-runda-manor",
    slug: "the-runda-manor",
    title: "The Runda Manor",
    location: "Runda",
    type: "Villa",
    price: 260000000,
    bedrooms: 6,
    bathrooms: 7,
    sqft: 9100,
    highlight: "Grand reception manor with guest pavilion and mature gardens",
    blurb: "A landmark family estate with sculpted lawns, formal entertaining rooms, and uncompromising presence.",
    description:
      "The Runda Manor is designed for generational hosting, diplomatic entertaining, and quietly powerful living, with every room scaled for ceremony and calm in equal measure.",
    status: "For Sale",
    coverImage:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80"
    ],
    amenities: ["Guest pavilion", "Home office wing", "Pool house", "Chef's kitchen", "Security command room", "Wine cellar"],
    features: [
      "Cathedral-height arrival foyer",
      "Garden-facing family kitchen",
      "Private guest suite cluster",
      "Sunken firepit terrace"
    ],
    agentNote: "A trophy home for multigenerational ownership and ambassadorial entertaining."
  },
  {
    id: "mh-westlands-oriel",
    slug: "oriel-suites-westlands",
    title: "Oriel Suites",
    location: "Westlands",
    type: "Apartment",
    price: 280000,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1550,
    highlight: "Serviced executive leasing with hotel-caliber wellness floor",
    blurb: "A sophisticated furnished residence built for expat arrival, flexibility, and five-star routine.",
    description:
      "Oriel Suites packages premium Nairobi living into a polished, low-friction address that suits consultants, executives, and high-mobility international residents.",
    status: "For Rent",
    coverImage:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1505692952047-1a78307da8f2?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1600&q=80"
    ],
    amenities: ["Furnished packages", "Wellness floor", "Housekeeping", "Airport transfer desk", "Business lounge", "24/7 concierge"],
    features: [
      "Fully dressed interiors",
      "Quiet work-from-home alcove",
      "Hotel-style utility pantry",
      "Balcony with city sunset exposure"
    ],
    agentNote: "A strong expat housing product with seamless onboarding and flexible lease structures."
  },
  {
    id: "mh-karen-meadow",
    slug: "meadow-residences-karen",
    title: "Meadow Residences",
    location: "Karen",
    type: "Residence",
    price: 69000000,
    bedrooms: 4,
    bathrooms: 4,
    sqft: 3400,
    highlight: "Boutique low-rise living with garden courtyards and family club",
    blurb: "A calm, low-density address shaped for elegant family routines and long-term wealth preservation.",
    description:
      "This boutique Karen residence speaks to buyers who want everyday softness, strong family amenity planning, and an investment profile grounded in timeless, low-density design.",
    status: "For Sale",
    coverImage:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1505692952047-1a78307da8f2?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1600&q=80"
    ],
    amenities: ["Family club", "Shaded courtyards", "Children's atelier", "Yoga lawn", "Backup borehole", "Security concierge"],
    features: [
      "Low-density floor plates",
      "Softly veined stone palette",
      "Family breakfast terrace",
      "Storage-rich utility core"
    ],
    agentNote: "Appealing for relocating families and conservative long-hold investors."
  }
];

export const propertyLocations = ["All", "Westlands", "Karen", "Kilimani", "Riverside", "Kileleshwa", "Runda"] as const;
export const propertyTypes = ["All", "Apartment", "Penthouse", "Residence", "Villa"] as const;
export const transactionOptions = ["All", "Buy", "Rent", "Lease"] as const;
export const bedroomOptions = ["Any", "1+", "2+", "3+", "4+", "5+"] as const;
export const bathroomOptions = ["Any", "2+", "3+", "4+", "5+"] as const;
export const sortOptions = [
  { label: "Newest Curation", value: "featured" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Largest Footprint", value: "size-desc" }
] as const;

export function getFeaturedProperties() {
  return properties.slice(0, 6);
}

export function getPropertyBySlug(slug: string) {
  return properties.find((property) => property.slug === slug);
}

export function getSimilarProperties(slug: string, location: Property["location"]) {
  return properties.filter((property) => property.slug !== slug && property.location === location).slice(0, 3);
}
