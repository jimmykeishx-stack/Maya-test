import { errorResponse, successResponse } from "@/lib/backend/core/api-response";
import { notificationReadSchema } from "@/lib/backend/validation/schemas";
import { markNotificationsRead } from "@/lib/backend/services/notifications-service";

export async function PATCH(request: Request) {
  try {
    const payload = notificationReadSchema.parse(await request.json());
    const records = await markNotificationsRead(payload.ids);
    return successResponse("Notifications updated successfully", records, {
      total: records.length
    });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Unable to update notifications.", 400);
  }
}
