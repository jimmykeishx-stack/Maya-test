import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { requireAdminApi } from "@/lib/auth/api";
import {
  createAdminEventGalleryItem,
  eventGallerySchema,
  getAdminEventGalleryItems
} from "@/services/event-gallery";

export async function GET(request: Request) {
  const { response } = await requireAdminApi();

  if (response) {
    return response;
  }

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? 1);
  const search = searchParams.get("search") ?? "";

  try {
    const result = await getAdminEventGalleryItems({
      page: Number.isFinite(page) && page > 0 ? page : 1,
      search
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load event/gallery items." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { response } = await requireAdminApi();

  if (response) {
    return response;
  }

  try {
    const payload = eventGallerySchema.parse(await request.json());
    const item = await createAdminEventGalleryItem(payload);

    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Invalid event/gallery data." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create event/gallery item." },
      { status: 500 }
    );
  }
}
