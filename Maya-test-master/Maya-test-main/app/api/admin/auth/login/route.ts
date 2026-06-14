import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";

import { assertRateLimit } from "@/lib/backend/core/rate-limit";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1, "Password is required.")
});

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase authentication is not configured." }, { status: 500 });
  }

  const parsed = loginSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid admin email and password." }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();
  const headerStore = await headers();
  const ipAddress = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  try {
    assertRateLimit(`admin-login:${ipAddress}:${email}`, 5, 15 * 60 * 1000);
  } catch (rateLimitError) {
    return NextResponse.json(
      { error: rateLimitError instanceof Error ? rateLimitError.message : "Too many login attempts." },
      { status: 429 }
    );
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: parsed.data.password
  });

  if (error || !data.user?.email) {
    return NextResponse.json({ error: error?.message ?? "Invalid email or password." }, { status: 401 });
  }

  const { data: admin, error: adminError } = await supabase
    .from("admins")
    .select("id, email, created_at")
    .eq("id", data.user.id)
    .maybeSingle();

  if (adminError || !admin) {
    await supabase.auth.signOut();
    return NextResponse.json({ error: "This account is not authorized for admin access." }, { status: 403 });
  }

  return NextResponse.json({
    success: true,
    data: {
      admin,
      isAdmin: true,
      user: {
        id: data.user.id,
        email: data.user.email
      }
    }
  });
}
