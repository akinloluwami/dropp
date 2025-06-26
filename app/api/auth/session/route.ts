import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server/auth";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    console.log("Session API called");

    // Use the same cookie access method as getSession
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("dropp-auth-token");
    console.log("Session cookie from cookieStore:", sessionToken);

    const user = await getCurrentUser();
    console.log("getCurrentUser result:", user);

    if (!user) {
      console.log("No user found, returning 401");
      return NextResponse.json({ user: null }, { status: 401 });
    }

    console.log("User found, returning user data");
    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching session:", error);
    return NextResponse.json(
      { error: "Failed to fetch session" },
      { status: 500 }
    );
  }
}
