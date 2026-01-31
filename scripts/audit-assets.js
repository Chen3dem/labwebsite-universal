const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-01-01',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN || process.env.NEXT_PUBLIC_SANITY_TOKEN
});

async function auditAssets() {
    console.log("Auditing top 20 largest assets...");
    try {
        const query = `*[_type == "sanity.imageAsset"] | order(size desc) [0...20] {
      _id,
      originalFilename,
      size,
      mimeType,
      "refCount": count(*[references(^._id)])
    }`;

        const assets = await client.fetch(query);

        console.log(`Found ${assets.length} assets. Listing top largest:`);
        console.log("ID | Filename | Size (MB) | Refs | Type");
        console.log("-".repeat(60));

        assets.forEach(asset => {
            const sizeMB = (asset.size / (1024 * 1024)).toFixed(2);
            console.log(`${asset._id} | ${asset.originalFilename || 'No Name'} | ${sizeMB} MB | ${asset.refCount} | ${asset.mimeType}`);
        });

    } catch (err) {
        console.error("Error:", err.message);
    }
}

auditAssets();
