import { randomUUID } from "node:crypto";

import type { LeadRecord } from "@/lib/backend/contracts";
import { readJsonRecords, writeJsonRecords } from "@/lib/backend/repositories/json-store";
import { sanitizeText } from "@/lib/backend/core/sanitize";
import { saveBuyerInquiry } from "@/lib/submissions-store";

const fileName = "leads.json";

export async function createLead(input: Omit<LeadRecord, "id" | "createdAt" | "status" | "notes">) {
  const record: LeadRecord = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    status: "new",
    notes: [],
    ...input,
    fullName: sanitizeText(input.fullName),
    message: sanitizeText(input.message)
  };

  const records = await readJsonRecords<LeadRecord>(fileName);
  records.unshift(record);
  await writeJsonRecords(fileName, records);

  if (input.source !== "list_with_us") {
    await saveBuyerInquiry({
      fullName: record.fullName,
      email: record.email,
      phoneNumber: record.phoneNumber,
      message: record.message
    });
  }

  return record;
}

export async function listLeads() {
  return readJsonRecords<LeadRecord>(fileName);
}
