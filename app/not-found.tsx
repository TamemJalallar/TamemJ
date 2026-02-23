import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section-shell pt-14">
      <div className="page-shell max-w-3xl">
        <div className="surface-card-strong p-8 text-center sm:p-12">
          <p className="eyebrow">404</p>
          <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">Page not found</h1>
          <p className="mt-4 text-sm sm:text-base">
            The page you are looking for may have moved or does not exist.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/" className="btn-primary">
              Home
            </Link>
            <Link href="/apps" className="btn-secondary">
              Browse Apps
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
