import Link from "next/link";
import { Scan, ClipboardList, FlaskConical, LogOut, Box, ShoppingCart, ArrowRight } from "lucide-react";
import { UserButton } from "@clerk/nextjs";


import { ApproveButton } from "./approval-button";

// Sanity Client removed (unused and caused build issues)

export const revalidate = 0; // Ensure fresh data on every load
export const dynamic = 'force-dynamic';

interface PendingItem {
    name: string;
    itemId: string;
    barcode?: string;
    stock: number;
    owner?: { name: string };
    requestedQuantity?: number;
}

export default async function IntranetPage() {
    // Only keeping menu logic
    const menuItems = [
        {
            title: "Ordering",
            icon: <ShoppingCart size={48} />,
            href: "/ordering",
            color: "bg-cyan-600 hover:bg-cyan-700",
        },
        {
            title: "Receiving",
            icon: <Box size={48} />,
            href: "/receiving",
            color: "bg-amber-600 hover:bg-amber-700",
        },
        {
            title: "Protocols",
            icon: <FlaskConical size={48} />,
            href: "/protocols",
            color: "bg-purple-600 hover:bg-purple-700",
        },
        {
            title: "Inventory",
            icon: <ClipboardList size={48} />,
            href: "/inventory",
            color: "bg-emerald-600 hover:bg-emerald-700",
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col pt-32">
            <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-24 z-10 transition-[top] duration-300">
                <h1 className="text-xl font-bold font-serif text-slate-800">
                    Lab Intranet
                </h1>
                <UserButton afterSignOutUrl="/" />
            </header>

            <main className="flex-1 p-6 flex flex-col gap-6 max-w-md mx-auto w-full">
                <div className="grid grid-cols-1 gap-6">
                    {menuItems.map((item) => (
                        <Link
                            key={item.title}
                            href={item.href}
                            className={`${item.color} text-white p-8 rounded-2xl shadow-lg flex flex-col items-center justify-center gap-4 transition-transform active:scale-95 touch-manipulation`}
                        >
                            {item.icon}
                            <span className="text-2xl font-bold">{item.title}</span>
                        </Link>
                    ))}
                </div>


            </main>
        </div>
    );
}
