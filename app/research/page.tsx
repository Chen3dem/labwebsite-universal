import { sanityFetch } from "@/sanity/lib/fetch";
import { ALL_PROJECTS_QUERY } from "@/sanity/lib/queries";
import Image from "next/image";

import { urlFor } from "@/sanity/lib/image";

export const revalidate = 60;

export default async function ResearchPage() {
    const projects = await sanityFetch({ query: ALL_PROJECTS_QUERY });

    return (
        <div className="bg-white min-h-screen pt-32 pb-24 text-slate-900">

            {/* HEADER */}
            <div className="max-w-4xl mx-auto text-center mb-12 px-4">
                <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 text-slate-900">
                    What We <span className="text-primary">Do</span>
                </h1>
                <div className="text-lg text-slate-700 font-light space-y-6 text-left max-w-4xl mx-auto leading-relaxed mt-8">
                    <p>
                        We are dedicated to understanding how cellular signaling is organized and executed on membrane surfaces. By employing in-vitro/in-situ cryo-electron microscopy (cryo-EM), biochemistry, and cell biology, we aim to unravel how membrane surfaces govern protein function in physiologically relevant conditions.
                    </p>
                </div>
            </div>

            {/* ZIG-ZAG CONTENT */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-0">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {projects.map((project: any, index: number) => (
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
                ))}
            </div>
        </div>
    );
}
