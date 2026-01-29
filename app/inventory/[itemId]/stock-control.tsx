"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateStock } from "../../actions";
import { Minus, Plus } from "lucide-react";
import { showToast, updateToast } from "@/components/Toast";

interface StockControlProps {
    itemId: string;
    initialStock: number;
}

export function StockControl({ itemId, initialStock }: StockControlProps) {
    const router = useRouter();

    // Local state for immediate UI updates
    const [stock, setStock] = useState(initialStock);
    const [inputValue, setInputValue] = useState(initialStock.toString());

    // Sync with props when they change (e.g., page navigation)
    useEffect(() => {
        setStock(initialStock);
        setInputValue(initialStock.toString());
    }, [initialStock]);

    const handleUpdate = (newStock: number) => {
        if (newStock < 0 || isNaN(newStock)) {
            setInputValue(stock.toString());
            return;
        }

        // Update UI IMMEDIATELY
        setStock(newStock);
        setInputValue(newStock.toString());

        // Fire-and-forget server call with toast
        const toastId = showToast(`Updating stock to ${newStock}...`, "loading");

        updateStock(itemId, newStock)
            .then((result) => {
                if (result?.success) {
                    updateToast(toastId, `✓ Stock updated to ${newStock}`, "success");
                    // Refresh server components to update Request Approval button visibility
                    router.refresh();
                } else {
                    updateToast(toastId, `Failed: ${result?.error || 'Unknown'}`, "error");
                    // Revert on failure
                    setStock(initialStock);
                    setInputValue(initialStock.toString());
                }
            })
            .catch((err) => {
                console.error(err);
                updateToast(toastId, "Failed to update stock", "error");
                setStock(initialStock);
                setInputValue(initialStock.toString());
            });
    };

    const handleBlur = () => {
        const num = parseInt(inputValue, 10);
        if (!isNaN(num) && num !== stock) {
            handleUpdate(num);
        } else {
            setInputValue(stock.toString());
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            (e.target as HTMLInputElement).blur();
        }
    };

    const increment = () => handleUpdate(stock + 1);
    const decrement = () => handleUpdate(stock - 1);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center flex flex-col items-center">
            <span className="block text-slate-400 text-xs uppercase tracking-widest mb-2">Stock</span>

            <div className="flex items-center gap-4">
                <button
                    onClick={decrement}
                    disabled={stock <= 0}
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
                        value={inputValue}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val === "" || /^\d+$/.test(val)) {
                                setInputValue(val);
                            }
                        }}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        className={`w-20 text-center text-4xl font-bold bg-transparent border-b-2 border-transparent hover:border-slate-200 focus:border-blue-500 focus:outline-none transition-all
                            ${stock === 0 ? 'text-red-500' : 'text-slate-800'}
                        `}
                    />
                </div>

                <button
                    onClick={increment}
                    type="button"
                    className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 active:bg-slate-300 transition-colors"
                >
                    <Plus size={20} />
                </button>
            </div>
        </div>
    );
}
