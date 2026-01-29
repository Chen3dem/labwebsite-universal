import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

interface TeamMemberCardProps {
    name: string;
    role: string;
    bio?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    headshot?: any;
    fit?: 'contain' | 'cover';
}

export default function TeamMemberCard({ name, role, bio, headshot, fit = 'cover' }: TeamMemberCardProps) {
    return (
        <div className="group relative aspect-[3/4] w-full overflow-hidden bg-slate-100 shadow-xl rounded-sm" style={{ aspectRatio: '3 / 4' }}>
            {/* Image */}
            {headshot ? (
                <Image
                    src={urlFor(headshot).url()}
                    alt={name}
                    fill
                    className={`object-${fit} transition-all duration-700 ease-in-out group-hover:scale-110`}
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-slate-300 opacity-20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                </div>
            )}

            {/* Persistent Bottom Gradient & Info (Always Visible) */}
            <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-slate-700 via-slate-700/80 to-transparent p-6 pt-24 transition-opacity duration-300">
                <h3 className="text-xl font-bold text-white mb-1 shadow-black drop-shadow-md">
                    {name}
                </h3>
                <p className="text-sm font-bold text-white uppercase tracking-wider drop-shadow-md">
                    {role}
                </p>
            </div>

            {/* Overlay Info (Hover Only) */}
            <div className="absolute inset-0 z-10 bg-slate-700/95 flex flex-col justify-center items-center p-8 pb-32 text-center opacity-0 group-hover:opacity-100 transition-all duration-500 overflow-y-auto">
                <div className="mt-auto mb-auto space-y-6 w-full">

                    {bio && (
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100 w-full">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-700 pb-1 inline-block">About Me</h4>
                            <div className="prose prose-invert prose-sm text-slate-300 text-sm leading-snug text-center mx-auto max-w-sm">
                                <p>{bio}</p>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
