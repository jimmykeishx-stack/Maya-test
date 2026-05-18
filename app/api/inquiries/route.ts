import { NextResponse } from "next/server";

import { saveBuyerInquiry } from "@/lib/submissions-store";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    message?: string;
  };

  if (!body.fullName || !body.email || !body.phoneNumber || !body.message) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const record = await saveBuyerInquiry({
    fullName: body.fullName,
    email: body.email,
    phoneNumber: body.phoneNumber,
    message: body.message
  });

  return NextResponse.json({ success: true, id: record.id });
}
