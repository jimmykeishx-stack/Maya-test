import type { Property } from "@/data/properties";

export type UserRole = "guest" | "user" | "agent" | "admin";
export type LeadStatus = "new" | "contacted" | "viewing_scheduled" | "negotiating" | "converted" | "closed_lost";
export type ViewingStatus = "pending" | "approved" | "rejected" | "rescheduled" | "completed";
export type NotificationChannel = "in_app" | "email" | "sms" | "whatsapp";
export type NotificationEvent =
  | "inquiry_received"
  | "property_approved"
  | "viewing_scheduled"
  | "new_matching_property"
  | "password_reset"
  | "listing_expiration";

export type AuthSessionLog = {
  id: string;
  userId: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
};

export type PlatformUser = {
  id: string;
  email: string;
  role: UserRole;
  fullName?: string;
};

export type SavedSearchFilter = {
  listingType?: string;
  segment?: string;
  location?: string;
  minBedrooms?: number;
  minBathrooms?: number;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  featuredOnly?: boolean;
  recentlyAdded?: boolean;
};

export type SavedPropertyRecord = {
  id: string;
  userId?: string;
  sessionId?: string;
  propertyId: string;
  createdAt: string;
};

export type AlertRecord = {
  id: string;
  userId?: string;
  sessionId?: string;
  email?: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  channels: NotificationChannel[];
  searchName: string;
  filters: SavedSearchFilter;
  createdAt: string;
};

export type LeadRecord = {
  id: string;
  propertyId?: string;
  source: "contact_form" | "property_page" | "diaspora_connect" | "list_with_us";
  fullName: string;
  email: string;
  phoneNumber: string;
  message: string;
  status: LeadStatus;
  assignedAgentId?: string;
  notes: string[];
  createdAt: string;
};

export type ViewingRequestRecord = {
  id: string;
  propertyId: string;
  requesterName: string;
  requesterEmail: string;
  requesterPhone: string;
  preferredDate: string;
  preferredTimeSlot: string;
  notes?: string;
  status: ViewingStatus;
  createdAt: string;
};

export type NotificationRecord = {
  id: string;
  userId?: string;
  title: string;
  body: string;
  event: NotificationEvent;
  read: boolean;
  channels: NotificationChannel[];
  createdAt: string;
};

export type BlogPostRecord = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  status: "draft" | "published";
  category: string;
  tags: string[];
  featuredImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  publishedAt?: string;
  createdAt: string;
};

export type AdminOverview = {
  totals: {
    properties: number;
    leads: number;
    viewingRequests: number;
    savedSearches: number;
    notifications: number;
  };
  byRole: Record<UserRole, number>;
  recentLeads: LeadRecord[];
  recentViewings: ViewingRequestRecord[];
  featuredProperties: Property[];
};

export type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
};

export type ApiFailure = {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
};
