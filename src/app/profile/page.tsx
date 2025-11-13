"use client";

import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">Profile</h1>
          <p className="mt-2 text-gray-400">Manage your account settings</p>
        </div>

        <div className="space-y-6">
          {/* Profile Card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
            <div className="flex items-center space-x-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-2xl font-bold text-white">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white">
                  {user.displayName || "User"}
                </h2>
                <p className="mt-1 text-gray-400">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
            <h3 className="mb-6 text-xl font-bold text-white">Account Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400">Email Address</label>
                <p className="mt-1 text-white">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">User ID</label>
                <p className="mt-1 font-mono text-sm text-gray-300">{user.uid}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Account Created</label>
                <p className="mt-1 text-white">
                  {user.metadata.creationTime
                    ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Unknown"}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
            <h3 className="mb-6 text-xl font-bold text-white">Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => router.push("/cards")}
                className="w-full rounded-lg border border-purple-500/50 bg-purple-500/10 px-6 py-3 text-left text-white transition-all hover:bg-purple-500/20"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">My Cards</p>
                    <p className="text-sm text-gray-400">View and manage your cards</p>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </button>

              <button
                onClick={handleSignOut}
                className="w-full rounded-lg border border-red-500/50 bg-red-500/10 px-6 py-3 text-left text-white transition-all hover:bg-red-500/20"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Sign Out</p>
                    <p className="text-sm text-gray-400">Sign out of your account</p>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
