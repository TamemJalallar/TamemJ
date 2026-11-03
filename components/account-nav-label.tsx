"use client";

import { useAccount } from "@/components/account/account-provider";

export function AccountNavLabel() {
  const { user, status } = useAccount();
  if (status === "loading") return <>Account</>;
  return <>{user ? "Profile" : "Sign In"}</>;
}
