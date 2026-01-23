import Link from "next/link";
import Image from "next/image";
import { sanityFetch } from "@/sanity/lib/fetch";
import { ALL_NEWS_QUERY, GALLERY_IMAGES_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

export const revalidate = 60;

export default async function NewsPage(props: { searchParams: Promise<{ page?: string }> }) {
    const searchParams = await props.searchParams;
    const allNews = await sanityFetch({ query: ALL_NEWS_QUERY });
    const galleryImages = await sanityFetch({ query: GALLERY_IMAGES_QUERY });

    const ITEMS_PER_PAGE = 6;
    const currentPage = Number(searchParams?.page) || 1;
    const totalPages = Math.ceil(allNews.length / ITEMS_PER_PAGE);

    // Calculate start and end index
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentNews = allNews.slice(startIndex, endIndex);

    return (
        <div className="bg-white min-h-screen pt-32 pb-24 text-slate-900">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="mb-20 text-center">
                    <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 text-slate-900">News</h1>
                </div>

                <div className="space-y-2 relative border-l border-slate-200 ml-4 md:ml-0 md:border-l-0 mb-20">
                    {currentNews.length > 0 ? (
                        currentNews.map((item: any) => {
                            const NewsContent = (
                                <div className="bg-white border border-slate-200 shadow-sm hover:shadow-lg hover:border-primary/50 transition-all duration-300 rounded-sm overflow-hidden w-full flex flex-col md:flex-row min-h-[140px] group-hover:bg-slate-50/50">

                                    {/* Optional Image */}
                                    {item.mainImage && (
                                        <div className="relative w-full md:w-48 aspect-video md:aspect-auto">
                                            <Image
                                                src={urlFor(item.mainImage).url()}
                                                alt={item.title}
                                                fill
                                                className={`object-${item.imageFit || 'cover'} grayscale group-hover:grayscale-0 transition-all duration-700`}
                                            />
                                        </div>
                                    )}

                                    {/* Text Content */}
                                    <div className={`p-5 flex-1 ${item.mainImage ? '' : ''}`}>
                                        <div className="mb-1 text-xs text-primary font-bold uppercase tracking-widest flex items-center gap-2">
                                            {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : 'TBD'}
                                            {item.url && <span className="text-[10px] bg-primary/10 px-1.5 py-0.5 rounded-full text-primary">External Link ↗</span>}
                                        </div>

                                        <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors text-slate-900">
                                            {item.title}
                                        </h2>

                                        <p className="text-slate-600 text-base leading-relaxed line-clamp-2">
                                            {item.excerpt}
                                        </p>
                                    </div>
                                </div>
                            );

                            return (
                                <div key={item._id} className="relative flex flex-col md:flex-row gap-4 items-start group">
                                    {/* Timeline Dot (Desktop) */}
                                    <div className="hidden md:block absolute left-[-45px] top-6 w-3 h-3 rounded-full bg-slate-400 ring-4 ring-white group-hover:bg-primary transition-colors"></div>

                                    {/* Content Container (Wrapped if URL exists) */}
                                    {item.url ? (
                                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="w-full block">
                                            {NewsContent}
                                        </a>
                                    ) : (
                                        <div className="w-full">
                                            {NewsContent}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-slate-500 text-center">No news to display.</p>
                    )}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-4 mb-32">
                        {currentPage > 1 && (
                            <Link
                                href={`/news?page=${currentPage - 1}`}
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
                                href={`/news?page=${currentPage + 1}`}
                                className="px-6 py-2 border border-slate-300 rounded-full text-slate-600 hover:bg-slate-100 transition-colors bg-white font-medium"
                            >
                                Older →
                            </Link>
                        )}
                    </div>
                )}

                {/* Image Slider - Fun Moments */}
                {galleryImages.length > 0 && (
                    <div className="mb-12">
                        <div className="text-center mb-10">
                            <h2 className="text-5xl md:text-6xl font-display font-bold mb-6 text-slate-900">Fun</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                            {galleryImages.map((image: any) => {
                                const GalleryItem = (
                                    <div className="group h-full">
                                        <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-md mb-4 bg-slate-50 border border-slate-100 group-hover:shadow-lg transition-all duration-300">
                                            <Image
                                                src={urlFor(image.image).url()}
                                                alt={image.title || "Fun moment"}
                                                fill
                                                className={`object-${image.imageFit || 'contain'} transition-transform duration-500 group-hover:scale-105`}
                                            />
                                            {image.url && (
                                                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm">
                                                    <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-slate-600 text-sm text-center italic leading-relaxed px-2 group-hover:text-primary transition-colors">
                                            {image.caption}
                                        </p>
                                    </div>
                                );

                                return (
                                    <div key={image._id}>
                                        {image.url ? (
                                            <a href={image.url} target="_blank" rel="noopener noreferrer" className="block h-full cursor-pointer">
                                                {GalleryItem}
                                            </a>
                                        ) : (
                                            GalleryItem
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
