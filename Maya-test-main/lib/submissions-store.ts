import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { createSupabaseServerClient, hasSupabaseServerConfig } from "@/lib/supabase/server";

export type BuyerInquiryRecord = {
  id: string;
  createdAt: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  message: string;
};

export type OwnerSubmissionRecord = {
  id: string;
  createdAt: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  propertyType: string;
  location: string;
  listingType: string;
  expectedPrice: string;
  propertyDescription: string;
  ownershipConfirmed: boolean;
  images?: {
    fileName: string;
    mimeType: string;
    size: number;
    storedAt: string;
    hash: string;
    dataUrl?: string;
  }[];
};

type OwnerSubmissionRow = {
  id: string;
  created_at: string;
  full_name: string;
  phone_number: string;
  email: string;
  property_type: string;
  location: string;
  listing_type: string;
  expected_price: string;
  property_description: string;
  ownership_confirmed: boolean;
  owner_listing_images?: OwnerSubmissionImageRow[];
};

type OwnerSubmissionImageRow = {
  file_name: string;
  mime_type: string | null;
  size: number;
  hash: string;
  data_url: string;
  sort_order: number;
};

const submissionsDir = path.join(process.cwd(), "data", "submissions");
const uploadsDir = path.join(submissionsDir, "uploads");

async function ensureDirectories() {
  await mkdir(submissionsDir, { recursive: true });
  await mkdir(uploadsDir, { recursive: true });
}

async function readRecords<T>(fileName: string) {
  try {
    await ensureDirectories();
    const filePath = path.join(submissionsDir, fileName);
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw) as T[];
  } catch {
    return [] as T[];
  }
}

async function writeRecords<T>(fileName: string, records: T[]) {
  await ensureDirectories();
  const filePath = path.join(submissionsDir, fileName);
  await writeFile(filePath, JSON.stringify(records, null, 2), "utf8");
}

function mapOwnerSubmission(row: OwnerSubmissionRow): OwnerSubmissionRecord {
  const images = [...(row.owner_listing_images ?? [])]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((image) => ({
      fileName: image.file_name,
      mimeType: image.mime_type ?? "application/octet-stream",
      size: image.size,
      storedAt: "supabase-db",
      hash: image.hash,
      dataUrl: image.data_url
    }));

  return {
    id: row.id,
    createdAt: row.created_at,
    fullName: row.full_name,
    phoneNumber: row.phone_number,
    email: row.email,
    propertyType: row.property_type,
    location: row.location,
    listingType: row.listing_type,
    expectedPrice: row.expected_price,
    propertyDescription: row.property_description,
    ownershipConfirmed: row.ownership_confirmed,
    images: images.length ? images : undefined
  };
}

async function getSupabaseOwnerSubmissions() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) return null;

  const { data, error } = await supabase
    .from("owner_listing_submissions")
    .select("*, owner_listing_images(*)")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as unknown as OwnerSubmissionRow[]).map(mapOwnerSubmission);
}

export async function getBuyerInquiries() {
  return readRecords<BuyerInquiryRecord>("buyer-inquiries.json");
}

export async function getOwnerSubmissions() {
  if (hasSupabaseServerConfig()) {
    try {
      const records = await getSupabaseOwnerSubmissions();
      if (records) return records;
    } catch {
      // Fall back to local records so local/dev admin pages still render before migrations run.
    }
  }

  return readRecords<OwnerSubmissionRecord>("owner-listings.json");
}

export async function saveBuyerInquiry(input: Omit<BuyerInquiryRecord, "id" | "createdAt">) {
  const record: BuyerInquiryRecord = {
    id: `inquiry-${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...input
  };

  const records = await readRecords<BuyerInquiryRecord>("buyer-inquiries.json");
  records.unshift(record);
  await writeRecords("buyer-inquiries.json", records);
  return record;
}

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9.\-_]/g, "-");
}

function dataUrlToBuffer(dataUrl: string) {
  const [, base64 = ""] = dataUrl.split(",");
  return Buffer.from(base64, "base64");
}

function fileToDataUrl(file: File, buffer: Buffer) {
  const mimeType = file.type || "application/octet-stream";
  return `data:${mimeType};base64,${buffer.toString("base64")}`;
}

async function buildImageRecords(images: File[] = []) {
  const imageRecords: NonNullable<OwnerSubmissionRecord["images"]> = [];
  const seenHashes = new Set<string>();

  for (const [index, image] of images.entries()) {
    if (!image || image.size <= 0) continue;

    const buffer = Buffer.from(await image.arrayBuffer());
    const hash = createHash("sha256").update(buffer).digest("hex");

    if (seenHashes.has(hash)) {
      continue;
    }

    seenHashes.add(hash);

    imageRecords.push({
      fileName: image.name,
      mimeType: image.type || "application/octet-stream",
      size: image.size,
      storedAt: `supabase-db:${index + 1}`,
      hash,
      dataUrl: fileToDataUrl(image, buffer)
    });
  }

  return imageRecords;
}

async function saveOwnerSubmissionToSupabase(input: {
  fullName: string;
  phoneNumber: string;
  email: string;
  propertyType: string;
  location: string;
  listingType: string;
  expectedPrice: string;
  propertyDescription: string;
  ownershipConfirmed: boolean;
  images?: File[];
}) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) return null;

  const imageRecords = await buildImageRecords(input.images);
  const { data: submission, error: submissionError } = await supabase
    .from("owner_listing_submissions")
    .insert({
      full_name: input.fullName,
      phone_number: input.phoneNumber,
      email: input.email,
      property_type: input.propertyType,
      location: input.location,
      listing_type: input.listingType,
      expected_price: input.expectedPrice,
      property_description: input.propertyDescription,
      ownership_confirmed: input.ownershipConfirmed
    })
    .select("*")
    .single();

  if (submissionError || !submission) {
    throw new Error(submissionError?.message ?? "Unable to save owner listing.");
  }

  if (imageRecords.length) {
    const { error: imageError } = await supabase.from("owner_listing_images").insert(
      imageRecords.map((image, index) => ({
        submission_id: submission.id,
        file_name: image.fileName,
        mime_type: image.mimeType,
        size: image.size,
        hash: image.hash,
        data_url: image.dataUrl ?? "",
        sort_order: index
      }))
    );

    if (imageError) {
      throw new Error(imageError.message);
    }
  }

  return mapOwnerSubmission({
    ...(submission as unknown as OwnerSubmissionRow),
    owner_listing_images: imageRecords.map((image, index) => ({
      file_name: image.fileName,
      mime_type: image.mimeType,
      size: image.size,
      hash: image.hash,
      data_url: image.dataUrl ?? "",
      sort_order: index
    }))
  });
}

export async function saveOwnerSubmission(input: {
  fullName: string;
  phoneNumber: string;
  email: string;
  propertyType: string;
  location: string;
  listingType: string;
  expectedPrice: string;
  propertyDescription: string;
  ownershipConfirmed: boolean;
  images?: File[];
}) {
  if (hasSupabaseServerConfig()) {
    const record = await saveOwnerSubmissionToSupabase(input);
    if (record) return record;
  }

  await ensureDirectories();

  const imageRecords: NonNullable<OwnerSubmissionRecord["images"]> = [];
  const seenHashes = new Set<string>();

  for (const [index, image] of (input.images ?? []).entries()) {
    if (!image || image.size <= 0) continue;

    const buffer = Buffer.from(await image.arrayBuffer());
    const hash = createHash("sha256").update(buffer).digest("hex");

    if (seenHashes.has(hash)) {
      continue;
    }

    seenHashes.add(hash);

    const safeName = `${Date.now()}-${index + 1}-${hash.slice(0, 10)}-${sanitizeFileName(image.name)}`;
    const storedAt = path.join(uploadsDir, safeName);
    await writeFile(storedAt, buffer);
    imageRecords.push({
      fileName: image.name,
      mimeType: image.type,
      size: image.size,
      storedAt,
      hash,
      dataUrl: fileToDataUrl(image, buffer)
    });
  }

  const record: OwnerSubmissionRecord = {
    id: `owner-${Date.now()}`,
    createdAt: new Date().toISOString(),
    fullName: input.fullName,
    phoneNumber: input.phoneNumber,
    email: input.email,
    propertyType: input.propertyType,
    location: input.location,
    listingType: input.listingType,
    expectedPrice: input.expectedPrice,
    propertyDescription: input.propertyDescription,
    ownershipConfirmed: input.ownershipConfirmed,
    images: imageRecords.length ? imageRecords : undefined
  };

  const records = await readRecords<OwnerSubmissionRecord>("owner-listings.json");
  records.unshift(record);
  await writeRecords("owner-listings.json", records);
  return record;
}

export function ownerSubmissionImageToResponse(image: NonNullable<OwnerSubmissionRecord["images"]>[number]) {
  if (!image.dataUrl) return null;

  const body = dataUrlToBuffer(image.dataUrl);

  return {
    body,
    contentType: image.mimeType || "application/octet-stream",
    contentLength: body.length
  };
}


