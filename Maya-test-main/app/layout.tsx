import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";

import { Footer } from "@/components/site/footer";
import { FloatingWhatsappButton } from "@/components/site/floating-whatsapp-button";
import { Navbar } from "@/components/site/navbar";
import { AuthProvider } from "@/components/auth/auth-provider";
import { companyContact } from "@/data/site";
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
      "Maya Haven helps clients find a property they can call home within Nairobi and beyond, while offering trusted property consultation, investor support, and management services.",
    areaServed: "Nairobi and beyond",
    telephone: companyContact.whatsappDisplay.replace(/\s+/g, ""),
    email: [companyContact.primaryEmail, companyContact.secondaryEmail]
  };

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <AuthProvider>
          <SavedListingsProvider>
            <CurrencyProvider>
              <Navbar />
              <main>{children}</main>
              <FloatingWhatsappButton />
              <Footer />
            </CurrencyProvider>
          </SavedListingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
