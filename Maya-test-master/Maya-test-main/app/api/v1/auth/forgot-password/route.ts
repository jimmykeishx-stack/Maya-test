import { errorResponse, successResponse } from "@/lib/backend/core/api-response";
import { resetRequestSchema } from "@/lib/backend/validation/schemas";
import { requestPasswordReset } from "@/lib/backend/services/auth-service";

export async function POST(request: Request) {
  try {
    const payload = resetRequestSchema.parse(await request.json());
    const result = await requestPasswordReset(payload.email);
    return successResponse("Password reset requested successfully", result);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Unable to request password reset.", 400);
  }
}
