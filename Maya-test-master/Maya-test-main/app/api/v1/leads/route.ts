import { errorResponse, successResponse } from "@/lib/backend/core/api-response";
import { backendConfig } from "@/lib/backend/config";
import { assertRateLimit } from "@/lib/backend/core/rate-limit";
import { getRequestContext } from "@/lib/backend/auth/session";
import { leadSchema } from "@/lib/backend/validation/schemas";
import { createLead, listLeads } from "@/lib/backend/services/leads-service";

export async function GET() {
  const leads = await listLeads();
  return successResponse("Leads fetched successfully", leads, {
    total: leads.length
  });
}

export async function POST(request: Request) {
  try {
    const context = await getRequestContext();
    assertRateLimit(`lead:${context.ipAddress}`, backendConfig.MAYA_HAVEN_RATE_LIMIT_MAX, backendConfig.MAYA_HAVEN_RATE_LIMIT_WINDOW_MS);
    const payload = leadSchema.parse(await request.json());
    const lead = await createLead(payload);

    return successResponse("Lead captured successfully", lead, {
      status: lead.status
    });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Unable to capture lead.", 400);
  }
}
