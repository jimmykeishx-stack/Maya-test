import { BackendError } from "@/lib/backend/core/errors";
import { createAdminSupabaseClient } from "@/lib/backend/supabase/server";

export async function registerUser(email: string, password: string, fullName: string, role: "user" | "agent") {
  const supabase = createAdminSupabaseClient();

  if (!supabase) {
    throw new BackendError("Supabase authentication is not configured.", 500);
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: false,
    user_metadata: {
      full_name: fullName,
      role
    }
  });

  if (error) {
    throw new BackendError(error.message, 400);
  }

  return data.user;
}

export async function requestPasswordReset(email: string) {
  const supabase = createAdminSupabaseClient();

  if (!supabase) {
    throw new BackendError("Supabase authentication is not configured.", 500);
  }

  const { data, error } = await supabase.auth.admin.generateLink({
    type: "recovery",
    email
  });

  if (error) {
    throw new BackendError(error.message, 400);
  }

  return data;
}
