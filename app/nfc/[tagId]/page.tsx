import { createClient } from "next-sanity";
import { redirect } from "next/navigation";
import Link from "next/link";

const getClient = () => createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: "2024-01-01",
    useCdn: false,
});

export default async function NFCDispatcherPage({
    params,
}: {
    params: Promise<{ tagId: string }>;
}) {
    const { tagId } = await params;

    // Fetch info about this Tag ID
    const query = `*[_type == "nfcTag" && tagId == $tagId][0]{
        type,
        location,
        equipment->{itemId},
        protocol->{_id}
    }`;

    const tagData = await getClient().fetch(query, { tagId });

    if (!tagData) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Unknown Tag</h1>
                <p className="text-slate-600 mb-8">
                    The tag <code>{tagId}</code> is not registered in the system.
                </p>
                <Link href="/intranet" className="bg-slate-800 text-white px-6 py-3 rounded-xl font-semibold">
                    Go to Dashboard
                </Link>
            </div>
        );
    }

    // Dispatch based on type
    switch (tagData.type) {
        case 'location':
            // Redirect to Inventory filtered by location
            return redirect(`/inventory?location=${encodeURIComponent(tagData.location)}`);

        case 'receiving':
            // Redirect to Receiving Mode
            return redirect(`/receiving`);

        case 'equipment':
            if (tagData.equipment && tagData.equipment.itemId) {
                // Redirect to Equipment's inventory detail page
                return redirect(`/inventory/${tagData.equipment.itemId}`);
            }
            break; // Fall through if equipment ref is missing

        case 'protocol':
            if (tagData.protocol && tagData.protocol._id) {
                // Redirect to Protocol detail
                return redirect(`/protocols?open=${tagData.protocol._id}`);
            }
            break;
    }

    // Fallback if configuration is incomplete
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
            <h1 className="text-2xl font-bold text-amber-600 mb-4">Misconfigured Tag</h1>
            <p className="text-slate-600 mb-8">
                The tag <code>{tagId}</code> has a type of <strong>{tagData.type}</strong> but is missing required data.
            </p>
            <Link href="/intranet" className="bg-slate-800 text-white px-6 py-3 rounded-xl font-semibold">
                Go to Dashboard
            </Link>
        </div>
    );
}
