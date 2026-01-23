import Link from "next/link";
import Image from "next/image";

interface ProjectCardProps {
    title: string;
    summary: string;
    slug: string;
    mainImage?: string;
}

export default function ProjectCard({ title, summary, slug, mainImage }: ProjectCardProps) {
    return (
        <Link href={`/research/${slug}`} className="group block h-full">
            <div className="flex flex-col h-full bg-white border border-slate-200 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-lg rounded-sm overflow-hidden">
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                    {mainImage ? (
                        <Image
                            src={mainImage}
                            alt={title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-300">
                            No Image
                        </div>
                    )}

                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/0 to-transparent opacity-0 group-hover:opacity-0 transition-opacity" />
                </div>

                <div className="flex flex-1 flex-col p-6 relative">
                    <h3 className="mb-3 text-xl font-display font-bold tracking-tight text-slate-900 group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                    <p className="flex-1 text-sm text-slate-600 leading-relaxed line-clamp-3">
                        {summary}
                    </p>
                    <div className="mt-6 flex items-center text-xs font-bold uppercase tracking-wider text-primary opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                        View Project &rarr;
                    </div>
                </div>
            </div>
        </Link>
    );
}
