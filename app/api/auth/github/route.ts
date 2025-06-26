import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/server/notdb";
import { createSession, setSessionCookie } from "@/lib/server/session";

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const REDIRECT_URI = process.env.NEXTAUTH_URL || "http://localhost:3050";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(`${REDIRECT_URI}/login?error=${error}`);
  }

  if (!code) {
    // Initial OAuth request - redirect to GitHub
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}/api/auth/github&scope=user:email`;
    return NextResponse.redirect(githubAuthUrl);
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: `${REDIRECT_URI}/api/auth/github`,
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return NextResponse.redirect(
        `${REDIRECT_URI}/login?error=${tokenData.error_description}`
      );
    }

    const accessToken = tokenData.access_token;

    // Get user data from GitHub
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    const userData = await userResponse.json();

    // Get user email
    const emailResponse = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    const emails = await emailResponse.json();
    const primaryEmail =
      emails.find((email: any) => email.primary)?.email || userData.email;

    // Check if user exists in database
    const existingUsers = await db.users.find({
      filter: {
        githubId: userData.id.toString(),
      },
    });

    let user: any;

    if (existingUsers.length > 0) {
      user = existingUsers[0];
    } else {
      // Create new user
      user = await db.users.insert({
        name: userData.name || userData.login,
        email: primaryEmail,
        username: userData.login,
        githubId: userData.id.toString(),
        image: userData.avatar_url,
      });
    }

    // Create session with minimal data
    console.log("Creating session for user:", user._id);
    const sessionToken = await createSession({
      userId: user._id,
      githubId: user.githubId,
      username: user.username,
      email: user.email,
      name: user.name,
      image: user.image,
    });
    console.log("Session token created:", sessionToken);

    // Set session cookie
    console.log("Setting session cookie");
    await setSessionCookie(sessionToken);
    console.log("Session cookie set, redirecting to dashboard");

    return NextResponse.redirect(`${REDIRECT_URI}/dashboard`);
  } catch (error) {
    console.error("GitHub OAuth error:", error);
    return NextResponse.redirect(
      `${REDIRECT_URI}/login?error=Authentication failed`
    );
  }
}
