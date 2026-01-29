import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/fetch";
import { FEATURED_PROJECTS_QUERY, LATEST_NEWS_QUERY, HOME_PAGE_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import Image from "next/image";
import HeroSlider from "@/components/HeroSlider";
import { urlFor } from "@/sanity/lib/image";

export const revalidate = 60;

export default async function Home() {
    const [featuredProjects, latestNews, homePageData, siteSettings] = await Promise.all([
        sanityFetch({ query: FEATURED_PROJECTS_QUERY }),
        sanityFetch({ query: LATEST_NEWS_QUERY }),
        sanityFetch({ query: HOME_PAGE_QUERY }),
        sanityFetch({ query: SITE_SETTINGS_QUERY }),
    ]);

    return (
        <div className="bg-white min-h-screen text-slate-900 relative overflow-x-hidden">

            {/* HERO SECTION - Barrett Lab Style */}
            <section className="relative min-h-screen flex flex-col pt-36 pb-24 justify-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

                        {/* Left Column: Text */}
                        <div className="space-y-6 lg:col-span-5">
                            <h1 className="relative z-20 font-display font-bold text-slate-900 leading-tight text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-4xl">
                                {homePageData?.heroTitle || siteSettings?.description || "Edit Hero Title in Sanity Studio"}
                            </h1>
                            <p className="relative z-20 text-slate-600 font-light max-w-lg leading-relaxed text-base sm:text-lg md:text-xl mt-6">
                                Edit this hero description in Sanity Studio (Site Settings).
                            </p>
                            <div className="pt-2 flex flex-wrap gap-4">
                                <Link
                                    href="/research"
                                    className="inline-block px-10 py-5 bg-primary text-white text-sm font-bold uppercase tracking-widest hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 rounded-sm"
                                >
                                    Our Science
                                </Link>
                                <Link
                                    href="/contact#join-us"
                                    className="inline-block px-10 py-5 bg-primary text-white text-sm font-bold uppercase tracking-widest hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 rounded-sm"
                                >
                                    Join Us
                                </Link>
                            </div>
                        </div>

                        {/* Right Column: Dynamic Hero Image */}
                        <div className="relative h-[300px] md:h-[400px] lg:h-[500px] w-full max-w-full mx-auto lg:col-span-7 flex items-center justify-center mt-10 lg:mt-0">
                            {homePageData?.heroImages && homePageData.heroImages.length > 0 ? (
                                <HeroSlider images={homePageData.heroImages} fit={homePageData.heroImageFit} />
                            ) : homePageData?.heroImage ? (
                                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                                    <Image
                                        src={urlFor(homePageData.heroImage).url()}
                                        alt="Hero"
                                        fill
                                        className={`object-${homePageData.heroImageFit || 'contain'}`}
                                        priority
                                    />
                                </div>
                            ) : (
                                /* Fallback to Placeholder if no image set */
                                <div className="absolute inset-0 bg-slate-100 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center text-slate-400 p-8 text-center group">
                                    <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="uppercase tracking-widest font-bold text-sm text-slate-500 mb-2">Hero Image Placeholder</h3>
                                    <p className="text-xs text-slate-400 max-w-xs">
                                        Add a Hero Image in Sanity Studio<br />
                                        (Home Page &gt; Hero Image)
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
