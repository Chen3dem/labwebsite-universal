import { createClient } from "next-sanity";
import OrderingDashboard from "./dashboard";

// Sanity Client
const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: "2024-01-01",
    useCdn: false,
});

export const revalidate = 0; // Ensure fresh data on every load

interface PendingItem {
    name: string;
    itemId: string;
    barcode?: string;
    stock: number;
    owner?: { name: string };
    requestedQuantity?: number;
    category?: string;
    equipmentStatus?: string;
    requestNote?: string;
    repairedAt?: string;
}

export default async function OrderingPage() {
    // Fetch Pending Orders (Approved) - "Just Ordered" (And Repairs In Progress)
    const pendingOrders: PendingItem[] = await client.fetch(`
        *[_type == "inventoryItem" && status == "Ordered"] {
            name,
            itemId,
            barcode,
            stock,
            category,
            equipmentStatus
        }
    `);

    const pendingApprovals: PendingItem[] = await client.fetch(`
        *[_type == "inventoryItem" && status == "Requested"] {
            name,
            itemId,
            barcode,
            stock,
            requestedQuantity,
            owner->{name},
            category,
            equipmentStatus,
            requestNote
        }
    `);

    return (
        <OrderingDashboard
            pendingOrders={pendingOrders}
            pendingApprovals={pendingApprovals}
        />
    );
}
