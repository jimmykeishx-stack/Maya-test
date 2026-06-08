import { successResponse } from "@/lib/backend/core/api-response";
import { hasSupabaseCredentials } from "@/lib/backend/config";

export async function GET() {
  return successResponse("Backend health check passed", {
    status: "ok",
    backend: "supabase-first",
    supabaseConfigured: hasSupabaseCredentials()
  });
}
