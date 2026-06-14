import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth/admin";

export async function requireAdminApi() {
  const session = await getAdminSession();

  if (!session.user) {
    return {
      response: NextResponse.json({ error: "Authentication required." }, { status: 401 }),
      session: null
    };
  }

  if (!session.isAdmin) {
    return {
      response: NextResponse.json({ error: "Admin access required." }, { status: 403 }),
      session: null
    };
  }

  return {
    response: null,
    session
  };
}
