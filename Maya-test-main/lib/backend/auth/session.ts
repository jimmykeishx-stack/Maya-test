import { headers } from "next/headers";

import type { PlatformUser, UserRole } from "@/lib/backend/contracts";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getRequestContext() {
  const headerStore = await headers();
  const ipAddress = headerStore.get("x-forwarded-for") ?? "127.0.0.1";
  const userAgent = headerStore.get("user-agent") ?? "unknown";
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      role: "guest" as UserRole,
      user: null,
      sessionId: "anonymous-session",
      ipAddress,
      userAgent
    };
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return {
      role: "guest" as UserRole,
      user: null,
      sessionId: "anonymous-session",
      ipAddress,
      userAgent
    };
  }

  const { data: admin } = await supabase
    .from("admins")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  const role: UserRole = admin ? "admin" : "user";
  const platformUser: PlatformUser = {
    id: user.id,
    email: user.email,
    role
  };

  return {
    role,
    user: platformUser,
    sessionId: user.id,
    ipAddress,
    userAgent
  };
}
