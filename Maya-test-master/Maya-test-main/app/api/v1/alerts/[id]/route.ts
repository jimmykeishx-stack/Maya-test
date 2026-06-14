import { successResponse } from "@/lib/backend/core/api-response";
import { deleteAlert } from "@/lib/backend/services/alerts-service";

export async function DELETE(
  _request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  const { id } = await context.params;
  await deleteAlert(id);
  return successResponse("Alert deleted successfully", { id });
}
