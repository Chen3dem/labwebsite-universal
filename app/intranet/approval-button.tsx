"use client";

import { useRouter } from "next/navigation";
import { approveItem } from "../actions";
import { Check } from "lucide-react";
import { showToast, updateToast } from "@/components/Toast";

export function ApproveButton({ itemId }: { itemId: string }) {
    const router = useRouter();

    const handleApprove = (e: React.MouseEvent) => {
        e.preventDefault();

        const toastId = showToast("Approving request...", "loading");

        approveItem(itemId)
            .then(() => {
                updateToast(toastId, "✓ Request approved!", "success");
                // Refresh server components to update the lists
                router.refresh();
            })
            .catch((err) => {
                console.error("Failed to approve", err);
                updateToast(toastId, "Failed to approve", "error");
            });
    };

    return (
        <button
            onClick={handleApprove}
            className="bg-blue-100 text-blue-700 p-2 rounded-lg hover:bg-blue-200 transition-colors"
            title="Approve Request"
        >
            <Check size={16} />
        </button>
    );
}
