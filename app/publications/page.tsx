import Link from "next/link";
import Image from "next/image";
import { sanityFetch } from "@/sanity/lib/fetch";
import { ALL_PUBLICATIONS_QUERY, ALL_MEMBERS_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

export const revalidate = 60;

export default async function PublicationsPage(props: { searchParams: Promise<{ page?: string }> }) {
    const searchParams = await props.searchParams;
    const [allPublications, members] = await Promise.all([
        sanityFetch({ query: ALL_PUBLICATIONS_QUERY }),
        sanityFetch({ query: ALL_MEMBERS_QUERY }),
    ]);

    const ITEMS_PER_PAGE = 6;
    const currentPage = Number(searchParams?.page) || 1;
    const totalPages = Math.ceil(allPublications.length / ITEMS_PER_PAGE);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const publications = allPublications.slice(startIndex, endIndex);

    // Helper to generate name variations for matching
    const getMemberNameVariations = (fullName: string) => {
        const variations = new Set<string>();
        const cleanName = fullName.trim();
        variations.add(cleanName.toLowerCase()); // "zhicheng cui"

        const parts = cleanName.split(' ');
        if (parts.length >= 2) {
            const first = parts[0];
            const last = parts[parts.length - 1];
            const firstInitial = first[0];

            // Variations
            variations.add(`${firstInitial} ${last}`.toLowerCase()); // "z cui"
            variations.add(`${firstInitial}. ${last}`.toLowerCase()); // "z. cui"
            variations.add(`${last} ${firstInitial}`.toLowerCase()); // "cui z"
            variations.add(`${last} ${firstInitial}.`.toLowerCase()); // "cui z."
            variations.add(`${first} ${last}`.toLowerCase());
        }
        return variations;
    };

    // Build a set of all team member name variations
    const teamVariations = new Set<string>();
    members.forEach((m: any) => {
        const vars = getMemberNameVariations(m.name);
        vars.forEach(v => teamVariations.add(v));
    });

    const isTeamMember = (authorName: string) => {
        const clean = authorName.trim().toLowerCase();
        // Check exact match first
        if (teamVariations.has(clean)) return true;

        // Check partial match (e.g. if authorName is "Zhicheng Cui (co-first)")
        // but splitting by comma usually handles this.
        // Let's try matching standardized forms of the authorName against teamVariations
        const authorVars = getMemberNameVariations(authorName);
        for (const v of authorVars) {
            if (teamVariations.has(v)) return true;
        }

        return false;
    };

    return (
        <div className="bg-white min-h-screen pt-32 pb-16 text-slate-900">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="mb-20 text-center">
                    <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 text-slate-900 uppercase tracking-tight">
                        Publications
                    </h1>
                </div>

                <div className="space-y-4">
                    {publications.length > 0 ? (
                        <div className="space-y-4">
                            {publications.map((pub: any) => (
                                <div key={pub._id} className="bg-white border border-slate-200 shadow-sm rounded-lg p-5 hover:shadow-md hover:border-primary/50 transition-all flex flex-col md:flex-row gap-5">
                                    {/* Image Section */}
                                    {pub.image && (
                                        <div className="relative w-full md:w-40 aspect-video flex-shrink-0 bg-slate-50 overflow-hidden rounded-md border border-slate-100">
                                            <Image
                                                src={urlFor(pub.image).url()}
                                                alt={pub.title}
                                                fill
                                                className={`object-${pub.imageFit || 'contain'} grayscale hover:grayscale-0 transition-all duration-500`}
                                            />
                                        </div>
                                    )}

                                    {/* Content Section */}
                                    <div className="flex-grow">
                                        <h3 className="text-lg font-bold text-slate-900 mb-1 leading-tight">
                                            <a href={pub.url || pub.file || "#"} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                                                {pub.title}
                                            </a>
                                        </h3>
                                        <div className="text-slate-600 mb-1 font-light text-sm">
                                            {/* Author Highlighting Logic with Annotations */}
                                            {pub.authors ? pub.authors.split(/,\s*/).map((author: string, index: number, arr: string[]) => {
                                                const symbols = author.match(/[*#]+/g)?.[0] || '';
                                                const cleanName = author.replace(/[*#]+/g, '').trim();
                                                const isMember = isTeamMember(cleanName);

                                                return (
                                                    <span key={index}>
                                                        {isMember ? (
                                                            <strong className="text-slate-900 font-bold">{cleanName}</strong>
                                                        ) : (
                                                            <span>{cleanName}</span>
                                                        )}
                                                        {symbols && <sup className="text-xs ml-0.5 select-none">{symbols}</sup>}
                                                        {index < arr.length - 1 && ", "}
                                                    </span>
                                                );
                                            }) : "Unknown Authors"}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 text-xs mt-1">
                                            <span className="text-primary italic font-medium">{pub.journal}</span>
                                            {pub.publishedAt && (
                                                <span className="text-slate-500">({new Date(pub.publishedAt).getFullYear()})</span>
                                            )}
                                            {pub.doi && (
                                                <span className="text-slate-400 font-mono">DOI: {pub.doi}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                                <span className="text-4xl">📚</span>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">No Publications Yet</h2>
                            <p className="text-slate-500 mb-6 max-w-md mx-auto">
                                Add your lab's publications in <strong>Sanity Studio &gt; Publications</strong>.
                            </p>
                            <div className="w-full max-w-2xl bg-white border border-slate-200 p-4 rounded-lg shadow-sm opacity-60">
                                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-slate-100 rounded w-1/2 mb-3"></div>
                                <div className="flex gap-2">
                                    <div className="h-3 bg-blue-50 rounded w-16"></div>
                                    <div className="h-3 bg-slate-50 rounded w-12"></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-4 mt-20 mb-12">
                        {currentPage > 1 && (
                            <Link
                                href={`/publications?page=${currentPage - 1}`}
                                className="px-6 py-2 border border-slate-300 rounded-full text-slate-600 hover:bg-slate-100 transition-colors bg-white font-medium"
                            >
                                ← Newer
                            </Link>
                        )}

                        <span className="px-4 py-2 text-slate-400 font-medium">
                            Page {currentPage} of {totalPages}
                        </span>

                        {currentPage < totalPages && (
                            <Link
                                href={`/publications?page=${currentPage + 1}`}
                                className="px-6 py-2 border border-slate-300 rounded-full text-slate-600 hover:bg-slate-100 transition-colors bg-white font-medium"
                            >
                                Older →
                            </Link>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}
