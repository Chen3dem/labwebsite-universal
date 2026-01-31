const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-01-01',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN || process.env.NEXT_PUBLIC_SANITY_TOKEN // We need a write token if we were to delete, but read is fine for listing if public dataset? No, we need token for assets? Actually public dataset reads are fine.
});

async function findUnusedAssets() {
    console.log("Fetching unused assets...");
    try {
        const query = `*[_type == "sanity.imageAsset" && count(*[references(^._id)]) == 0]{
      _id,
      originalFilename,
      size,
      url
    }`;

        const assets = await client.fetch(query);

        if (assets.length === 0) {
            console.log("No unused assets found.");
            return;
        }

        console.log(`Found ${assets.length} unused assets:`);
        let totalSize = 0;

        assets.forEach(asset => {
            const sizeMB = (asset.size / (1024 * 1024)).toFixed(2);
            totalSize += asset.size;
            console.log(`- ${asset.originalFilename || asset._id} (${sizeMB} MB)`);
        });

        console.log(`\nTotal reclaimable space: ${(totalSize / (1024 * 1024)).toFixed(2)} MB`);

    } catch (err) {
        console.error("Error:", err.message);
    }
}

findUnusedAssets();
