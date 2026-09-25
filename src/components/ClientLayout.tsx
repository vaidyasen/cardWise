import { Header } from "@/components/Header";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f3f1e8] text-[#171917]">
      <Header />
      <main>{children}</main>
    </div>
  );
}
