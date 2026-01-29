
"use client";

import { useState, useRef } from "react";
import { addInventoryNote } from "../../actions";
import { Plus, MessageSquare } from "lucide-react";
import { showToast, updateToast } from "@/components/Toast";

interface Note {
    _key: string;
    content: string;
    timestamp: string;
    author: string;
}

export function ItemNotes({ itemId, notes: initialNotes }: { itemId: string, notes: Note[] }) {
    const [showForm, setShowForm] = useState(false);
    const [newNote, setNewNote] = useState("");
    const [notes, setNotes] = useState(initialNotes || []);

    // Track user edits to prevent prop sync from reverting
    const userEditedRef = useRef(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newNote.trim()) return;

        const noteContent = newNote.trim();

        // Create optimistic note
        const optimisticNote: Note = {
            _key: `optimistic-${Date.now()}`,
            content: noteContent,
            timestamp: new Date().toISOString(),
            author: "You"
        };

        // Update UI IMMEDIATELY
        setNotes(prev => [...prev, optimisticNote]);
        setNewNote("");
        setShowForm(false);
        userEditedRef.current = true;

        const toastId = showToast("Saving note...", "loading");

        addInventoryNote(itemId, noteContent)
            .then(() => {
                updateToast(toastId, "✓ Note saved!", "success");
                // Allow prop sync after delay
                setTimeout(() => { userEditedRef.current = false; }, 2000);
            })
            .catch((err) => {
                console.error(err);
                updateToast(toastId, "Failed to save note", "error");
                // Revert optimistic update
                setNotes(prev => prev.filter(n => n._key !== optimisticNote._key));
                userEditedRef.current = false;
            });
    };

    return (
        <div id="notes-section" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4 scroll-mt-24">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <MessageSquare size={16} className="text-blue-500" />
                    Notes & Activity
                </h3>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg transition-colors"
                >
                    <Plus size={14} /> Add Note
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="flex flex-col gap-2 animate-in slide-in-from-top-2 duration-200">
                    <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Write a note..."
                        className="w-full p-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-slate-50 focus:bg-white transition-colors"
                        rows={3}
                        autoFocus
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="text-xs font-bold text-slate-500 hover:text-slate-700 px-3 py-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!newNote.trim()}
                            className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            Save Note
                        </button>
                    </div>
                </form>
            )}

            <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
                {notes && notes.length > 0 ? (
                    // Show newest first (assuming Sanity appends to end, we reverse or sort)
                    // Sanity append adds to end. So [0] is oldest.
                    // We probably want newest first.
                    [...notes].reverse().map((note) => (
                        <div key={note._key} className="flex flex-col gap-1 text-sm bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <p className="text-slate-700 whitespace-pre-wrap">{note.content}</p>
                            <div className="flex justify-between items-center mt-1">
                                <span className="text-xs font-bold text-slate-500">{note.author}</span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                    {new Date(note.timestamp).toLocaleDateString()} {new Date(note.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-slate-400 text-xs text-center italic py-2">No notes yet.</p>
                )}
            </div>
        </div>
    );
}

