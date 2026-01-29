"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { Search, Filter, X } from "lucide-react";

const STATUSES = [
    'In Stock',
    'Low Stock',
    'Requested',
    'Ordered',
    'Out of Stock',
];

const EQUIPMENT_STATUSES = [
    'Working',
    'Finicky',
    'Broken',
];

export function InventoryControls({ owners, locations }: { owners: { _id: string, name: string }[], locations: string[] }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Local state for immediate UI feedback
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
    const [isPending, startTransition] = useTransition();

    // Create a new URLSearchParams object based on current params
    const createQueryString = useCallback(
        (name: string, value: string | null) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) {
                params.set(name, value);
            } else {
                params.delete(name);
            }
            return params.toString();
        },
        [searchParams]
    );

    // Debounce search update
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery !== (searchParams.get("q") || "")) {
                startTransition(() => {
                    router.push(pathname + "?" + createQueryString("q", searchQuery));
                });
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, searchParams, pathname, router, createQueryString]);

    const handleFilterChange = (key: string, value: string) => {
        startTransition(() => {
            router.push(pathname + "?" + createQueryString(key, value === "all" ? null : value));
        });
    };

    const currentCategory = searchParams.get("category");
    const isEquipment = currentCategory === 'Equipment';
    const activeStatuses = isEquipment ? EQUIPMENT_STATUSES : STATUSES;

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row gap-4 items-center">

            {/* Search Bar */}
            <div className="relative flex-1 w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Search size={18} />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search items..."
                    className="block w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery("")}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="flex w-full md:w-auto gap-2 overflow-x-auto pb-2 md:pb-0">
                <div className="relative min-w-[150px]">
                    <select
                        value={searchParams.get("location") || "all"}
                        onChange={(e) => handleFilterChange("location", e.target.value)}
                        className="appearance-none w-full bg-slate-50 border border-slate-200 text-slate-700 py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm cursor-pointer"
                    >
                        <option value="all">All Locations</option>
                        {locations.map(loc => (
                            <option key={loc} value={loc}>{loc}</option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-500">
                        <Filter size={14} />
                    </div>
                </div>

                {!isEquipment && (
                    <div className="relative min-w-[150px]">
                        <select
                            value={searchParams.get("owner") || "all"}
                            onChange={(e) => handleFilterChange("owner", e.target.value)}
                            className="appearance-none w-full bg-slate-50 border border-slate-200 text-slate-700 py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm cursor-pointer"
                        >
                            <option value="all">All Owners</option>
                            <option value="lab-stock">Lab Stock</option>
                            {owners.map(owner => (
                                <option key={owner._id} value={owner._id}>{owner.name}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-500">
                            <Filter size={14} />
                        </div>
                    </div>
                )}

                <div className="relative min-w-[150px]">
                    <select
                        value={searchParams.get("status") || "all"}
                        onChange={(e) => handleFilterChange("status", e.target.value)}
                        className="appearance-none w-full bg-slate-50 border border-slate-200 text-slate-700 py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm cursor-pointer"
                    >
                        <option value="all">All Statuses</option>
                        {activeStatuses.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-500">
                        <Filter size={14} />
                    </div>
                </div>

                {/* Plasmid Toggle (Only if Biological is selected) */}
                {(currentCategory === "Biological") && (
                    <div className="flex items-center gap-2 px-2 py-2 bg-purple-50 border border-purple-100 rounded-lg">
                        <input
                            type="checkbox"
                            checked={searchParams.get("type") === "plasmid"}
                            onChange={(e) => handleFilterChange("type", e.target.checked ? "plasmid" : "all")}
                            id="plasmid-toggle"
                            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 border-gray-300 cursor-pointer"
                        />
                        <label htmlFor="plasmid-toggle" className="text-sm font-medium text-purple-700 cursor-pointer select-none">
                            Plasmids Only
                        </label>
                    </div>
                )}
            </div>

            {isPending && (
                <div className="text-blue-500 text-xs font-medium animate-pulse whitespace-nowrap">
                    Updating...
                </div>
            )}
        </div>
    );
}
