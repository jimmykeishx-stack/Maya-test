import { NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/auth/api";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const PROPERTY_IMAGE_BUCKETS = ["property-images", "property-media"] as const;
const MAX_IMAGE_COUNT = 30;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

function sanitizeFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isMissingBucketError(error: { message?: string } | null) {
  const message = error?.message?.toLowerCase() ?? "";
  return message.includes("bucket") && message.includes("not found");
}

export async function POST(request: Request) {
  const { response, session } = await requireAdminApi();

  if (response) {
    return response;
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase Storage is not configured." }, { status: 500 });
  }

  const formData = await request.formData();
  const files = formData.getAll("files").filter((item): item is File => item instanceof File);

  if (!files.length) {
    return NextResponse.json({ error: "No image files were provided." }, { status: 400 });
  }

  if (files.length > MAX_IMAGE_COUNT) {
    return NextResponse.json({ error: `Upload up to ${MAX_IMAGE_COUNT} images at once.` }, { status: 400 });
  }

  const invalidFile = files.find((file) => !file.type.startsWith("image/") || file.size > MAX_IMAGE_SIZE);

  if (invalidFile) {
    return NextResponse.json({ error: "Upload image files only. Each image must be 10MB or smaller." }, { status: 400 });
  }

  const media = [];
  const ownerId = session!.user!.id;

  for (const [index, file] of files.entries()) {
    const safeName = sanitizeFileName(file.name) || `property-image-${index + 1}.jpg`;
    const storagePath = `${ownerId}/${Date.now()}-${crypto.randomUUID()}-${safeName}`;
    let uploadedBucket: (typeof PROPERTY_IMAGE_BUCKETS)[number] | null = null;
    let lastUploadError: { message?: string } | null = null;

    for (const bucket of PROPERTY_IMAGE_BUCKETS) {
      const { error: uploadError } = await supabase.storage.from(bucket).upload(storagePath, file, {
        cacheControl: "31536000",
        contentType: file.type,
        upsert: false
      });

      if (!uploadError) {
        uploadedBucket = bucket;
        break;
      }

      lastUploadError = uploadError;

      if (!isMissingBucketError(uploadError)) {
        break;
      }
    }

    if (!uploadedBucket) {
      const attemptedBuckets = PROPERTY_IMAGE_BUCKETS.join(", ");
      return NextResponse.json(
        {
          error:
            lastUploadError?.message
              ? `Storage upload failed after trying ${attemptedBuckets}: ${lastUploadError.message}`
              : `No Supabase Storage bucket was found. Create property-images or run the property CRUD/RLS migrations.`
        },
        { status: 500 }
      );
    }

    const { data } = supabase.storage.from(uploadedBucket).getPublicUrl(storagePath);

    media.push({
      bucket: uploadedBucket,
      name: file.name,
      size: file.size,
      storagePath,
      url: data.publicUrl
    });
  }

  return NextResponse.json({
    success: true,
    media
  });
}
