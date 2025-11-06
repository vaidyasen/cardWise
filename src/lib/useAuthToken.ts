import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";

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
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    ...options.headers,
  };

  return fetch(url, {
    ...options,
    headers,
  });
}
