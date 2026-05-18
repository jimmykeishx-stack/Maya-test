import { NextResponse } from "next/server";

import { saveOwnerSubmission } from "@/lib/submissions-store";

export async function POST(request: Request) {
  const formData = await request.formData();

  const fullName = String(formData.get("fullName") ?? "");
  const phoneNumber = String(formData.get("phoneNumber") ?? "");
  const email = String(formData.get("email") ?? "");
  const propertyType = String(formData.get("propertyType") ?? "");
  const location = String(formData.get("location") ?? "");
  const listingType = String(formData.get("listingType") ?? "");
  const expectedPrice = String(formData.get("expectedPrice") ?? "");
  const propertyDescription = String(formData.get("propertyDescription") ?? "");
  const ownershipConfirmed = String(formData.get("ownershipConfirmed") ?? "") === "true";
  const image = formData.get("image");

  if (!fullName || !phoneNumber || !email || !propertyType || !location || !listingType || !expectedPrice || !propertyDescription || !ownershipConfirmed) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const record = await saveOwnerSubmission({
    fullName,
    phoneNumber,
    email,
    propertyType,
    location,
    listingType,
    expectedPrice,
    propertyDescription,
    ownershipConfirmed,
    image: image instanceof File ? image : null
  });

  return NextResponse.json({ success: true, id: record.id });
}
