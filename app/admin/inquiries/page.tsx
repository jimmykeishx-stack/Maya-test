import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/admin";

export default async function AdminInquiriesPage() {
  await requireAdmin("/admin/inquiries");
  redirect("/admin");
}
