"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { X } from "lucide-react";

interface BarcodeScannerProps {
    onResult: (text: string) => void;
    onClose: () => void;
}

export function BarcodeScanner({ onResult, onClose }: BarcodeScannerProps) {
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const [error, setError] = useState<string>("");
    const [detectedCodes, setDetectedCodes] = useState<string[]>([]);

    useEffect(() => {
        // Initialize scanner
        const scannerId = "reader";

        const startScanner = async () => {
            try {
                if (scannerRef.current) return; // Prevent double init
                const scanner = new Html5Qrcode(scannerId);
                scannerRef.current = scanner;

                // Config
                const config = {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0,
                    formatsToSupport: [
                        Html5QrcodeSupportedFormats.QR_CODE,
                        Html5QrcodeSupportedFormats.EAN_13,
                        Html5QrcodeSupportedFormats.EAN_8,
                        Html5QrcodeSupportedFormats.CODE_128,
                        Html5QrcodeSupportedFormats.CODE_39,
                        Html5QrcodeSupportedFormats.UPC_A,
                        Html5QrcodeSupportedFormats.UPC_E,
                    ]
                };

                await scanner.start(
                    { facingMode: "environment" },
                    config,
                    (decodedText) => {
                        // On success
                        setDetectedCodes(prev => {
                            if (!prev.includes(decodedText)) {
                                if (navigator.vibrate) navigator.vibrate(50); // Haptic feedback
                                return [decodedText, ...prev].slice(0, 5); // Keep last 5
                            }
                            return prev;
                        });
                    },
                    (errorMessage) => {
                        // Ignore scan errors
                        console.debug(errorMessage);
                    }
                );
            } catch (err: unknown) {
                console.error("Failed to start scanner", err);

                let errorMessage = "Camera error. Please check permissions.";

                // Check for insecure context (HTTP vs HTTPS)
                const errorName = (err as Error)?.name;

                if (window.isSecureContext === false) {
                    errorMessage = "Camera access requires a secure connection (HTTPS).";
                } else if (errorName === "NotAllowedError" || errorName === "PermissionDeniedError") {
                    errorMessage = "Camera permission denied.";
                } else if (errorName === "NotFoundError") {
                    errorMessage = "No camera found.";
                } else if (errorName === "NotReadableError" || errorName === "TrackStartError") {
                    errorMessage = "Camera is in use by another application.";
                } else if (typeof err === "string") {
                    errorMessage = err;
                }

                setError(errorMessage);
            }
        };

        startScanner();

        // Cleanup
        return () => {
            if (scannerRef.current && scannerRef.current.isScanning) {
                scannerRef.current.stop().then(() => {
                    scannerRef.current?.clear();
                }).catch(err => console.error("Failed to stop scanner", err));
            }
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white p-2 bg-white/10 rounded-full hover:bg-white/20 z-50"
            >
                <X size={24} />
            </button>

            <div className="w-full max-w-md flex flex-col gap-4 animate-in fade-in zoom-in duration-300">
                <div className="relative overflow-hidden rounded-2xl bg-black border border-white/10 shadow-2xl">
                    <div id="reader" className="w-full h-full min-h-[300px] bg-black"></div>

                    {error && (
                        <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-red-400 bg-black/80">
                            {error}
                        </div>
                    )}

                    {!error && (
                        <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-white/30 m-12 rounded-xl opacity-50"></div>
                    )}
                </div>

                <div className="space-y-2">
                    <p className="text-slate-400 text-center text-sm mb-2">
                        {detectedCodes.length === 0
                            ? "Point camera at a barcode..."
                            : "Tap a detected code to select it:"}
                    </p>

                    <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto">
                        {detectedCodes.map((code) => (
                            <button
                                key={code}
                                onClick={() => onResult(code)}
                                className="bg-white/10 hover:bg-blue-500/20 text-white p-4 rounded-xl border border-white/10 text-left flex justify-between items-center transition-all active:scale-95"
                            >
                                <span className="font-mono font-bold text-lg tracking-wider">{code}</span>
                                <span className="text-xs bg-white/20 px-2 py-1 rounded">Select</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
