import { requireRole } from "@/lib/backend/auth/guards";
import { errorResponse, successResponse } from "@/lib/backend/core/api-response";
import { createBlogPost, listBlogPosts } from "@/lib/backend/services/blog-service";

export async function GET() {
  const posts = await listBlogPosts();
  return successResponse("Blog posts fetched successfully", posts, {
    total: posts.length
  });
}

export async function POST(request: Request) {
  try {
    await requireRole("agent");
    const payload = (await request.json()) as {
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
    };

    const post = await createBlogPost({
      ...payload
    });

    return successResponse("Blog post created successfully", post);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Unable to create blog post.", 400);
  }
}
