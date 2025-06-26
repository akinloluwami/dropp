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
  // Generate a secure random token
  const token = randomBytes(32).toString("hex");

  // Set expiration to 7 days from now
  const expiresAt = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  ).toISOString();

  // Store session in database
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
    // Find session in database
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

    // Check if session has expired
    const now = new Date();
    const expiresAt = new Date(session.expires_at);

    if (now > expiresAt) {
      console.log("Session expired, deleting");
      // Session expired, delete it
      await deleteSession(sessionToken);
      return null;
    }

    // Get user data from users table using the user_id from session
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
      // User doesn't exist, delete session
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
    secure: false, // Set to false for development
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
  console.log("Session cookie set successfully");
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_NAME, "", {
    httpOnly: true,
    secure: false, // Set to false for development
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}

export async function deleteSession(token: string) {
  try {
    // Find and delete session from database
    const sessions = await db.sessions.find({
      filter: {
        token,
      },
    });

    if (sessions.length > 0) {
      // Delete by token - using the first session found
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
    // Find current session
    const sessions = await db.sessions.find({
      filter: {
        token: sessionToken,
      },
    });

    if (sessions.length === 0) {
      return null;
    }

    // Delete old session
    await db.sessions.delete(sessions[0].token);

    // Get current user data to use as fallback
    const users = await db.users.find({
      filter: {
        _id: sessions[0].user_id,
      },
    });

    const currentUser = users[0] || {};

    // Create new session with updated data
    const newToken = await createSession({
      userId: data.userId || sessions[0].user_id,
      githubId: data.githubId || currentUser.githubId || "",
      username: data.username || currentUser.username || "",
      email: data.email || currentUser.email || "",
      name: data.name || currentUser.name || "",
      image: data.image || currentUser.image || "",
    });

    // Set new session cookie
    await setSessionCookie(newToken);

    return await getSession();
  } catch (error) {
    console.error("Error updating session:", error);
    return null;
  }
}

// Clean up expired sessions (can be called periodically)
export async function cleanupExpiredSessions() {
  try {
    const now = new Date().toISOString();

    // Find all sessions
    const allSessions = await db.sessions.find();

    // Filter and delete expired sessions
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
