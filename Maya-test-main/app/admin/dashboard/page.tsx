import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/admin";

export default async function AdminDashboardPage() {
  await requireAdmin("/admin/dashboard");
  redirect("/admin");
}
