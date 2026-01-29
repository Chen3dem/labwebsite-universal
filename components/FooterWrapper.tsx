"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

interface FooterWrapperProps {
    siteSettings?: any;
}

export default function FooterWrapper({ siteSettings }: FooterWrapperProps) {
    const pathname = usePathname();

    // Hide Footer on Sanity Studio
    if (pathname?.startsWith('/studio')) return null;



    return <Footer siteSettings={siteSettings} />;
}
