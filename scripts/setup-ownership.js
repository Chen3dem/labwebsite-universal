require('dotenv').config({ path: '.env.local' });
const { createClient } = require('next-sanity');

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
});

const main = async () => {
    // 1. Check or Create "Lab Stock" Team Member
    console.log('Checking for "Lab Stock" member...');
    let labStockId;

    // Looser query to find any existing "Lab Stock"
    const existing = await client.fetch(`*[_type == "teamMember" && name == "Lab Stock"][0]`);

    if (existing) {
        console.log('Found existing "Lab Stock" member:', existing._id);
        labStockId = existing._id;
    } else {
        console.log('Creating "Lab Stock" member...');
        const doc = await client.create({
            _type: 'teamMember',
            name: 'Lab Stock',
            role: 'staff',
            bio: 'Shared laboratory supplies and reagents.',
            imageFit: 'cover'
        });
        console.log('Created "Lab Stock" member:', doc._id);
        labStockId = doc._id;
    }

    // 2. Update all inventory items to have this owner if they don't have one
    console.log('Finding items without owner...');
    const items = await client.fetch(`*[_type == "inventoryItem" && !defined(owner)]`);
    console.log(`Found ${items.length} items to update.`);

    if (items.length === 0) {
        console.log("No items need updating.");
        return;
    }

    const transaction = client.transaction();
    items.forEach(item => {
        transaction.patch(item._id, p => p.set({
            owner: {
                _type: 'reference',
                _ref: labStockId
            }
        }));
    });

    console.log('Committing updates...');
    await transaction.commit();
    console.log('Successfully set "Lab Stock" as default owner.');
};

main().catch(err => {
    console.error('Setup failed:', err);
    process.exit(1);
});
