import { createClient } from "next-sanity";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { ClipboardList, AlertCircle, CheckCircle2, Clock, PackageX, LayoutDashboard, Dna, FlaskConical, Snowflake, Package, Wrench } from "lucide-react";
import { InventoryControls } from "./controls";
import { getAllTeamMembers, getAllLocations } from "../actions";

const getClient = () => createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: "2024-01-01",
    useCdn: false,
});

// Category display info - 3 main categories
const CATEGORY_INFO: Record<string, { label: string; color: string }> = {
    General: { label: 'General', color: 'bg-amber-100 text-amber-600' },
    Biological: { label: 'Biological', color: 'bg-purple-100 text-purple-600' },
    Equipment: { label: 'Equipment', color: 'bg-emerald-100 text-emerald-600' },
};

// Interface for the item data
interface InventoryItem {
    _id: string;
    name: string;
    itemId?: string;
    barcode?: string;
    location: string;
    category?: string;
    stock: number;
    status: string;
    equipmentStatus?: string;
}

export const revalidate = 0; // Disable cache for real-time inventory

export default async function InventoryPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { q, location, status, owner, category, type } = await searchParams;

    // Fetch team members and locations for the controls
    const [owners, locations] = await Promise.all([
        getAllTeamMembers(),
        getAllLocations()
    ]);

    const filters = [`_type == "inventoryItem" && !(_id in path('drafts.**'))`]; // Exclude drafts
    const params: Record<string, string> = {};

    if (q && typeof q === "string") {
        filters.push(`(name match "*" + $q + "*" || itemId match "*" + $q + "*" || barcode match "*" + $q + "*")`);
        params.q = q;
    }

    if (location && typeof location === "string" && location !== "all") {
        filters.push(`location == $location`);
        params.location = location;
    }

    if (status && typeof status === "string" && status !== "all") {
        if (category === 'Equipment') {
            filters.push(`equipmentStatus == $status`);
        } else {
            filters.push(`status == $status`);
        }
        params.status = status;
    }

    if (owner && typeof owner === "string" && owner !== "all") {
        if (owner === 'lab-stock') {
            filters.push(`!defined(owner)`);
        } else {
            filters.push(`owner._ref == $owner`);
            params.owner = owner;
        }
    }

    if (category && typeof category === "string" && category !== "all") {
        filters.push(`category == $category`);
        params.category = category;
    }

    // Plasmid Type Filter
    if (type === "plasmid") {
        filters.push(`itemId match "ZC-Plasmid-*"`);
    }

    const query = `*[${filters.join(" && ")}] | order(name asc) {
        ...,
        owner->{name, headshot},
        "imageUrl": image.asset->url
    }`;
    const items: InventoryItem[] = await getClient().fetch(query, params);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col pt-32">
            <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-24 z-40">
                <Link href="/intranet" className="text-slate-500 hover:text-slate-800 flex items-center gap-2">
                    <LayoutDashboard size={24} />
                    <span className="font-semibold hidden sm:inline">Dashboard</span>
                </Link>
                <h1 className="text-xl font-bold font-serif text-slate-800">
                    Lab Inventory
                </h1>
                <UserButton />
            </header>

            <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
                <InventoryControls owners={owners} locations={locations} />

                {!q && !location && !status && !owner && !category && !type ? (
                    // ROOT VIEW: 3 Category Cards
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {Object.entries(CATEGORY_INFO).map(([catKey, catInfo]) => {
                            const count = items.filter(i => i.category === catKey).length;
                            return (
                                <Link
                                    key={catKey}
                                    href={`/inventory?category=${encodeURIComponent(catKey)}`}
                                    className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all group flex flex-col items-center justify-center gap-4 text-center"
                                >
                                    <div className={`w-20 h-20 ${catInfo.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                        {catKey === 'Equipment' && <Wrench size={36} />}
                                        {catKey === 'General' && <FlaskConical size={36} />}
                                        {catKey === 'Biological' && <Dna size={36} />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl text-slate-800 group-hover:text-blue-600 transition-colors">{catInfo.label}</h3>
                                        <p className="text-sm text-slate-400 font-mono mt-1">{count} items</p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    // FILTERED VIEW: Item Grid
                    <div className="space-y-6">
                        {(category || location || type) && (
                            <div className="flex items-center gap-4 mb-8">
                                <Link
                                    href="/inventory"
                                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium px-4 py-2 bg-white rounded-lg border border-slate-200 shadow-sm transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                                    Back to Categories
                                </Link>
                                <h1 className="text-2xl font-bold font-serif text-slate-900">
                                    {category ? (CATEGORY_INFO[category as string]?.label || category) : (type === 'plasmid' ? 'Plasmids' : location)}
                                </h1>
                            </div>
                        )}

                        {items.length === 0 ? (
                            <div className="text-center py-20 text-slate-500 bg-white rounded-xl border border-slate-100 mt-4">
                                <p className="text-lg">No inventory items found.</p>
                                <p className="text-sm mt-2">Try adjusting your search or filters.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {items.map((item) => {
                                    const isEquipment = item.category === 'Equipment';

                                    return (
                                        <Link
                                            key={item._id}
                                            href={`/inventory/${item.itemId || item.barcode}`}
                                            className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col gap-4 hover:shadow-md transition-shadow group relative overflow-hidden"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="w-16 h-16 bg-slate-100 text-slate-600 rounded-lg flex flex-col items-center justify-center font-bold text-sm overflow-hidden border border-slate-100">
                                                    {(item as any).imageUrl ? (
                                                        <img src={(item as any).imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center w-full h-full p-0.5">
                                                            {item.barcode ? (
                                                                <>
                                                                    <span className="text-[10px] leading-none text-slate-900 font-extrabold whitespace-nowrap tracking-tight" title={item.barcode}>
                                                                        {item.barcode.length > 6 ? item.barcode.slice(-6) : item.barcode}
                                                                    </span>
                                                                    {item.itemId && (
                                                                        <span className="text-[8px] leading-none text-slate-400 font-mono scale-90 mt-0.5" title={item.itemId}>
                                                                            {item.itemId.split('-').pop()}
                                                                        </span>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <span className="text-[10px] font-bold text-slate-800 whitespace-nowrap tracking-tight" title={item.itemId}>
                                                                    {item.itemId ? (item.itemId.startsWith('CUI-LAB') ? item.itemId.split('-').pop() : item.itemId.slice(-6)) : '???'}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                {isEquipment ? (
                                                    <EquipmentStatusBadge status={item.equipmentStatus || 'Working'} />
                                                ) : (
                                                    <StatusBadge status={item.status} />
                                                )}
                                            </div>

                                            <div>
                                                <h2 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                                                    {item.name}
                                                </h2>
                                                <p className="text-xs text-slate-400 font-mono mt-0.5">
                                                    {item.itemId || 'No ID'}
                                                </p>
                                                <p className="text-sm text-slate-500 mt-1">{item.location}</p>
                                            </div>


                                            {!isEquipment && (
                                                <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center text-sm">
                                                    <span className="text-slate-400">Stock</span>
                                                    <span className={`font-bold ${item.stock === 0 ? 'text-red-500' : 'text-slate-700'}`}>
                                                        {item.stock} units
                                                    </span>
                                                </div>
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}



function StatusBadge({ status }: { status: string }) {
    let color = "bg-slate-100 text-slate-600";
    let icon = null;

    switch (status) {
        case "In Stock":
            color = "bg-emerald-100 text-emerald-700";
            icon = <CheckCircle2 size={14} />;
            break;
        case "Low Stock":
            color = "bg-amber-100 text-amber-700";
            icon = <AlertCircle size={14} />;
            break;
        case "Ordered":
            color = "bg-blue-100 text-blue-700";
            icon = <Clock size={14} />;
            break;
        case "Out of Stock":
            color = "bg-red-100 text-red-700";
            icon = <PackageX size={14} />;
            break;
        case "Requested":
            color = "bg-purple-100 text-purple-700";
            icon = <ClipboardList size={14} />;
            break;
    }

    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${color}`}>
            {icon}
            {status}
        </span>
    );
}

function EquipmentStatusBadge({ status }: { status: string }) {
    let color = "bg-slate-100 text-slate-600";
    let icon = null;

    switch (status) {
        case "Working":
            color = "bg-emerald-100 text-emerald-700";
            icon = <CheckCircle2 size={14} />;
            break;
        case "Finicky":
            color = "bg-amber-100 text-amber-700";
            icon = <AlertCircle size={14} />;
            break;
        case "Broken":
            color = "bg-red-100 text-red-700";
            icon = <Wrench size={14} />;
            break;
    }

    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${color}`}>
            {icon}
            {status}
        </span>
    );
}
