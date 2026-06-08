import { errorResponse, successResponse } from "@/lib/backend/core/api-response";
import { leadSchema } from "@/lib/backend/validation/schemas";
import { createInquiry } from "@/services/inquiries";

export async function POST(request: Request) {
  try {
    const payload = leadSchema.parse(await request.json());
    const record = await createInquiry(payload);
    return successResponse("Inquiry captured successfully", { id: record.id, status: record.status });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Missing required fields.", 400);
  }
}
