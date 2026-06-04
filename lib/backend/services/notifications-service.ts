import { randomUUID } from "node:crypto";

import type { NotificationRecord } from "@/lib/backend/contracts";
import { readJsonRecords, writeJsonRecords } from "@/lib/backend/repositories/json-store";

const fileName = "notifications.json";

export async function createNotification(input: Omit<NotificationRecord, "id" | "createdAt" | "read">) {
  const record: NotificationRecord = {
    id: randomUUID(),
    read: false,
    createdAt: new Date().toISOString(),
    ...input
  };

  const records = await readJsonRecords<NotificationRecord>(fileName);
  records.unshift(record);
  await writeJsonRecords(fileName, records);
  return record;
}

export async function listNotifications(userId?: string) {
  const records = await readJsonRecords<NotificationRecord>(fileName);
  return userId ? records.filter((record) => record.userId === userId) : records;
}

export async function markNotificationsRead(ids: string[]) {
  const records = await readJsonRecords<NotificationRecord>(fileName);
  const nextRecords = records.map((record) => (ids.includes(record.id) ? { ...record, read: true } : record));
  await writeJsonRecords(fileName, nextRecords);
  return nextRecords.filter((record) => ids.includes(record.id));
}
