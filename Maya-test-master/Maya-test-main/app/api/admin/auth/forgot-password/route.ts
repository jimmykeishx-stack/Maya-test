import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";

import { assertRateLimit } from "@/lib/backend/core/rate-limit";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const forgotPasswordSchema = z.object({
  email: z.string().trim().email()
});

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase authentication is not configured." }, { status: 500 });
  }

  const parsed = forgotPasswordSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid admin email address." }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();
  const headerStore = await headers();
  const ipAddress = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const origin = headerStore.get("origin") ?? new URL(request.url).origin;

  try {
    assertRateLimit(`admin-password-reset:${ipAddress}:${email}`, 3, 60 * 60 * 1000);
  } catch (rateLimitError) {
    return NextResponse.json(
      { error: rateLimitError instanceof Error ? rateLimitError.message : "Too many reset requests." },
      { status: 429 }
    );
  }

  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/admin/reset-password`
  });

  return NextResponse.json({
    success: true,
    message: "If this email belongs to an administrator, a secure reset link has been sent."
  });
}
