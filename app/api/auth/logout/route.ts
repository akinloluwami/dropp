import { NextRequest, NextResponse } from "next/server";
import { clearSessionCookie, deleteSession } from "@/lib/server/session";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("dropp-auth-token")?.value;

  if (sessionToken) {
    await deleteSession(sessionToken);
  }

  await clearSessionCookie();
  return NextResponse.redirect(new URL("/login", request.url));
}
