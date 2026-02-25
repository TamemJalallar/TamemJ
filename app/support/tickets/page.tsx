import type { Metadata } from "next";
import { TicketsWorkbench } from "@/components/support-portal/tickets-workbench";

export const metadata: Metadata = {
  title: "My Tickets",
  description: "View and manage locally stored demo incidents and service requests in the support portal.",
  alternates: { canonical: "/support/tickets/" }
};

export default function TicketsPage() {
  return <TicketsWorkbench />;
}
