import type { UserRole } from "@/lib/backend/contracts";
import { BackendError } from "@/lib/backend/core/errors";
import { getRequestContext } from "@/lib/backend/auth/session";

const roleOrder: Record<UserRole, number> = {
  guest: 0,
  user: 1,
  agent: 2,
  admin: 3
};

export async function requireRole(role: UserRole) {
  const context = await getRequestContext();

  if (roleOrder[context.role] < roleOrder[role]) {
    throw new BackendError("You do not have permission to access this resource.", 403);
  }

  return context;
}
