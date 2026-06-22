import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/auth/api";
import { getOwnerSubmissions } from "@/lib/submissions-store";

type RouteContext = {
  params: Promise<{ id: string; hash: string }>;
};

function downloadFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-") || "maya-haven-owner-submission-image";
}

export async function GET(_request: Request, context: RouteContext) {
  const { response } = await requireAdminApi();

  if (response) {
    return response;
  }

  const { id, hash } = await context.params;
  const submissions = await getOwnerSubmissions();
  const submission = submissions.find((item) => item.id === id);
  const image = submission?.images?.find((item) => item.hash === hash);

  if (!image) {
    return NextResponse.json({ error: "Image not found." }, { status: 404 });
  }

  const uploadsRoot = path.resolve(process.cwd(), "data", "submissions", "uploads");
  const imagePath = path.resolve(image.storedAt);

  if (!imagePath.startsWith(uploadsRoot + path.sep)) {
    return NextResponse.json({ error: "Invalid image path." }, { status: 400 });
  }

  try {
    const file = await readFile(imagePath);

    return new NextResponse(file, {
      headers: {
        "Content-Type": image.mimeType,
        "Content-Length": String(image.size),
        "Cache-Control": "private, max-age=300",
        "Content-Disposition": `attachment; filename="${downloadFileName(image.fileName)}"`
      }
    });
  } catch {
    return NextResponse.json({ error: "Image file could not be read." }, { status: 404 });
  }
}