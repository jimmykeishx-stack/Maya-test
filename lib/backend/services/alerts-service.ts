import { randomUUID } from "node:crypto";

import type { AlertRecord } from "@/lib/backend/contracts";
import { readJsonRecords, writeJsonRecords } from "@/lib/backend/repositories/json-store";

const fileName = "alerts.json";

export async function createAlert(input: Omit<AlertRecord, "id" | "createdAt">) {
  const record: AlertRecord = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ...input
  };

  const records = await readJsonRecords<AlertRecord>(fileName);
  records.unshift(record);
  await writeJsonRecords(fileName, records);
  return record;
}

export async function deleteAlert(id: string) {
  const records = await readJsonRecords<AlertRecord>(fileName);
  await writeJsonRecords(
    fileName,
    records.filter((record) => record.id !== id)
  );
}

export async function listAlerts(userId?: string, sessionId?: string) {
  const records = await readJsonRecords<AlertRecord>(fileName);
  return records.filter((record) => (userId ? record.userId === userId : record.sessionId === sessionId));
}
