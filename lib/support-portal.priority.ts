import type { SupportImpact, SupportUrgency, TicketPriority } from "@/types/support";

const priorityMatrix: Record<SupportImpact, Record<SupportUrgency, TicketPriority>> = {
  High: {
    High: "P1",
    Medium: "P2",
    Low: "P2"
  },
  Medium: {
    High: "P2",
    Medium: "P3",
    Low: "P4"
  },
  Low: {
    High: "P3",
    Medium: "P4",
    Low: "P4"
  }
};

export function calculateTicketPriority(
  impact: SupportImpact,
  urgency: SupportUrgency
): TicketPriority {
  return priorityMatrix[impact][urgency];
}
