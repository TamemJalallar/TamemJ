import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t border-line/70 bg-white/80 dark:border-slate-700 dark:bg-slate-950/80">
      <div className="page-shell py-8 sm:py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">© {year} Tamem J. All rights reserved.</p>

          <nav aria-label="Footer links" className="flex flex-wrap gap-2">
            <Link
              href="/apps"
              className="nav-link dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-100"
            >
              Apps
            </Link>
            <Link
              href="/downloads"
              className="nav-link dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-100"
            >
              Downloads
            </Link>
            <Link
              href="/corporate-tech-fixes"
              className="nav-link dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-100"
            >
              Tech Fixes
            </Link>
            <Link
              href="/guides"
              className="nav-link dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-100"
            >
              Guides
            </Link>
            <Link
              href="/ai-agents"
              className="nav-link dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-100"
            >
              AI Agents
            </Link>
            <Link
              href="/support"
              className="nav-link dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-100"
            >
              Support
            </Link>
            <Link
              href="/donate"
              className="nav-link dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-100"
            >
              Donate
            </Link>
            <Link
              href="/privacy"
              className="nav-link dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-100"
            >
              Privacy Policy
            </Link>
            <Link
              href="/contact"
              className="nav-link dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-100"
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
