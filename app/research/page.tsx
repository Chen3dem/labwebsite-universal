import { sanityFetch } from "@/sanity/lib/fetch";
import { ALL_PROJECTS_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import Image from "next/image";

import { urlFor } from "@/sanity/lib/image";

export const revalidate = 60;

export default async function ResearchPage() {
    const [projects, siteSettings] = await Promise.all([
        sanityFetch({ query: ALL_PROJECTS_QUERY }),
        sanityFetch({ query: SITE_SETTINGS_QUERY }),
    ]);

    return (
        <div className="bg-white min-h-screen pt-32 pb-24 text-slate-900">

            {/* HEADER */}
            <div className="max-w-4xl mx-auto text-center mb-12 px-4">
                <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 text-slate-900">
                    What We <span className="text-primary">Do</span>
                </h1>
                <div className="text-lg text-slate-700 font-light space-y-6 text-left max-w-4xl mx-auto leading-relaxed mt-8 whitespace-pre-line">
                    <p>
                        {siteSettings?.researchIntro || "Add your research introduction in Sanity Studio (Site Settings > Research Page Intro)."}
                    </p>
                </div>
            </div>

            {/* ZIG-ZAG CONTENT */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-0">
                {projects.length > 0 ? (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    projects.map((project: any, index: number) => (
                        <div
                            key={project._id}
                            className={`flex flex-col lg:flex-row items-stretch border-t border-slate-200 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
                        >

                            {/* Image Section (50%) */}
                            <div className="w-full lg:w-1/2 relative min-h-[350px] border-b lg:border-b-0 border-slate-200">
                                {project.mainImage ? (
                                    <Image src={urlFor(project.mainImage).url()} alt={project.title} fill className={`object-${project.imageFit || 'contain'} p-4 transition-all duration-700`} />
                                ) : (
                                    <div className="absolute inset-0 bg-slate-50 flex items-center justify-center">
                                        <span className="text-slate-300 text-6xl font-bold opacity-30">0{index + 1}</span>
                                    </div>
                                )}
                            </div>

                            {/* Text Section (50%) */}
                            <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center bg-white">

                                <h2 className="text-3xl font-display font-bold mb-6 text-slate-900">
                                    {project.title}
                                </h2>
                                <p className="text-slate-600 text-lg leading-relaxed mb-8">
                                    {project.summary}
                                </p>

                            </div>

                        </div>
                    ))
                ) : (
                    <div className="border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-slate-400">
                            <span className="text-4xl text-slate-400">🔬</span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">No Projects Added Yet</h2>
                        <p className="text-slate-500 mb-8 max-w-md mx-auto">
                            Add your first research project in <strong>Sanity Studio &gt; Research Projects</strong>.
                        </p>
                        <div className="bg-slate-50 px-6 py-4 rounded-xl text-sm font-mono text-slate-600 border border-slate-200">
                            Research Projects will appear here in a alternating grid layout.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
