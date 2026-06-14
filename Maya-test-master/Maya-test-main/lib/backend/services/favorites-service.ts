import { randomUUID } from "node:crypto";

import type { SavedPropertyRecord } from "@/lib/backend/contracts";
import { readJsonRecords, writeJsonRecords } from "@/lib/backend/repositories/json-store";

const fileName = "favorites.json";

export async function saveFavorite(input: Omit<SavedPropertyRecord, "id" | "createdAt">) {
  const records = await readJsonRecords<SavedPropertyRecord>(fileName);
  const existing = records.find((record) => record.propertyId === input.propertyId && record.userId === input.userId && record.sessionId === input.sessionId);

  if (existing) {
    return existing;
  }

  const record: SavedPropertyRecord = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ...input
  };

  records.unshift(record);
  await writeJsonRecords(fileName, records);
  return record;
}

export async function removeFavorite(id: string) {
  const records = await readJsonRecords<SavedPropertyRecord>(fileName);
  const nextRecords = records.filter((record) => record.id !== id);
  await writeJsonRecords(fileName, nextRecords);
}

export async function listFavorites(userId?: string, sessionId?: string) {
  const records = await readJsonRecords<SavedPropertyRecord>(fileName);
  return records.filter((record) => (userId ? record.userId === userId : record.sessionId === sessionId));
}
