import { errorResponse, successResponse } from "@/lib/backend/core/api-response";
import { getAdminOverview } from "@/lib/backend/services/admin-service";
import { requireAdminApi } from "@/lib/auth/api";

export async function GET() {
  try {
    const { response } = await requireAdminApi();

    if (response) {
      return response;
    }

    const overview = await getAdminOverview();
    return successResponse("Admin overview fetched successfully", overview);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Unable to fetch admin overview.", 403);
  }
}
