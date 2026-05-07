export interface DownloadEditorialOverride {
  leadParagraph: string;
  pagePurpose: string;
  bestFitHighlights?: string[];
}

export const downloadEditorialOverrides: Record<string, DownloadEditorialOverride> = {
  "microsoft-teams": {
    leadParagraph:
      "This page is for the person who just needs the right Microsoft Teams install path without bouncing between Microsoft marketing pages, store listings, and admin docs. It keeps the common enterprise download routes together so rollout, reinstall, and support handoff are faster.",
    pagePurpose:
      "Teams is one of those apps users need immediately, often while they are already blocked from meetings or chat. This guide exists to give IT teams and end users a clean handoff: official channels, clear platform choices, and enough release context to install with confidence.",
    bestFitHighlights: [
      "Best when you need the official Teams install path quickly for a user, shared workstation, or support escalation.",
      "Useful for separating website, store, and direct installer options without sending users through multiple Microsoft pages.",
      "Good fit for meeting-day issues where reinstalling or validating the current client is part of the fix."
    ]
  },
  notion: {
    leadParagraph:
      "Notion downloads are straightforward once you know which desktop or mobile path you actually want. This page puts the official channels in one place so users can move from \"where do I get it\" to \"it is installed\" without second-guessing the source.",
    pagePurpose:
      "The point of this guide is not to review Notion; it is to make the install path simple and trustworthy. Whether the user is setting up a fresh workstation or reinstalling the client after sync issues, the official download and store routes are collected here with the useful release context nearby.",
    bestFitHighlights: [
      "Helpful when onboarding users who need a fast, official install path for Notion across desktop and mobile.",
      "Cuts down on support back-and-forth by keeping the main vendor and store routes together.",
      "Works well as a handoff page when reinstalling after local cache or sync issues."
    ]
  },
  vscode: {
    leadParagraph:
      "Visual Studio Code has several valid install paths, and that can be confusing when you are trying to give someone a clean answer fast. This page keeps the official Microsoft download, release, and source references together so the install decision is obvious.",
    pagePurpose:
      "This guide exists for practical deployment and reinstall scenarios, not for debating editors. If a developer, student, or IT admin needs the stable VS Code build, release notes, or a trustworthy source link, everything they need is already laid out here.",
    bestFitHighlights: [
      "Strong fit for new-device setup, developer onboarding, and reinstall requests after a broken extension or profile state.",
      "Useful when someone needs both the official stable installer and a release/source reference in one place.",
      "Good for support teams who want a clean page to hand off instead of multiple Microsoft and GitHub links."
    ]
  },
  firefox: {
    leadParagraph:
      "Firefox is often chosen because users want a stable browser with better privacy defaults, but the install question still comes up across managed and personal devices. This page keeps the official Mozilla and store routes together so the answer is fast and low-risk.",
    pagePurpose:
      "The goal here is to make Firefox installation easy to trust. Instead of sending users through search results or unofficial mirrors, this guide pulls the official channels, direct installer options, and source reference into one page that is simple to hand off.",
    bestFitHighlights: [
      "Best for privacy-minded users or teams that want an official Firefox path without hunting through search results.",
      "Useful when browser reinstall is part of troubleshooting authentication, profile, or extension issues.",
      "Helpful for Windows and macOS support flows where a direct official installer matters."
    ]
  },
  figma: {
    leadParagraph:
      "Figma users usually arrive here because they need to get back to work quickly, not because they want to compare installers. This page keeps the desktop, web, and store entry points together so design teams can choose the right route without friction.",
    pagePurpose:
      "This guide exists to support real workstation setup and recovery moments: a fresh laptop, a desktop app reinstall, or a quick handoff to the official client while a support issue is being diagnosed. The value is in making the trusted install path obvious.",
    bestFitHighlights: [
      "Great for design-team onboarding, laptop refreshes, and desktop-app reinstall requests.",
      "Useful when support needs to confirm whether the user should stay in web, store, or desktop app.",
      "Pairs well with the site's Figma troubleshooting guides when install validation is part of the workflow."
    ]
  },
  cursor: {
    leadParagraph:
      "Cursor changes quickly, and most people looking for it just want the right installer without ending up on a stale blog post or a random mirror. This page keeps the official download path front and center so the install step stays simple.",
    pagePurpose:
      "The purpose of this guide is to make Cursor easy to deploy and easy to trust. Whether someone is trying it for the first time or reinstalling after a broken update, the official download path and platform coverage are clear from the start.",
    bestFitHighlights: [
      "Useful for developer onboarding when an AI-first editor is part of the standard toolset.",
      "Helps avoid unofficial download paths for a fast-moving product with frequent interest spikes.",
      "Good for support teams documenting a clean reinstall path after extension or update issues."
    ]
  },
  "chatgpt-desktop": {
    leadParagraph:
      "People usually search for the ChatGPT desktop app when they want the official client quickly, not a list of articles about it. This page keeps the OpenAI and app-store routes together so the install decision is immediate and trustworthy.",
    pagePurpose:
      "This guide is meant to reduce friction around a very common request: \"Where do I get the real ChatGPT app?\" It gathers the official desktop and store options in one place so users do not have to guess which result is current.",
    bestFitHighlights: [
      "Best when a user wants the official ChatGPT client and needs a fast yes-or-no answer on where to install it.",
      "Useful for workstation setup, reinstalls, or support handoffs involving the desktop app versus the web app.",
      "Helps keep AI-tool installs anchored to official OpenAI distribution paths."
    ]
  },
  "claude-desktop": {
    leadParagraph:
      "Claude Desktop is still new enough that users often want reassurance they are landing on the official installer. This page makes that easy by keeping the trusted Anthropic download path and platform coverage together in one place.",
    pagePurpose:
      "The point of this guide is simple: reduce uncertainty. If a team member wants Claude on macOS or Windows, or support needs to confirm the right install source before troubleshooting, the official path is already mapped out here.",
    bestFitHighlights: [
      "Useful for early-stage team rollouts where users want the official Anthropic download path immediately.",
      "Helps support conversations stay focused when install validation is the first step.",
      "Good fit for AI-tool setup pages where speed and trust matter more than a long product review."
    ]
  },
  wireshark: {
    leadParagraph:
      "Wireshark is one of those tools people often need at the exact moment they are already investigating a problem. This page keeps the official installer and release references close at hand so a network or endpoint workflow does not slow down at the download step.",
    pagePurpose:
      "This guide is built for practical use, especially in support and diagnostics scenarios. If someone needs Wireshark for packet capture, validation, or lab work, the official download path should be easy to confirm and easy to hand off.",
    bestFitHighlights: [
      "Best for IT admins, network engineers, and students who need Wireshark quickly for diagnostics.",
      "Helpful when you want the official installer plus release context without searching around.",
      "Strong fit for troubleshooting runbooks that ask the user to install a known network-analysis tool."
    ]
  },
  filezilla: {
    leadParagraph:
      "FileZilla is still a common answer when users need a straightforward SFTP or FTP client, but the right installer path is worth keeping clean. This page gathers the official site and release references so the download step stays simple.",
    pagePurpose:
      "The goal here is to make a common support handoff easier. When someone needs FileZilla for file transfer, website maintenance, or server access, this guide keeps the official channels and platform choices easy to verify.",
    bestFitHighlights: [
      "Useful for IT teams, web admins, and power users who need a familiar SFTP client without guessing at the source.",
      "Good fit for support documentation where a clean install path matters more than product commentary.",
      "Helps keep download guidance anchored to official channels during server-access troubleshooting."
    ]
  }
};

export function getDownloadEditorialOverride(slug: string): DownloadEditorialOverride | undefined {
  return downloadEditorialOverrides[slug];
}
