import { getSession } from "./session";

export async function getCurrentUser() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  // Return user data from session (already verified to exist in DB)
  return {
    id: session.userId,
    githubId: session.githubId,
    username: session.username,
    email: session.email,
    name: session.name,
    image: session.image,
  };
}

export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Authentication required");
  }

  return user;
}
