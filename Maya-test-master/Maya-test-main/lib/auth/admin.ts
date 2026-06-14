import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AdminSessionState = {
  admin: {
    id: string;
    email: string;
    created_at: string;
  } | null;
  isAdmin: boolean;
  user: {
    id: string;
    email?: string;
  } | null;
};

export async function getAdminSession(): Promise<AdminSessionState> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      admin: null,
      isAdmin: false,
      user: null
    };
  }

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user?.email) {
    return {
      admin: null,
      isAdmin: false,
      user: null
    };
  }

  const { data: admin, error: adminError } = await supabase
    .from("admins")
    .select("id, email, created_at")
    .eq("id", user.id)
    .maybeSingle();

  if (adminError || !admin) {
    return {
      admin: null,
      isAdmin: false,
      user: {
        id: user.id,
        email: user.email
      }
    };
  }

  return {
    admin,
    isAdmin: true,
    user: {
      id: user.id,
      email: user.email
    }
  };
}

export async function requireAdmin(nextPath = "/admin") {
  const session = await getAdminSession();

  if (!session.user) {
    redirect(`/admin/login?next=${encodeURIComponent(nextPath)}`);
  }

  if (!session.isAdmin) {
    redirect("/unauthorized");
  }

  return session;
}
