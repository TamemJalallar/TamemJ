import type { Metadata } from "next";
import Link from "next/link";
import { getAiAgentsRegistry } from "@/lib/aiAgents.registry";
import { getGenAIPrompts } from "@/lib/genai-prompts";
import { buildOpenGraph, buildTwitter } from "@/lib/seo";

export const metadata: Metadata = {
  title: "AI Hub — Agents + GenAI Prompts",
  description:
    "Explore AI Agents (system prompts) and GenAI Prompts (Meta/Adobe workflows) in one place. Copy-ready, production-focused libraries.",
  alternates: {
    canonical: "/ai/"
  },
  openGraph: buildOpenGraph(
    "AI Hub — Agents + GenAI Prompts",
    "Explore AI Agents (system prompts) and GenAI Prompts (Meta/Adobe workflows) in one place.",
    "/ai/"
  ),
  twitter: buildTwitter(
    "AI Hub — Agents + GenAI Prompts",
    "Explore AI Agents (system prompts) and GenAI Prompts (Meta/Adobe workflows) in one place."
  )
};

export default function AiLibraryPage() {
  const agents = getAiAgentsRegistry();
  const prompts = getGenAIPrompts();

  return (
    <section className="section-shell pb-12 pt-10 sm:pt-14">
      <div className="page-shell">
        <div className="rounded-3xl border border-line/70 bg-white/95 p-6 shadow-soft dark:border-slate-800 dark:bg-slate-950/70 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            AI Hub
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100 sm:text-4xl">
            AI Hub: Agents + GenAI Prompts
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-600 dark:text-slate-300">
            Pick the right library for your workflow. AI Agents focus on role-based system prompts,
            while GenAI Prompts target Meta AI + Adobe workflows for creative tasks.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="rounded-full border border-line/70 bg-slate-50 px-3 py-1 dark:border-slate-800 dark:bg-slate-900">
              {agents.length} AI agents
            </span>
            <span className="rounded-full border border-line/70 bg-slate-50 px-3 py-1 dark:border-slate-800 dark:bg-slate-900">
              {prompts.length} GenAI prompts
            </span>
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <Link
            href="/ai-agents"
            className="group relative overflow-hidden rounded-3xl border border-line/70 bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-card dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-slate-700"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/60 via-transparent to-transparent opacity-0 transition group-hover:opacity-100 dark:from-emerald-900/20" />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                AI Agents
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                System prompts for specialized roles
              </h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                300+ expert agent prompts across technology, business, marketing, legal, finance,
                and operations. Built for ChatGPT, Claude, Grok/xAI, Perplexity, and Gemini.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-semibold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200">
                  {agents.length} agents
                </span>
                <span className="rounded-full border border-line/70 bg-white px-3 py-1 font-semibold dark:border-slate-700 dark:bg-slate-900">
                  Role-based system prompts
                </span>
              </div>
              <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition group-hover:translate-x-1 dark:text-emerald-200">
                Browse AI Agents →
              </div>
            </div>
          </Link>

          <Link
            href="/genai-prompts"
            className="group relative overflow-hidden rounded-3xl border border-line/70 bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-card dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-slate-700"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/60 via-transparent to-transparent opacity-0 transition group-hover:opacity-100 dark:from-cyan-900/20" />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                GenAI Prompts
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                Meta AI + Adobe workflows
              </h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                Copy-ready prompts for Meta AI chat and Adobe Firefly/Photoshop Generative Fill,
                Expand, and Text-to-Image tasks with variables and best-practice guidance.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 font-semibold text-cyan-700 dark:border-cyan-900/60 dark:bg-cyan-950/40 dark:text-cyan-200">
                  {prompts.length} prompts
                </span>
                <span className="rounded-full border border-line/70 bg-white px-3 py-1 font-semibold dark:border-slate-700 dark:bg-slate-900">
                  Creative + marketing workflows
                </span>
              </div>
              <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-700 transition group-hover:translate-x-1 dark:text-cyan-200">
                Browse GenAI Prompts →
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-6 rounded-2xl border border-line/70 bg-slate-50 p-5 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          <p className="font-semibold text-slate-900 dark:text-slate-100">Not sure where to start?</p>
          <p className="mt-2">
            If you need role-based system prompts, start with AI Agents. If you need creative or visual
            prompts, head to GenAI Prompts.
          </p>
        </div>
      </div>
    </section>
  );
}
