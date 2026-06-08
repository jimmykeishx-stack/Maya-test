import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/admin";

export default async function AdminMediaPage() {
  await requireAdmin("/admin/media");
  redirect("/admin");
}
