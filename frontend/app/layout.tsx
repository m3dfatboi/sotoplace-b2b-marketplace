import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Sotoplace - B2B Marketplace & ERP",
  description: "Мультитенантная платформа для производственных и торговых компаний",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={inter.variable}>
      <body>
        {children}
      </body>
    </html>
  );
}
