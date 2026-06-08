import { errorResponse, successResponse } from "@/lib/backend/core/api-response";
import { alertSchema } from "@/lib/backend/validation/schemas";
import { createAlert, listAlerts } from "@/lib/backend/services/alerts-service";
import { getRequestContext } from "@/lib/backend/auth/session";

export async function GET() {
  const context = await getRequestContext();
  const records = await listAlerts(context.user?.id, context.sessionId);
  return successResponse("Alerts fetched successfully", records, {
    total: records.length
  });
}

export async function POST(request: Request) {
  try {
    const context = await getRequestContext();
    const payload = alertSchema.parse(await request.json());
    const record = await createAlert({
      ...payload,
      userId: payload.userId ?? context.user?.id,
      sessionId: payload.sessionId ?? context.sessionId
    });

    return successResponse("Alert created successfully", record);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Unable to create alert.", 400);
  }
}
