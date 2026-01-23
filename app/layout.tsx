import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google"; // Playfair Display is serif.
import Navbar from "@/components/Navbar";
import FooterWrapper from "@/components/FooterWrapper";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "CUI Lab",
  description: "Academic Research Lab",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} ${playfair.variable} font-sans antialiased bg-white text-slate-900`}
        suppressHydrationWarning
      >
        <Navbar />
        {children}
        <FooterWrapper />
      </body>
    </html>
  );
}