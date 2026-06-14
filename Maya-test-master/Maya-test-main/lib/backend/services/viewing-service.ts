import { randomUUID } from "node:crypto";

import type { ViewingRequestRecord } from "@/lib/backend/contracts";
import { readJsonRecords, writeJsonRecords } from "@/lib/backend/repositories/json-store";

const fileName = "viewing-requests.json";

export async function createViewingRequest(input: Omit<ViewingRequestRecord, "id" | "createdAt" | "status">) {
  const record: ViewingRequestRecord = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    status: "pending",
    ...input
  };

  const records = await readJsonRecords<ViewingRequestRecord>(fileName);
  records.unshift(record);
  await writeJsonRecords(fileName, records);
  return record;
}

export async function listViewingRequests() {
  return readJsonRecords<ViewingRequestRecord>(fileName);
}
