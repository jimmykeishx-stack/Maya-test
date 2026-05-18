import { NextResponse } from "next/server";

import { queryProperties } from "@/lib/property-store";
import type { ListingType, MarketSegment, MarketStatus } from "@/data/properties";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const listingType = searchParams.get("listingType") as ListingType | null;
  const segment = searchParams.get("segment") as MarketSegment | null;
  const marketStatus = searchParams.get("marketStatus") as MarketStatus | null;
  const search = searchParams.get("search") ?? "";

  const results = queryProperties({
    listingType: listingType ?? undefined,
    segment: segment ?? undefined,
    marketStatus: marketStatus ?? undefined,
    search
  });

  return NextResponse.json({ count: results.length, properties: results });
}
