import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";

import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";
import { CurrencyProvider } from "@/hooks/use-currency";
import { SavedListingsProvider } from "@/hooks/use-saved-listings";
import { createMetadata } from "@/lib/metadata";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap"
});

export const metadata: Metadata = createMetadata();

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Maya Haven",
    description:
      "Maya Haven helps clients find a property they can call home within Nairobi and beyond, while offering trusted diaspora property consultation and management services.",
    areaServed: "Nairobi and beyond",
    telephone: "+254720584744"
  };

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <SavedListingsProvider>
          <CurrencyProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </CurrencyProvider>
        </SavedListingsProvider>
      </body>
    </html>
  );
}
