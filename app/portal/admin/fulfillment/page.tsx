import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { isSuperAdminUser, getAllFulfillmentOrders, getUserFromId } from "@/lib/airtable";
import FulfillmentDashboard from "./FulfillmentDashboard";

export default async function FulfillmentPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/?error=auth_required");
  const admin = await isSuperAdminUser(user.userId);
  if (!admin) redirect("/portal?error=unauthorized");

  const [orders, adminInfo] = await Promise.all([
    getAllFulfillmentOrders(),
    getUserFromId(user.userId),
  ]);
  const adminDisplayName = adminInfo?.slack_display_name || user.name || user.email || "admin";

  return <FulfillmentDashboard initialOrders={orders} adminDisplayName={adminDisplayName} />;
}
