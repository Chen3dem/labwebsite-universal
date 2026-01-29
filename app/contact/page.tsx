import Image from "next/image";
import { sanityFetch } from "@/sanity/lib/fetch";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

export const revalidate = 60;

export default async function ContactPage() {
    const siteSettings = await sanityFetch({ query: SITE_SETTINGS_QUERY });
    return (
        <div className="bg-white min-h-screen pt-36 pb-16 text-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Section: Centered Logo */}
                <div className="flex flex-col items-center justify-center max-w-6xl mx-auto mb-20">

                    {/* Logo - Use Institution Logo from Site Settings */}
                    <div className="flex-shrink-0 relative">
                        {siteSettings?.institutionLogo?.asset ? (
                            <a href="#" className="block hover:opacity-90 transition-opacity">
                                <Image
                                    src={urlFor(siteSettings.institutionLogo).url()}
                                    alt="Institution Logo"
                                    width={450}
                                    height={150}
                                    className="h-auto w-auto max-w-[450px]"
                                />
                            </a>
                        ) : (
                            <div className="w-[450px] h-[150px] bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-400">
                                <span className="text-4xl mb-2">🏛️</span>
                                <span className="uppercase tracking-widest font-bold text-sm">Upload Institution Logo</span>
                                <span className="text-xs text-slate-500 mt-1">(Site Settings &gt; Institution Logo)</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

                    {/* Left Column: Contact Info */}
                    <div className="space-y-12">
                        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 h-full flex flex-col">
                            <h3 className="text-2xl font-bold text-slate-900 mb-6 uppercase tracking-wider border-b border-slate-200 pb-4">GET IN TOUCH</h3>

                            <div className="space-y-8">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Email</h4>
                                    <a href="#" className="text-primary hover:text-rose-700 transition-colors text-xl font-medium break-all">
                                        Check Footer for Contact Info
                                    </a>
                                </div>

                                <div>
                                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Lab Address</h4>
                                    <div className="text-slate-600 font-light leading-relaxed text-lg">
                                        <p>Address details available primarily in the footer.</p>
                                        <p>Please configure the contact page in Sanity or customize this content.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Join Us */}
                    <div className="space-y-12">
                        <div id="join-us" className="bg-slate-50 p-8 rounded-2xl border border-slate-100 h-full flex flex-col scroll-mt-32 lg:scroll-mt-40">
                            <h3 className="text-2xl font-bold text-slate-900 mb-6 uppercase tracking-wider border-b border-slate-200 pb-4">
                                {siteSettings?.joinUs?.title || "JOIN US"}
                            </h3>

                            <p className="text-lg text-slate-600 mb-8 leading-relaxed font-light">
                                {siteSettings?.joinUs?.introText || "We are looking for motivated scientists to join our team."}
                            </p>

                            <div className="space-y-6">
                                {siteSettings?.joinUs?.openPositions && siteSettings.joinUs.openPositions.length > 0 ? (
                                    siteSettings.joinUs.openPositions.map((position: any, idx: number) => (
                                        <div key={idx}>
                                            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">{position.title}</h4>
                                            <p className="text-slate-600 font-light text-lg">
                                                {position.description}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    // Placeholder if no positions defined
                                    <div className="border border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                                        <p className="text-slate-500 font-medium mb-1">No Open Positions Listed</p>
                                        <p className="text-xs text-slate-400">
                                            Configure this section in Sanity Studio<br />
                                            (Site Settings &gt; Join Us Section)
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
