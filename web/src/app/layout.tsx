import type { Metadata } from "next";
import { Fraunces, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CelestialBackground } from "@/components/CelestialBackground";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ESO | Cyber-Mystik-Plattform",
  description: "Dein Spiegel aus Sternen, Karten und KI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${fraunces.variable} ${inter.variable} ${geistMono.variable}`}>
      <body className="antialiased min-h-screen flex flex-col selection:bg-gold/30 selection:text-gold">
        <CelestialBackground />
        <div className="absolute top-0 right-0 p-4 sm:p-6 z-50">
          <UserAuth />
        </div>
        <main className="flex-1 flex flex-col relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
