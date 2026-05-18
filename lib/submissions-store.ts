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
  image?: {
    fileName: string;
    mimeType: string;
    size: number;
    storedAt: string;
  };
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
  image?: File | null;
}) {
  await ensureDirectories();

  let imageRecord: OwnerSubmissionRecord["image"] | undefined;

  if (input.image && input.image.size > 0) {
    const safeName = `${Date.now()}-${sanitizeFileName(input.image.name)}`;
    const storedAt = path.join(uploadsDir, safeName);
    const buffer = Buffer.from(await input.image.arrayBuffer());
    await writeFile(storedAt, buffer);
    imageRecord = {
      fileName: input.image.name,
      mimeType: input.image.type,
      size: input.image.size,
      storedAt
    };
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
    image: imageRecord
  };

  const records = await readRecords<OwnerSubmissionRecord>("owner-listings.json");
  records.unshift(record);
  await writeRecords("owner-listings.json", records);
  return record;
}
