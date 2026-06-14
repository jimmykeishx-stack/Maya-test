import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth/admin";

export async function GET() {
  const session = await getAdminSession();

  if (!session.user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  if (!session.isAdmin) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  return NextResponse.json({
    success: true,
    data: session
  });
}
