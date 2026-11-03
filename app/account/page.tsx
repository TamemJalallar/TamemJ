import type { Metadata } from "next";
import { AccountDashboard } from "@/components/account/account-dashboard";
import { buildOpenGraph, buildTwitter } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Account",
  description:
    "Create your account, manage your profile, and track software downloads across your devices.",
  alternates: {
    canonical: "/account/"
  },
  robots: {
    index: false,
    follow: false
  },
  openGraph: buildOpenGraph(
    "Account | Tamem J",
    "Create your account, manage your profile, and track software downloads.",
    "/account/"
  ),
  twitter: buildTwitter(
    "Account | Tamem J",
    "Create your account, manage your profile, and track software downloads."
  )
};

export default function AccountPage() {
  return (
    <section className="section-shell pt-8 sm:pt-10">
      <div className="page-shell">
        <AccountDashboard />
      </div>
    </section>
  );
}
