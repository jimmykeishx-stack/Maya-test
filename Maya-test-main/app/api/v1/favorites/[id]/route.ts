import { successResponse } from "@/lib/backend/core/api-response";
import { removeFavorite } from "@/lib/backend/services/favorites-service";

export async function DELETE(
  _request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  const { id } = await context.params;
  await removeFavorite(id);
  return successResponse("Favorite removed successfully", { id });
}
