"use client";

import { useEffect, useRef } from "react";
import QRCode from "react-qr-code";
import { X, Printer } from "lucide-react";
import { createPortal } from "react-dom";

interface QRCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    url: string;
    itemName: string;
    itemId: string;
}

export function QRCodeModal({ isOpen, onClose, url, itemName, itemId }: QRCodeModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    // Close on click outside
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (!isOpen) return null;

    // Use portal to render at body level
    return createPortal(
        <div
            id="qr-print-modal"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 print:p-0 print:bg-white print:static"
            onClick={handleBackdropClick}
        >
            <div
                ref={modalRef}
                className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center gap-6 animate-scale-in relative print:shadow-none print:w-full print:max-w-none print:p-0"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button - Hide on Print */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors bg-slate-100 rounded-full p-2 print:hidden"
                >
                    <X size={20} />
                </button>

                {/* Printable Content */}
                <div className="flex flex-col items-center text-center gap-4 py-4 print:absolute print:top-0 print:left-0 print:w-full print:h-full print:justify-center print:flex">
                    <h3 className="text-xl font-bold text-slate-900 leading-tight print:text-3xl">{itemName}</h3>

                    <div className="bg-white p-4 rounded-xl border-2 border-slate-900 print:border-4 print:p-6">
                        <QRCode
                            value={url}
                            size={200}
                            className="w-full h-auto"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <span className="font-mono text-sm text-slate-500 tracking-wider uppercase print:text-lg">ID: {itemId}</span>
                        <span className="text-xs text-slate-400 print:text-sm">Scan to view details & stock</span>
                    </div>
                </div>

                {/* Print Action - Hide on Print */}
                <button
                    onClick={handlePrint}
                    className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200 print:hidden"
                >
                    <Printer size={20} />
                    Print Label
                </button>
            </div>

            {/* Print Styles */}
            <style jsx global>{`
                @media print {
                    @page {
                        margin: 0;
                        size: auto;
                    }
                    html, body {
                        min-height: 100%;
                        height: auto;
                        margin: 0 !important;
                        padding: 0 !important;
                        overflow: hidden !important;
                    }

                    /* 
                       CRITICAL FIX: Use display:none instead of visibility:hidden.
                       visibility:hidden preserves layout space, causing blank pages.
                       display:none removes elements from the flow.
                    */
                    body > *:not(#qr-print-modal) {
                        display: none !important;
                    }

                    /* Position the modal */
                    #qr-print-modal {
                        position: absolute !important;
                        top: 0 !important;
                        left: 0 !important;
                        width: 100% !important;
                        height: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        background: white !important;
                        z-index: 99999 !important;
                        display: flex !important;
                        align-items: center;
                        justify-content: center;
                        
                        /* prevent breaks */
                        break-inside: avoid;
                        page-break-inside: avoid;
                        break-after: avoid;
                        page-break-after: avoid;
                    }

                    /* Ensure content fits without overflow */
                    #qr-print-modal > div {
                        transform: none !important;
                        box-shadow: none !important;
                        max-width: 90% !important;
                        max-height: 90% !important;
                    }
                }
            `}</style>
        </div>,
        document.body
    );
}
