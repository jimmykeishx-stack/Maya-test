import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

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
  }[];
};

const submissionsDir = path.join(process.cwd(), "data", "submissions");
const uploadsDir = path.join(submissionsDir, "uploads");

async function ensureDirectories() {
  await mkdir(submissionsDir, { recursive: true });
  await mkdir(uploadsDir, { recursive: true });
}

async function readRecords<T>(fileName: string) {
  await ensureDirectories();
  const filePath = path.join(submissionsDir, fileName);

  try {
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

export async function getBuyerInquiries() {
  return readRecords<BuyerInquiryRecord>("buyer-inquiries.json");
}

export async function getOwnerSubmissions() {
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
      hash
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
