"use client";

import { useEffect, useMemo, useState } from "react";
import type { Ticket, TicketPriority, TicketStatus, TicketType } from "@/types/support";
import { SupportPageHeader } from "@/components/support-portal/page-header";
import { FilterChips } from "@/components/support-portal/filter-chips";
import {
  PriorityBadge,
  StatusBadge,
  TicketBadgeRow,
  TicketTypeBadge
} from "@/components/support-portal/badges";
import {
  addTicketActivity,
  getStoredTickets,
  seedDemoTickets,
  updateTicketStatus
} from "@/lib/support-portal.storage";
import { trackTicketActivityAdded } from "@/lib/support-portal.analytics";

const statusOptions: TicketStatus[] = ["New", "In Progress", "Waiting on User", "Resolved", "Closed"];
const priorityOptions: TicketPriority[] = ["P1", "P2", "P3", "P4"];
const typeOptions: TicketType[] = ["Incident", "Request"];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString();
}

export function TicketsWorkbench() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [noteText, setNoteText] = useState("");
  const [commentText, setCommentText] = useState("");

  function refreshTickets() {
    const next = getStoredTickets();
    setTickets(next);
    setSelectedTicketId((current) => current ?? next[0]?.id ?? null);
  }

  useEffect(() => {
    refreshTickets();
  }, []);

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(ticket.status)) return false;
      if (selectedPriorities.length > 0 && !selectedPriorities.includes(ticket.priority)) return false;
      if (selectedTypes.length > 0 && !selectedTypes.includes(ticket.type)) return false;
      return true;
    });
  }, [tickets, selectedStatuses, selectedPriorities, selectedTypes]);

  const selectedTicket = useMemo(
    () => filteredTickets.find((ticket) => ticket.id === selectedTicketId) ?? filteredTickets[0] ?? null,
    [filteredTickets, selectedTicketId]
  );

  useEffect(() => {
    if (!selectedTicket && filteredTickets.length > 0) {
      setSelectedTicketId(filteredTickets[0].id);
    }
  }, [selectedTicket, filteredTickets]);

  function handleStatusChange(ticketId: string, status: TicketStatus) {
    updateTicketStatus(ticketId, status);
    refreshTickets();
  }

  function submitActivity(mode: "note" | "comment") {
    if (!selectedTicket) return;
    const text = mode === "note" ? noteText.trim() : commentText.trim();
    if (!text) return;

    addTicketActivity(selectedTicket.id, {
      actor: mode === "note" ? "Analyst" : "User",
      type: mode,
      message: text
    });

    trackTicketActivityAdded({ ticketId: selectedTicket.id, mode });
    refreshTickets();

    if (mode === "note") setNoteText("");
    else setCommentText("");
  }

  return (
    <div className="space-y-5">
      <SupportPageHeader
        title="My Tickets"
        description="View locally stored demo incident and request tickets, filter by status/priority/type, and simulate ticket activity updates."
        breadcrumbs={[{ label: "Support Portal", href: "/support" }, { label: "My Tickets" }]}
        actions={
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={refreshTickets} className="btn-secondary">
              Refresh
            </button>
            <button type="button" onClick={() => { seedDemoTickets(); refreshTickets(); }} className="btn-primary">
              Seed Demo Tickets
            </button>
          </div>
        }
        filters={
          <div className="space-y-3">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Status</p>
              <FilterChips
                options={statusOptions.map((value) => ({ label: value, value }))}
                selected={selectedStatuses}
                onChange={setSelectedStatuses}
              />
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Priority</p>
                <FilterChips
                  options={priorityOptions.map((value) => ({ label: value, value }))}
                  selected={selectedPriorities}
                  onChange={setSelectedPriorities}
                />
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Type</p>
                <FilterChips
                  options={typeOptions.map((value) => ({ label: value, value }))}
                  selected={selectedTypes}
                  onChange={setSelectedTypes}
                />
              </div>
            </div>
          </div>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-2xl border border-line/70 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-950/70 sm:p-5">
          {filteredTickets.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-line/70 text-left text-xs uppercase tracking-[0.14em] text-slate-500 dark:border-slate-800 dark:text-slate-400">
                    <th className="px-3 py-3">Ticket</th>
                    <th className="px-3 py-3">Type</th>
                    <th className="px-3 py-3">Priority</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map((ticket) => {
                    const selected = selectedTicket?.id === ticket.id;
                    return (
                      <tr
                        key={ticket.id}
                        className={
                          selected
                            ? "bg-slate-50 dark:bg-slate-900/70"
                            : "hover:bg-slate-50/80 dark:hover:bg-slate-900/40"
                        }
                      >
                        <td className="px-3 py-3 align-top">
                          <button
                            type="button"
                            onClick={() => setSelectedTicketId(ticket.id)}
                            className="w-full text-left"
                          >
                            <p className="font-semibold text-slate-900 dark:text-slate-100">{ticket.id}</p>
                            <p className="mt-1 max-w-xl text-xs text-slate-600 dark:text-slate-300">{ticket.summary}</p>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{ticket.category} • {ticket.product}</p>
                          </button>
                        </td>
                        <td className="px-3 py-3 align-top"><TicketTypeBadge type={ticket.type} /></td>
                        <td className="px-3 py-3 align-top"><PriorityBadge priority={ticket.priority} /></td>
                        <td className="px-3 py-3 align-top"><StatusBadge status={ticket.status} /></td>
                        <td className="px-3 py-3 align-top text-xs text-slate-500 dark:text-slate-400">{formatDate(ticket.updatedAt)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-line/80 bg-white p-6 text-sm dark:border-slate-800 dark:bg-slate-950/70">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">No tickets yet</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-300">Submit an incident or catalog request, or seed demo tickets to explore the workbench.</p>
              <button type="button" onClick={() => { seedDemoTickets(); refreshTickets(); }} className="btn-secondary mt-4">
                Seed Demo Tickets
              </button>
            </div>
          )}
        </section>

        <aside className="space-y-5">
          {selectedTicket ? (
            <>
              <div className="rounded-2xl border border-line/70 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-950/70 sm:p-6">
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Selected Ticket</p>
                      <h2 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">{selectedTicket.id}</h2>
                    </div>
                    <select
                      value={selectedTicket.status}
                      onChange={(event) => handleStatusChange(selectedTicket.id, event.target.value as TicketStatus)}
                      className="rounded-xl border border-line bg-white px-3 py-2 text-xs font-medium text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                  <TicketBadgeRow ticket={selectedTicket} />
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{selectedTicket.summary}</p>
                  <p className="text-sm leading-7 text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{selectedTicket.description}</p>
                  <dl className="grid gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <div><dt className="inline font-semibold">Category:</dt> <dd className="inline">{selectedTicket.category}{selectedTicket.subcategory ? ` / ${selectedTicket.subcategory}` : ""}</dd></div>
                    <div><dt className="inline font-semibold">Product:</dt> <dd className="inline">{selectedTicket.product}</dd></div>
                    <div><dt className="inline font-semibold">Preferred Contact:</dt> <dd className="inline">{selectedTicket.preferredContactMethod}</dd></div>
                    <div><dt className="inline font-semibold">Created:</dt> <dd className="inline">{formatDate(selectedTicket.createdAt)}</dd></div>
                    {selectedTicket.attachments.length > 0 ? (
                      <div>
                        <dt className="inline font-semibold">Attachments (mock):</dt>{" "}
                        <dd className="inline">{selectedTicket.attachments.join(", ")}</dd>
                      </div>
                    ) : null}
                  </dl>
                </div>
              </div>

              <div className="rounded-2xl border border-line/70 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-950/70 sm:p-6">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Add Internal Note (Mock)</h2>
                <textarea
                  rows={3}
                  value={noteText}
                  onChange={(event) => setNoteText(event.target.value)}
                  placeholder="Analyst note (local demo only)"
                  className="mt-3 w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:shadow-soft dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
                <button type="button" onClick={() => submitActivity("note")} className="btn-secondary mt-3">
                  Add Note
                </button>
              </div>

              <div className="rounded-2xl border border-line/70 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-950/70 sm:p-6">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Add User Comment (Mock)</h2>
                <textarea
                  rows={3}
                  value={commentText}
                  onChange={(event) => setCommentText(event.target.value)}
                  placeholder="User comment (local demo only)"
                  className="mt-3 w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:shadow-soft dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
                <button type="button" onClick={() => submitActivity("comment")} className="btn-secondary mt-3">
                  Add Comment
                </button>
              </div>

              <div className="rounded-2xl border border-line/70 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-950/70 sm:p-6">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Activity Log</h2>
                <ol className="mt-3 space-y-3">
                  {selectedTicket.activityLog.map((entry) => (
                    <li key={entry.id} className="rounded-xl border border-line/70 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-900/70">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="font-semibold text-slate-700 dark:text-slate-200">{entry.actor} • {entry.type}</span>
                        <span className="text-slate-500 dark:text-slate-400">{formatDate(entry.createdAt)}</span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">{entry.message}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-line/70 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-950/70">
              <p className="text-sm text-slate-600 dark:text-slate-300">Select a ticket to view details and activity.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
