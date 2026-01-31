"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Box, Camera, Search, Plus, Minus, Loader2, CheckCircle2, AlertCircle, PlusCircle, User, ChevronRight, LayoutDashboard } from "lucide-react";
import { getItemDetails, receiveItem, createInventoryItem, searchInventoryItems, getAllTeamMembers, getAllLocations, getSiteSettings } from "../actions";
import { LocationCombobox } from "./location-combobox";
import { BarcodeScanner } from "@/components/BarcodeScanner";
import imageCompression from 'browser-image-compression';
import { useRef } from "react";
import { ToastContainer, showToast, updateToast } from "@/components/Toast";

import { useUser } from "@clerk/nextjs";

export default function ReceivingPage() {
    const { user } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            const role = (user.publicMetadata.role as string) || 'viewer';
            if (role === 'viewer') {
                router.replace('/intranet');
            }
        }
    }, [user, router]);
    const [isPending, startTransition] = useTransition();

    // State
    const [scanId, setScanId] = useState("");
    const [foundItem, setFoundItem] = useState<any>(null);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [quantityReceived, setQuantityReceived] = useState(1);
    const [step, setStep] = useState<'scan' | 'select' | 'confirm' | 'create'>('scan');
    const [error, setError] = useState("");
    const [teamMembers, setTeamMembers] = useState<any[]>([]);
    const [showScanner, setShowScanner] = useState(false);
    const [showCreateScanner, setShowCreateScanner] = useState(false); // New state for creation form
    const [lastInputSource, setLastInputSource] = useState<'scan' | 'type'>('type');

    // Create new item state
    const [newItemName, setNewItemName] = useState("");
    const [newItemBarcode, setNewItemBarcode] = useState("");
    const [newItemLocation, setNewItemLocation] = useState("");
    const [newItemOwner, setNewItemOwner] = useState("");
    const [newItemMinStock, setNewItemMinStock] = useState(5);
    const [newItemCategory, setNewItemCategory] = useState("General");
    const [isPlasmid, setIsPlasmid] = useState(false); // New State
    const [availableLocations, setAvailableLocations] = useState<string[]>([
        'Chemical Cabinet'
    ]);
    const [labIdPrefix, setLabIdPrefix] = useState("CUI-LAB");
    const [plasmidIdPrefix, setPlasmidIdPrefix] = useState("ZC-Plasmid");

    // Image Handling State
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Helpers
    const sanitizeBarcode = (input: string) => {
        return input.replace(/[\x00-\x1F\x7F]/g, "");
    };

    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        try {
            const options = {
                maxSizeMB: 0.5,
                maxWidthOrHeight: 1280,
                useWebWorker: true
            };
            const compressedFile = await imageCompression(file, options);
            setImageFile(compressedFile);
            setImagePreview(URL.createObjectURL(compressedFile));
        } catch (error) {
            console.error(error);
            setError("Failed to compress image.");
        }
    };

    const triggerCamera = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    const startCreation = () => {
        setStep('create');

        // If scanned, ALWAYS treat as barcode and clear name
        if (lastInputSource === 'scan') {
            setNewItemBarcode(scanId);
            setNewItemName("");
        } else {
            // Heuristic for typed input
            const isBarcodeLike = /^[A-Z0-9-]+$/.test(scanId) && !scanId.includes(' ');
            if (isBarcodeLike) {
                setNewItemBarcode(scanId);
                setNewItemName("");
            } else {
                setNewItemName(scanId);
                setNewItemBarcode("");
            }
        }

        setNewItemOwner("lab-stock");

        setNewItemMinStock(5);
        setError("");
        setImageFile(null);
        setImagePreview("");
        setIsPlasmid(false); // Reset plasmid state
        setQuantityReceived(1);
    };

    useEffect(() => {
        getSiteSettings().then(settings => {
            setLabIdPrefix(settings.labIdPrefix);
            setPlasmidIdPrefix(settings.plasmidIdPrefix);
        });
        getAllTeamMembers().then(setTeamMembers);
        getAllLocations().then(locs => {
            if (locs && locs.length > 0) {
                setAvailableLocations(locs);
            }
        });
    }, []);



    // Look up item
    const handleScan = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        let query = scanId.trim();
        if (!query) return;

        // Sanitize
        const cleanQuery = sanitizeBarcode(query);
        if (cleanQuery !== query) {
            console.log("Sanitized barcode:", query, "->", cleanQuery);
            query = cleanQuery;
            setScanId(cleanQuery); // Update UI
        }

        startTransition(async () => {
            try {
                // Use the new fuzzy search
                const items = await searchInventoryItems(query);

                if (items.length === 1) {
                    // Exact or unique match
                    setFoundItem(items[0]);
                    setStep('confirm');
                    setQuantityReceived(1);
                    setScanId("");
                    setImageFile(null);
                    setImagePreview("");
                } else if (items.length > 1) {
                    // Multiple matches
                    setSearchResults(items);
                    setStep('select');
                } else {
                    // No matches
                    setError(`Item "${query}" not found.`);
                }
            } catch (err) {
                setError("Failed to lookup item. Please try again.");
            }
        });
    };

    const handleSelectResult = (item: any) => {
        setFoundItem(item);
        setStep('confirm');
        setQuantityReceived(1);
        setScanId("");
        setImageFile(null);
        setImagePreview("");
    };

    const handleConfirm = async () => {
        if (!foundItem) return;

        // Capture data before resetting
        const itemName = foundItem.name;
        const itemIdentifier = foundItem.itemId || foundItem.barcode;
        const qty = quantityReceived;
        let imageBase64: string | undefined = undefined;
        if (imageFile) {
            imageBase64 = await convertToBase64(imageFile);
        }

        // Reset UI IMMEDIATELY (optimistic)
        setStep('scan');
        setFoundItem(null);
        setScanId("");
        setQuantityReceived(1);
        setImageFile(null);
        setImagePreview("");

        // Scroll to top of page
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Show toast and run in background
        const toastId = showToast(`Receiving ${qty}x ${itemName}...`, "loading");

        // Fire-and-forget (no await blocking UI)
        receiveItem(itemIdentifier, qty, imageBase64)
            .then(() => {
                updateToast(toastId, `✓ Received ${qty}x ${itemName}`, "success");
            })
            .catch((err) => {
                console.error(err);
                updateToast(toastId, `Failed to receive ${itemName}`, "error");
            });
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItemName.trim()) return;

        // Capture data before resetting
        const itemName = newItemName;
        const qty = quantityReceived;
        let imageBase64: string | undefined = undefined;
        if (imageFile) {
            imageBase64 = await convertToBase64(imageFile);
        }

        const createData = {
            name: newItemName,
            barcode: newItemBarcode.trim() || undefined,
            location: newItemLocation,
            stock: quantityReceived,
            ownerId: newItemOwner || undefined,
            minStock: newItemMinStock,
            category: newItemCategory,
            imageBase64,
            isPlasmid
        };

        // Reset UI IMMEDIATELY (optimistic)
        setStep('scan');
        setNewItemName("");
        setNewItemBarcode("");
        setNewItemOwner("");
        setNewItemLocation("");
        setNewItemMinStock(5);
        setNewItemCategory("General");
        setScanId("");
        setQuantityReceived(1);
        setImageFile(null);
        setImagePreview("");
        setIsPlasmid(false);

        // Scroll to top of page
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Show toast and run in background
        const toastId = showToast(`Creating ${itemName}...`, "loading");

        // Fire-and-forget (no await blocking UI)
        createInventoryItem(createData)
            .then(() => {
                updateToast(toastId, `✓ Created ${qty}x ${itemName}`, "success");
            })
            .catch((err) => {
                console.error(err);
                updateToast(toastId, `Failed to create ${itemName}`, "error");
            });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col pt-32">
            <ToastContainer />
            {/* ... header ... */}
            <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-24 z-40 px-6 sm:px-12">
                {step === 'scan' ? (
                    <Link href="/intranet" className="text-slate-500 hover:text-slate-800 flex items-center gap-2">
                        <LayoutDashboard size={24} />
                        <span className="font-medium hidden sm:inline">Dashboard</span>
                    </Link>
                ) : (
                    <button
                        onClick={() => {
                            setStep('scan');
                            setFoundItem(null);
                            setScanId("");
                        }}
                        className="text-slate-500 hover:text-slate-800"
                    >
                        <ArrowLeft size={28} />
                    </button>
                )}
                <h1 className="text-xl font-bold font-serif text-slate-800">
                    {step === 'create' ? 'Add New Item' : 'Receiving Station'}
                </h1>
                <div className="w-8" />
            </header>

            {/* ... scanner ... */}
            {showScanner && (
                <BarcodeScanner
                    onResult={(text) => {
                        setScanId(text);
                        setShowScanner(false);
                        setLastInputSource('scan');
                    }}
                    onClose={() => setShowScanner(false)}
                />
            )}

            {/* Creation Form Scanner */}
            {showCreateScanner && (
                <BarcodeScanner
                    onResult={(text) => {
                        setNewItemBarcode(text);
                        setShowCreateScanner(false);
                    }}
                    onClose={() => setShowCreateScanner(false)}
                />
            )}

            <main className="flex-1 p-6 max-w-md mx-auto w-full">
                {/* ... scan/select/confirm views ... */}

                {step === 'scan' && (
                    <div className="flex flex-col gap-8 animate-fade-in">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center space-y-4">
                            <button
                                onClick={() => setShowScanner(true)}
                                className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto hover:bg-blue-200 transition-colors shadow-sm active:scale-95"
                            >
                                <Camera size={40} />
                            </button>
                            <h2 className="text-2xl font-bold text-slate-900">Scan or Search</h2>
                            <p className="text-slate-500 text-sm">
                                Enter Barcode or Item Name (e.g. "Falcon")
                            </p>

                            <form onSubmit={handleScan} className="space-y-4 pt-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={scanId}
                                        onChange={(e) => {
                                            setScanId(e.target.value);
                                            setError("");
                                            setLastInputSource('type');
                                        }}
                                        placeholder="Scan or Type Name..."
                                        className="w-full p-4 pl-12 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-medium text-center"
                                    />
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                </div>

                                {error && (
                                    <div className="space-y-3">
                                        <div className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg flex items-center gap-2 justify-center">
                                            <AlertCircle size={16} />
                                            {error}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={startCreation}
                                            className="w-full bg-blue-50 text-blue-600 p-3 rounded-xl font-bold text-sm hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <PlusCircle size={18} />
                                            Add New Item "{scanId}"
                                        </button>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={!scanId || isPending}
                                    className="w-full bg-slate-900 text-white p-4 rounded-xl font-bold text-lg shadow-lg hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isPending ? <Loader2 className="animate-spin" /> : "Look Up"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {step === 'select' && (
                    <div className="flex flex-col gap-6 animate-fade-in">
                        {/* ... select view content ... */}
                        <h2 className="text-xl font-bold text-slate-900 text-center">Select Item</h2>
                        <div className="space-y-3">
                            {searchResults.map(item => (
                                <button
                                    key={item._id}
                                    onClick={() => handleSelectResult(item)}
                                    className="w-full bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md transition-all text-left flex items-center justify-between group"
                                >
                                    <div>
                                        <div className="font-bold text-slate-900">{item.name}</div>
                                        <div className="text-xs text-slate-500 font-mono mt-1">
                                            {item.article || item.itemId || item.barcode}
                                        </div>
                                    </div>
                                    <ChevronRight className="text-slate-300 group-hover:text-blue-500" />
                                </button>
                            ))}
                        </div>

                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t border-slate-200"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-slate-50 px-2 text-sm text-slate-500">or</span>
                            </div>
                        </div>

                        <button
                            onClick={startCreation}
                            className="w-full bg-blue-50 text-blue-600 p-4 rounded-xl font-bold hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                        >
                            <PlusCircle size={20} />
                            Create New Item "{scanId}"
                        </button>
                        <button
                            onClick={() => setStep('scan')}
                            className="text-slate-500 font-medium text-center p-2 hover:text-slate-800"
                        >
                            Back to Search
                        </button>
                    </div>
                )}

                {step === 'confirm' && foundItem && (
                    // ... confirm view ...
                    <div className="flex flex-col gap-6 animate-fade-in">
                        <div className="bg-white p-8 rounded-3xl shadow-md border border-slate-100 text-center flex flex-col gap-4">
                            <div className="w-24 h-24 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-2 overflow-hidden border border-slate-100">
                                {foundItem.imageUrl ? (
                                    <img src={foundItem.imageUrl} alt={foundItem.name} className="w-full h-full object-cover" />
                                ) : (
                                    <Box size={40} />
                                )}
                            </div>

                            <div>
                                <h2 className="text-3xl font-bold text-slate-900 font-serif leading-tight">{foundItem.name}</h2>
                                {foundItem.barcode ? (
                                    <div className="flex flex-col items-center mt-2">
                                        <span className="font-bold text-slate-800 tracking-wider font-mono text-lg">{foundItem.barcode}</span>
                                        {foundItem.itemId && (
                                            <span className="text-xs text-slate-400 font-mono">{foundItem.itemId}</span>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-slate-500 font-mono text-sm mt-2">{foundItem.itemId || 'No ID'}</p>
                                )}
                                <div className="inline-block bg-slate-100 text-slate-600 px-4 py-1 rounded-full text-sm font-medium mt-3">
                                    {foundItem.location}
                                </div>
                            </div>

                            <div className="border-t border-slate-50 my-2" />

                            <div className="grid grid-cols-3 gap-2 py-2 items-center">
                                <div className="flex flex-col items-center">
                                    <span className="text-slate-400 text-xs uppercase tracking-widest mb-1">Current</span>
                                    <span className="text-xl font-bold text-slate-700">{foundItem.stock}</span>
                                </div>
                                <div className="flex justify-center text-slate-300">
                                    <Plus size={24} />
                                </div>
                                <div className="flex flex-col items-center w-full">
                                    <span className="text-blue-500 text-xs uppercase tracking-widest mb-1 font-bold">Received</span>
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => setQuantityReceived(Math.max(1, quantityReceived - 1))}
                                            className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm text-blue-600 hover:bg-blue-100 active:bg-blue-200 transition-colors border border-slate-200"
                                        >
                                            <Minus size={18} strokeWidth={2.5} />
                                        </button>
                                        <input
                                            type="number"
                                            min="1"
                                            value={quantityReceived}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value);
                                                setQuantityReceived(isNaN(val) ? 1 : Math.max(1, val));
                                            }}
                                            className="w-14 text-center font-bold text-2xl text-blue-700 bg-transparent outline-none border-b border-transparent focus:border-blue-300 transition-colors [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none py-1"
                                        />
                                        <button
                                            onClick={() => setQuantityReceived(quantityReceived + 1)}
                                            className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm text-blue-600 hover:bg-blue-100 active:bg-blue-200 transition-colors border border-slate-200"
                                        >
                                            <Plus size={18} strokeWidth={2.5} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-emerald-50 p-4 rounded-2xl mt-2 flex justify-between items-center text-emerald-800">
                                <span className="font-medium text-sm">New Total Stock</span>
                                <span className="font-bold text-2xl">{(foundItem.stock || 0) + quantityReceived}</span>
                            </div>
                        </div>

                        {/* Image Capture for existing item */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4">
                            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                                <Camera size={16} />
                                Update Photo
                            </h3>
                            <div
                                onClick={triggerCamera}
                                className="w-full h-48 bg-slate-50 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors border-2 border-dashed border-slate-200 overflow-hidden relative group"
                            >
                                {imagePreview ? (
                                    <>
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="text-white font-medium flex items-center gap-2">
                                                <Camera size={20} /> Retake
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-slate-400">
                                        <Camera size={32} />
                                        <span className="text-sm font-medium">Tap to take photo</span>
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                capture="environment"
                                onChange={handleImageSelect}
                                ref={fileInputRef}
                                className="hidden"
                            />
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={handleConfirm}
                                disabled={isPending}
                                className="w-full bg-emerald-600 text-white p-4 rounded-xl font-bold text-lg shadow-lg hover:bg-emerald-700 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isPending ? <Loader2 className="animate-spin" /> : (
                                    <>
                                        <CheckCircle2 size={24} />
                                        Confirm & Add to Inventory
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => {
                                    setStep('scan');
                                    setFoundItem(null);
                                    setScanId("");
                                }}
                                disabled={isPending}
                                className="w-full bg-white text-slate-600 border border-slate-200 p-4 rounded-xl font-bold hover:bg-slate-50 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {step === 'create' && (
                    <div className="flex flex-col gap-6 animate-fade-in">
                        <div className="bg-white p-8 rounded-3xl shadow-md border border-slate-100 flex flex-col gap-6">
                            <div className="text-center relative">
                                <div
                                    onClick={triggerCamera}
                                    className="w-24 h-24 bg-slate-100 rounded-2xl flex flex-col items-center justify-center mx-auto mb-3 cursor-pointer hover:bg-slate-200 transition-colors overflow-hidden relative group"
                                >
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <>
                                            <Camera size={32} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                                            <span className="text-[10px] text-slate-400 font-bold mt-1">Add Photo</span>
                                        </>
                                    )}
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900">Add New Item</h2>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    onChange={handleImageSelect}
                                    className="hidden"
                                />
                            </div>

                            <form onSubmit={handleCreate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Item Name</label>
                                    <input
                                        type="text"
                                        value={newItemName}
                                        onChange={(e) => setNewItemName(e.target.value)}
                                        placeholder="e.g. 50ml Falcon Tubes"
                                        className="w-full p-4 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                    <select
                                        value={newItemCategory}
                                        onChange={(e) => {
                                            const cat = e.target.value;
                                            setNewItemCategory(cat);
                                            setQuantityReceived(1); // Default to 1

                                            if (cat === 'Equipment') {
                                                setNewItemMinStock(1);
                                            } else if (cat === 'Biological') {
                                                setNewItemMinStock(2);
                                            } else {
                                                setNewItemMinStock(5);
                                            }
                                            // Reset plasmid if not biological
                                            if (cat !== 'Biological') {
                                                setIsPlasmid(false);
                                            }
                                        }}
                                        className="w-full p-4 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none bg-white"
                                        required
                                    >
                                        <option value="General">General</option>
                                        <option value="Biological">Biological</option>
                                        <option value="Equipment">Equipment</option>
                                    </select>

                                    {/* Plasmid Checkbox - Only for Biological */}
                                    {newItemCategory === 'Biological' && (
                                        <div className="flex items-center gap-3 mt-3 bg-purple-50 p-3 rounded-xl border border-purple-100">
                                            <div className="relative flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="isPlasmid"
                                                    checked={isPlasmid}
                                                    onChange={(e) => setIsPlasmid(e.target.checked)}
                                                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 border-gray-300"
                                                />
                                            </div>
                                            <label htmlFor="isPlasmid" className="text-sm text-purple-800 font-medium cursor-pointer select-none flex-1">
                                                Is this a Plasmid?
                                                <span className="block text-xs text-purple-600 font-normal mt-0.5">
                                                    Auto-generates ID: <strong>{plasmidIdPrefix}-xxxx</strong>
                                                </span>
                                            </label>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Barcode (Optional)</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={newItemBarcode}
                                            onChange={(e) => setNewItemBarcode(e.target.value)}
                                            placeholder="Scan or leave empty for Auto-ID"
                                            className="w-full p-4 pr-14 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-mono"
                                            disabled={isPlasmid}
                                        />
                                        {!isPlasmid && (
                                            <button
                                                type="button"
                                                onClick={() => setShowCreateScanner(true)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Camera size={24} />
                                            </button>
                                        )}
                                    </div>
                                    {!newItemBarcode && (
                                        <p className="text-xs text-slate-400 mt-1 ml-1">
                                            Will generate: <strong>{isPlasmid ? `${plasmidIdPrefix}-xxxx` : `${labIdPrefix}-xxxx`}</strong>
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Owner</label>
                                    <select
                                        value={newItemOwner}
                                        onChange={(e) => setNewItemOwner(e.target.value)}
                                        className="w-full p-4 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none bg-white"
                                    >
                                        <option value="lab-stock">Lab Stock</option>
                                        <option value="">Select Owner...</option>
                                        {teamMembers.map(member => (
                                            <option key={member._id} value={member._id}>{member.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Storage Location</label>
                                    <LocationCombobox
                                        value={newItemLocation}
                                        onChange={setNewItemLocation}
                                        options={availableLocations}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Quantity Received</label>
                                    <div className="flex items-center justify-center gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setQuantityReceived(Math.max(1, quantityReceived - 1))}
                                            className="w-12 h-12 flex items-center justify-center bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200 active:scale-95 transition-all"
                                        >
                                            <Minus size={20} />
                                        </button>
                                        <input
                                            type="number"
                                            value={quantityReceived}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value);
                                                setQuantityReceived(isNaN(val) ? 1 : Math.max(1, val));
                                            }}
                                            className="w-20 p-3 text-center font-bold text-xl border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setQuantityReceived(quantityReceived + 1)}
                                            className="w-12 h-12 flex items-center justify-center bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200 active:scale-95 transition-all"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Low Stock Threshold</label>
                                    <div className="flex items-center justify-center gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setNewItemMinStock(Math.max(1, newItemMinStock - 1))}
                                            className="w-10 h-10 flex items-center justify-center bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200 active:scale-95 transition-all"
                                        >
                                            <Minus size={18} />
                                        </button>
                                        <input
                                            type="number"
                                            value={newItemMinStock}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value);
                                                setNewItemMinStock(isNaN(val) ? 1 : Math.max(1, val));
                                            }}
                                            className="w-16 p-2 text-center font-bold text-lg border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setNewItemMinStock(newItemMinStock + 1)}
                                            className="w-10 h-10 flex items-center justify-center bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200 active:scale-95 transition-all"
                                        >
                                            <Plus size={18} />
                                        </button>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1 text-center">
                                        Item status becomes "Low Stock" below this amount.
                                    </p>
                                </div>

                                <div className="pt-4 space-y-3">
                                    <button
                                        type="submit"
                                        disabled={isPending || !newItemName}
                                        className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isPending ? <Loader2 className="animate-spin" /> : "Create & Add to Inventory"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setStep('scan')}
                                        disabled={isPending}
                                        className="w-full bg-white text-slate-600 border border-slate-200 p-4 rounded-xl font-bold hover:bg-slate-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
