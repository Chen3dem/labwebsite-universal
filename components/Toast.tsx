"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, XCircle, X } from "lucide-react";

export type ToastStatus = "loading" | "success" | "error";

interface ToastItem {
    id: string;
    message: string;
    status: ToastStatus;
}

// Global state for toasts (simple approach without context)
let toastListeners: Array<(toasts: ToastItem[]) => void> = [];
let toasts: ToastItem[] = [];

function notifyListeners() {
    toastListeners.forEach((listener) => listener([...toasts]));
}

export function showToast(message: string, status: ToastStatus = "loading"): string {
    const id = Math.random().toString(36).substring(7);
    toasts = [...toasts, { id, message, status }];
    notifyListeners();
    return id;
}

export function updateToast(id: string, message: string, status: ToastStatus) {
    toasts = toasts.map((t) => (t.id === id ? { ...t, message, status } : t));
    notifyListeners();

    // Auto-dismiss success/error after 3s
    if (status === "success" || status === "error") {
        setTimeout(() => dismissToast(id), 3000);
    }
}

export function dismissToast(id: string) {
    toasts = toasts.filter((t) => t.id !== id);
    notifyListeners();
}

export function ToastContainer() {
    const [localToasts, setLocalToasts] = useState<ToastItem[]>([]);

    useEffect(() => {
        toastListeners.push(setLocalToasts);
        return () => {
            toastListeners = toastListeners.filter((l) => l !== setLocalToasts);
        };
    }, []);

    if (localToasts.length === 0) return null;

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-full max-w-sm px-4">
            {localToasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`flex items-center gap-3 p-4 rounded-xl shadow-lg border animate-fade-in ${toast.status === "loading"
                            ? "bg-white border-slate-200 text-slate-700"
                            : toast.status === "success"
                                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                                : "bg-red-50 border-red-200 text-red-800"
                        }`}
                >
                    {toast.status === "loading" && (
                        <Loader2 size={20} className="animate-spin text-blue-500 shrink-0" />
                    )}
                    {toast.status === "success" && (
                        <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
                    )}
                    {toast.status === "error" && (
                        <XCircle size={20} className="text-red-500 shrink-0" />
                    )}
                    <span className="text-sm font-medium flex-1">{toast.message}</span>
                    <button
                        onClick={() => dismissToast(toast.id)}
                        className="text-slate-400 hover:text-slate-600"
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
}
