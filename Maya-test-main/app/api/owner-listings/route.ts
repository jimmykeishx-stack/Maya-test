import { NextResponse } from "next/server";

import { saveOwnerSubmission } from "@/lib/submissions-store";

const ACCEPTED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".tif", ".tiff", ".svg", ".heic", ".heif", ".avif"];

function isAcceptedImageFile(file: File) {
  if (file.type.startsWith("image/")) return true;
  const name = file.name.toLowerCase();
  return ACCEPTED_IMAGE_EXTENSIONS.some((extension) => name.endsWith(extension));
}

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
  const images = formData
    .getAll("images")
    .filter((value): value is File => value instanceof File && value.size > 0);

  if (!fullName || !phoneNumber || !email || !propertyType || !location || !listingType || !expectedPrice || !propertyDescription || !ownershipConfirmed) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  if (images.length > 30) {
    return NextResponse.json({ error: "A maximum of 30 images is allowed per listing submission." }, { status: 400 });
  }

  if (images.some((image) => !isAcceptedImageFile(image))) {
    return NextResponse.json(
      { error: "Only image uploads are supported. Use common photo formats like JPG, PNG, WEBP, HEIC, HEIF, AVIF, GIF, TIFF, BMP, or SVG." },
      { status: 400 }
    );
  }

  if (images.some((image) => image.size > 10 * 1024 * 1024)) {
    return NextResponse.json({ error: "Each image must be 10MB or smaller after optimization." }, { status: 400 });
  }

  try {
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
      images
    });

    return NextResponse.json({ success: true, id: record.id, imageCount: record.images?.length ?? 0 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to submit owner listing.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

