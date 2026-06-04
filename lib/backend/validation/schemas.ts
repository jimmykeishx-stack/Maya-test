import { z } from "zod";

export const propertyQuerySchema = z.object({
  listingType: z.enum(["sale", "rent"]).optional(),
  segment: z.enum(["residential", "commercial", "affordable-housing"]).optional(),
  marketStatus: z.enum(["available", "sold", "rented", "archived"]).optional(),
  search: z.string().trim().optional(),
  location: z.string().trim().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  minBedrooms: z.coerce.number().optional(),
  minBathrooms: z.coerce.number().optional(),
  sort: z.enum(["featured", "price-desc", "price-asc", "size-desc"]).default("featured"),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(50).default(12)
});

export const leadSchema = z.object({
  propertyId: z.string().trim().optional(),
  source: z.enum(["contact_form", "property_page", "diaspora_connect", "list_with_us"]).default("contact_form"),
  fullName: z.string().trim().min(2),
  email: z.string().email(),
  phoneNumber: z.string().trim().min(7),
  message: z.string().trim().min(10)
});

export const favoriteSchema = z.object({
  propertyId: z.string().trim().min(1),
  sessionId: z.string().trim().optional(),
  userId: z.string().trim().optional()
});

export const alertSchema = z.object({
  sessionId: z.string().trim().optional(),
  userId: z.string().trim().optional(),
  email: z.string().email().optional(),
  phoneNumber: z.string().trim().optional(),
  whatsappNumber: z.string().trim().optional(),
  channels: z.array(z.enum(["in_app", "email", "sms", "whatsapp"])).min(1),
  searchName: z.string().trim().min(2),
  filters: z.object({
    listingType: z.string().trim().optional(),
    segment: z.string().trim().optional(),
    location: z.string().trim().optional(),
    minBedrooms: z.coerce.number().optional(),
    minBathrooms: z.coerce.number().optional(),
    minPrice: z.coerce.number().optional(),
    maxPrice: z.coerce.number().optional(),
    propertyType: z.string().trim().optional(),
    featuredOnly: z.boolean().optional(),
    recentlyAdded: z.boolean().optional()
  })
});

export const viewingRequestSchema = z.object({
  propertyId: z.string().trim().min(1),
  requesterName: z.string().trim().min(2),
  requesterEmail: z.string().email(),
  requesterPhone: z.string().trim().min(7),
  preferredDate: z.string().trim().min(8),
  preferredTimeSlot: z.string().trim().min(2),
  notes: z.string().trim().optional()
});

export const notificationReadSchema = z.object({
  ids: z.array(z.string().trim().min(1)).min(1)
});

export const authRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().trim().min(2),
  role: z.enum(["user", "agent"]).default("user")
});

export const authLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const resetRequestSchema = z.object({
  email: z.string().email()
});

export const passwordResetSchema = z.object({
  accessToken: z.string().trim().min(1),
  refreshToken: z.string().trim().min(1),
  password: z.string().min(8)
});
