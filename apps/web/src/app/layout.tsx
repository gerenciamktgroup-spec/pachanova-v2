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
  keywords: ["tokenización", "inmobiliaria", "bienes raíces", "Perú", "inversión", "blockchain", "RWA", "fideicomiso"],
  openGraph: {
    title: "PachaNova — Inversión Inmobiliaria Tokenizada",
    description: "El primer fideicomiso inmobiliario tokenizado de Perú. Desde $10. Respaldado por ley.",
    url: "https://pachanova.com",
    siteName: "PachaNova",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PachaNova - Tierra real. Valor real. Acceso real.",
      },
    ],
    locale: "es_PE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PachaNova — Inversión Inmobiliaria Tokenizada",
    description: "El primer fideicomiso inmobiliario tokenizado de Perú. Inversión segura con respaldo legal y tecnología blockchain.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.variable} ${dmSans.variable} antialiased bg-[#0a111f] text-white`}
      >
        {children}
      </body>
    </html>
  );
}
