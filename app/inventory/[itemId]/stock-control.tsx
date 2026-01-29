"use client";

import { useTransition, useState, useEffect } from "react";
import { updateStock } from "../../actions";
import { Minus, Plus, Loader2 } from "lucide-react";

interface StockControlProps {
    itemId: string;
    initialStock: number;
}

export function StockControl({ itemId, initialStock }: StockControlProps) {
    const [isPending, startTransition] = useTransition();
    const [value, setValue] = useState(initialStock.toString());

    // Sync local state when server state updates
    useEffect(() => {
        setValue(initialStock.toString());
    }, [initialStock]);

    const handleUpdate = (newStock: number) => {
        if (newStock < 0 || isNaN(newStock)) {
            setValue(initialStock.toString()); // Revert if invalid
            return;
        }

        startTransition(async () => {
            await updateStock(itemId, newStock);
        });
    };

    const handleBlur = () => {
        const num = parseInt(value, 10);
        if (num !== initialStock) {
            handleUpdate(num);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const num = parseInt(value, 10);
            if (num !== initialStock) {
                handleUpdate(num);
            }
            (e.target as HTMLInputElement).blur();
        }
    };

    const increment = () => handleUpdate(initialStock + 1);
    const decrement = () => handleUpdate(initialStock - 1);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center flex flex-col items-center">
            <span className="block text-slate-400 text-xs uppercase tracking-widest mb-2">Stock</span>

            <div className="flex items-center gap-4">
                <button
                    onClick={decrement}
                    disabled={isPending || initialStock <= 0}
                    type="button"
                    className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 active:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Minus size={20} />
                </button>

                <div className="relative">
                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={value}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val === "" || /^\d+$/.test(val)) {
                                setValue(val);
                            }
                        }}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        disabled={isPending}
                        className={`w-20 text-center text-4xl font-bold bg-transparent border-b-2 border-transparent hover:border-slate-200 focus:border-blue-500 focus:outline-none transition-all
                            ${initialStock === 0 ? 'text-red-500' : 'text-slate-800'} 
                            ${isPending ? 'opacity-50' : ''}
                        `}
                    />
                </div>

                <button
                    onClick={increment}
                    disabled={isPending}
                    type="button"
                    className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 active:bg-slate-300 transition-colors"
                >
                    <Plus size={20} />
                </button>
            </div>

            {isPending && (
                <div className="mt-2 text-blue-500 flex items-center gap-1 text-xs font-medium">
                    <Loader2 size={12} className="animate-spin" />
                    Updating...
                </div>
            )}
        </div>
    );
}
