import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

import { backendConfig, hasSupabaseCredentials } from "@/lib/backend/config";

export async function createRouteSupabaseClient() {
  if (!hasSupabaseCredentials()) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(backendConfig.NEXT_PUBLIC_SUPABASE_URL!, backendConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      }
    }
  });
}

export function createAdminSupabaseClient() {
  if (!backendConfig.NEXT_PUBLIC_SUPABASE_URL || !backendConfig.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }

  return createClient(backendConfig.NEXT_PUBLIC_SUPABASE_URL, backendConfig.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false
    }
  });
}
