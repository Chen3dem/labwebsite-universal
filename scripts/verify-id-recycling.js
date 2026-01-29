
const { createClient } = require('@sanity/client');
const dotenv = require('dotenv');
const assert = require('assert');

dotenv.config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
});

// Standalone ID generator matching app logic
async function generateNextLabId(category) {
    const query = `*[_type == "inventoryItem" && defined(itemId) && itemId match "CUI-LAB-*"].itemId`;
    const allIds = await client.fetch(query);

    const usedNumbers = new Set();
    for (const id of allIds) {
        const match = id.match(/^CUI-LAB-(\d+)$/);
        if (match && match[1]) {
            usedNumbers.add(parseInt(match[1], 10));
        }
    }

    let start = 1000;
    if (category === 'Equipment') start = 1;
    if (category === 'Biological') start = 6000;

    let nextNum = start;
    while (usedNumbers.has(nextNum)) {
        nextNum++;
    }

    return `CUI-LAB-${nextNum.toString().padStart(4, '0')}`;
}

async function verifyRecycling() {
    console.log("🧪 Starting ID Recycling Verification...");

    const category = "Equipment";

    // 1. Get next available ID
    const initialId = await generateNextLabId(category);
    console.log(`1. Next available ID should be: ${initialId}`);

    // 2. Create Item A
    console.log(`2. Creating Item A with ID: ${initialId}...`);
    const docA = {
        _type: 'inventoryItem',
        name: 'Item A (Temp)',
        itemId: initialId,
        category,
        minStock: 1, stock: 1
    };
    const resA = await client.create(docA);
    console.log(`   Element created: ${resA._id}`);

    // 3. Verify net next ID moves forward
    const nextId = await generateNextLabId(category);
    console.log(`3. Checking next ID (should be different): ${nextId}`);
    assert.notStrictEqual(initialId, nextId, "ID did not increment after creation!");
    console.log("   --> Confirmed: ID incremented.");

    // 4. Delete Item A
    console.log(`4. Deleting Item A (${resA._id})...`);
    await client.delete(resA._id);
    // Wait a moment for consistency (though strong consistency usually ok)
    await new Promise(r => setTimeout(r, 1000));

    // 5. Check if ID stays recycled
    console.log(`5. Checking next available ID again (should match Step 1)...`);
    const recycledId = await generateNextLabId(category);
    console.log(`   Got: ${recycledId}`);

    if (recycledId === initialId) {
        console.log("✅ SUCCESS: ID was recycled!");
    } else {
        console.error(`❌ FAILURE: Expected ${initialId}, got ${recycledId}`);
        process.exit(1);
    }
}

verifyRecycling().catch(err => {
    console.error(err);
    process.exit(1);
});
