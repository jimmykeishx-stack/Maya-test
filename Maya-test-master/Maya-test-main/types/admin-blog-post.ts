export type BlogPostStatus = "draft" | "published" | "archived";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  status: BlogPostStatus;
  category: string;
  tags: string[];
  featuredImageUrl: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  authorProfileId: string | null;
};

export type BlogPostPayload = {
  title: string;
  slug?: string;
  excerpt: string;
  body: string;
  status: BlogPostStatus;
  category: string;
  tags?: string[];
  featuredImageUrl?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  publishedAt?: string | null;
};

export type BlogPostListResult = {
  posts: BlogPost[];
  count: number;
  page: number;
  pageSize: number;
  pageCount: number;
};
