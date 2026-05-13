import { NextRequest, NextResponse } from "next/server";
import {
  exchangeYahooCodeForToken,
  getYahooLocalOnlyMessage,
  isLocalYahooOAuthAllowed,
  maskSecret,
  renderYahooResultPage,
  resolveYahooLeague,
  upsertLocalEnvValues
} from "@/lib/fantasy-yahoo";

const STATE_COOKIE = "yahoo_fantasy_oauth_state";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function htmlResponse(html: string, status = 200) {
  return new NextResponse(html, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

export async function GET(request: NextRequest) {
  if (!isLocalYahooOAuthAllowed()) {
    return htmlResponse(
      renderYahooResultPage({
        title: "Local-only route",
        body: getYahooLocalOnlyMessage(),
        success: false
      }),
      403
    );
  }

  const url = new URL(request.url);
  const state = url.searchParams.get("state") ?? "";
  const code = url.searchParams.get("code") ?? "";
  const error = url.searchParams.get("error");
  const errorDescription = url.searchParams.get("error_description");
  const expectedState = request.cookies.get(STATE_COOKIE)?.value ?? "";

  if (error) {
    const response = htmlResponse(
      renderYahooResultPage({
        title: "Yahoo authorization was not completed",
        body: "Yahoo returned an error before the token exchange finished.",
        details: [errorDescription ? `${error}: ${errorDescription}` : error],
        success: false
      }),
      400
    );
    response.cookies.delete(STATE_COOKIE);
    return response;
  }

  if (!code) {
    const response = htmlResponse(
      renderYahooResultPage({
        title: "Missing Yahoo authorization code",
        body: "Yahoo redirected back without an authorization code, so the token exchange could not start.",
        success: false
      }),
      400
    );
    response.cookies.delete(STATE_COOKIE);
    return response;
  }

  if (!state || !expectedState || state !== expectedState) {
    const response = htmlResponse(
      renderYahooResultPage({
        title: "State verification failed",
        body: "The Yahoo OAuth callback did not match the signed local session. Start the flow again from the local app so we can avoid writing the wrong tokens.",
        success: false
      }),
      400
    );
    response.cookies.delete(STATE_COOKIE);
    return response;
  }

  try {
    const token = await exchangeYahooCodeForToken(code);
    const resolvedLeague = await resolveYahooLeague(token.access_token);

    await upsertLocalEnvValues({
      YAHOO_REFRESH_TOKEN: token.refresh_token,
      YAHOO_LEAGUE_KEY: resolvedLeague?.leagueKey
    });

    const response = htmlResponse(
      renderYahooResultPage({
        title: "Yahoo fantasy connection saved locally",
        body: "The OAuth flow completed successfully and the local environment file has been updated. Restart the local server before testing live Yahoo-powered league features so the new values are loaded.",
        details: [
          `Refresh token: ${maskSecret(token.refresh_token)}`,
          `Resolved league key: ${resolvedLeague?.leagueKey ?? "not found"}`,
          `League name: ${resolvedLeague?.leagueName ?? "not returned"}`,
          `League ID: ${resolvedLeague?.leagueId ?? "not returned"}`
        ],
        success: true
      })
    );
    response.cookies.delete(STATE_COOKIE);
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Yahoo OAuth error";
    const response = htmlResponse(
      renderYahooResultPage({
        title: "Yahoo OAuth setup failed",
        body: "The callback reached the local app, but Yahoo did not finish the token or league lookup step cleanly.",
        details: [message],
        success: false
      }),
      500
    );
    response.cookies.delete(STATE_COOKIE);
    return response;
  }
}
