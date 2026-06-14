import { successResponse } from "@/lib/backend/core/api-response";
import { getRequestContext } from "@/lib/backend/auth/session";
import { listNotifications } from "@/lib/backend/services/notifications-service";

export async function GET() {
  const context = await getRequestContext();
  const records = await listNotifications(context.user?.id);
  return successResponse("Notifications fetched successfully", records, {
    total: records.length
  });
}
