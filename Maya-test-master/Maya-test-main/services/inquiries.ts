import { randomUUID } from "node:crypto";

import { sanitizeText } from "@/lib/backend/core/sanitize";
import { createSupabasePublicClient } from "@/lib/supabase/client";
import { saveBuyerInquiry } from "@/lib/submissions-store";

type InquirySource = "contact_form" | "property_page" | "diaspora_connect" | "list_with_us";

export type CreateInquiryInput = {
  propertyId?: string;
  source?: InquirySource;
  fullName: string;
  email: string;
  phoneNumber: string;
  message: string;
};

type InquiryResult = {
  id: string;
  status: "new";
  createdAt: string;
};

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function resolvePropertyId(propertyId: string | undefined) {
  if (!propertyId) return null;
  if (uuidPattern.test(propertyId)) return propertyId;

  const supabase = createSupabasePublicClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("properties")
    .select("id")
    .or(`slug.eq.${propertyId},legacy_id.eq.${propertyId}`)
    .maybeSingle();

  if (error) {
    console.warn("[Maya Haven] Unable to resolve inquiry property id.", error.message);
    return null;
  }

  const resolved = data as { id: string } | null;
  return resolved?.id ?? null;
}

async function saveFallbackInquiry(input: CreateInquiryInput): Promise<InquiryResult> {
  const record = await saveBuyerInquiry({
    fullName: sanitizeText(input.fullName),
    email: input.email.trim().toLowerCase(),
    phoneNumber: input.phoneNumber.trim(),
    message: sanitizeText(input.message)
  });

  return {
    id: record.id || randomUUID(),
    status: "new",
    createdAt: record.createdAt
  };
}

export async function createInquiry(input: CreateInquiryInput): Promise<InquiryResult> {
  const supabase = createSupabasePublicClient();
  if (!supabase) return saveFallbackInquiry(input);

  const propertyId = await resolvePropertyId(input.propertyId);
  const { data, error } = await supabase
    .from("inquiries")
    .insert({
      property_id: propertyId,
      source: input.source ?? "contact_form",
      full_name: sanitizeText(input.fullName),
      email: input.email.trim().toLowerCase(),
      phone_number: input.phoneNumber.trim(),
      message: sanitizeText(input.message),
      lead_status: "new"
    })
    .select("id, lead_status, created_at")
    .single();

  if (error) {
    console.warn("[Maya Haven] Supabase inquiry insert failed. Falling back to local inquiry storage.", error.message);
    return saveFallbackInquiry(input);
  }

  return {
    id: data.id,
    status: "new",
    createdAt: data.created_at
  };
}
