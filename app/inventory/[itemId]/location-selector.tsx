"use client";

import { useState, useEffect } from "react";
import { updateItemLocation } from "../../actions";
import { Check, MapPin, Plus } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import { showToast, updateToast } from "@/components/Toast";

interface LocationSelectorProps {
    itemId: string;
    currentLocation: string;
    allLocations: string[];
}

export function LocationSelector({ itemId, currentLocation, allLocations }: LocationSelectorProps) {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [location, setLocation] = useState(currentLocation);

    // Sync with props when they change
    useEffect(() => {
        setLocation(currentLocation);
    }, [currentLocation]);

    const handleSelect = (loc: string) => {
        setOpen(false);

        // Update UI IMMEDIATELY
        setLocation(loc);
        setInputValue("");

        // Fire-and-forget with toast
        const toastId = showToast(`Setting location to ${loc}...`, "loading");

        updateItemLocation(itemId, loc)
            .then(() => {
                updateToast(toastId, `✓ Location: ${loc}`, "success");
            })
            .catch((err) => {
                console.error(err);
                updateToast(toastId, "Failed to update location", "error");
                setLocation(currentLocation); // Revert on error
            });
    };

    const filteredLocations = allLocations.filter(loc =>
        loc.toLowerCase().includes(inputValue.toLowerCase())
    );

    return (
        <Popover.Root open={open} onOpenChange={setOpen}>
            <Popover.Trigger asChild>
                <button
                    className="inline-flex items-center gap-2 bg-slate-100 text-slate-600 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-slate-200 transition-colors"
                >
                    <MapPin size={14} />
                    <span>{location || "Set Location"}</span>
                </button>
            </Popover.Trigger>

            <Popover.Portal>
                <Popover.Content className="w-64 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-50 animate-fade-in" sideOffset={5}>
                    <input
                        type="text"
                        placeholder="Search or type new..."
                        className="w-full text-sm p-2 border border-slate-200 rounded-lg mb-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        autoFocus
                    />

                    <div className="max-h-60 overflow-y-auto space-y-1">
                        {inputValue && !allLocations.includes(inputValue) && (
                            <button
                                onClick={() => handleSelect(inputValue)}
                                className="w-full flex items-center gap-2 p-2 rounded-lg text-sm text-blue-600 hover:bg-blue-50"
                            >
                                <Plus size={14} />
                                <span className="font-bold">Use "{inputValue}"</span>
                            </button>
                        )}

                        {filteredLocations.map((loc) => (
                            <button
                                key={loc}
                                onClick={() => handleSelect(loc)}
                                className={`w-full flex items-center justify-between p-2 rounded-lg text-sm transition-colors ${loc === location ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                <span>{loc}</span>
                                {loc === location && <Check size={14} />}
                            </button>
                        ))}

                        {filteredLocations.length === 0 && !inputValue && (
                            <div className="p-2 text-xs text-slate-400 text-center">Type to add new</div>
                        )}
                    </div>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}

