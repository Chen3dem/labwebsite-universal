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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {sortedMembers.map((member: any) => {
                            // Map 'pi' to 'Principal Investigator' if needed, or use the role map
                            const displayRole = ROLE_TITLES[member.role] || member.role;

                            // Fallback bio for PI if empty
                            let displayBio = member.bio;
                            if (member.role === 'pi' && !displayBio) {
                                displayBio = "Principal Investigator at the University of Colorado Anschutz Medical Campus. Dr. Cui's research focuses on the mechanisms of lysosomal signaling and cellular dormancy. Prior to starting his lab, he completed his postdoctoral training at the Whitehead Institute/MIT with Dr. David Sabatini. He received his Ph.D. in Biophysics from Harvard University.";
                            }

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
                </div>

            </div>
        </div>
    );
}
