import { cookies } from "next/headers";
import { db } from "./notdb";
import { randomBytes } from "crypto";

const SESSION_NAME = "dropp-auth-token";

export interface SessionData {
  userId: string;
  githubId: string;
  username: string;
  email: string;
  name: string;
  image: string;
}

export async function createSession(data: SessionData) {
  const token = randomBytes(32).toString("hex");

  const expiresAt = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  ).toISOString();

  await db.sessions.insert({
    token,
    user_id: data.userId,
    expires_at: expiresAt,
  });

  return token;
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_NAME)?.value;

  if (!sessionToken) {
    console.log("No session token found in cookies");
    return null;
  }

  try {
    const sessions = await db.sessions.find({
      filter: {
        token: sessionToken,
      },
    });

    if (sessions.length === 0) {
      console.log("No session found in database for token:", sessionToken);
      return null;
    }

    const session = sessions[0];
    console.log("Found session:", {
      token: sessionToken,
      user_id: session.user_id,
    });

    const now = new Date();
    const expiresAt = new Date(session.expires_at);

    if (now > expiresAt) {
      console.log("Session expired, deleting");

      await deleteSession(sessionToken);
      return null;
    }

    const users = await db.users.find({
      filter: {
        _id: session.user_id,
      },
    });

    console.log(
      "Looking for user with _id:",
      session.user_id,
      "Found users:",
      users.length
    );

    if (users.length === 0) {
      console.log("No user found for _id:", session.user_id);

      await deleteSession(sessionToken);
      return null;
    }

    const user = users[0];
    console.log("Found user:", user);

    return {
      userId: user._id,
      githubId: user.githubId,
      username: user.username,
      email: user.email,
      name: user.name,
      image: user.image,
    };
  } catch (error) {
    console.error("Session verification failed:", error);
    return null;
  }
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  console.log("Setting session cookie:", token);
  cookieStore.set(SESSION_NAME, token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  console.log("Session cookie set successfully");
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_NAME, "", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}

export async function deleteSession(token: string) {
  try {
    const sessions = await db.sessions.find({
      filter: {
        token,
      },
    });

    if (sessions.length > 0) {
      await db.sessions.delete(sessions[0].token);
    }
  } catch (error) {
    console.error("Error deleting session:", error);
  }
}

export async function updateSession(data: Partial<SessionData>) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_NAME)?.value;

  if (!sessionToken) {
    return null;
  }

  try {
    const sessions = await db.sessions.find({
      filter: {
        token: sessionToken,
      },
    });

    if (sessions.length === 0) {
      return null;
    }

    await db.sessions.delete(sessions[0].token);

    const users = await db.users.find({
      filter: {
        _id: sessions[0].user_id,
      },
    });

    const currentUser = users[0] || {};

    const newToken = await createSession({
      userId: data.userId || sessions[0].user_id,
      githubId: data.githubId || currentUser.githubId || "",
      username: data.username || currentUser.username || "",
      email: data.email || currentUser.email || "",
      name: data.name || currentUser.name || "",
      image: data.image || currentUser.image || "",
    });

    await setSessionCookie(newToken);

    return await getSession();
  } catch (error) {
    console.error("Error updating session:", error);
    return null;
  }
}

export async function cleanupExpiredSessions() {
  try {
    const now = new Date().toISOString();

    const allSessions = await db.sessions.find();

    for (const session of allSessions) {
      const expiresAt = new Date(session.expires_at);
      const nowDate = new Date();

      if (nowDate > expiresAt) {
        await db.sessions.delete(session.token);
      }
    }

    console.log(`Cleaned up expired sessions`);
  } catch (error) {
    console.error("Error cleaning up expired sessions:", error);
  }
}
