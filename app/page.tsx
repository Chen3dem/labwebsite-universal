import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/fetch";
import { FEATURED_PROJECTS_QUERY, LATEST_NEWS_QUERY, HOME_PAGE_QUERY } from "@/sanity/lib/queries";
import Image from "next/image";
import HeroSlider from "@/components/HeroSlider";
import { urlFor } from "@/sanity/lib/image";

export const revalidate = 60;

export default async function Home() {
    const [featuredProjects, latestNews, homePageData] = await Promise.all([
        sanityFetch({ query: FEATURED_PROJECTS_QUERY }),
        sanityFetch({ query: LATEST_NEWS_QUERY }),
        sanityFetch({ query: HOME_PAGE_QUERY }),
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
                                {homePageData?.heroTitle || "Deciphering Cellular Signaling on Membranes"}
                            </h1>
                            <p className="relative z-20 text-slate-600 font-light max-w-lg leading-relaxed text-base sm:text-lg md:text-xl mt-6">
                                The Cui Lab illuminates the hidden mechanisms of membrane-localized signaling events, remodeling our understanding of cellular adaptation.
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
                                /* Fallback to original circles if no image set */
                                <>
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] lg:w-[45vw] lg:h-[45vw] bg-secondary/30 rounded-full blur-3xl -z-10 animate-pulse"></div>
                                    <div className="absolute top-0 right-0 lg:top-20 w-[15vw] h-[15vw] bg-accent/40 rounded-full mix-blend-multiply filter blur-xl animate-bounce duration-[3000ms]"></div>
                                    <div className="absolute bottom-0 left-0 lg:bottom-10 lg:left-10 w-[20vw] h-[20vw] bg-primary/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse duration-[4000ms]"></div>

                                    <div className="relative z-10 w-full h-full">
                                        <div className="absolute top-0 right-0 lg:top-10 lg:right-10 w-[45vw] h-[45vw] sm:w-[35vw] sm:h-[35vw] md:w-[25vw] md:h-[25vw] rounded-full overflow-hidden border-4 border-white shadow-2xl shape-blob">
                                            {featuredProjects[0]?.mainImage ? (
                                                <Image src={urlFor(featuredProjects[0].mainImage).url()} alt="Research" fill className="object-cover scale-110" />
                                            ) : (
                                                <div className="w-full h-full bg-slate-200"></div>
                                            )}
                                        </div>

                                        <div className="absolute bottom-0 left-0 lg:bottom-20 lg:left-10 w-[30vw] h-[30vw] sm:w-[25vw] sm:h-[25vw] md:w-[15vw] md:h-[15vw] rounded-full overflow-hidden border-4 border-white shadow-xl mix-blend-hard-light opacity-90">
                                            {featuredProjects[1]?.mainImage ? (
                                                <Image src={urlFor(featuredProjects[1].mainImage).url()} alt="Research" fill className="object-cover grayscale contrast-125" />
                                            ) : (
                                                <div className="w-full h-full bg-primary/50"></div>
                                            )}
                                            <div className="absolute inset-0 bg-primary/40 mix-blend-color"></div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
