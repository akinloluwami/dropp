import { NextResponse } from "next/server";
import { clearSessionCookie, deleteSession } from "@/lib/server/session";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (sessionToken) {
    await deleteSession(sessionToken);
  }

  await clearSessionCookie();
  return NextResponse.redirect("/login");
}
