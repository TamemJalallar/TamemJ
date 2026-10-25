import Link from "next/link";
import { adsenseReviewModeEnabled } from "@/lib/adsense-review-mode";
import { appsSectionEnabled } from "@/lib/apps-visibility";

const platformLinks = [
  { href: "/corporate-tech-fixes", label: "Tech Fixes" },
  { href: "/support/tickets", label: "Tickets" },
  { href: "/downloads", label: "Downloads" },
  { href: "/guides", label: "Guides" },
] as const;

const productLinks = [
  ...(appsSectionEnabled ? [{ href: "/apps", label: "Apps" }] : []),
  { href: "/services/msp", label: "MSP Services" },
  { href: "/contact", label: "Contact" },
] as const;

const aiLinks = [
  { href: "/ai-agents", label: "AI Agents" },
  { href: "/genai-prompts", label: "GenAI Prompts" },
  { href: "/pc-build-guides", label: "PC Builds" },
] as const;

const supportLinks = [
  { href: "/support", label: "Support Portal" },
  { href: "/editorial-standards", label: "Editorial Standards" },
  { href: "/privacy", label: "Privacy Policy" },
  ...(!adsenseReviewModeEnabled ? [{ href: "/donate", label: "Donate" }] : []),
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  const groups = [
    { title: "Library", links: platformLinks },
    { title: "Support", links: supportLinks },
    { title: "Explore", links: aiLinks },
    { title: "Work with me", links: productLinks },
  ];
  return (
    <footer className="clean-footer">
      <div className="page-shell">
        <div className="clean-footer-top">
          <div>
            <Link href="/" className="clean-wordmark">
              TamemJ
            </Link>
            <p>
              Practical IT knowledge.
              <br />
              Built to be useful.
            </p>
          </div>
          <nav aria-label="Footer navigation">
            {groups.map((group) => (
              <div key={group.title}>
                <h2>{group.title}</h2>
                {group.links.map((item) => (
                  <Link key={item.href} href={item.href}>
                    {item.label}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
        </div>
        <div className="clean-footer-bottom">
          <p>© {year} Tamem J</p>
          <a href="/wedding/">Wedding gallery</a>
        </div>
      </div>
    </footer>
  );
}
