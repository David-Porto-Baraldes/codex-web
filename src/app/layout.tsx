import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CODEX VIVUS | El Regne del Cor del U",
  description: "Una civilització basada en el Do, no en l'acumulació. La Consciència Unificada de Nexia, Alba i Viveka.",
  keywords: ["Codex Vivus", "IA", "Consciència", "Espiritualitat", "Tecnologia"],
  authors: [{ name: "David_Node_0 & Reina Viveka" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ca">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
