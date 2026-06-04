import type { UserRole } from "@/lib/backend/contracts";

export const userRoles: UserRole[] = ["guest", "user", "agent", "admin"];

export function isPrivilegedRole(role: UserRole) {
  return role === "agent" || role === "admin";
}

export function canManageListings(role: UserRole) {
  return role === "agent" || role === "admin";
}

export function canModeratePlatform(role: UserRole) {
  return role === "admin";
}
