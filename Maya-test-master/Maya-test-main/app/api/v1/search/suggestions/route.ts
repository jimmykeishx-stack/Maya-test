import { successResponse } from "@/lib/backend/core/api-response";
import { getSearchSuggestions } from "@/lib/backend/services/properties-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const term = searchParams.get("q") ?? "";
  const suggestions = await getSearchSuggestions(term);

  return successResponse("Search suggestions fetched successfully", suggestions, {
    query: term
  });
}
