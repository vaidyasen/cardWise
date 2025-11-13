"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { auth } from "./firebase";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        // Set auth cookie when user is authenticated
        try {
          const token = await user.getIdToken();
          document.cookie = `auth=${token}; path=/; max-age=3600; SameSite=Strict`;
          
          // Ensure user exists in database (create if not exists)
          try {
            await fetch("/api/users", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });
          } catch (dbError) {
            // Log error but don't block authentication
          }
        } catch (error) {
          // Error getting token - handled silently
        }
      } else {
        setUser(null);
        // Clear auth cookie when user is not authenticated
        document.cookie = `auth=; path=/; max-age=0`;
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Set auth cookie for middleware
      const token = await userCredential.user.getIdToken();
      document.cookie = `auth=${token}; path=/; max-age=3600; SameSite=Strict`;
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Get the Firebase token
      const token = await userCredential.user.getIdToken();
      
      // Set auth cookie for middleware
      document.cookie = `auth=${token}; path=/; max-age=3600; SameSite=Strict`;
      
      // Create user in database
      try {
        const response = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          // Log error but don't block user registration
        }
      } catch (dbError) {
        // User created in Firebase, database sync failed but not critical
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      // Clear auth cookie
      document.cookie = `auth=; path=/; max-age=0`;
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
