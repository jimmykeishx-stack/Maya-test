import { successResponse, errorResponse } from "@/lib/backend/core/api-response";
import { favoriteSchema } from "@/lib/backend/validation/schemas";
import { listFavorites, saveFavorite } from "@/lib/backend/services/favorites-service";
import { getRequestContext } from "@/lib/backend/auth/session";

export async function GET() {
  const context = await getRequestContext();
  const records = await listFavorites(context.user?.id, context.sessionId);
  return successResponse("Favorites fetched successfully", records, {
    total: records.length
  });
}

export async function POST(request: Request) {
  try {
    const context = await getRequestContext();
    const payload = favoriteSchema.parse(await request.json());
    const favorite = await saveFavorite({
      propertyId: payload.propertyId,
      userId: payload.userId ?? context.user?.id,
      sessionId: payload.sessionId ?? context.sessionId
    });

    return successResponse("Favorite saved successfully", favorite);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Unable to save favorite.", 400);
  }
}
