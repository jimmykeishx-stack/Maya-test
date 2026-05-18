import { NextResponse } from "next/server";

import { createProperty, queryProperties } from "@/lib/property-store";
import type { ListingType, MarketSegment, MarketStatus, Property } from "@/data/properties";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const listingType = searchParams.get("listingType") as ListingType | null;
  const segment = searchParams.get("segment") as MarketSegment | null;
  const marketStatus = searchParams.get("marketStatus") as MarketStatus | null;
  const search = searchParams.get("search") ?? "";

  const results = await queryProperties({
    listingType: listingType ?? undefined,
    segment: segment ?? undefined,
    marketStatus: marketStatus ?? undefined,
    search
  });

  return NextResponse.json({ count: results.length, properties: results });
}

export async function POST(request: Request) {
  const property = (await request.json()) as Property;

  if (!property.id || !property.slug || !property.title) {
    return NextResponse.json({ error: "Missing required property fields." }, { status: 400 });
  }

  const record = await createProperty(property);
  return NextResponse.json({ success: true, property: record });
}
