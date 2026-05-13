import { NextResponse } from "next/server";
import {
  buildYahooAuthorizationUrl,
  createYahooState,
  getYahooConfig,
  getYahooConfigProblems,
  getYahooLocalOnlyMessage,
  isLocalYahooOAuthAllowed
} from "@/lib/fantasy-yahoo";

const STATE_COOKIE = "yahoo_fantasy_oauth_state";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!isLocalYahooOAuthAllowed()) {
    return NextResponse.json({ error: getYahooLocalOnlyMessage() }, { status: 403 });
  }

  const problems = getYahooConfigProblems();
  if (problems.length > 0) {
    return NextResponse.json(
      {
        error: "Yahoo OAuth is not configured yet.",
        details: problems
      },
      { status: 500 }
    );
  }

  const state = createYahooState();
  const redirectUrl = buildYahooAuthorizationUrl(state);
  const { redirectUri } = getYahooConfig();
  const response = NextResponse.redirect(redirectUrl, { status: 302 });

  response.cookies.set({
    name: STATE_COOKIE,
    value: state,
    httpOnly: true,
    sameSite: "lax",
    secure: redirectUri.startsWith("https://"),
    path: "/",
    maxAge: 60 * 10
  });

  return response;
}
