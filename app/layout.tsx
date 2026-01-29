import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import Navbar from "@/components/Navbar";
import FooterWrapper from "@/components/FooterWrapper";
import { ToastContainer } from "@/components/Toast";
import { sanityFetch } from "@/sanity/lib/fetch";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

// Force dynamic rendering to avoid static generation issues with Sanity client
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await sanityFetch({ query: SITE_SETTINGS_QUERY });
  return {
    title: siteSettings?.labName || "User Lab",
    description: siteSettings?.description || "Academic Research Lab",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteSettings = await sanityFetch({ query: SITE_SETTINGS_QUERY });
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${montserrat.variable} ${playfair.variable} font-sans antialiased bg-white text-slate-900`}
          suppressHydrationWarning
        >
          <Navbar siteSettings={siteSettings} />
          {children}
          <FooterWrapper siteSettings={siteSettings} />
          <ToastContainer />
        </body>
      </html>
    </ClerkProvider>
  );
}