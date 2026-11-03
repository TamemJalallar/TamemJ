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
      <body className="bg-bg p-6 text-fg">
        <div className="mx-auto max-w-xl rounded-2xl border border-line/80 bg-card p-6 shadow-soft">
          <h1 className="text-2xl font-semibold">Something went wrong</h1>
          <p className="mt-3 text-sm text-muted">
            An unexpected runtime error occurred. This incident was recorded for troubleshooting.
          </p>
          {error.digest ? <p className="mt-2 text-xs text-muted">Digest: {error.digest}</p> : null}
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
