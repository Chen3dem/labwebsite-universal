
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@sanity/client');

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
});

async function updateMinStock() {
    console.log('🔄 Fetching inventory items...');
    const items = await client.fetch(`*[_type == "inventoryItem"]{_id, name, category, stock, minStock}`);
    console.log(`Found ${items.length} items.`);

    const transaction = client.transaction();
    let updates = 0;

    for (const item of items) {
        let newMinStock = item.minStock;

        if (item.category === 'Equipment') {
            newMinStock = 1;
        } else if (item.category === 'Biological') {
            newMinStock = 2;
        } else {
            continue; // Skip General or other categories
        }

        // Only update if changed
        if (newMinStock !== item.minStock) {
            // Recalculate status
            let newStatus = 'In Stock';
            if (item.stock === 0) newStatus = 'Out of Stock';
            else if (item.stock < newMinStock) newStatus = 'Low Stock';

            transaction.patch(item._id, p => p
                .set({ minStock: newMinStock, status: newStatus })
            );
            updates++;
            console.log(`Updated ${item.name}: Min Stock ${item.minStock} -> ${newMinStock}`);
        }
    }

    if (updates > 0) {
        console.log(`💾 Committing ${updates} updates...`);
        try {
            await transaction.commit();
            console.log('✅ Update complete!');
        } catch (err) {
            console.error('❌ Transaction failed:', err);
        }
    } else {
        console.log('✨ No updates needed.');
    }
}

updateMinStock();
