"use client";

import { AuthProvider } from "@/lib/auth";
import { Header } from "@/components/Header";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <Header />
        <main>{children}</main>
      </div>
    </AuthProvider>
  );
}
