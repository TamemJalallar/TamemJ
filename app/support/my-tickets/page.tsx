import type { Metadata } from "next";
import { AdSenseSlot } from "@/components/monetization/adsense-slot";
import { getAdSenseSlot, monetizationConfig } from "@/lib/monetization";
import { TicketsWorkbench } from "@/components/support-portal/tickets-workbench";

export const metadata: Metadata = {
  title: "My Tickets",
  description: "View and manage locally stored demo incidents and service requests in the support portal.",
  alternates: { canonical: "/support/my-tickets/" },
  robots: { index: false, follow: false }
};

export default function TicketsPage() {
  return (
    <>
      <div className="section-shell pb-4 pt-6">
        <div className="page-shell">
          <AdSenseSlot
            client={monetizationConfig.adsenseClient}
            slot={getAdSenseSlot("display")}
            label="Advertisement"
          />
        </div>
      </div>
      <TicketsWorkbench />
    </>
  );
}
