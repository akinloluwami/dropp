"use client";

import { useEffect, useState } from "react";

export interface User {
  id: string;
  githubId: string;
  username: string;
  email: string;
  name: string;
  image: string;
}

export function useSession() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch("/api/auth/session", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Session check failed:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    checkSession();
  }, []);

  const logout = async () => {
    try {
      await fetch("/api/auth/logout");
      setUser(null);
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return { user, loading, logout };
}

export async function getSession(): Promise<User | null> {
  try {
    const response = await fetch("/api/auth/session", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error("Error fetching session:", error);
    return null;
  }
}
