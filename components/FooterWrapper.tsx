"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function FooterWrapper() {
    const pathname = usePathname();

    // Hide Footer on Sanity Studio
    if (pathname?.startsWith('/studio')) return null;



    return <Footer />;
}
