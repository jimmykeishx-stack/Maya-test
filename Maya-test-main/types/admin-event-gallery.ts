export type EventGalleryStatus = "draft" | "published" | "archived";

export type EventGalleryItem = {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  imageUrl: string;
  imageUrls: string[];
  status: EventGalleryStatus;
  eventDate: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type EventGalleryPayload = {
  title: string;
  category: string;
  excerpt: string;
  imageUrl: string;
  imageUrls?: string[];
  status: EventGalleryStatus;
  eventDate?: string | null;
  sortOrder?: number;
};

export type EventGalleryListResult = {
  items: EventGalleryItem[];
  count: number;
  page: number;
  pageSize: number;
  pageCount: number;
};