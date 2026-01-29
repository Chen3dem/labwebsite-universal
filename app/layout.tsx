import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import Navbar from "@/components/Navbar";
import FooterWrapper from "@/components/FooterWrapper";
import { ToastContainer } from "@/components/Toast";
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
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${montserrat.variable} ${playfair.variable} font-sans antialiased bg-white text-slate-900`}
          suppressHydrationWarning
        >
          <Navbar />
          {children}
          <FooterWrapper />
          <ToastContainer />
        </body>
      </html>
    </ClerkProvider>
  );
}