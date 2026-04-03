import Link from "next/link";
import { adsenseReviewModeEnabled } from "@/lib/adsense-review-mode";
import { appsSectionEnabled } from "@/lib/apps-visibility";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t border-line/70 bg-card/85 backdrop-blur-sm">
      <div className="page-shell py-8 sm:py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">© {year} Tamem J. All rights reserved.</p>

          <nav aria-label="Footer links" className="flex flex-wrap gap-2">
            {appsSectionEnabled ? (
              <Link href="/apps" className="nav-link">
                Apps
              </Link>
            ) : null}
            {!adsenseReviewModeEnabled ? (
              <>
                <Link href="/downloads" className="nav-link">
                  Downloads
                </Link>
                <Link href="/corporate-tech-fixes" className="nav-link">
                  Tech Fixes
                </Link>
                <Link href="/guides" className="nav-link">
                  Guides
                </Link>
                <Link href="/services/msp" className="nav-link">
                  MSP Services
                </Link>
                <Link href="/ai-agents" className="nav-link">
                  AI Agents
                </Link>
                <Link href="/genai-prompts" className="nav-link">
                  GenAI Prompts
                </Link>
              </>
            ) : null}
            <Link href="/support" className="nav-link">
              Support
            </Link>
            {!adsenseReviewModeEnabled ? (
              <Link href="/donate" className="nav-link">
                Donate
              </Link>
            ) : null}
            <Link href="/privacy" className="nav-link">
              Privacy Policy
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
