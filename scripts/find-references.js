const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-01-01',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN || process.env.NEXT_PUBLIC_SANITY_TOKEN
});

async function findReferences() {
    const assetId = 'image-7209417d3e2d7da4a2d7bb05520bc6da07f3a37d-2944x1440-png'; // The 9MB file
    console.log(`Finding references for ${assetId}...`);
    try {
        const query = `*[references($id)]{_id, _type, title, name}`;
        const docs = await client.fetch(query, { id: assetId });

        console.log("Referenced by:");
        docs.forEach(doc => {
            console.log(`- Type: ${doc._type}, ID: ${doc._id}, Title: ${doc.title || doc.name || 'Untitled'}`);
        });

    } catch (err) {
        console.error("Error:", err.message);
    }
}

findReferences();
