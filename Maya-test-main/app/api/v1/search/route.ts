import { errorResponse, successResponse } from "@/lib/backend/core/api-response";
import { propertyQuerySchema } from "@/lib/backend/validation/schemas";
import { listProperties } from "@/lib/backend/services/properties-service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = propertyQuerySchema.parse(Object.fromEntries(searchParams.entries()));
    const result = await listProperties(query);

    return successResponse("Search completed successfully", result.records, {
      page: result.page,
      pageSize: result.pageSize,
      total: result.total,
      totalPages: result.totalPages
    });
  } catch {
    return errorResponse("Unable to complete search.", 500);
  }
}
