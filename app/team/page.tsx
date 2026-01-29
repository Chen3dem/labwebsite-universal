import { sanityFetch } from "@/sanity/lib/fetch";
import { ALL_MEMBERS_QUERY } from "@/sanity/lib/queries";
import TeamMemberCard from "@/components/TeamMemberCard";

export const revalidate = 60;

// Order priority for sorting
const ROLE_PRIORITY: Record<string, number> = {
    "pi": 1,
    "postdoc": 2,
    "pra": 3,
    "phd": 4,
    "master": 5,
    "undergrad": 6,
    "staff": 7,
    "alumni": 99
};

const ROLE_TITLES: Record<string, string> = {
    pi: "Principal Investigator",
    postdoc: "Postdoctoral Fellow",
    pra: "Professional Research Assistant",
    phd: "PhD Student",
    master: "Master Student",
    undergrad: "Undergraduate",
    staff: "Research Staff",
};

export default async function TeamPage() {
    const members = await sanityFetch({ query: ALL_MEMBERS_QUERY });

    // Sort members by role priority
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sortedMembers = members.sort((a: any, b: any) => {
        const roleA = Object.keys(ROLE_PRIORITY).find(r => a.role.toLowerCase().includes(r)) || 'alumni';
        const roleB = Object.keys(ROLE_PRIORITY).find(r => b.role.toLowerCase().includes(r)) || 'alumni';
        return (ROLE_PRIORITY[roleA] || 99) - (ROLE_PRIORITY[roleB] || 99);
    });

    return (
        <div className="bg-white min-h-screen pt-32 pb-16 text-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* HEADER */}
                <div className="max-w-4xl mx-auto text-center mb-24 px-4">
                    <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 text-slate-900">
                        Who We <span className="text-primary">Are</span>
                    </h1>
                    <div className="mt-20 border-b-2 border-slate-100 max-w-2xl mx-auto"></div>
                </div>

                {/* Unified Team Grid */}
                <div>
                    {sortedMembers.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {sortedMembers.map((member: any) => {
                                // Map 'pi' to 'Principal Investigator' if needed, or use the role map
                                const displayRole = ROLE_TITLES[member.role] || member.role;

                                // Use bio directly from sanity
                                const displayBio = member.bio;

                                return (
                                    <TeamMemberCard
                                        key={member._id}
                                        name={member.name}
                                        role={displayRole}
                                        bio={displayBio}
                                        headshot={member.headshot}
                                        fit={member.imageFit}
                                    />
                                );
                            })}
                        </div>
                    ) : (
                        <div className="border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                                <span className="text-4xl">👥</span>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Meet the Team</h2>
                            <p className="text-slate-500 mb-8 max-w-md mx-auto">
                                Add your team members in <strong>Sanity Studio &gt; Team Members</strong>.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl opacity-50 pointer-events-none blur-sm select-none">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="bg-slate-50 rounded-xl p-6 flex flex-col items-center">
                                        <div className="w-32 h-32 rounded-full bg-slate-200 mb-4"></div>
                                        <div className="h-6 w-3/4 bg-slate-200 rounded mb-2"></div>
                                        <div className="h-4 w-1/2 bg-slate-100 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
