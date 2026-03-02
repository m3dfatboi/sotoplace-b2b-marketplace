import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Sotoplace - B2B Маркетплейс",
  description: "Современная B2B платформа для бизнеса",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-gray-50">
            <Sidebar />
            <Header />
            <main className="ml-60 mt-16 transition-all duration-300">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
