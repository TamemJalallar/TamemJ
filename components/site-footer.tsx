import Link from "next/link";
import { adsenseReviewModeEnabled } from "@/lib/adsense-review-mode";
import { appsSectionEnabled } from "@/lib/apps-visibility";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-line bg-neutral-100/90 backdrop-blur-sm dark:bg-neutral-950/80">
      <div className="page-shell py-10 sm:py-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-xl space-y-3">
            <p className="eyebrow">TamemJ</p>
            <h2 className="font-display text-xl font-semibold text-fg sm:text-2xl">
              IT support resources, downloads, apps, and technical product work.
            </h2>
            <p className="text-sm text-muted sm:text-base">
              A polished knowledge hub for troubleshooting, enterprise support workflows, curated tools,
              and developer-focused product pages.
            </p>
            <p className="text-sm text-muted">© {year} Tamem J. All rights reserved.</p>
          </div>

          <nav aria-label="Footer links" className="grid gap-2 sm:grid-cols-2 lg:min-w-[26rem]">
            {appsSectionEnabled ? (
              <Link href="/apps" className="footer-link">
                Apps
              </Link>
            ) : null}
            {!adsenseReviewModeEnabled ? (
              <>
                <Link href="/downloads" className="footer-link">
                  Downloads
                </Link>
                <Link href="/corporate-tech-fixes" className="footer-link">
                  Tech Fixes
                </Link>
                <Link href="/guides" className="footer-link">
                  Guides
                </Link>
                <Link href="/services/msp" className="footer-link">
                  MSP Services
                </Link>
                <Link href="/ai-agents" className="footer-link">
                  AI Agents
                </Link>
                <Link href="/genai-prompts" className="footer-link">
                  GenAI Prompts
                </Link>
              </>
            ) : null}
            <Link href="/support" className="footer-link">
              Support
            </Link>
            {!adsenseReviewModeEnabled ? (
              <Link href="/donate" className="footer-link">
                Donate
              </Link>
            ) : null}
            <Link href="/privacy" className="footer-link">
              Privacy Policy
            </Link>
            <Link href="/contact" className="footer-link">
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
