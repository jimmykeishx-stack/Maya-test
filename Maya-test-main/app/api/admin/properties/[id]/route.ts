import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { requireAdminApi } from "@/lib/auth/api";
import {
  adminPropertySchema,
  deleteAdminProperty,
  getAdminPropertyById,
  updateAdminProperty
} from "@/services/admin-properties";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { response } = await requireAdminApi();

  if (response) {
    return response;
  }

  const { id } = await context.params;
  const property = await getAdminPropertyById(id);

  if (!property) {
    return NextResponse.json({ error: "Property not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true, property });
}

export async function PATCH(request: Request, context: RouteContext) {
  const { response } = await requireAdminApi();

  if (response) {
    return response;
  }

  const { id } = await context.params;

  try {
    const payload = adminPropertySchema.parse(await request.json());
    const property = await updateAdminProperty(id, payload);

    return NextResponse.json({ success: true, property });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid property data." }, { status: 400 });
    }

    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to update property." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { response } = await requireAdminApi();

  if (response) {
    return response;
  }

  const { id } = await context.params;

  try {
    await deleteAdminProperty(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to delete property." }, { status: 500 });
  }
}
