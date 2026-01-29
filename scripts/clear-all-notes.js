
const { createClient } = require('@sanity/client');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
});

async function clearNotes() {
    console.log("🧹 Clearing notes from all inventory items...");

    // Fetch all items that have notes defined
    const items = await client.fetch('*[_type == "inventoryItem" && defined(notes)] { _id, name }');

    if (items.length === 0) {
        console.log("✅ No items with notes found.");
        return;
    }

    console.log(`Found ${items.length} items with notes.`);

    const transaction = client.transaction();

    for (const item of items) {
        transaction.patch(item._id, p => p.unset(['notes']));
        console.log(`- Queued note removal for: ${item.name}`);
    }

    console.log("💾 Committing updates...");
    await transaction.commit();
    console.log("✅ All notes removed successfully!");
}

clearNotes().catch(err => {
    console.error("❌ Failed to clear notes:", err);
    process.exit(1);
});
