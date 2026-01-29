"use client";

import { useTransition } from "react";
import { updateItemOwner } from "../../actions";
import { Check, ChevronDown, User, Users } from "lucide-react";
import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";

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
    const [isPending, startTransition] = useTransition();
    const [open, setOpen] = useState(false);

    // Fallback if currentOwner is undefined/null or if it is the PI (hidden)
    const displayOwner = (currentOwner && currentOwner.name !== "Zhicheng (Chen) Cui")
        ? currentOwner
        : { name: "Lab Stock", _id: "lab-stock-placeholder", role: "admin", headshot: undefined };

    const handleSelect = (memberId: string) => {
        setOpen(false);
        startTransition(async () => {
            await updateItemOwner(itemId, memberId);
        });
    };

    return (
        <Popover.Root open={open} onOpenChange={setOpen}>
            <Popover.Trigger asChild>
                <button
                    disabled={isPending}
                    className="w-full bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-colors group text-left"
                >
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${displayOwner.name === 'Lab Stock' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                            {displayOwner.headshot ? (
                                // Placeholder for realistic image handling
                                <User size={20} />
                            ) : displayOwner.name === 'Lab Stock' ? (
                                <Users size={20} />
                            ) : (
                                <span className="font-bold text-sm">
                                    {displayOwner.name.charAt(0)}
                                </span>
                            )}
                        </div>
                        <div>
                            <span className="block text-xs uppercase tracking-widest text-slate-400">Owner</span>
                            <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                {displayOwner.name}
                            </span>
                        </div>
                    </div>
                    <ChevronDown size={20} className="text-slate-300 group-hover:text-slate-500" />
                </button>
            </Popover.Trigger>

            <Popover.Portal>
                <Popover.Content className="w-[var(--radix-popover-trigger-width)] bg-white rounded-xl shadow-xl border border-slate-100 p-1 z-50 animate-fade-in max-h-60 overflow-y-auto" sideOffset={5}>
                    {/* Lab Stock Option (Always First) */}
                    <button
                        onClick={() => handleSelect('lab-stock')}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm transition-colors ${displayOwner.name === 'Lab Stock' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-indigo-100 text-indigo-600`}>
                            <Users size={14} />
                        </div>
                        <span className="font-medium flex-1 text-left">Lab Stock</span>
                        {displayOwner.name === 'Lab Stock' && <Check size={16} />}
                    </button>

                    <div className="h-px bg-slate-100 my-1 mx-2"></div>

                    {/* Team Members */}
                    {allMembers
                        .filter(m => m.name !== "Lab Stock" && m.role !== "Principal Investigator") // Double check filters
                        .map((member) => (
                            <button
                                key={member._id}
                                onClick={() => handleSelect(member._id)}
                                className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm transition-colors ${member._id === displayOwner._id ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
                                    }`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-slate-100 text-slate-500`}>
                                    <span className="font-bold text-xs">{member.name.charAt(0)}</span>
                                </div>
                                <span className="font-medium flex-1 text-left">{member.name}</span>
                                {member._id === displayOwner._id && <Check size={16} />}
                            </button>
                        ))}
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
