import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { VisualEditsMessenger } from "orchids-visual-edits";
import { WhatsAppWidget } from "@/components/WhatsAppWidget";
import { TrackerProvider } from "@/components/TrackerProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://testunilatino.algorithmus.io";

export const metadata: Metadata = {
  title: "Test Vocacional Gratis | Descubre qué carrera estudiar | Universidad Latino Mérida",
  description: "¿No sabes qué estudiar? Haz nuestro test vocacional gratis con IA y descubre tu carrera ideal en Mérida. Recibe tu dictamen personalizado + opciones de beca por WhatsApp.",
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: "Test Vocacional Gratis | Universidad Latino Mérida",
    description: "Descubre qué carrera estudiar con nuestro test vocacional con IA. Orientación vocacional personalizada en 5 minutos.",
    url: BASE_URL,
    siteName: "Universidad Latino",
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Test Vocacional Gratis | Descubre qué carrera estudiar | Universidad Latino",
    description: "¿No sabes qué estudiar? Haz el test vocacional gratis con IA y descubre tu carrera ideal en Mérida.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-MX">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <TrackerProvider>
            {children}
          </TrackerProvider>
          <WhatsAppWidget />
          <VisualEditsMessenger />
        </body>
    </html>
  );
}
