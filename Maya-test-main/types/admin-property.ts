export type AdminListingType = "sale" | "rent";
export type AdminPropertySegment = "residential" | "commercial" | "affordable_housing";
export type AdminPropertyStatus = "available" | "rented" | "sold";

export type AdminProperty = {
  id: string;
  title: string;
  slug: string;
  description: string;
  propertyType: string;
  listingType: AdminListingType;
  segment: AdminPropertySegment;
  price: number;
  location: string;
  bedrooms: number | null;
  bathrooms: number | null;
  areaSqft: number | null;
  amenities: string[];
  featured: boolean;
  status: AdminPropertyStatus;
  coverImage: string | null;
  galleryImages: string[];
  youtubeVideoId: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
};

export type AdminPropertyPayload = {
  title: string;
  slug?: string;
  description: string;
  propertyType: string;
  listingType: AdminListingType;
  segment: AdminPropertySegment;
  price: number;
  location: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  areaSqft?: number | null;
  amenities?: string[];
  featured?: boolean;
  status: AdminPropertyStatus;
  coverImage?: string | null;
  galleryImages?: string[];
  youtubeVideoId?: string | null;
};

export type AdminPropertyListResult = {
  properties: AdminProperty[];
  count: number;
  page: number;
  pageSize: number;
  pageCount: number;
};
