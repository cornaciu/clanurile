// app/layout.tsx
import { cookies } from "next/headers"
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Clanurile",
  description: "Un joc de clanuri urban",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body className={`${inter.className} bg-gray-950`}>
        <header className="fixed top left-1/2 -translate-x-1/2 z-50">
        </header>

        <main className="pt-1">
          {children}
        </main>
      </body>
    </html>
  );
}