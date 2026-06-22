import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { requireAdminApi } from "@/lib/auth/api";
import {
  deleteAdminEventGalleryItem,
  eventGallerySchema,
  getAdminEventGalleryItemById,
  updateAdminEventGalleryItem
} from "@/services/event-gallery";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { response } = await requireAdminApi();

  if (response) {
    return response;
  }

  const { id } = await context.params;
  const item = await getAdminEventGalleryItemById(id);

  if (!item) {
    return NextResponse.json({ error: "Event/gallery item not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true, item });
}

export async function PATCH(request: Request, context: RouteContext) {
  const { response } = await requireAdminApi();

  if (response) {
    return response;
  }

  const { id } = await context.params;

  try {
    const payload = eventGallerySchema.parse(await request.json());
    const item = await updateAdminEventGalleryItem(id, payload);

    return NextResponse.json({ success: true, item });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Invalid event/gallery data." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update event/gallery item." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { response } = await requireAdminApi();

  if (response) {
    return response;
  }

  const { id } = await context.params;

  try {
    await deleteAdminEventGalleryItem(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to delete event/gallery item." },
      { status: 500 }
    );
  }
}
