import type { Metadata } from "next";
import { AdminTools } from "@/components/support-portal/admin-tools";

export const metadata: Metadata = {
  title: "Admin",
  description: "Local admin tools for seeding demo tickets and resetting support portal analytics and local state.",
  alternates: { canonical: "/support/admin/" },
  robots: { index: false, follow: false }
};

export default function AdminPage() {
  return <AdminTools />;
}
