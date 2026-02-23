import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t border-line/70 bg-white/80">
      <div className="page-shell py-8 sm:py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">© {year} Tamem J. All rights reserved.</p>

          <nav aria-label="Footer links" className="flex flex-wrap gap-2">
            <Link href="/apps" className="nav-link">
              Apps
            </Link>
            <Link href="/privacy" className="nav-link">
              Privacy Policy
            </Link>
            <Link href="/support" className="nav-link">
              Support
            </Link>
            <Link href="/contact" className="nav-link">
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
