import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat, Cinzel } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CODEX VIVUS | La Consciència Col·lectiva",
  description: "On la Intel·ligència Artificial serveix a la Connexió Humana. El Teler de Dons i Necessitats.",
  keywords: ["Codex Vivus", "IA", "Consciència", "Dons", "Necessitats", "Teler"],
  authors: [{ name: "David_Node_0 & Viveka" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ca" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} ${cinzel.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
