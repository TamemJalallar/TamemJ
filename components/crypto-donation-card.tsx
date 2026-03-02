"use client";

import { useEffect, useState } from "react";
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
  const [openQrKey, setOpenQrKey] = useState<string>("");
  const [qrImageByKey, setQrImageByKey] = useState<Record<string, string>>({});
  const [qrLoadingKey, setQrLoadingKey] = useState<string>("");
  const [qrErrorKey, setQrErrorKey] = useState<string>("");
  const activeQrMethod = methods.find((method) => method.key === openQrKey);

  async function handleCopyAddress(method: CryptoDonationMethod): Promise<void> {
    const copied = await copyToClipboard(method.address);
    if (!copied) return;

    setCopiedKey(method.key);
    window.setTimeout(() => {
      setCopiedKey((current) => (current === method.key ? "" : current));
    }, 1800);
  }

  async function handleOpenQr(method: CryptoDonationMethod): Promise<void> {
    setOpenQrKey(method.key);
    setQrErrorKey("");

    if (qrImageByKey[method.key]) {
      return;
    }

    setQrLoadingKey(method.key);
    try {
      const QRCode = await import("qrcode");
      const qrDataUrl = await QRCode.toDataURL(method.address, {
        width: 220,
        margin: 1,
        errorCorrectionLevel: "M"
      });

      setQrImageByKey((current) => ({
        ...current,
        [method.key]: qrDataUrl
      }));
    } catch {
      setQrErrorKey(method.key);
    } finally {
      setQrLoadingKey((current) => (current === method.key ? "" : current));
    }
  }

  function handleCloseQr(): void {
    setOpenQrKey("");
  }

  useEffect(() => {
    if (!openQrKey) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenQrKey("");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [openQrKey]);

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
                <button
                  type="button"
                  aria-pressed={openQrKey === method.key}
                  onClick={() => {
                    if (openQrKey === method.key) {
                      handleCloseQr();
                    } else {
                      void handleOpenQr(method);
                    }
                  }}
                  className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-800"
                >
                  {openQrKey === method.key ? "Hide QR" : "Show QR"}
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

      {activeQrMethod ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
            onClick={handleCloseQr}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${activeQrMethod.symbol} donation QR code`}
            className="relative z-10 w-full max-w-lg rounded-2xl border border-line bg-white p-4 shadow-card dark:border-slate-700 dark:bg-slate-950 sm:p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                  {activeQrMethod.network}
                </p>
                <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">
                  {activeQrMethod.symbol} Donation QR
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCloseQr}
                className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-800"
              >
                Close
              </button>
            </div>

            <div className="mt-4 rounded-xl border border-line bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900">
              {qrLoadingKey === activeQrMethod.key ? (
                <p className="text-sm text-slate-600 dark:text-slate-300">Generating QR code...</p>
              ) : null}

              {qrErrorKey === activeQrMethod.key ? (
                <p className="text-sm text-rose-700 dark:text-rose-300">
                  Unable to generate QR code. Use copy address instead.
                </p>
              ) : null}

              {qrImageByKey[activeQrMethod.key] ? (
                <div className="flex flex-col items-center gap-3">
                  <img
                    src={qrImageByKey[activeQrMethod.key]}
                    alt={`${activeQrMethod.symbol} donation wallet address QR code`}
                    className="h-64 w-64 rounded-lg border border-line bg-white p-2 sm:h-72 sm:w-72"
                    loading="lazy"
                  />
                  <p className="text-center text-sm text-slate-600 dark:text-slate-300">
                    Scan with your {activeQrMethod.symbol} wallet app.
                  </p>
                </div>
              ) : null}
            </div>

            <p className="mt-3 break-all rounded-lg border border-dashed border-line bg-slate-50 px-3 py-2 font-mono text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
              {activeQrMethod.address}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  void handleCopyAddress(activeQrMethod);
                }}
                className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-800"
              >
                {copiedKey === activeQrMethod.key ? "Copied" : "Copy Address"}
              </button>
              <a
                href={activeQrMethod.walletUri}
                className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-800"
              >
                Open Wallet
              </a>
              <a
                href={activeQrMethod.explorerUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-medium text-cyan-700 hover:text-cyan-800 dark:text-cyan-300 dark:hover:text-cyan-200"
              >
                View on Explorer
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
