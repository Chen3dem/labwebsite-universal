import { createClient } from "next-sanity";
import Link from "next/link";
import { LayoutDashboard, FileText, Download, ExternalLink, Dna, Wrench, ShieldAlert, Box, Filter, Search } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { ProtocolControls } from "./controls";

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: "2024-01-01",
    useCdn: false,
});

export const revalidate = 0;

// Category display info
const CATEGORY_INFO: Record<string, { label: string; color: string; icon: any }> = {
    General: { label: 'General', color: 'bg-amber-100 text-amber-600', icon: FileText },
    Biological: { label: 'Biological', color: 'bg-purple-100 text-purple-600', icon: Dna },
    Equipment: { label: 'Equipment', color: 'bg-emerald-100 text-emerald-600', icon: Wrench },
    Safety: { label: 'Safety', color: 'bg-red-100 text-red-600', icon: ShieldAlert },
    Other: { label: 'Other', color: 'bg-slate-100 text-slate-600', icon: Box },
};

interface Protocol {
    _id: string;
    title: string;
    category: string;
    description: string;
    versions?: {
        version: string;
        uploadedAt: string;
        notes?: string;
        file: {
            asset: {
                url: string;
            }
        }
    }[];
    file?: { asset: { url: string } };
    link?: string;
    tags?: string[];
}

export default async function ProtocolsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { q, category } = await searchParams;

    // Filter Logic
    const filter = [`_type == "protocol"`];
    const params: Record<string, string> = {};

    if (q && typeof q === "string") {
        filter.push(`(title match "*" + $q + "*" || description match "*" + $q + "*")`);
        params.q = q;
    }

    if (category && typeof category === "string" && category !== "all") {
        filter.push(`category == $category`);
        params.category = category;
    }

    // Fetch Data
    const protocols: Protocol[] = await client.fetch(`
        *[${filter.join(" && ")}] | order(title asc) {
            _id,
            title,
            category,
            description,
            versions[] {
                version,
                uploadedAt,
                notes,
                file {
                    asset->{
                        url
                    }
                }
            },
            file {
                asset->{
                    url
                }
            },
            link,
            tags
        }
    `, params);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col pt-32">
            <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-24 z-40 px-6 sm:px-12">
                <Link href="/intranet" className="text-slate-500 hover:text-slate-800 flex items-center gap-2 font-medium transition-colors">
                    <LayoutDashboard size={24} />
                    <span className="hidden sm:inline">Dashboard</span>
                </Link>
                <h1 className="text-xl font-bold font-serif text-slate-800">
                    Protocols & Manuals
                </h1>
                <UserButton />
            </header>

            <main className="flex-1 p-6 sm:p-12 max-w-7xl mx-auto w-full">
                <ProtocolControls />

                {!q && !category ? (
                    // ROOT VIEW: Category Cards
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {Object.entries(CATEGORY_INFO).map(([catKey, catInfo]) => {
                            const Icon = catInfo.icon;
                            // Note: Counting implies fetching ALL protocols. 
                            // Since we fetched filtered list, and filter is empty here, 'protocols' has ALL items.
                            const count = protocols.filter(p => p.category === catKey).length;

                            return (
                                <Link
                                    key={catKey}
                                    href={`/protocols?category=${encodeURIComponent(catKey)}`}
                                    className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all group flex flex-col items-center justify-center gap-4 text-center"
                                >
                                    <div className={`w-20 h-20 ${catInfo.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                        <Icon size={36} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl text-slate-800 group-hover:text-blue-600 transition-colors">{catInfo.label}</h3>
                                        <p className="text-sm text-slate-400 font-mono mt-1">{count} protocols</p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    // FILTERED VIEW: Grid
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-8">
                            <Link
                                href="/protocols"
                                className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium px-4 py-2 bg-white rounded-lg border border-slate-200 shadow-sm transition-colors"
                            >
                                <Filter size={16} />
                                Back to Categories
                            </Link>
                            <h1 className="text-2xl font-bold font-serif text-slate-900">
                                {category ? (CATEGORY_INFO[category as string]?.label || category) : 'Search Results'}
                            </h1>
                        </div>

                        {protocols.length === 0 ? (
                            <div className="text-center py-20 text-slate-500 bg-white rounded-xl border border-slate-100 mt-4">
                                <p className="text-lg">No protocols found.</p>
                                <p className="text-sm mt-2">Try adjusting your search or filters.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {protocols.map((protocol) => {
                                    // Determine latest version logic
                                    const sortedVersions = protocol.versions?.slice().sort((a, b) =>
                                        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
                                    ) || [];
                                    const latestVersion = sortedVersions[0];
                                    const downloadUrl = latestVersion?.file?.asset?.url || protocol.file?.asset?.url;

                                    return (
                                        <div key={protocol._id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 border border-slate-100 flex flex-col h-full group relative">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className={`p-3 rounded-xl transition-colors ${CATEGORY_INFO[protocol.category]?.color || 'bg-slate-100 text-slate-600'}`}>
                                                    <FileText size={24} />
                                                </div>
                                                <div className="flex flex-col items-end gap-1">
                                                    {latestVersion && latestVersion.version && (
                                                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                                                            v{latestVersion.version}
                                                        </span>
                                                    )}
                                                    {protocol.tags && (
                                                        <div className="flex flex-wrap gap-1 justify-end">
                                                            {protocol.tags.slice(0, 2).map(tag => (
                                                                <span key={tag} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <h3 className="font-bold text-slate-900 text-lg mb-2 leading-tight">
                                                {protocol.title}
                                            </h3>

                                            {protocol.description && (
                                                <p className="text-slate-500 text-sm mb-4 line-clamp-3">
                                                    {protocol.description}
                                                </p>
                                            )}

                                            <div className="mt-auto pt-4 flex gap-3">
                                                {downloadUrl && (
                                                    <a
                                                        href={downloadUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-xl font-medium text-sm hover:bg-slate-800 transition-colors"
                                                    >
                                                        <Download size={16} />
                                                        PDF
                                                    </a>
                                                )}
                                                {protocol.link && (
                                                    <a
                                                        href={protocol.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm transition-colors border max-w-[50%] px-4
                                                            ${downloadUrl
                                                                ? "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                                                                : "flex-1 bg-blue-600 text-white border-transparent hover:bg-blue-700"
                                                            }`}
                                                    >
                                                        <ExternalLink size={16} />
                                                        {downloadUrl ? "Link" : "Open"}
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
