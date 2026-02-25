import type { Metadata } from "next";
import { IncidentForm } from "@/components/support-portal/incident-form";

export const metadata: Metadata = {
  title: "Submit Incident",
  description:
    "Submit a demo incident with ITIL-lite intake fields, impact/urgency, and automatic priority calculation. Stored locally in the browser.",
  alternates: { canonical: "/support/incident/new/" }
};

export default function NewIncidentPage() {
  return <IncidentForm />;
}
