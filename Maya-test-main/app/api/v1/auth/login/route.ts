import { errorResponse, successResponse } from "@/lib/backend/core/api-response";
import { authLoginSchema } from "@/lib/backend/validation/schemas";
import { createRouteSupabaseClient } from "@/lib/backend/supabase/server";

export async function POST(request: Request) {
  try {
    const payload = authLoginSchema.parse(await request.json());
    const supabase = await createRouteSupabaseClient();

    if (!supabase) {
      return errorResponse("Supabase authentication is not configured.", 500);
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: payload.email,
      password: payload.password
    });

    if (error) {
      throw error;
    }

    return successResponse("Logged in successfully", data);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Unable to login.", 400);
  }
}
