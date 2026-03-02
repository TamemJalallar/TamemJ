"use client";

import { useState } from "react";
import type { CryptoDonationMethod } from "@/lib/crypto-donations";

interface CryptoDonationCardProps {
  methods: CryptoDonationMethod[];
}

function shortenAddress(address: string): string {
  if (address.length <= 18) return address;
  return `${address.slice(0, 8)}...${address.slice(-8)}`;
}

async function copyToClipboard(value: string): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

export function CryptoDonationCard({ methods }: CryptoDonationCardProps) {
  const [copiedKey, setCopiedKey] = useState<string>("");

  async function handleCopyAddress(method: CryptoDonationMethod): Promise<void> {
    const copied = await copyToClipboard(method.address);
    if (!copied) return;

    setCopiedKey(method.key);
    window.setTimeout(() => {
      setCopiedKey((current) => (current === method.key ? "" : current));
    }, 1800);
  }

  return (
    <section className="rounded-2xl border border-line/70 bg-slate-50/80 p-4 shadow-soft dark:border-slate-700 dark:bg-slate-900/70 sm:p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            Support This Site
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">Donate with Crypto</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            If these guides help you, you can support ongoing updates with a crypto donation.
          </p>
        </div>
      </div>

      {methods.length === 0 ? (
        <p className="mt-3 rounded-xl border border-dashed border-line bg-white px-3 py-2 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
          Crypto donation addresses are not configured yet.
        </p>
      ) : (
        <ul className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {methods.map((method) => (
            <li
              key={method.key}
              className="rounded-xl border border-line bg-white p-3 dark:border-slate-700 dark:bg-slate-950"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                {method.network}
              </p>
              <p className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100">{method.symbol}</p>
              <p className="mt-1 font-mono text-xs text-slate-600 dark:text-slate-300" title={method.address}>
                {shortenAddress(method.address)}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    void handleCopyAddress(method);
                  }}
                  className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-800"
                >
                  {copiedKey === method.key ? "Copied" : "Copy"}
                </button>
                <a
                  href={method.walletUri}
                  className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-800"
                >
                  Open Wallet
                </a>
                <a
                  href={method.explorerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-medium text-cyan-700 hover:text-cyan-800 dark:text-cyan-300 dark:hover:text-cyan-200"
                >
                  Explorer
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
