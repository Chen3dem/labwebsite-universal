"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { reorderItem, requestRepair, updateEquipmentStatus } from "../../actions";
import { ShoppingCart, Check, Wrench, QrCode } from "lucide-react";
import { QRCodeModal } from "@/components/QRCodeModal";
import { showToast, updateToast } from "@/components/Toast";

export function EquipmentStatusSelector({ currentStatus, itemId }: { currentStatus: string, itemId: string }) {
    const router = useRouter();
    const [status, setStatus] = useState(currentStatus || 'Working');

    // Sync with props when they change
    useEffect(() => {
        setStatus(currentStatus || 'Working');
    }, [currentStatus]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;

        // Update UI IMMEDIATELY
        setStatus(newStatus);

        const toastId = showToast(`Updating status...`, "loading");

        updateEquipmentStatus(itemId, newStatus)
            .then(() => {
                updateToast(toastId, `✓ Status: ${newStatus}`, "success");
                // Refresh server components to show/hide Repair button
                router.refresh();
            })
            .catch((err) => {
                console.error(err);
                updateToast(toastId, "Failed to update status", "error");
                setStatus(currentStatus || 'Working'); // Revert
            });
    };

    return (
        <select
            value={status}
            onChange={handleChange}
            className={`w-full p-3 rounded-xl border-2 font-bold text-center outline-none cursor-pointer appearance-none
                ${status === 'Broken' ? 'bg-red-50 border-red-100 text-red-600' :
                    status === 'Finicky' ? 'bg-amber-50 border-amber-100 text-amber-600' :
                        status === 'Repair Requested' ? 'bg-purple-50 border-purple-100 text-purple-600' :
                            'bg-emerald-50 border-emerald-100 text-emerald-600'
                }
            `}
        >
            <option value="Working">✓ Working</option>
            <option value="Finicky">! Finicky</option>
            <option value="Broken">✗ Broken</option>
            <option value="Repair Requested">? Repair Requested</option>
        </select>
    );
}


export function ReorderButton({ currentStatus, itemId, adminEmail }: { currentStatus: string, itemId: string, adminEmail?: string }) {
    const [status, setStatus] = useState(currentStatus);

    // Sync with props when they change
    useEffect(() => {
        setStatus(currentStatus);
    }, [currentStatus]);

    const isOrdered = status === "Ordered";
    const isRequested = status === "Requested";
    const isUrgent = status === "Out of Stock" || status === "Low Stock";

    const handleReorder = () => {
        // Update UI IMMEDIATELY
        setStatus("Requested");

        const toastId = showToast("Submitting request...", "loading");

        reorderItem(itemId)
            .then((result) => {
                if (result.success) {
                    updateToast(toastId, "✓ Request submitted!", "success");

                    // Open Mailto Link
                    const subject = encodeURIComponent(`[Approval Needed] ${result.itemName} (Qty: ${result.requestedQuantity})`);
                    const body = encodeURIComponent(`
Item Requested: ${result.itemName}
ID: ${result.itemId}
Quantity: ${result.requestedQuantity}

Please review and approve this request on the Intranet:
${window.location.origin}/ordering
`);
                    const recipient = adminEmail || 'cuilabmanager@gmail.com';
                    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
                }
            })
            .catch((err) => {
                console.error("Failed to reorder", err);
                updateToast(toastId, "Failed to submit request", "error");
                setStatus(currentStatus); // Revert
            });
    };

    return (
        <button
            onClick={handleReorder}
            disabled={isOrdered || isRequested}
            className={`w-full py-6 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 shadow-lg transition-all active:scale-95 text-white
        ${isOrdered || isRequested
                    ? "bg-slate-300 cursor-not-allowed text-slate-500 shadow-none"
                    : isUrgent
                        ? "bg-red-600 hover:bg-red-700 shadow-red-200 animate-pulse"
                        : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
                }
      `}
        >
            {isOrdered ? (
                <>
                    <Check /> Ordered
                </>
            ) : isRequested ? (
                <>
                    <Check /> Requested
                </>
            ) : (
                <>
                    <ShoppingCart /> Request Approval
                </>
            )}
        </button>
    );
}




export function RepairButton({ itemId, adminEmail }: { itemId: string, adminEmail?: string }) {
    const [showModal, setShowModal] = useState(false);
    const [issue, setIssue] = useState("");

    const handleRepairClick = () => {
        setShowModal(true);
    };

    const handleSubmit = () => {
        if (!issue.trim()) return;

        const issueText = issue; // Capture before clearing

        // Close modal immediately
        setShowModal(false);
        setIssue("");

        const toastId = showToast("Submitting repair request...", "loading");

        requestRepair(itemId, issueText)
            .then((result) => {
                if (result.success) {
                    updateToast(toastId, "✓ Repair request submitted!", "success");

                    // Open Mailto Link
                    const subject = encodeURIComponent(`[Repair Requested] ${result.itemName}`);
                    const body = encodeURIComponent(`
Repair Requested for: ${result.itemName}
Issue: ${issueText}

Approve repair at:
${window.location.origin}/ordering
`);
                    const recipient = adminEmail || 'cuilabmanager@gmail.com';
                    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
                }
            })
            .catch((err) => {
                console.error("Failed to request repair", err);
                updateToast(toastId, "Failed to submit repair request", "error");
            });
    };

    return (
        <>
            <button
                onClick={handleRepairClick}
                className="w-full py-6 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 shadow-lg transition-all active:scale-95 text-white bg-amber-600 hover:bg-amber-700 shadow-amber-200"
            >
                <Wrench /> Request Repair
            </button>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Request Repair</h3>
                        <p className="text-slate-500 mb-4 text-sm">Please describe the issue with this equipment so we can fix it.</p>

                        <textarea
                            value={issue}
                            onChange={(e) => setIssue(e.target.value)}
                            placeholder="e.g. Making loud noise, won't turn on..."
                            className="w-full p-3 border border-slate-200 rounded-xl mb-4 focus:ring-2 focus:ring-amber-500 outline-none h-32 resize-none"
                            autoFocus
                        />

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 py-3 text-slate-600 font-bold bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!issue.trim()}
                                className="flex-1 py-3 text-white font-bold bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                Submit Request
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
export function PrintQRButton({ itemId, itemName }: { itemId: string, itemName: string }) {
    const [showQR, setShowQR] = useState(false);
    // Get current URL or default to origin + path
    const [url, setUrl] = useState("");

    const handleOpen = () => {
        // Prefer production URL from env var if available, otherwise use current window location
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
        // Construct standard inventory path
        setUrl(`${baseUrl}/inventory/${itemId}`);
        setShowQR(true);
    };

    return (
        <>
            <button
                onClick={handleOpen}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors"
            >
                <QrCode size={16} />
                Print QR
            </button>
            <QRCodeModal
                isOpen={showQR}
                onClose={() => setShowQR(false)}
                url={url}
                itemName={itemName}
                itemId={itemId}
            />
        </>
    );
}
