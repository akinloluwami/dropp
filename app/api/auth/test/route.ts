import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    console.log("Test API called");

    // Check cookies from request
    const requestCookies = request.cookies.getAll();
    console.log("Request cookies:", requestCookies);

    // Check cookies from cookieStore
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("dropp-auth-token");
    console.log("CookieStore session cookie:", sessionCookie);

    // Check all cookies from cookieStore
    const allCookies = cookieStore.getAll();
    console.log("CookieStore all cookies:", allCookies);

    return NextResponse.json({
      requestCookies,
      cookieStoreSession: sessionCookie,
      allCookieStoreCookies: allCookies,
    });
  } catch (error) {
    console.error("Test API error:", error);
    return NextResponse.json({ error: "Test failed" }, { status: 500 });
  }
}
