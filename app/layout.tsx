import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Preloader } from "@/components/layout/Preloader";
import { StoreHydrator } from "@/components/layout/StoreHydrator";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AURA ONE — Beyond Sound. Beyond Reality.",
  description:
    "AURA ONE is a fictional luxury wireless headphone concept. Explore a cinematic 3D product experience built around silence, aluminium and adaptive acoustics.",
  applicationName: "AURA Audio",
  authors: [{ name: "AURA Audio Concept Studio" }],
  keywords: [
    "AURA Audio",
    "AURA ONE",
    "concept headphones",
    "3D product experience",
    "creative development",
  ],
  openGraph: {
    title: "AURA ONE — Beyond Sound. Beyond Reality.",
    description:
      "A fictional luxury headphone concept. An immersive, cinematic product experience.",
    type: "website",
    siteName: "AURA Audio",
  },
  twitter: {
    card: "summary_large_image",
    title: "AURA ONE — Beyond Sound. Beyond Reality.",
    description:
      "A fictional luxury headphone concept. An immersive, cinematic product experience.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#09090B",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} bg-ink font-body text-chalk antialiased`}
      >
        <a
          href="#main"
          className="sr-only z-[120] rounded-full bg-chalk px-5 py-3 text-sm font-semibold text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <StoreHydrator />
        <Preloader />
        <div className="grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
