"use client";

import { useState, useEffect } from "react";
import { Check, ChevronDown, MapPin, Plus } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";

interface LocationComboboxProps {
    value: string;
    onChange: (value: string) => void;
    options: string[];
}

export function LocationCombobox({ value, onChange, options }: LocationComboboxProps) {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");

    // Filter options based on input
    const filteredOptions = options.filter(opt =>
        opt.toLowerCase().includes(inputValue.toLowerCase())
    );

    // If the current value is not in options, make sure it's reflected in the input when opening?
    // Actually, let's keep it simple.

    return (
        <Popover.Root open={open} onOpenChange={setOpen}>
            <Popover.Trigger asChild>
                <button
                    type="button"
                    className="w-full p-4 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none bg-white text-left flex items-center justify-between group"
                >
                    <span className={value ? "text-slate-900" : "text-slate-400"}>
                        {value || "Select or Type Location..."}
                    </span>
                    <ChevronDown className="text-slate-400 group-hover:text-slate-600" />
                </button>
            </Popover.Trigger>

            <Popover.Portal>
                <Popover.Content className="w-[var(--radix-popover-trigger-width)] bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-50 animate-fade-in" sideOffset={5}>
                    <input
                        type="text"
                        placeholder="Search or type new..."
                        className="w-full text-sm p-3 border border-slate-200 rounded-lg mb-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        autoFocus
                    />

                    <div className="max-h-60 overflow-y-auto space-y-1">
                        {inputValue && !options.some(o => o.toLowerCase() === inputValue.toLowerCase()) && (
                            <button
                                type="button"
                                onClick={() => {
                                    onChange(inputValue);
                                    setOpen(false);
                                    setInputValue("");
                                }}
                                className="w-full flex items-center gap-2 p-3 rounded-lg text-sm text-blue-600 hover:bg-blue-50"
                            >
                                <Plus size={16} />
                                <span className="font-bold">Use "{inputValue}"</span>
                            </button>
                        )}

                        {filteredOptions.map((opt) => (
                            <button
                                key={opt}
                                type="button"
                                onClick={() => {
                                    onChange(opt);
                                    setOpen(false);
                                    setInputValue("");
                                }}
                                className={`w-full flex items-center justify-between p-3 rounded-lg text-sm transition-colors ${opt === value ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                <span>{opt}</span>
                                {opt === value && <Check size={16} />}
                            </button>
                        ))}

                        {filteredOptions.length === 0 && !inputValue && (
                            <div className="p-4 text-sm text-slate-400 text-center">Type to add new</div>
                        )}
                    </div>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
