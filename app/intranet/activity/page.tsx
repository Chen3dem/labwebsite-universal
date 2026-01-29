import { createClient } from "next-sanity";
import Link from "next/link";
import { ArrowLeft, Activity } from "lucide-react";
import { ActivitySearch } from "./search";

export const revalidate = 0;

const getClient = () => createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: "2024-01-01",
    useCdn: false,
});

type ActivityEvent = {
    _key: string;
    timestamp: string;
    user: string;
    action: string;
    target: string;
    details?: string;
    itemId?: string;
};

export default async function ActivityLogPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const resolvedSearchParams = await searchParams;
    const q = resolvedSearchParams.q?.toLowerCase() || "";

    // If searching, we need to inspect events inside the daily logs.
    // If not searching, we just get the most recent daily logs and their events.
    let events: ActivityEvent[] = [];

    if (q) {
        // Search Mode: Find events matching the query
        // Note: Sanity doesn't support deep array filtering efficiently in GROQ for this structure universally,
        // but we can fetch recent logs and filter in memory, or use a specific GROQ.
        // Let's fetch the last 30 days of logs and filter in code for flexibility.
        const logs = await getClient().fetch(`*[_type == "dailyActivityLog"] | order(date desc) [0...30] {
            events
        }`);

        const allEvents = logs.flatMap((log: any) => log.events || []);
        events = allEvents.filter((e: ActivityEvent) =>
            e.user?.toLowerCase().includes(q) ||
            e.action?.toLowerCase().includes(q) ||
            e.target?.toLowerCase().includes(q) ||
            e.details?.toLowerCase().includes(q)
        );
    } else {
        // Default Mode: Fetch last 7 days of events
        const logs = await getClient().fetch(`*[_type == "dailyActivityLog"] | order(date desc) [0...7] {
            events
        }`);
        events = logs.flatMap((log: any) => log.events || []);
    }

    // Sort descending by timestamp
    events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col pt-32">
            <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-24 z-10 px-6 sm:px-12">
                <div className="flex items-center gap-4">
                    <Link href="/intranet" className="text-slate-500 hover:text-slate-800 transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-xl font-bold font-serif text-slate-800 flex items-center gap-2">
                        <Activity className="text-cyan-600" />
                        Activity Log
                    </h1>
                </div>
            </header>

            <main className="flex-1 p-6 max-w-2xl mx-auto w-full">
                <ActivitySearch />

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    {events.length > 0 ? (
                        <div className="divide-y divide-slate-100">
                            {events.map((log: ActivityEvent) => (
                                <div key={log._key} className="p-4 hover:bg-slate-50 transition-colors">
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="font-bold text-slate-800 text-sm">{log.action}</div>
                                        <div className="text-xs text-slate-400 font-mono">
                                            {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                    <div className="text-sm text-slate-600 mb-1">
                                        <span className="font-medium text-slate-900">{log.user}</span> on <span className="font-medium text-slate-900">{log.target}</span>
                                    </div>
                                    {log.details && (
                                        <div className="text-xs text-slate-400 font-mono bg-slate-50 p-1.5 rounded border border-slate-100 mt-2">
                                            {log.details}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-slate-400">
                            {q ? `No results for "${q}"` : "No activity recorded recently."}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
