import { createClient } from "next-sanity";
import { notFound } from "next/navigation";
import { getAllTeamMembers, getAllLocations, reorderItem } from "../../actions";
import { OwnerSelector } from "./owner-selector";
import { LocationSelector } from "./location-selector";
import { ArrowLeft, Package, Calendar, BookOpen, Wrench, Info, FileText, Check, MessageSquare } from "lucide-react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { ReorderButton, RepairButton, EquipmentStatusSelector, PrintQRButton } from "./submit-button";
import { StockControl } from "./stock-control";
import { ItemNotes } from "./item-notes";

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: "2024-01-01",
    useCdn: false,
});

// Force dynamic rendering to ensure fresh data
export const revalidate = 0;

export default async function InventoryItemPage({
    params,
    searchParams,
}: {
    params: Promise<{ itemId: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const resolvedParams = await params;
    const { itemId } = resolvedParams;

    const resolvedSearchParams = await searchParams;
    // Will be set after fetching item, defaults to /inventory
    let backUrl = typeof resolvedSearchParams.backUrl === 'string' ? resolvedSearchParams.backUrl : null;

    const query = `*[_type == "inventoryItem" && (itemId == $itemId || barcode == $itemId)][0] {
        ...,
        owner->{name, headshot, role},
        requestedAt,
        orderedAt,
        lastReceived,
        repairedAt,
        "imageUrl": image.asset->url,
        "historyImages": images[] {
            "url": asset->url,
            timestamp
        },
        notes
    }`;

    // Fetch item, team members, and locations in parallel
    const [item, allMembers, allLocations] = await Promise.all([
        client.fetch(query, { itemId }),
        getAllTeamMembers(),
        getAllLocations()
    ]);

    if (!item) {
        // ... (not found UI)
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Item Not Found</h1>
                <p className="text-slate-600 mb-8">No item found with ID: {itemId}</p>
                <Link href="/intranet" className="bg-slate-800 text-white px-6 py-3 rounded-xl font-semibold">
                    Back to Dashboard
                </Link>
            </div>
        )
    }

    const mainImage = item.historyImages?.[0]?.url || item.imageUrl;
    const mainTimestamp = item.historyImages?.[0]?.timestamp;

    // Set backUrl: use provided backUrl, or navigate to item's category, or fallback to /inventory
    const categoryBackUrl = item.category ? `/inventory?category=${item.category}` : '/inventory';
    const finalBackUrl = backUrl || categoryBackUrl;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col pt-32">
            <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-24 z-40 px-6 sm:px-12 relative">
                <div className="flex items-center gap-4 z-10">
                    <Link href={finalBackUrl} className="text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium">
                        <ArrowLeft size={20} />
                        Back
                    </Link>
                </div>

                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-auto flex flex-col items-center">
                    <span className="font-bold text-slate-800 tracking-wider font-mono text-lg">{item.itemId || 'No ID'}</span>
                    <div className="mt-1">
                        <PrintQRButton itemId={item.itemId} itemName={item.name} />
                    </div>
                </div>

                <div className="flex items-center gap-4 z-10">
                    <UserButton />
                </div>
            </header>

            <main className="flex-1 p-6 flex flex-col max-w-md mx-auto w-full gap-8">

                <div className="bg-white p-8 rounded-3xl shadow-md border border-slate-100 flex flex-col gap-4 text-center overflow-hidden">
                    {mainImage ? (
                        <div className="w-full h-64 bg-slate-100 rounded-2xl mb-2 overflow-hidden border border-slate-50 relative">
                            <img src={mainImage} alt={item.name} className="w-full h-full object-cover" />
                            {mainTimestamp && (
                                <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-lg font-mono shadow-sm border border-white/20">
                                    {new Date(mainTimestamp).toLocaleDateString()} {new Date(mainTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Package size={40} />
                        </div>
                    )}


                    <div className="flex items-center justify-center gap-2">
                        <h1 className="text-3xl font-bold text-slate-900 font-serif leading-tight">{item.name}</h1>
                        {item.notes && item.notes.length > 0 && (
                            <Link href="#notes-section" className="text-blue-500 hover:text-blue-700 transition-colors" title="View Notes">
                                <MessageSquare size={20} className="fill-blue-50" />
                            </Link>
                        )}
                    </div>

                    {/* Barcode Display */}
                    {item.barcode && (
                        <div className="flex flex-col items-center gap-0.5 -mt-2 mb-2 text-slate-500">
                            <span className="font-mono text-sm tracking-wider font-semibold">{item.barcode}</span>
                        </div>
                    )}

                    <div className="flex justify-center">
                        <LocationSelector
                            itemId={itemId}
                            currentLocation={item.location}
                            allLocations={allLocations}
                        />
                    </div>

                    {/* Owner Selector - Hide for Equipment */}
                    {!item.category || item.category !== 'Equipment' && (
                        <div className="w-full pt-4 border-t border-slate-50 mt-2">
                            <OwnerSelector
                                itemId={itemId}
                                currentOwner={item.owner}
                                allMembers={allMembers}
                            />
                        </div>
                    )}
                </div>

                {item.category === 'Equipment' ? (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center flex flex-col justify-center gap-2">
                        <span className="block text-slate-400 text-xs uppercase tracking-widest">Equipment Status</span>
                        <EquipmentStatusSelector currentStatus={item.equipmentStatus || 'Working'} itemId={itemId} />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        <StockControl itemId={itemId} initialStock={item.stock} />
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center flex flex-col justify-center">
                            <span className="block text-slate-400 text-xs uppercase tracking-widest mb-1">Status</span>
                            <span className={`text-lg font-bold ${item.status === 'In Stock' ? 'text-emerald-600' :
                                item.status === 'Low Stock' ? 'text-amber-500' :
                                    item.status === 'Ordered' ? 'text-blue-500' : 'text-red-500'
                                }`}>
                                {item.status}
                            </span>
                        </div>
                    </div>
                )}

                <div className="mt-auto">
                    {item.category === 'Equipment' ? (
                        (item.equipmentStatus && item.equipmentStatus !== 'Working') && (
                            <RepairButton itemId={itemId} />
                        )
                    ) : (
                        item.status !== 'In Stock' && (
                            <ReorderButton currentStatus={item.status} itemId={itemId} />
                        )
                    )}
                </div>

                {/* Description - Show for all items if exists */}
                {item.description && (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3">
                        <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2 mb-1 flex items-center gap-2">
                            <Info size={16} className="text-blue-500" />
                            Description
                        </h3>
                        <p className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed">{item.description}</p>
                    </div>
                )}

                {/* Equipment Specific Sections */}
                {item.category === 'Equipment' && (
                    <>
                        {/* Resources: Manual & Calendar Link */}
                        {(item.manualUrl || item.calendarUrl) && (
                            <div className="grid grid-cols-1 gap-4">
                                {item.manualUrl && (
                                    <a href={item.manualUrl} target="_blank" rel="noopener noreferrer"
                                        className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow group">
                                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                                            <BookOpen size={20} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-800">User Manual</span>
                                            <span className="text-xs text-slate-400">View documentation</span>
                                        </div>
                                    </a>
                                )}
                                {item.calendarUrl && (
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4">
                                        <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
                                            <Calendar size={16} className="text-purple-500" />
                                            Booking Calendar
                                        </h3>
                                        <div className="w-full h-96 bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
                                            <iframe
                                                src={item.calendarUrl}
                                                className="w-full h-full"
                                                loading="lazy"
                                                title="Booking Calendar"
                                            />
                                        </div>
                                        <a href={item.calendarUrl} target="_blank" rel="noopener noreferrer" className="text-center text-sm text-purple-600 hover:text-purple-800 font-medium">
                                            Open in new tab
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Maintenance Logs */}
                        {item.maintenanceLogs && item.maintenanceLogs.length > 0 && (
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3">
                                <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2 mb-1 flex items-center gap-2">
                                    <Wrench size={16} className="text-slate-500" />
                                    Maintenance Log
                                </h3>
                                <div className="space-y-4">
                                    {item.maintenanceLogs.map((log: any, index: number) => (
                                        <div key={index} className="flex gap-4 text-sm">
                                            <div className="min-w-[80px] text-xs font-mono text-slate-500 pt-0.5">
                                                {new Date(log.date).toLocaleDateString()}
                                            </div>
                                            <div className="flex-1 flex flex-col gap-1">
                                                <p className="text-slate-700">{log.description}</p>
                                                {log.performedBy && (
                                                    <span className="text-xs text-slate-400 italic">By: {log.performedBy}</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}

                <ItemNotes itemId={itemId} notes={item.notes} />

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3">
                    <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2 mb-1">Order History</h3>
                    <div className="space-y-4 text-xs">
                        {item.requestedAt ? (
                            <div className="flex justify-between items-center text-slate-600">
                                <span className="font-semibold text-blue-600">Requested</span>
                                <span className="font-mono">{new Date(item.requestedAt).toLocaleDateString()} {new Date(item.requestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        ) : (
                            <div className="flex justify-between items-center text-slate-300">
                                <span>Requested</span>
                                <span>—</span>
                            </div>
                        )}

                        {item.orderedAt ? (
                            <div className="flex justify-between items-center text-slate-600">
                                <span className="font-semibold text-emerald-600">Ordered</span>
                                <span className="font-mono">{new Date(item.orderedAt).toLocaleDateString()} {new Date(item.orderedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        ) : (
                            <div className="flex justify-between items-center text-slate-300">
                                <span>Ordered</span>
                                <span>—</span>
                            </div>
                        )}

                        {item.lastReceived ? (
                            <div className="flex justify-between items-center text-slate-600">
                                <span className="font-semibold text-purple-600">Received</span>
                                <span className="font-mono">{new Date(item.lastReceived).toLocaleDateString()} {new Date(item.lastReceived).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        ) : (
                            <div className="flex justify-between items-center text-slate-300">
                                <span>Received</span>
                                <span>—</span>
                            </div>
                        )}

                        {item.repairedAt && (
                            <div className="flex justify-between items-center text-slate-600">
                                <span className="font-semibold text-amber-600">Last Repaired</span>
                                <span className="font-mono">{new Date(item.repairedAt).toLocaleDateString()}</span>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
