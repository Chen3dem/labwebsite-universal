
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

const LOCATION = "Cuilab-Bay-1";
const TODAY = new Date().toISOString();

// ID Generation Logic (Mirrors app/actions.ts but standalone)
async function getNextId(category, usedIds) {
    let start = 1000;
    if (category === 'Equipment') start = 1;
    if (category === 'Biological') start = 6000;

    let nextNum = start;
    let id = `CUI-LAB-${nextNum.toString().padStart(4, '0')}`;
    while (usedIds.has(id)) {
        nextNum++;
        id = `CUI-LAB-${nextNum.toString().padStart(4, '0')}`;
    }
    usedIds.add(id);
    return id;
}

const ITEMS = [
    // --- Equipment (Start 0001) ---
    { name: "High-Speed Centrifuge 5424R", category: "Equipment" },
    { name: "NanoDrop 2000 Spectrophotometer", category: "Equipment" },
    { name: "Thermal Cycler T100", category: "Equipment" },
    { name: "Gel Doc XR+ System", category: "Equipment" },
    { name: "Incubator Shaker 37°C", category: "Equipment" },
    { name: "Vortex Mixer Genie 2", category: "Equipment" },
    { name: "Mini-Centrifuge (Sprout)", category: "Equipment" },
    { name: "pH Meter SevenCompact", category: "Equipment" },
    { name: "Analytical Balance", category: "Equipment" },
    { name: "Micropipette Set (P1000, P200, P20, P2)", category: "Equipment" },
    { name: "Water Bath 42°C", category: "Equipment" },
    { name: "Heat Block", category: "Equipment" },
    { name: "Electrophoresis Power Supply", category: "Equipment" },
    { name: "Trans-Blot Turbo Transfer System", category: "Equipment" },
    { name: "Sonicator Q500", category: "Equipment" },
    { name: "FPLC System (ÄKTA pure)", category: "Equipment" },
    { name: "Cryo-Plunger (Vitrobot Mark IV)", category: "Equipment" },
    { name: "Transmission Electron Microscope Grip", category: "Equipment" },
    { name: "Liquid Nitrogen Dewar 35L", category: "Equipment" },
    { name: "Grid Storage Box System", category: "Equipment" },
    { name: "Plasma Cleaner", category: "Equipment" },
    { name: "Carbon Coater", category: "Equipment" },
    { name: "Microscope light source", category: "Equipment" },
    { name: "Fluorescence Microscope", category: "Equipment" },
    { name: "Plate Reader (Synergy H1)", category: "Equipment" },

    // --- Biological (Start 6000) ---
    { name: "E. coli BL21(DE3) Cells", category: "Biological" },
    { name: "E. coli DH5alpha Competent Cells", category: "Biological" },
    { name: "HEK293T Cell Line", category: "Biological" },
    { name: "HeLa Cell Line", category: "Biological" },
    { name: "Sf9 Insect Cells", category: "Biological" },
    { name: "T4 DNA Ligase", category: "Biological" },
    { name: "Q5 High-Fidelity DNA Polymerase", category: "Biological" },
    { name: "BamHI-HF Restriction Enzyme", category: "Biological" },
    { name: "EcoRI-HF Restriction Enzyme", category: "Biological" },
    { name: "NotI-HF Restriction Enzyme", category: "Biological" },
    { name: "XhoI Restriction Enzyme", category: "Biological" },
    { name: "NdeI Restriction Enzyme", category: "Biological" },
    { name: "DPN1 Enzyme", category: "Biological" },
    { name: "Proteinase K", category: "Biological" },
    { name: "RNase A", category: "Biological" },
    { name: "DNase I", category: "Biological" },
    { name: "Anti-GFP Antibody (Mouse)", category: "Biological" },
    { name: "Anti-His Tag Antibody (Rabbit)", category: "Biological" },
    { name: "Anti-Flag Antibody", category: "Biological" },
    { name: "Goat Anti-Mouse HRP Secondary", category: "Biological" },
    { name: "Goat Anti-Rabbit HRP Secondary", category: "Biological" },
    { name: "BSA Standards (2 mg/mL)", category: "Biological" },
    { name: "Pre-stained Protein Ladder", category: "Biological" },
    { name: "1kb DNA Ladder", category: "Biological" },
    { name: "pET28a Vector", category: "Biological" },
    { name: "pGEX-6P-1 Vector", category: "Biological" },
    { name: "pFastBac1 Vector", category: "Biological" },
    { name: "Trypsin-EDTA (0.25%)", category: "Biological" },
    { name: "Fetal Bovine Serum (FBS)", category: "Biological" },
    { name: "Penicillin-Streptomycin 100x", category: "Biological" },

    // --- General (Start 1000) ---
    { name: "Falcon 50mL Conical Tubes", category: "General" },
    { name: "Falcon 15mL Conical Tubes", category: "General" },
    { name: "1.5mL Microcentrifuge Tubes", category: "General" },
    { name: "PCR Tubes (0.2mL Strip)", category: "General" },
    { name: "Petri Dishes (100mm)", category: "General" },
    { name: "Pipette Tips P1000 (Blue)", category: "General" },
    { name: "Pipette Tips P200 (Yellow)", category: "General" },
    { name: "Pipette Tips P10 (Clear)", category: "General" },
    { name: "Filter Tips P1000", category: "General" },
    { name: "Filter Tips P200", category: "General" },
    { name: "Filter Tips P20", category: "General" },
    { name: "Nitrile Gloves Small", category: "General" },
    { name: "Nitrile Gloves Medium", category: "General" },
    { name: "Nitrile Gloves Large", category: "General" },
    { name: "Kimwipes (Large)", category: "General" },
    { name: "Kimwipes (Small)", category: "General" },
    { name: "Parafilm M", category: "General" },
    { name: "Aluminum Foil", category: "General" },
    { name: "Syringe Filters (0.22 um)", category: "General" },
    { name: "Syringes 10mL", category: "General" },
    { name: "Ethanol 100% (Molecular Grade)", category: "General" },
    { name: "Isopropanol", category: "General" },
    { name: "Agarose Powder", category: "General" },
    { name: "Tris Base", category: "General" },
    { name: "Glycine", category: "General" },
    { name: "SDS Powder", category: "General" },
    { name: "Acrylamide 30%", category: "General" },
    { name: "LB Broth Powder", category: "General" },
    { name: "LB Agar Powder", category: "General" },
    { name: "Cryo-EM Grid Boxes", category: "General" },
    { name: "Quantifoil R1.2/1.3 Grids", category: "General" },
    { name: "C-Flat Grids", category: "General" },
    { name: "Glow Discharge Glass Slides", category: "General" },
    { name: "Mica Sheets", category: "General" },
    { name: "Tweezers Types 5", category: "General" },
    { name: "Tweezers Types 4", category: "General" },
    { name: "Razor Blades", category: "General" },
    { name: "Sharps Container", category: "General" },
    { name: "Biohazard Bags Red", category: "General" },
    { name: "Autoclave Tape", category: "General" },
    { name: "Laboratory Notebook", category: "General" },
    { name: "Sharpie Markers (Black)", category: "General" },
    { name: "Cryo Vials 2mL", category: "General" },
    { name: "Lab Label Tape (White)", category: "General" },
    { name: "Lab Label Tape (Red)", category: "General" },
];

// Fill random items to reach 100 if list is short
while (ITEMS.length < 100) {
    ITEMS.push({ name: `Generic Lab Supply #${ITEMS.length + 1}`, category: "General" });
}

async function seed() {
    console.log("🔥  Starting Database Reset & Seeding...");

    // 1. Delete all existing inventory
    console.log("🗑️  Deleting existing items...");
    await client.delete({ query: '*[_type == "inventoryItem"]' });

    // 2. Create Items
    console.log(`🌱  Seeding ${ITEMS.length} items...`);

    const usedIds = new Set();
    const mutations = [];

    for (const item of ITEMS) {
        const itemId = await getNextId(item.category, usedIds);

        let minStock = 5;
        if (item.category === 'Equipment') minStock = 1;
        if (item.category === 'Biological') minStock = 2;

        const doc = {
            _type: 'inventoryItem',
            name: item.name,
            category: item.category,
            itemId: itemId,
            location: LOCATION,
            minStock: minStock,
            stock: Math.floor(Math.random() * 10) + 1, // Random stock 1-10
            status: 'In Stock', // Will trigger update if < minStock
            lastReceived: TODAY,
            notes: Math.random() > 0.7 ? [ // 30% chance of having a note
                {
                    _key: `note-${itemId}`,
                    content: "Auto-generated note: Checked inventory on arrival.",
                    author: "System Bot",
                    timestamp: TODAY
                }
            ] : undefined
        };

        if (item.category === 'Equipment') {
            doc.equipmentStatus = 'Working';
            doc.stock = 1; // Equipment usually single stock
        } else {
            // Calculate accurate status
            if (doc.stock < doc.minStock) doc.status = 'Low Stock';
        }

        mutations.push({ create: doc });
    }

    // Batch Commit
    // Sanity limit is around 195 mutations per transaction usually safe.
    // We have 100 items. One transaction is fine.
    console.log("💾  Committing transaction...");
    await client.transaction(mutations).commit();

    console.log("✅  Seeding Complete!");
}

seed().catch((err) => {
    console.error("❌ Seeding Failed:", err);
    process.exit(1);
});
