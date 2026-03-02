"use client";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-100 p-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="mx-auto max-w-xl rounded-2xl border border-line/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-2xl font-semibold">Something went wrong</h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            An unexpected runtime error occurred. This incident was recorded for troubleshooting.
          </p>
          {error.digest ? (
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Digest: {error.digest}</p>
          ) : null}
          <button
            type="button"
            onClick={() => reset()}
            className="btn-primary mt-5 !px-4 !py-2"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
