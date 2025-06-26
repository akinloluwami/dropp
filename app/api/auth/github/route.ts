import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/server/notdb";
import { createSession, setSessionCookie } from "@/lib/server/session";

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const REDIRECT_URI = process.env.APP_URL;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(`${REDIRECT_URI}/auth?error=${error}`);
  }

  if (!code) {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}/api/auth/github&scope=user:email`;
    return NextResponse.redirect(githubAuthUrl);
  }

  try {
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

    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    const userData = await userResponse.json();

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
      // Update user info if changed
      const updatedFields: any = {};
      if (user.name !== (userData.name || userData.login))
        updatedFields.name = userData.name || userData.login;
      if (user.email !== primaryEmail) updatedFields.email = primaryEmail;
      if (user.username !== userData.login)
        updatedFields.username = userData.login;
      if (user.image !== userData.avatar_url)
        updatedFields.image = userData.avatar_url;
      if (Object.keys(updatedFields).length > 0) {
        await db.users.update(user._id, updatedFields);
        user = { ...user, ...updatedFields };
      }
    } else {
      // Check if user exists by email (for account linking)
      const usersByEmail = await db.users.find({
        filter: { email: primaryEmail },
      });
      if (usersByEmail.length > 0) {
        user = usersByEmail[0];
        // Link GitHub ID and update info
        const updatedFields: any = {
          githubId: userData.id.toString(),
          name: userData.name || userData.login,
          username: userData.login,
          image: userData.avatar_url,
        };
        await db.users.update(user._id, updatedFields);
        user = { ...user, ...updatedFields };
      } else {
        user = await db.users.insert({
          name: userData.name || userData.login,
          email: primaryEmail,
          username: userData.login,
          githubId: userData.id.toString(),
          image: userData.avatar_url,
        });
      }
    }

    const sessionToken = await createSession({
      userId: user._id,
      githubId: user.githubId,
      username: user.username,
      email: user.email,
      name: user.name,
      image: user.image,
    });

    await setSessionCookie(sessionToken);

    return NextResponse.redirect(`${REDIRECT_URI}/dashboard/snippets`);
  } catch (error) {
    console.error("GitHub OAuth error:", error);
    return NextResponse.redirect(
      `${REDIRECT_URI}/auth?error=Authentication failed`
    );
  }
}
