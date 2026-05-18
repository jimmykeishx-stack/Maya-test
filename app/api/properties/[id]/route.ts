import { NextResponse } from "next/server";

import { deleteProperty, updateProperty } from "@/lib/property-store";
import type { Property } from "@/data/properties";

export async function PUT(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  const { id } = await context.params;
  const property = (await request.json()) as Property;

  if (!id) {
    return NextResponse.json({ error: "Property id is required." }, { status: 400 });
  }

  const record = await updateProperty(id, property);
  return NextResponse.json({ success: true, property: record });
}

export async function DELETE(
  _request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ error: "Property id is required." }, { status: 400 });
  }

  await deleteProperty(id);
  return NextResponse.json({ success: true });
}
