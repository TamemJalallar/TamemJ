import type { Metadata } from "next";
import { AdSenseSlot } from "@/components/monetization/adsense-slot";
import { getAdSenseSlot, monetizationConfig } from "@/lib/monetization";
import { IncidentForm } from "@/components/support-portal/incident-form";

export const metadata: Metadata = {
  title: "Incident Form",
  description:
    "Submit an incident using the ITIL-lite incident form with required requester info, category/application mapping, impact/urgency, and automatic priority.",
  alternates: { canonical: "/support/incident/new/" },
  robots: { index: false, follow: false }
};

export default function NewIncidentPage() {
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
      <IncidentForm />
    </>
  );
}
