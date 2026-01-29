
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@sanity/client');

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
});

async function resetAndSeed() {
    console.log('🗑️  Deleting all inventory items...');
    await client.delete({ query: '*[_type == "inventoryItem"]' });
    console.log('✅ Inventory cleared.');

    const items = [
        // ========== BIOLOGICAL (Plasmids, Cells, Proteins) ==========
        // Plasmids (Use ZC-Plasmid-xxxx format for IDs if possible, or just let system handle, but here we manually set to test)
        { name: 'pET-28a(+)', category: 'Biological', itemId: 'ZC-Plasmid-0001', minStock: 2 },
        { name: 'pGEX-6P-1-Ub', category: 'Biological', itemId: 'ZC-Plasmid-0002', minStock: 2 },
        { name: 'pCMV-GFP', category: 'Biological', itemId: 'ZC-Plasmid-0003', minStock: 2 },
        { name: 'pET-SUMO-Protease', category: 'Biological', itemId: 'ZC-Plasmid-0004', minStock: 2 },
        { name: 'pMAL-c5X-MBP', category: 'Biological', itemId: 'ZC-Plasmid-0005', minStock: 2 },

        // Primers (Biological)
        { name: 'T7 Forward Primer', category: 'Biological', itemId: 'CUI-LAB-1001' },
        { name: 'T7 Reverse Primer', category: 'Biological', itemId: 'CUI-LAB-1002' },
        { name: 'GFP-Seq-F', category: 'Biological', itemId: 'CUI-LAB-1003' },
        { name: 'Ub-Clone-R', category: 'Biological', itemId: 'CUI-LAB-1004' },
        { name: 'SUMO-Seq-F', category: 'Biological', itemId: 'CUI-LAB-1005' },

        // Cells (Biological)
        { name: 'BL21(DE3) Competent Cells', category: 'Biological', itemId: 'CUI-LAB-1006' },
        { name: 'DH5α Competent Cells', category: 'Biological', itemId: 'CUI-LAB-1007' },
        { name: 'Rosetta 2(DE3) Cells', category: 'Biological', itemId: 'CUI-LAB-1008' },
        { name: 'XL1-Blue Cells', category: 'Biological', itemId: 'CUI-LAB-1009' },
        { name: 'SHuffle T7 Express', category: 'Biological', itemId: 'CUI-LAB-1010' },

        // Proteins (Biological)
        { name: 'TEV Protease', category: 'Biological', itemId: 'CUI-LAB-1011' },
        { name: 'SUMO Protease (Ulp1)', category: 'Biological', itemId: 'CUI-LAB-1012' },
        { name: 'Streptavidin', category: 'Biological', itemId: 'CUI-LAB-1013' },
        { name: 'BSA Standard', category: 'Biological', itemId: 'CUI-LAB-1014' },
        { name: 'Lysozyme', category: 'Biological', itemId: 'CUI-LAB-1015' },

        // Antibodies (Biological - New Type)
        { name: 'Anti-His Tag Antibody', category: 'Biological', itemId: 'CUI-LAB-1016' },
        { name: 'Anti-GFP Antibody', category: 'Biological', itemId: 'CUI-LAB-1017' },
        { name: 'Goat Anti-Mouse HRP', category: 'Biological', itemId: 'CUI-LAB-1018' },
        { name: 'Anti-Flag M2', category: 'Biological', itemId: 'CUI-LAB-1019' },
        { name: 'Anti-GST Antibody', category: 'Biological', itemId: 'CUI-LAB-1020' },


        // ========== GENERAL (Chemicals, Kits, Consumables) ==========
        // Chemicals
        { name: 'IPTG (1M stock)', category: 'General', itemId: 'CUI-LAB-2001' },
        { name: 'DTT (1M stock)', category: 'General', itemId: 'CUI-LAB-2002' },
        { name: 'Imidazole', category: 'General', itemId: 'CUI-LAB-2003' },
        { name: 'Tris Base', category: 'General', itemId: 'CUI-LAB-2004' },
        { name: 'Sodium Chloride', category: 'General', itemId: 'CUI-LAB-2005' },
        { name: 'Glycerol', category: 'General', itemId: 'CUI-LAB-2006' },
        { name: 'Ethanol 100%', category: 'General', itemId: 'CUI-LAB-2007' },
        { name: 'β-Mercaptoethanol', category: 'General', itemId: 'CUI-LAB-2008' },
        { name: 'HEPES', category: 'General', itemId: 'CUI-LAB-2009' },
        { name: 'EDTA (0.5M)', category: 'General', itemId: 'CUI-LAB-2010' },

        // Kits
        { name: 'QIAprep Spin Miniprep Kit', category: 'General', itemId: 'CUI-LAB-2011' },
        { name: 'NEB Q5 High-Fidelity PCR Kit', category: 'General', itemId: 'CUI-LAB-2012' },
        { name: 'Gibson Assembly Master Mix', category: 'General', itemId: 'CUI-LAB-2013' },
        { name: 'Pierce BCA Protein Assay Kit', category: 'General', itemId: 'CUI-LAB-2014' },
        { name: 'GeneJET Gel Extraction Kit', category: 'General', itemId: 'CUI-LAB-2015' },

        // Consumables
        { name: '1.5 mL Microcentrifuge Tubes', category: 'General', itemId: 'CUI-LAB-2016' },
        { name: '10 µL Filter Tips', category: 'General', itemId: 'CUI-LAB-2017' },
        { name: '200 µL Filter Tips', category: 'General', itemId: 'CUI-LAB-2018' },
        { name: '1000 µL Filter Tips', category: 'General', itemId: 'CUI-LAB-2019' },
        { name: '96-Well PCR Plates', category: 'General', itemId: 'CUI-LAB-2020' },
        { name: 'Falcon Tubes (50mL)', category: 'General', itemId: 'CUI-LAB-2021' },
        { name: 'Falcon Tubes (15mL)', category: 'General', itemId: 'CUI-LAB-2022' },
        { name: 'Petri Dishes (100mm)', category: 'General', itemId: 'CUI-LAB-2023' },
        { name: 'Syringe Filters (0.22µm)', category: 'General', itemId: 'CUI-LAB-2024' },
        { name: 'Parafilm', category: 'General', itemId: 'CUI-LAB-2025' },


        // ========== EQUIPMENT (Instruments, Cryo Grids, Screens) ==========
        // Equipment (Instruments)
        { name: 'Eppendorf Centrifuge 5424R', category: 'Equipment', itemId: 'CUI-LAB-3001', minStock: 1, equipmentStatus: 'Working' },
        { name: 'NanoDrop One', category: 'Equipment', itemId: 'CUI-LAB-3002', minStock: 1, equipmentStatus: 'Working' },
        { name: 'Bio-Rad ChemiDoc', category: 'Equipment', itemId: 'CUI-LAB-3003', minStock: 1, equipmentStatus: 'Working' },
        { name: 'AKTA Pure 25', category: 'Equipment', itemId: 'CUI-LAB-3004', minStock: 1, equipmentStatus: 'Working' },
        { name: 'Vitrobot Mark IV', category: 'Equipment', itemId: 'CUI-LAB-3005', minStock: 1, equipmentStatus: 'Working' },
        { name: 'Tecan Spark Plate Reader', category: 'Equipment', itemId: 'CUI-LAB-3006', minStock: 1, equipmentStatus: 'Working' },
        { name: 'Thermocycler T100', category: 'Equipment', itemId: 'CUI-LAB-3007', minStock: 1, equipmentStatus: 'Working' },
        { name: 'Sonication Bath', category: 'Equipment', itemId: 'CUI-LAB-3008', minStock: 1, equipmentStatus: 'Finicky' },
        { name: 'pH Meter', category: 'Equipment', itemId: 'CUI-LAB-3009', minStock: 1, equipmentStatus: 'Working' },
        { name: 'Vortex Mixer', category: 'Equipment', itemId: 'CUI-LAB-3010', minStock: 1, equipmentStatus: 'Broken' }
    ];

    console.log(`🌱 Seeding ${items.length} new items...`);

    const transaction = client.transaction();

    // Universal attributes
    const LOCATION = "Cuilab-Bay-1";
    // Owner is undefined (Lab Stock)

    items.forEach(item => {
        const doc = {
            _type: 'inventoryItem',
            ...item,
            location: LOCATION,
            stock: Math.floor(Math.random() * 20) + 1,
            minStock: item.minStock || 5, // Default to 5 unless specified (plasmid/equipment)
            // No owner field = Lab Stock
        };

        // Fix status based on random stock
        if (doc.stock === 0) doc.status = 'Out of Stock';
        else if (doc.stock < doc.minStock) doc.status = 'Low Stock';
        else doc.status = 'In Stock';

        transaction.create(doc);
    });

    try {
        await transaction.commit();
        console.log('🎉 Seed complete! Added 50 items to Cuilab-Bay-1 (Lab Stock).');
    } catch (err) {
        console.error('❌ Transaction failed:', err);
    }
}

resetAndSeed();
