require('dotenv').config({ path: '.env.local' });
const { createClient } = require('next-sanity');

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset || !token) {
    console.error('Missing required environment variables. using .env.local');
    process.exit(1);
}

const client = createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    token,
    useCdn: false,
});

const LOCATIONS = [
    '4°C Fridge',
    '-20°C Freezer 1',
    '-20°C Freezer 2',
    '-80°C Freezer 1',
    '-80°C Freezer 2',
    'Chemical Cabinet',
    'Room Temperature Shelf',
];

const STATUSES = [
    'In Stock',
    'Low Stock',
    'Ordered',
    'Out of Stock',
];

const ITEM_NAMES = [
    'BSA (Bovine Serum Albumin) 500g', 'Ethanol 70% 1L', 'Ethanol 100% 1L',
    'Pipette Tips 10uL', 'Pipette Tips 200uL', 'Pipette Tips 1000uL',
    'Falcon Tubes 15ml', 'Falcon Tubes 50ml',
    'DMEM Media 500ml', 'FBS (Fetal Bovine Serum) 500ml',
    'PBS 10x 1L', 'Tris-HCl pH 7.4', 'NaCl 1kg', 'Agarose 500g',
    'Trypsin-EDTA 100ml', 'Penicillin-Streptomycin 100ml',
    'Lipofectamine 3000', 'Trizol Reagent', 'PowerUp SYBR Green',
    'Microcentrifuge Tubes 1.5ml', 'PCR Tubes 0.2ml',
    'Cell Culture Plates 6-well', 'Cell Culture Plates 96-well',
    'Syringe Filters 0.22um', 'Syringe Filters 0.45um',
    'Methanol 1L', 'Isopropanol 1L', 'Acetone 1L',
    'Hydrochloric Acid 1L', 'Sodium Hydroxide 1kg',
    'HEPES Buffer 1M', 'EDTA 0.5M',
    'Proteinase K', 'RNase A', 'DNase I',
    'Ladder 1kb Plus', 'Protein Ladder',
    'Glass Slides', 'Cover Slips',
    'Kimwipes', 'Nitrile Gloves S', 'Nitrile Gloves M', 'Nitrile Gloves L',
    'Paper Towels', 'Bleach 1L',
];

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const main = async () => {
    console.log('Starting seed...');

    // Clear existing items to prevent duplicates
    console.log('Clearing existing inventory items...');
    await client.delete({ query: '*[_type == "inventoryItem"]' });
    console.log('Existing items cleared.');

    // Create new items

    const transaction = client.transaction();

    for (let i = 0; i < 50; i++) {
        const name = ITEM_NAMES[getRandomInt(0, ITEM_NAMES.length - 1)];
        // Add a random suffix to ensure uniqueness if needed, or just let duplicates happen (realistic)
        // But for Item ID, we want unique ones.
        const idNum = String(i + 1 + 1000).padStart(3, '0'); // Start from 1001 to avoid conflicts with manual testing
        const itemId = `CUI-LAB-${idNum}`;

        const stock = getRandomInt(0, 50);
        let status = 'In Stock';
        if (stock === 0) status = 'Out of Stock';
        else if (stock < 10) status = 'Low Stock';

        // Randomly override status sometimes to simulate "Ordered" despite stock levels
        if (stock < 5 && Math.random() < 0.3) status = 'Ordered';

        const location = LOCATIONS[getRandomInt(0, LOCATIONS.length - 1)];

        const doc = {
            _type: 'inventoryItem',
            name: `${name} (Batch ${getRandomInt(1, 99)})`, // Add batch to name to vary it
            itemId,
            location,
            stock,
            status,
        };

        transaction.create(doc);
    }

    console.log('Committing transaction...');
    await transaction.commit();
    console.log('Successfully added 50 inventory items.');
};

main().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});
