import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";
import { DemoBanner } from "@/components/DemoBanner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PachaNova — Inversión Inmobiliaria Tokenizada",
  description: "Plataforma de inversión inmobiliaria tokenizada con respaldo fiduciario. Adquiere participaciones digitales sobre activos reales.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.variable} ${dmSans.variable} antialiased`}
      >
        <DemoBanner />
        {children}
      </body>
    </html>
  );
}
