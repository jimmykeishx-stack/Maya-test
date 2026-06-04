import { errorResponse, successResponse } from "@/lib/backend/core/api-response";
import { BackendError } from "@/lib/backend/core/errors";
import { propertyQuerySchema } from "@/lib/backend/validation/schemas";
import { listProperties } from "@/lib/backend/services/properties-service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = propertyQuerySchema.parse(Object.fromEntries(searchParams.entries()));
    const result = await listProperties(query);

    return successResponse("Properties fetched successfully", result.records, {
      page: result.page,
      pageSize: result.pageSize,
      total: result.total,
      totalPages: result.totalPages
    });
  } catch (error) {
    if (error instanceof BackendError) {
      return errorResponse(error.message, error.status, error.details);
    }

    return errorResponse("Unable to fetch properties.", 500);
  }
}
