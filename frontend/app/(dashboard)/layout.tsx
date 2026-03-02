"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Sidebar />
      <Header />
      <main className="ml-60 mt-16 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
