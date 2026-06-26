import { randomUUID } from "node:crypto";

import type { AlertRecord, SavedSearchFilter } from "@/lib/backend/contracts";
import { readJsonRecords, writeJsonRecords } from "@/lib/backend/repositories/json-store";
import { createSupabaseServerClient, hasSupabaseServerConfig } from "@/lib/supabase/server";

const fileName = "alerts.json";

type AlertRow = {
  id: string;
  user_id: string | null;
  session_id: string | null;
  email: string | null;
  phone_number: string | null;
  whatsapp_number: string | null;
  channels: AlertRecord["channels"];
  search_name: string;
  filters: SavedSearchFilter;
  created_at: string;
};

function mapAlert(row: AlertRow): AlertRecord {
  return {
    id: row.id,
    userId: row.user_id ?? undefined,
    sessionId: row.session_id ?? undefined,
    email: row.email ?? undefined,
    phoneNumber: row.phone_number ?? undefined,
    whatsappNumber: row.whatsapp_number ?? undefined,
    channels: row.channels,
    searchName: row.search_name,
    filters: row.filters,
    createdAt: row.created_at
  };
}

async function createLocalAlert(input: Omit<AlertRecord, "id" | "createdAt">) {
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

export async function createAlert(input: Omit<AlertRecord, "id" | "createdAt">) {
  const supabase = await createSupabaseServerClient();

  if (!supabase && !hasSupabaseServerConfig()) {
    return createLocalAlert(input);
  }

  if (!supabase) {
    throw new Error("Supabase is not configured for alerts.");
  }

  const { data, error } = await supabase
    .from("saved_search_alerts")
    .insert({
      user_id: input.userId ?? null,
      session_id: input.sessionId ?? null,
      email: input.email ?? null,
      phone_number: input.phoneNumber ?? null,
      whatsapp_number: input.whatsappNumber ?? null,
      channels: input.channels,
      search_name: input.searchName,
      filters: input.filters
    })
    .select("*")
    .single();

  if (error) {
    console.error("[Maya Haven] Alert insert failed.", error.message);
    throw new Error("Unable to save alert request. Please try again.");
  }

  return mapAlert(data as AlertRow);
}

export async function deleteAlert(id: string) {
  const supabase = await createSupabaseServerClient();

  if (!supabase && !hasSupabaseServerConfig()) {
    const records = await readJsonRecords<AlertRecord>(fileName);
    await writeJsonRecords(
      fileName,
      records.filter((record) => record.id !== id)
    );
    return;
  }

  if (!supabase) {
    throw new Error("Supabase is not configured for alerts.");
  }

  const { error } = await supabase.from("saved_search_alerts").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function listAlerts(userId?: string, sessionId?: string) {
  const supabase = await createSupabaseServerClient();

  if (!supabase && !hasSupabaseServerConfig()) {
    const records = await readJsonRecords<AlertRecord>(fileName);
    return records.filter((record) => (userId ? record.userId === userId : record.sessionId === sessionId));
  }

  if (!supabase) {
    return [];
  }

  let query = supabase.from("saved_search_alerts").select("*").order("created_at", { ascending: false });

  if (userId) {
    query = query.eq("user_id", userId);
  } else if (sessionId) {
    query = query.eq("session_id", sessionId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[Maya Haven] Alert fetch failed.", error.message);
    return [];
  }

  return ((data ?? []) as AlertRow[]).map(mapAlert);
}
