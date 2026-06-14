import { errorResponse, successResponse } from "@/lib/backend/core/api-response";
import { getPropertyDetails } from "@/lib/backend/services/properties-service";

export async function GET(
  _request: Request,
  context: {
    params: Promise<{ slug: string }>;
  }
) {
  const { slug } = await context.params;
  const property = await getPropertyDetails(slug);

  if (!property) {
    return errorResponse("Property not found.", 404);
  }

  return successResponse("Property fetched successfully", property);
}
