import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/admin";

export default async function AdminSettingsPage() {
  await requireAdmin("/admin/settings");
  redirect("/admin");
}
