"use server";

import { createClient } from "next-sanity";
import { revalidatePath } from "next/cache";
import { sendApprovalRequestEmail, sendRepairRequestEmail } from "@/lib/email";
import { currentUser } from "@clerk/nextjs/server";

const token = process.env.SANITY_API_TOKEN;

const getClient = () => {
    return createClient({
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
        apiVersion: "2024-01-01",
        useCdn: false,
        token: process.env.SANITY_API_TOKEN,
    });
};

async function logActivity(action: string, targetName: string, targetId: string, details?: string) {
    try {
        const user = await currentUser();
        const userName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || "Unknown" : "System/Guest";

        const now = new Date();
        // Use Mountain Time for date key to match user's local time
        const dateKey = now.toLocaleDateString('en-CA', { timeZone: 'America/Denver' }); // YYYY-MM-DD format
        const docId = `log-${dateKey}`;

        const event = {
            _key: crypto.randomUUID(),
            timestamp: now.toISOString(),
            user: userName,
            action,
            target: targetName,
            details: details || `Item ID: ${targetId}`,
            itemId: targetId
        };

        // Ensure the daily document exists
        await getClient().createIfNotExists({
            _id: docId,
            _type: 'dailyActivityLog',
            date: dateKey,
            events: []
        });

        // Append the event
        await getClient()
            .patch(docId)
            .setIfMissing({ events: [] })
            .append('events', [event])
            .commit();

    } catch (error) {
        console.error("Failed to log activity:", error);
    }
}

// Helper to get site settings
export async function getSiteSettings() {
    const query = `*[_type == "siteSettings"][0]{
        labIdPrefix,
        plasmidIdPrefix
    }`;
    const settings = await getClient().fetch(query);
    return {
        labIdPrefix: settings?.labIdPrefix || "CUI-LAB",
        plasmidIdPrefix: settings?.plasmidIdPrefix || "ZC-Plasmid"
    };
}

export async function reorderItem(itemId: string) {
    if (!token) {
        throw new Error("Missing SANITY_API_TOKEN");
    }

    // Find the document ID and details using the itemId field
    const query = `*[_type == "inventoryItem" && itemId == $itemId][0]{_id, name, itemId, minStock, stock}`;
    const item = await getClient().fetch(query, { itemId });

    if (!item?._id) {
        throw new Error(`Item not found: ${itemId}`);
    }

    // Calculate needed quantity: difference between minStock and current stock, or default to 1
    const currentStock = item.stock || 0;
    const minStock = item.minStock || 0;
    const needed = minStock - currentStock;
    const qty = Math.max(1, needed);

    await getClient()
        .patch(item._id)
        .set({
            status: "Requested",
            requestedQuantity: qty,
            requestedAt: new Date().toISOString()
        })
        .commit();

    // Email is now handled client-side via mailto link

    await logActivity("Requested Reorder", item.name, item.itemId, `Requested Qty: ${qty}`);

    // Skip revalidatePath - optimistic UI handles the update
    // revalidatePath(`/inventory/${itemId}`);
    return { success: true, itemId: item.itemId, itemName: item.name, requestedQuantity: qty };
}

export async function requestRepair(itemId: string, issueDescription: string = "Repair Requested") {
    if (!token) throw new Error("Missing SANITY_API_TOKEN");

    const query = `*[_type == "inventoryItem" && itemId == $itemId][0]{_id, name, itemId, owner->{name}, category}`;
    const item = await getClient().fetch(query, { itemId });

    if (!item?._id) throw new Error(`Item not found: ${itemId}`);

    // Update status to 'Requested' (so it appears on ordering page)
    // Update equipmentStatus to 'Finicky' (to alert users)
    // Save the request note
    await getClient()
        .patch(item._id)
        .set({
            status: 'Requested',
            equipmentStatus: 'Finicky',
            requestNote: issueDescription,
            requestedAt: new Date().toISOString()
        })
        .commit();

    // Send Email - handled client side via mailto
    // const requesterName = "Lab Member"; 

    await logActivity("Requested Repair", item.name, item.itemId, issueDescription);

    // Skip revalidatePath - optimistic UI handles the update
    // revalidatePath(`/inventory/${itemId}`);
    return {
        success: true,
        itemName: item.name
    };
}

export async function approveItem(itemId: string) {
    if (!token) throw new Error("Missing SANITY_API_TOKEN");

    const query = `*[_type == "inventoryItem" && itemId == $itemId][0]{_id, name, category, equipmentStatus}`;
    const item = await getClient().fetch(query, { itemId });

    if (!item?._id) throw new Error(`Item not found: ${itemId}`);

    if (item.category === 'Equipment') {
        // For equipment, approval means confirming the repair order
        await getClient().patch(item._id).set({
            status: "Ordered", // Moves it to 'Just Ordered' list
            equipmentStatus: "Repair Requested",
            orderedAt: new Date().toISOString()
        }).commit();

        await logActivity("Approved Repair", item.name, itemId);
    } else {
        // Standard Inventory Item
        await getClient().patch(item._id).set({
            status: "Ordered",
            orderedAt: new Date().toISOString()
        }).commit();

        await logActivity("Approved Order", item.name, itemId);
    }

    // Skip revalidatePath - optimistic UI handles the update
    // revalidatePath(`/inventory/${itemId}`);
    // revalidatePath(`/intranet`);
}

export async function updateEquipmentStatus(itemId: string, status: string) {
    if (!token) throw new Error("Missing SANITY_API_TOKEN");

    const query = `*[_type == "inventoryItem" && itemId == $itemId][0]{_id, name}`;
    const item = await getClient().fetch(query, { itemId });

    if (!item?._id) throw new Error(`Item not found: ${itemId}`);

    const patch = getClient().patch(item._id).set({ equipmentStatus: status });

    // If marked as Working, reset global status to In Stock (removes from Ordering list)
    // And set the repairedAt timestamp
    if (status === 'Working') {
        patch.set({
            status: 'In Stock',
            repairedAt: new Date().toISOString()
        });
    }

    await patch.commit();

    await logActivity("Updated Equipment Status", item.name, itemId, `Status: ${status}`);

    // Skip revalidatePath - optimistic UI handles the update
    // revalidatePath(`/inventory/${itemId}`);
}

export async function updateStock(itemId: string, newStock: number) {
    if (!token) {
        console.error("Missing SANITY_API_TOKEN in updateStock");
        return { success: false, error: "Server Configuration Error: Missing Token" };
    }

    try {
        // Find the document ID and minStock using the itemId field
        const query = `*[_type == "inventoryItem" && itemId == $itemId][0]{_id, minStock, name}`;
        const item = await getClient().fetch(query, { itemId });

        if (!item || !item._id) {
            return { success: false, error: `Item not found: ${itemId}` };
        }

        const { _id: documentId, minStock: rawMinStock, name } = item;
        const minStock = rawMinStock ?? 5; // Handle null or undefined

        let status = "In Stock";
        if (newStock === 0) status = "Out of Stock";
        else if (newStock < minStock) status = "Low Stock";

        await getClient()
            .patch(documentId)
            .set({
                stock: newStock,
                status: status
            })
            .commit();

        await logActivity("Updated Stock", name, itemId, `New Stock: ${newStock}`);

        // Skip revalidatePath - optimistic UI handles the update
        // revalidatePath(`/inventory/${itemId}`);
        // revalidatePath(`/inventory`);
        return { success: true };
    } catch (error) {
        console.error("Error in updateStock:", error);
        return { success: false, error: String(error) };
    }
}

export async function getItemDetails(itemId: string) {
    const query = `*[_type == "inventoryItem" && !(_id in path("drafts.**")) && (itemId == $itemId || barcode == $itemId)][0]{
        _id,
        name,
        itemId,
        barcode,
        stock,
        minStock,
        location,
        status
    }`;
    return await getClient().fetch(query, { itemId });
}

export async function receiveItem(itemId: string, quantityReceived: number, imageBase64?: string) {
    if (!token) throw new Error("Missing SANITY_API_TOKEN");

    const item = await getItemDetails(itemId);
    if (!item) throw new Error(`Item not found: ${itemId}`);

    const newStock = (item.stock || 0) + quantityReceived;
    const minStock = item.minStock ?? 5; // Handle null or undefined

    let status = "In Stock";
    if (newStock === 0) status = "Out of Stock";
    else if (newStock < minStock) status = "Low Stock";

    let patch = getClient()
        .patch(item._id)
        .set({
            stock: newStock,
            status: status,
            lastReceived: new Date().toISOString()
        });

    if (imageBase64) {
        try {
            const parts = imageBase64.split(';base64,');
            const base64Data = parts.length > 1 ? parts[1] : parts[0];
            const buffer = Buffer.from(base64Data, 'base64');

            const asset = await getClient().assets.upload('image', buffer, {
                filename: `inventory-${item.itemId}-${Date.now()}.jpg`
            });

            const imageAsset = {
                _type: 'image',
                _key: crypto.randomUUID(), // Add unique key for array items
                asset: {
                    _type: "reference",
                    _ref: asset._id
                },
                timestamp: new Date().toISOString()
            };

            // Update 'image' (current) and prepend to 'images' (history)
            patch = patch.set({ image: imageAsset })
                .setIfMissing({ images: [] })
                .prepend('images', [imageAsset]);

        } catch (error) {
            console.error("Failed to upload image in receiveItem:", error);
        }
    }

    await patch.commit();

    await logActivity("Received Item", item.name, itemId, `Received Qty: ${quantityReceived}, Total: ${newStock}`);

    revalidatePath(`/inventory/${itemId}`);
    revalidatePath(`/inventory`);
    return { success: true, newStock, status };
}

export async function updateItemOwner(itemId: string, ownerId: string) {
    if (!token) throw new Error("Missing SANITY_API_TOKEN");

    const item = await getItemDetails(itemId);
    if (!item) throw new Error(`Item not found: ${itemId}`);

    const patch = getClient().patch(item._id);

    if (ownerId === 'lab-stock') {
        // Unset owner for Lab Stock
        patch.unset(['owner']);
    } else {
        patch.set({
            owner: {
                _type: 'reference',
                _ref: ownerId
            }
        });
    }

    await patch.commit();

    // Skip revalidatePath - optimistic UI handles the update
    // revalidatePath(`/inventory/${itemId}`);
    // revalidatePath(`/inventory`);
    return { success: true };
}

// Helper to generate the next available Lab ID based on Category ranges
async function generateNextLabId(category: string = 'General'): Promise<string> {
    const settings = await getSiteSettings();
    const prefix = settings.labIdPrefix;

    // 1. Fetch ALL existing Lab IDs to ensure uniqueness across the board
    // Match against the configured prefix
    const query = `*[_type == "inventoryItem" && defined(itemId) && itemId match "${prefix}-*"].itemId`;
    const allIds: string[] = await getClient().fetch(query);

    const usedNumbers = new Set<number>();
    const regex = new RegExp(`^${prefix}-(\\d+)$`);

    for (const id of allIds) {
        const match = id.match(regex);
        if (match && match[1]) {
            usedNumbers.add(parseInt(match[1], 10));
        }
    }

    // Define Ranges
    let start = 1000; // Default (General)
    if (category === 'Equipment') start = 1;
    if (category === 'Biological') start = 6000;

    // Find next available in range
    let nextNum = start;
    while (usedNumbers.has(nextNum)) {
        nextNum++;
    }

    return `${prefix}-${nextNum.toString().padStart(4, '0')}`;
}

export async function searchInventoryItems(queryText: string) {
    if (!queryText) return [];

    // Fuzzy search for name, exact/partial for IDs
    const query = `*[_type == "inventoryItem" && !(_id in path("drafts.**")) && (
        itemId match $q || 
        barcode match $q || 
        name match "*" + $q + "*"
    )] | order(name asc) {
        _id,
        name,
        itemId,
        barcode,
        stock,
        location,
        status,
        owner->{name},
        "imageUrl": image.asset->url
    }`;

    return await getClient().fetch(query, { q: queryText });
}

// Helper to generate the next available Plasmid ID (ZC-Plasmid-xxxx)
async function generateNextPlasmidId(): Promise<string> {
    const settings = await getSiteSettings();
    const prefix = settings.plasmidIdPrefix;

    const query = `*[_type == "inventoryItem" && defined(itemId) && itemId match "${prefix}-*"].itemId`;
    const allIds: string[] = await getClient().fetch(query);

    const usedNumbers = new Set<number>();
    const regex = new RegExp(`^${prefix}-(\\d+)$`);

    for (const id of allIds) {
        const match = id.match(regex);
        if (match && match[1]) {
            usedNumbers.add(parseInt(match[1], 10));
        }
    }

    let nextNum = 1;
    while (usedNumbers.has(nextNum)) {
        nextNum++;
    }

    return `${prefix}-${nextNum.toString().padStart(4, '0')}`;
}

export async function createInventoryItem(data: {
    name: string;
    barcode?: string;
    location: string;
    stock: number;
    ownerId?: string;
    minStock?: number;
    category?: string;  // General, Biological, or Equipment
    imageBase64?: string; // Optional: Base64 image data
    isPlasmid?: boolean; // New flag
}) {
    if (!token) throw new Error("Missing SANITY_API_TOKEN");

    let finalItemId = undefined;
    let finalBarcode = data.barcode;

    // Logic: 
    // If isPlasmid is true, generate ZC-Plasmid-xxxx
    // Else, generate unique Lab ID (CUI-LAB-xxxx)
    if (data.isPlasmid) {
        finalItemId = await generateNextPlasmidId();
    } else {
        finalItemId = await generateNextLabId(data.category);
    }

    // Safety check: ID must exist
    if (!finalItemId) {
        throw new Error("Failed to generate Lab ID. Please try again.");
    }

    if (!finalBarcode || finalBarcode.trim() === "") {
        finalBarcode = undefined;
    } else {
        // Sanitize barcode (strip control chars)
        finalBarcode = finalBarcode.replace(/[\x00-\x1F\x7F]/g, "").trim();
    }

    // Handle Image Upload
    let imageAsset = undefined;
    if (data.imageBase64) {
        try {
            // Strip prefix (data:image/jpeg;base64,)
            const parts = data.imageBase64.split(';base64,');
            const base64Data = parts.length > 1 ? parts[1] : parts[0];
            const buffer = Buffer.from(base64Data, 'base64');

            // Upload to Sanity
            const asset = await getClient().assets.upload('image', buffer, {
                filename: `inventory-${finalItemId}-${Date.now()}.jpg`
            });

            // Create image reference
            imageAsset = {
                _type: 'image',
                _key: crypto.randomUUID(), // Add unique key for array items
                asset: {
                    _type: "reference",
                    _ref: asset._id
                },
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error("Failed to upload image:", error);
            // Proceed without image if upload fails
        }
    }

    const isEquipment = data.category === 'Equipment';
    const defaultMinStock = isEquipment ? 1 : 5;

    const doc: any = {
        _type: 'inventoryItem',
        name: data.name,
        category: data.category || 'General',
        location: data.location,
        stock: data.stock,
        minStock: data.minStock ?? defaultMinStock,
        status: data.stock === 0 ? 'Out of Stock' : (data.stock < (data.minStock ?? defaultMinStock) ? 'Low Stock' : 'In Stock'),
        lastReceived: new Date().toISOString(),
    };

    if (isEquipment) {
        doc.equipmentStatus = 'Working';
    }

    if (finalBarcode) doc.barcode = finalBarcode;
    if (finalItemId) doc.itemId = finalItemId;

    if (imageAsset) {
        doc.image = imageAsset;
        doc.images = [imageAsset]; // Initialize history
    }

    if (data.ownerId && data.ownerId !== 'lab-stock') {
        doc.owner = {
            _type: 'reference',
            _ref: data.ownerId
        };
    }

    const result = await getClient().create(doc);

    await logActivity("Created Item", data.name, finalItemId || "unknown", `Initial Stock: ${data.stock}`);

    revalidatePath('/inventory');
    if (finalItemId) revalidatePath(`/inventory/${finalItemId}`);
    if (finalBarcode) revalidatePath(`/inventory/${finalBarcode}`);

    return { success: true, _id: result._id, itemId: finalItemId };
}

export async function getAllTeamMembers() {
    return await getClient().fetch(`*[_type == "teamMember" && name != "Zhicheng (Chen) Cui" && name != "Lab Stock"] | order(name asc) {
        _id,
        name,
        role,
        headshot
    }`);
}

export async function getAllLocations() {
    // Determine unique locations from existing items
    const locations: string[] = await getClient().fetch(`*[_type == "inventoryItem" && defined(location)].location`);
    // Unique and sort
    return Array.from(new Set(locations)).sort();
}

export async function updateItemLocation(itemId: string, newLocation: string) {
    if (!token) throw new Error("Missing SANITY_API_TOKEN");

    const item = await getItemDetails(itemId);
    if (!item) throw new Error(`Item not found: ${itemId}`);

    await getClient()
        .patch(item._id)
        .set({ location: newLocation })
        .commit();

    await logActivity("Updated Location", item.name, itemId, `New Location: ${newLocation}`);

    // Skip revalidatePath - optimistic UI handles the update
    // revalidatePath(`/inventory/${itemId}`);
    // revalidatePath(`/inventory`);
    return { success: true };
}

export async function addInventoryNote(itemId: string, content: string) {
    if (!token) throw new Error("Missing SANITY_API_TOKEN");

    const item = await getItemDetails(itemId);
    if (!item) throw new Error(`Item not found: ${itemId}`);

    const user = await currentUser();
    const authorName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || "Unknown" : "Guest";

    const note = {
        _key: crypto.randomUUID(),
        content,
        timestamp: new Date().toISOString(),
        author: authorName
    };

    await getClient()
        .patch(item._id)
        .setIfMissing({ notes: [] })
        .append('notes', [note])
        .commit();

    await logActivity("Added Note", item.name, itemId, `Note: ${content.substring(0, 50)}...`);

    revalidatePath(`/inventory/${itemId}`);
    return { success: true };
}
