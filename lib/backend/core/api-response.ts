import { NextResponse } from "next/server";

import type { ApiFailure, ApiSuccess } from "@/lib/backend/contracts";

export function successResponse<T>(message: string, data: T, meta?: Record<string, unknown>, init?: ResponseInit) {
  const body: ApiSuccess<T> = {
    success: true,
    message,
    data,
    meta
  };

  return NextResponse.json(body, init);
}

export function errorResponse(message: string, status = 400, errors?: Record<string, string[]>) {
  const body: ApiFailure = {
    success: false,
    message,
    errors
  };

  return NextResponse.json(body, { status });
}
