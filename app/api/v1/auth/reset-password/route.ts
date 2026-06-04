import { errorResponse, successResponse } from "@/lib/backend/core/api-response";
import { passwordResetSchema } from "@/lib/backend/validation/schemas";
import { createRouteSupabaseClient } from "@/lib/backend/supabase/server";

export async function POST(request: Request) {
  try {
    const payload = passwordResetSchema.parse(await request.json());
    const supabase = await createRouteSupabaseClient();

    if (!supabase) {
      return errorResponse("Supabase authentication is not configured.", 500);
    }

    const { error: sessionError } = await supabase.auth.setSession({
      access_token: payload.accessToken,
      refresh_token: payload.refreshToken
    });

    if (sessionError) {
      throw sessionError;
    }

    const { data, error } = await supabase.auth.updateUser({
      password: payload.password
    });

    if (error) {
      throw error;
    }

    return successResponse("Password reset successfully", data);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Unable to reset password.", 400);
  }
}
