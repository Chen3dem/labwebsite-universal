"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ClipboardList, ShoppingCart, ArrowRight, ArrowLeft, Search, Camera, Loader2, AlertCircle, ChevronRight, LayoutDashboard, Wrench } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { ApproveButton } from "../intranet/approval-button";
import { BarcodeScanner } from "@/components/BarcodeScanner";
import { searchInventoryItems } from "../actions";
import { ToastContainer } from "@/components/Toast";

interface PendingItem {
    name: string;
    itemId: string;
    barcode?: string;
    stock: number;
    owner?: { name: string };
    requestedQuantity?: number;
    category?: string;
    equipmentStatus?: string;
    requestNote?: string;
    repairedAt?: string;
}

interface OrderingDashboardProps {
    pendingOrders: PendingItem[];
    pendingApprovals: PendingItem[];
}

export default function OrderingDashboard({ pendingOrders: initialOrders, pendingApprovals: initialApprovals }: OrderingDashboardProps) {
    const router = useRouter();
    const [scanId, setScanId] = useState("");
    const [showScanner, setShowScanner] = useState(false);
    const [error, setError] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // Local state for optimistic UI
    const [approvals, setApprovals] = useState(initialApprovals);
    const [orders, setOrders] = useState(initialOrders);

    // Optimistically move item from approvals to orders
    const handleOptimisticApprove = (itemId: string) => {
        const item = approvals.find(a => a.itemId === itemId);
        if (item) {
            // Remove from approvals
            setApprovals(prev => prev.filter(a => a.itemId !== itemId));
            // Add to orders (at the beginning)
            setOrders(prev => [item, ...prev]);
        }
    };

    // Revert if approval fails
    const handleApprovalRevert = (itemId: string) => {
        const item = orders.find(o => o.itemId === itemId);
        if (item) {
            // Move back to approvals
            setOrders(prev => prev.filter(o => o.itemId !== itemId));
            setApprovals(prev => [item, ...prev]);
        }
    };

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        const query = scanId.trim();
        if (!query) return;

        setError("");
        setSearchResults([]);
        setIsSearching(true);

        try {
            const items = await searchInventoryItems(query);

            if (items.length === 1) {
                // Exact match -> Navigate
                router.push(`/inventory/${items[0].itemId}?backUrl=/ordering`);
            } else if (items.length > 1) {
                // Multiple -> Show results
                setSearchResults(items);
            } else {
                setError(`Item "${query}" not found.`);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to search item.");
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col pt-32">
            <ToastContainer />
            {/* ... header ... */}
            <header className="bg-white shadow-sm p-4 grid grid-cols-3 items-center sticky top-24 z-40 px-6 sm:px-12">
                <div className="flex justify-start">
                    <Link href="/intranet" className="text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-2">
                        <LayoutDashboard size={24} />
                        <span className="font-medium hidden sm:inline">Dashboard</span>
                    </Link>
                </div>
                <div className="flex justify-center">
                    <h1 className="text-xl font-bold font-serif text-slate-800">
                        Ordering
                    </h1>
                </div>
                <div className="flex justify-end">
                    <UserButton afterSignOutUrl="/" />
                </div>
            </header>

            {/* Scanner Modal */}
            {showScanner && (
                <BarcodeScanner
                    onResult={(text) => {
                        setScanId(text);
                        setShowScanner(false);
                        // Auto-search after scan
                        // We can't call handleSearch immediately due to state update async, 
                        // but we can just call search directly or use useEffect.
                        // Simple way: wrap in timeout or separate function. 
                        // Trigger search directly
                        (async () => {
                            setIsSearching(true);
                            try {
                                const items = await searchInventoryItems(text);
                                if (items.length === 1) {
                                    router.push(`/inventory/${items[0].itemId}?backUrl=/ordering`);
                                } else if (items.length > 1) {
                                    setSearchResults(items);
                                } else {
                                    setError(`Item "${text}" not found.`);
                                    setScanId(text); // Show what was scanned
                                }
                            } catch (err) {
                                setError("Search failed.");
                            } finally {
                                setIsSearching(false);
                            }
                        })();
                    }}
                    onClose={() => setShowScanner(false)}
                />
            )}

            <main className="flex-1 p-6 flex flex-col gap-6 max-w-md mx-auto w-full">
                {/* Search Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
                    <h2 className="font-bold text-slate-800">Find Item</h2>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={scanId}
                                onChange={(e) => {
                                    setScanId(e.target.value);
                                    setError("");
                                    setSearchResults([]);
                                }}
                                placeholder="Scan or Type name/ID..."
                                className="w-full text-sm p-3 pl-10 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        </div>
                        <button
                            onClick={() => setShowScanner(true)}
                            className="w-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-200 transition-colors"
                        >
                            <Camera size={24} />
                        </button>
                    </div>
                    <button
                        onClick={handleSearch}
                        disabled={!scanId || isSearching}
                        className="w-full bg-slate-800 text-white p-3 rounded-xl font-bold text-sm hover:bg-slate-900 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isSearching ? <Loader2 className="animate-spin" size={18} /> : "Search Item"}
                    </button>

                    {error && (
                        <div className="text-red-600 text-xs font-medium bg-red-50 p-2 rounded-lg flex items-center gap-2">
                            <AlertCircle size={14} />
                            {error}
                        </div>
                    )}

                    {searchResults.length > 0 && (
                        <div className="border-t border-slate-100 pt-3 flex flex-col gap-2 max-h-60 overflow-y-auto">
                            {searchResults.map(item => (
                                <Link
                                    key={item._id}
                                    href={`/inventory/${item.itemId}?backUrl=/ordering`}
                                    className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg group"
                                >
                                    <div>
                                        <div className="font-bold text-slate-800 text-sm">{item.name}</div>
                                        <div className="text-xs text-slate-500 font-mono">{item.itemId}</div>
                                    </div>
                                    <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500" />
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pending Approvals Section */}
                <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 border-l-4 border-l-blue-500">
                    <div className="flex items-center gap-3 mb-4 text-slate-800 border-b border-slate-100 pb-3">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                            <ShoppingCart size={20} />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg leading-tight">Requests for Approval</h2>
                            <p className="text-xs text-slate-500">{approvals.length} items needing review</p>
                        </div>
                    </div>
                    {approvals.length > 0 ? (
                        <div className="flex flex-col gap-3">
                            {approvals.map((item) => (
                                <div
                                    key={item.itemId}
                                    className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group"
                                >
                                    <Link href={`/inventory/${item.itemId}?backUrl=/ordering`} className="flex-1">
                                        <p className="font-semibold text-slate-800 text-sm line-clamp-1 flex items-center gap-2">
                                            {item.category === 'Equipment' && <span className="bg-red-100 text-red-600 text-[10px] px-1.5 py-0.5 rounded font-bold">REPAIR</span>}
                                            {item.name}
                                        </p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            {item.category === 'Equipment' ? (
                                                <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">
                                                    Issue: {item.requestNote || 'No details'}
                                                </span>
                                            ) : (
                                                <>
                                                    <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">
                                                        {item.owner?.name || 'Lab Stock'}
                                                    </span>
                                                    {item.requestedQuantity && (
                                                        <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold">
                                                            Qty: {item.requestedQuantity}
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                            <span className="text-[10px] text-slate-400 font-mono">{item.itemId}</span>
                                        </div>
                                    </Link>
                                    <div className="pl-3">
                                        <ApproveButton
                                            itemId={item.itemId}
                                            onApprove={() => handleOptimisticApprove(item.itemId)}
                                            onError={() => handleApprovalRevert(item.itemId)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-400 text-center py-4">No pending requests.</p>
                    )}
                </div>

                {/* Just Ordered Section */}
                <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 opacity-90">
                    <div className="flex items-center gap-3 mb-4 text-slate-800 border-b border-slate-100 pb-3">
                        <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                            <ClipboardList size={20} />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg leading-tight">Just Ordered</h2>
                            <p className="text-xs text-slate-500">{orders.length} items ordered</p>
                        </div>
                    </div>
                    {orders.length > 0 ? (
                        <div className="flex flex-col gap-3">
                            {orders.map((item) => (
                                <Link
                                    key={item.itemId}
                                    href={`/inventory/${item.itemId}?backUrl=/ordering`}
                                    className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group"
                                >
                                    <div>
                                        <p className="font-semibold text-slate-800 text-sm line-clamp-1">{item.name}</p>
                                        {item.barcode ? (
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-slate-900 font-mono">{item.barcode}</span>
                                                <span className="text-[10px] text-slate-400 font-mono">{item.itemId}</span>
                                            </div>
                                        ) : (
                                            <p className="text-xs text-slate-500 font-mono">{item.itemId}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center text-slate-400 group-hover:text-blue-600">
                                        <ArrowRight size={16} />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-400 text-center py-4">No recent orders.</p>
                    )}
                </div>

            </main>
        </div>
    );
}
