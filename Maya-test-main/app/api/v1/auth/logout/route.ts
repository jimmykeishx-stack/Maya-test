import { successResponse } from "@/lib/backend/core/api-response";
import { createRouteSupabaseClient } from "@/lib/backend/supabase/server";

export async function POST() {
  const supabase = await createRouteSupabaseClient();

  if (supabase) {
    await supabase.auth.signOut();
  }

  return successResponse("Logged out successfully", { ok: true });
}
