"use client";

import { useTransition } from "react";
import { approveItem } from "../actions";
import { Check, Loader2 } from "lucide-react";

export function ApproveButton({ itemId }: { itemId: string }) {
    const [isPending, startTransition] = useTransition();

    const handleApprove = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent link navigation if inside a link, though better to put outside
        startTransition(async () => {
            try {
                await approveItem(itemId);
            } catch (err) {
                console.error("Failed to approve", err);
                alert("Failed to approve item.");
            }
        });
    };

    return (
        <button
            onClick={handleApprove}
            disabled={isPending}
            className="bg-blue-100 text-blue-700 p-2 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
            title="Approve Request"
        >
            {isPending ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
        </button>
    );
}
