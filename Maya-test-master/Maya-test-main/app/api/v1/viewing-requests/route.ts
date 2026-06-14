import { errorResponse, successResponse } from "@/lib/backend/core/api-response";
import { viewingRequestSchema } from "@/lib/backend/validation/schemas";
import { createViewingRequest, listViewingRequests } from "@/lib/backend/services/viewing-service";

export async function GET() {
  const records = await listViewingRequests();
  return successResponse("Viewing requests fetched successfully", records, {
    total: records.length
  });
}

export async function POST(request: Request) {
  try {
    const payload = viewingRequestSchema.parse(await request.json());
    const record = await createViewingRequest(payload);
    return successResponse("Viewing request created successfully", record, {
      status: record.status
    });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Unable to create viewing request.", 400);
  }
}
