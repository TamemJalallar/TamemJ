import type { Metadata } from "next";
import { IncidentForm } from "@/components/support-portal/incident-form";

export const metadata: Metadata = {
  title: "Incident Form",
  description:
    "Submit an incident using the ITIL-lite incident form with required requester info, category/application mapping, impact/urgency, and automatic priority.",
  alternates: { canonical: "/support/incident/new/" },
  robots: { index: false, follow: false }
};

export default function NewIncidentPage() {
  return <IncidentForm />;
}
