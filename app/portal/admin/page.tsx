import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { isAdminUser, isSuperAdminUser } from "@/lib/airtable";
import AdminDashboard from "./AdminDashboard";

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/?error=auth_required");
  }

  const [admin, superAdmin] = await Promise.all([
    isAdminUser(user.userId),
    isSuperAdminUser(user.userId),
  ]);
  if (!admin) {
    redirect("/portal?error=unauthorized");
  }

  return <AdminDashboard userName={user.name} isSuperAdmin={superAdmin} />;
}
