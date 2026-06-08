import { NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/auth/api";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const MAX_IMAGE_COUNT = 30;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const PROPERTY_MEDIA_BUCKET = "property-media";

function sanitizeFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(request: Request) {
  const { response } = await requireAdminApi();

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

  const uniqueFiles = files.filter((file, index, allFiles) => {
    const signature = `${file.name}:${file.size}:${file.type}`;
    return allFiles.findIndex((item) => `${item.name}:${item.size}:${item.type}` === signature) === index;
  });

  if (uniqueFiles.length > MAX_IMAGE_COUNT) {
    return NextResponse.json({ error: `Upload a maximum of ${MAX_IMAGE_COUNT} images at a time.` }, { status: 400 });
  }

  const invalidFile = uniqueFiles.find((file) => !file.type.startsWith("image/") || file.size > MAX_IMAGE_SIZE);

  if (invalidFile) {
    return NextResponse.json(
      { error: "Upload image files only. Each image must be 10MB or smaller." },
      { status: 400 }
    );
  }

  const media = [];

  for (const [index, file] of uniqueFiles.entries()) {
    const safeName = sanitizeFileName(file.name) || `property-media-${index + 1}.jpg`;
    const storagePath = `admin/${Date.now()}-${crypto.randomUUID()}-${safeName}`;

    const { error: uploadError } = await supabase.storage.from(PROPERTY_MEDIA_BUCKET).upload(storagePath, file, {
      cacheControl: "31536000",
      contentType: file.type,
      upsert: false
    });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data } = supabase.storage.from(PROPERTY_MEDIA_BUCKET).getPublicUrl(storagePath);

    media.push({
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
