import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";

let csrfToken: string | null = null;

/**
 * Fetches CSRF token from the server
 * Caches the token to avoid redundant requests
 */
async function getCsrfToken(): Promise<string> {
  if (csrfToken) {
    return csrfToken;
  }

  try {
    const response = await fetch("/api/csrf");
    if (!response.ok) {
      throw new Error("Failed to fetch CSRF token");
    }
    const data = await response.json();
    csrfToken = data.token;
    return data.token;
  } catch (error) {
    console.error("Error fetching CSRF token:", error);
    throw error;
  }
}

export function useAuthToken() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const token = await user.getIdToken();
        setToken(token);
      } else {
        setToken(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return token;
}

// Helper function to make authenticated API calls
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Not authenticated");
  }

  const token = await user.getIdToken();
  
  // Add CSRF token for state-changing requests
  const method = options.method?.toUpperCase() || "GET";
  const needsCsrf = ["POST", "PUT", "DELETE", "PATCH"].includes(method);
  
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  
  if (needsCsrf) {
    const csrf = await getCsrfToken();
    headers["x-csrf-token"] = csrf;
  }

  return fetch(url, {
    ...options,
    headers,
  });
}
