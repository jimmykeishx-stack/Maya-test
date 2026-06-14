import { randomUUID } from "node:crypto";

import type { BlogPostRecord } from "@/lib/backend/contracts";
import { readJsonRecords, writeJsonRecords } from "@/lib/backend/repositories/json-store";
import { insightPosts } from "@/data/site";

const fileName = "blog-posts.json";

const seedPosts: BlogPostRecord[] = insightPosts.map((post, index) => ({
  id: randomUUID(),
  slug: post.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
  title: post.title,
  excerpt: post.excerpt,
  body: post.excerpt,
  status: "published",
  category: post.category,
  tags: ["market-intelligence", "maya-haven-insight"],
  featuredImage: post.image,
  seoTitle: post.title,
  seoDescription: post.excerpt,
  publishedAt: new Date(Date.now() - index * 86400000).toISOString(),
  createdAt: new Date(Date.now() - index * 86400000).toISOString()
}));

export async function listBlogPosts() {
  return readJsonRecords<BlogPostRecord>(fileName, seedPosts);
}

export async function createBlogPost(input: Omit<BlogPostRecord, "id" | "createdAt">) {
  const record: BlogPostRecord = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ...input
  };
  const records = await listBlogPosts();
  records.unshift(record);
  await writeJsonRecords(fileName, records);
  return record;
}
