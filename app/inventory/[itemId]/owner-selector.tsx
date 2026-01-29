"use client";

import { useState, useEffect } from "react";
import { updateItemOwner } from "../../actions";
import { Check, ChevronDown, User, Users } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import { showToast, updateToast } from "@/components/Toast";

interface TeamMember {
    _id: string;
    name: string;
    role: string;
    headshot?: any;
}

interface OwnerSelectorProps {
    itemId: string;
    currentOwner: TeamMember;
    allMembers: TeamMember[];
}

export function OwnerSelector({ itemId, currentOwner, allMembers }: OwnerSelectorProps) {
    const [open, setOpen] = useState(false);
    const [ownerId, setOwnerId] = useState(currentOwner?._id || 'lab-stock-placeholder');

    // Sync with props when they change
    useEffect(() => {
        setOwnerId(currentOwner?._id || 'lab-stock-placeholder');
    }, [currentOwner]);

    // Derive display owner from ID
    const displayOwner = ownerId === 'lab-stock-placeholder'
        ? { name: "Lab Stock", _id: "lab-stock-placeholder", role: "admin", headshot: undefined }
        : allMembers.find(m => m._id === ownerId) || currentOwner || { name: "Lab Stock", _id: "lab-stock-placeholder", role: "admin", headshot: undefined };

    // Hide PI
    const finalOwner = (displayOwner.name === "Zhicheng (Chen) Cui")
        ? { name: "Lab Stock", _id: "lab-stock-placeholder", role: "admin", headshot: undefined }
        : displayOwner;

    const handleSelect = (memberId: string) => {
        setOpen(false);

        // Update UI IMMEDIATELY
        const newId = memberId === 'lab-stock' ? 'lab-stock-placeholder' : memberId;
        setOwnerId(newId);

        const ownerName = memberId === 'lab-stock' ? 'Lab Stock' : allMembers.find(m => m._id === memberId)?.name || 'Unknown';
        const toastId = showToast(`Setting owner to ${ownerName}...`, "loading");

        updateItemOwner(itemId, memberId)
            .then(() => {
                updateToast(toastId, `✓ Owner: ${ownerName}`, "success");
            })
            .catch((err) => {
                console.error(err);
                updateToast(toastId, "Failed to update owner", "error");
                setOwnerId(currentOwner?._id || 'lab-stock-placeholder'); // Revert
            });
    };

    return (
        <Popover.Root open={open} onOpenChange={setOpen}>
            <Popover.Trigger asChild>
                <button
                    className="w-full bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-colors group text-left"
                >
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${finalOwner.name === 'Lab Stock' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                            {finalOwner.headshot ? (
                                <User size={20} />
                            ) : finalOwner.name === 'Lab Stock' ? (
                                <Users size={20} />
                            ) : (
                                <span className="font-bold text-sm">
                                    {finalOwner.name?.charAt(0)}
                                </span>
                            )}
                        </div>
                        <div>
                            <span className="block text-xs uppercase tracking-widest text-slate-400">Owner</span>
                            <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                {finalOwner.name}
                            </span>
                        </div>
                    </div>
                    <ChevronDown size={20} className="text-slate-300 group-hover:text-slate-500" />
                </button>
            </Popover.Trigger>

            <Popover.Portal>
                <Popover.Content className="w-[var(--radix-popover-trigger-width)] bg-white rounded-xl shadow-xl border border-slate-100 p-1 z-50 animate-fade-in max-h-60 overflow-y-auto" sideOffset={5}>
                    {/* Lab Stock Option */}
                    <button
                        onClick={() => handleSelect('lab-stock')}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm transition-colors ${finalOwner.name === 'Lab Stock' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-indigo-100 text-indigo-600">
                            <Users size={14} />
                        </div>
                        <span className="font-medium flex-1 text-left">Lab Stock</span>
                        {finalOwner.name === 'Lab Stock' && <Check size={16} />}
                    </button>

                    <div className="h-px bg-slate-100 my-1 mx-2"></div>

                    {/* Team Members */}
                    {allMembers
                        .filter(m => m.name !== "Lab Stock" && m.role !== "Principal Investigator")
                        .map((member) => (
                            <button
                                key={member._id}
                                onClick={() => handleSelect(member._id)}
                                className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm transition-colors ${member._id === finalOwner._id ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'}`}
                            >
                                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-slate-100 text-slate-500">
                                    <span className="font-bold text-xs">{member.name.charAt(0)}</span>
                                </div>
                                <span className="font-medium flex-1 text-left">{member.name}</span>
                                {member._id === finalOwner._id && <Check size={16} />}
                            </button>
                        ))}
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}

