import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import { accounts } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

interface GoogleCalendarEvent {
  id: string;
  summary?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
  attendees?: { email?: string; displayName?: string; self?: boolean }[];
}

// GET /api/calendar — Fetch upcoming Google Calendar events
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get the Google account tokens from the database
  const [account] = await getDb()
    .select({
      access_token: accounts.access_token,
      refresh_token: accounts.refresh_token,
      expires_at: accounts.expires_at,
    })
    .from(accounts)
    .where(
      and(
        eq(accounts.userId, session.user.id),
        eq(accounts.provider, "google")
      )
    );

  if (!account?.access_token) {
    return NextResponse.json(
      { error: "No Google account connected", events: [] },
      { status: 200 }
    );
  }

  // Check if token is expired and refresh if needed
  let accessToken = account.access_token;
  const now = Math.floor(Date.now() / 1000);

  if (account.expires_at && account.expires_at < now && account.refresh_token) {
    try {
      const refreshRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: process.env.AUTH_GOOGLE_ID!,
          client_secret: process.env.AUTH_GOOGLE_SECRET!,
          grant_type: "refresh_token",
          refresh_token: account.refresh_token,
        }),
      });

      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        accessToken = refreshData.access_token;

        // Update the stored token
        await getDb()
          .update(accounts)
          .set({
            access_token: refreshData.access_token,
            expires_at: Math.floor(Date.now() / 1000) + refreshData.expires_in,
          })
          .where(
            and(
              eq(accounts.userId, session.user.id),
              eq(accounts.provider, "google")
            )
          );
      }
    } catch (err) {
      console.error("Token refresh failed:", err);
    }
  }

  // Fetch upcoming events (next 14 days, max 20 events)
  const timeMin = new Date().toISOString();
  const timeMax = new Date(
    Date.now() + 14 * 24 * 60 * 60 * 1000
  ).toISOString();

  try {
    const calRes = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
        new URLSearchParams({
          timeMin,
          timeMax,
          maxResults: "20",
          singleEvents: "true",
          orderBy: "startTime",
        }),
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!calRes.ok) {
      const errText = await calRes.text();
      console.error("Calendar API error:", calRes.status, errText);
      return NextResponse.json({ events: [], error: "calendar_api_error" });
    }

    const calData = await calRes.json();
    const events = (calData.items || []).map((e: GoogleCalendarEvent) => ({
      id: e.id,
      title: e.summary || "(No title)",
      start: e.start?.dateTime || e.start?.date || "",
      end: e.end?.dateTime || e.end?.date || "",
      attendees: (e.attendees || [])
        .filter((a) => !a.self)
        .map((a) => a.displayName || a.email || "")
        .filter(Boolean),
    }));

    return NextResponse.json({ events });
  } catch (err) {
    console.error("Calendar fetch error:", err);
    return NextResponse.json({ events: [], error: "fetch_failed" });
  }
}
