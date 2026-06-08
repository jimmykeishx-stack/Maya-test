import { errorResponse, successResponse } from "@/lib/backend/core/api-response";
import { authRegisterSchema } from "@/lib/backend/validation/schemas";
import { registerUser } from "@/lib/backend/services/auth-service";

export async function POST(request: Request) {
  try {
    const payload = authRegisterSchema.parse(await request.json());
    const user = await registerUser(payload.email, payload.password, payload.fullName, payload.role);
    return successResponse("Registration initialized successfully", user);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Unable to register user.", 400);
  }
}
