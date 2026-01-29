// Script to seed 50 diverse inventory items across all categories
// Run with: node scripts/seed-lab-inventory.js

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@sanity/client');

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
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
    'Cryo Storage',
    'Bench 1',
    'Bench 2',
];

// Helper to pick random element
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randStock = () => Math.floor(Math.random() * 20);
const randId = () => `CUI-LAB-${String(Math.floor(1000 + Math.random() * 9000))}`;

const items = [
    // ========== Plasmids (5) ==========
    { name: 'pET-28a(+)', category: 'Plasmid', location: '-20°C Freezer 1', vectorBackbone: 'pET-28a', antibioticResistance: 'Kanamycin', geneInsert: 'None (empty vector)', sequenceVerified: true },
    { name: 'pGEX-6P-1-Ub', category: 'Plasmid', location: '-20°C Freezer 1', vectorBackbone: 'pGEX-6P-1', antibioticResistance: 'Ampicillin', geneInsert: 'Ubiquitin', sequenceVerified: true },
    { name: 'pCMV-GFP', category: 'Plasmid', location: '-20°C Freezer 2', vectorBackbone: 'pCMV', antibioticResistance: 'Kanamycin', geneInsert: 'eGFP', sequenceVerified: true },
    { name: 'pET-SUMO-Protease', category: 'Plasmid', location: '-20°C Freezer 1', vectorBackbone: 'pET-SUMO', antibioticResistance: 'Kanamycin', geneInsert: 'SUMO Protease', sequenceVerified: false },
    { name: 'pMAL-c5X-MBP', category: 'Plasmid', location: '-20°C Freezer 2', vectorBackbone: 'pMAL-c5X', antibioticResistance: 'Ampicillin', geneInsert: 'MBP fusion', sequenceVerified: true },

    // ========== Primers (5) ==========
    { name: 'T7 Forward Primer', category: 'Primer', location: '-20°C Freezer 1', sequence: 'TAATACGACTCACTATAGGG', targetGene: 'T7 promoter' },
    { name: 'T7 Reverse Primer', category: 'Primer', location: '-20°C Freezer 1', sequence: 'GCTAGTTATTGCTCAGCGG', targetGene: 'T7 terminator' },
    { name: 'GFP-Seq-F', category: 'Primer', location: '-20°C Freezer 1', sequence: 'ATGGTGAGCAAGGGCGAGGAG', targetGene: 'eGFP' },
    { name: 'Ub-Clone-R', category: 'Primer', location: '-20°C Freezer 1', sequence: 'TCAACCACCTCTTAGTCTTAAG', targetGene: 'Ubiquitin' },
    { name: 'SUMO-Seq-F', category: 'Primer', location: '-20°C Freezer 2', sequence: 'ATGTCGGACTCAGAAGTCAATC', targetGene: 'SUMO' },

    // ========== Cell Stocks (5) ==========
    { name: 'BL21(DE3) Competent Cells', category: 'CellStock', location: '-80°C Freezer 1', strain: 'BL21(DE3)', resistanceMarker: 'None' },
    { name: 'DH5α Competent Cells', category: 'CellStock', location: '-80°C Freezer 1', strain: 'DH5α', resistanceMarker: 'None' },
    { name: 'Rosetta 2(DE3) Cells', category: 'CellStock', location: '-80°C Freezer 1', strain: 'Rosetta 2(DE3)', resistanceMarker: 'Chloramphenicol' },
    { name: 'XL1-Blue Cells', category: 'CellStock', location: '-80°C Freezer 2', strain: 'XL1-Blue', resistanceMarker: 'Tetracycline' },
    { name: 'SHuffle T7 Express', category: 'CellStock', location: '-80°C Freezer 2', strain: 'SHuffle T7', resistanceMarker: 'Spectinomycin' },

    // ========== Proteins (5) ==========
    { name: 'TEV Protease', category: 'Protein', location: '-80°C Freezer 1', concentration: 2.5, bufferComposition: '50 mM Tris pH 8.0, 150 mM NaCl, 10% glycerol', molecularWeight: 27, extinctionCoefficient: 32290 },
    { name: 'SUMO Protease (Ulp1)', category: 'Protein', location: '-80°C Freezer 1', concentration: 5.0, bufferComposition: '20 mM Tris pH 7.5, 150 mM NaCl, 1 mM DTT', molecularWeight: 25, extinctionCoefficient: 28420 },
    { name: 'Streptavidin', category: 'Protein', location: '-20°C Freezer 1', concentration: 1.0, bufferComposition: 'PBS pH 7.4', molecularWeight: 60, extinctionCoefficient: 41940 },
    { name: 'BSA Standard', category: 'Protein', location: '4°C Fridge', concentration: 10.0, bufferComposition: 'PBS pH 7.4', molecularWeight: 66, extinctionCoefficient: 43824 },
    { name: 'Lysozyme', category: 'Protein', location: '-20°C Freezer 2', concentration: 50.0, bufferComposition: '10 mM Tris pH 8.0', molecularWeight: 14.3, extinctionCoefficient: 37970 },

    // ========== Chemicals (8) ==========
    { name: 'IPTG (1M stock)', category: 'Chemical', location: '-20°C Freezer 1', casNumber: '367-93-1', hazardType: 'None', storageTemp: '-20°C', lotNumber: 'SLCD5432' },
    { name: 'DTT (1M stock)', category: 'Chemical', location: '-20°C Freezer 1', casNumber: '3483-12-3', hazardType: 'Toxic', storageTemp: '-20°C', lotNumber: 'MKCK8765' },
    { name: 'Imidazole', category: 'Chemical', location: 'Chemical Cabinet', casNumber: '288-32-4', hazardType: 'Corrosive', storageTemp: 'RT', lotNumber: 'BCBT9012' },
    { name: 'Tris Base', category: 'Chemical', location: 'Chemical Cabinet', casNumber: '77-86-1', hazardType: 'None', storageTemp: 'RT', lotNumber: 'SLCB1234' },
    { name: 'Sodium Chloride', category: 'Chemical', location: 'Chemical Cabinet', casNumber: '7647-14-5', hazardType: 'None', storageTemp: 'RT', lotNumber: 'MKBQ5678' },
    { name: 'Glycerol', category: 'Chemical', location: 'Chemical Cabinet', casNumber: '56-81-5', hazardType: 'None', storageTemp: 'RT', lotNumber: 'SHBL4567' },
    { name: 'Ethanol 100%', category: 'Chemical', location: 'Chemical Cabinet', casNumber: '64-17-5', hazardType: 'Flammable', storageTemp: 'RT', lotNumber: 'STBJ7890' },
    { name: 'β-Mercaptoethanol', category: 'Chemical', location: 'Chemical Cabinet', casNumber: '60-24-2', hazardType: 'Toxic', storageTemp: '4°C', lotNumber: 'MKCL2345' },

    // ========== Kits (5) ==========
    { name: 'QIAprep Spin Miniprep Kit', category: 'Kit', location: 'Room Temperature Shelf', kitType: 'Miniprep', manufacturer: 'Qiagen' },
    { name: 'NEB Q5 High-Fidelity PCR Kit', category: 'Kit', location: '-20°C Freezer 1', kitType: 'PCR', manufacturer: 'New England Biolabs' },
    { name: 'Gibson Assembly Master Mix', category: 'Kit', location: '-20°C Freezer 1', kitType: 'Cloning', manufacturer: 'New England Biolabs' },
    { name: 'Pierce BCA Protein Assay Kit', category: 'Kit', location: 'Room Temperature Shelf', kitType: 'Protein Assay', manufacturer: 'Thermo Fisher' },
    { name: 'GeneJET Gel Extraction Kit', category: 'Kit', location: 'Room Temperature Shelf', kitType: 'Gel Extraction', manufacturer: 'Thermo Fisher' },

    // ========== Chromatography (4) ==========
    { name: 'Ni-NTA Agarose', category: 'Chromatography', location: '4°C Fridge', resinType: 'Ni-NTA', columnType: 'Gravity' },
    { name: 'Glutathione Sepharose 4B', category: 'Chromatography', location: '4°C Fridge', resinType: 'Glutathione', columnType: 'Gravity' },
    { name: 'Superdex 200 Increase 10/300', category: 'Chromatography', location: '4°C Fridge', resinType: 'Size Exclusion', columnType: 'Superdex 200' },
    { name: 'HiTrap Q HP 5mL', category: 'Chromatography', location: '4°C Fridge', resinType: 'Anion Exchange', columnType: 'HiTrap Q' },

    // ========== Cryo Grids (4) ==========
    { name: 'Quantifoil R1.2/1.3 Cu 300', category: 'CryoGrid', location: 'Cryo Storage', gridType: 'Quantifoil 1.2/1.3', meshSize: '300 mesh', iceQuality: 'Good' },
    { name: 'C-flat 1.2/1.3 Au 300', category: 'CryoGrid', location: 'Cryo Storage', gridType: 'C-flat 1.2/1.3', meshSize: '300 mesh', iceQuality: 'Good' },
    { name: 'UltrAuFoil R1.2/1.3 Au 300', category: 'CryoGrid', location: 'Cryo Storage', gridType: 'UltrAuFoil 1.2/1.3', meshSize: '300 mesh', iceQuality: 'Thick' },
    { name: 'Lacey Carbon Cu 400', category: 'CryoGrid', location: 'Cryo Storage', gridType: 'Lacey Carbon', meshSize: '400 mesh', iceQuality: 'Crystalline' },

    // ========== Crystal Screens (4) ==========
    { name: 'Hampton Crystal Screen HT', category: 'CrystalScreen', location: '4°C Fridge', screenName: 'Crystal Screen HT', wellCondition: 'A1', precipitant: 'PEG 4000', phValue: 7.0 },
    { name: 'Molecular Dimensions PACT Premier', category: 'CrystalScreen', location: '4°C Fridge', screenName: 'PACT Premier', wellCondition: 'B3', precipitant: 'PEG 3350', phValue: 6.5 },
    { name: 'Hampton Index HT', category: 'CrystalScreen', location: '4°C Fridge', screenName: 'Index HT', wellCondition: 'C5', precipitant: 'Ammonium Sulfate', phValue: 8.0 },
    { name: 'Qiagen Classics Suite', category: 'CrystalScreen', location: '4°C Fridge', screenName: 'Classics Suite', wellCondition: 'D2', precipitant: 'PEG 8000', phValue: 7.5 },

    // ========== Consumables (5) ==========
    { name: '1.5 mL Microcentrifuge Tubes', category: 'Consumable', location: 'Room Temperature Shelf', itemType: 'Tubes', isSterile: false },
    { name: '10 µL Filter Tips', category: 'Consumable', location: 'Room Temperature Shelf', itemType: 'Tips', isSterile: true },
    { name: '200 µL Filter Tips', category: 'Consumable', location: 'Room Temperature Shelf', itemType: 'Tips', isSterile: true },
    { name: '1000 µL Filter Tips', category: 'Consumable', location: 'Room Temperature Shelf', itemType: 'Tips', isSterile: true },
    { name: '96-Well PCR Plates', category: 'Consumable', location: 'Room Temperature Shelf', itemType: 'Plates', isSterile: true },

    // ========== Equipment (5) ==========
    { name: 'Eppendorf Centrifuge 5424R', category: 'Equipment', location: 'Bench 1', serialNumber: 'EP-2024-001', serviceDate: '2024-06-15', manualUrl: 'https://www.eppendorf.com/5424R-manual' },
    { name: 'NanoDrop One', category: 'Equipment', location: 'Bench 2', serialNumber: 'ND-2023-042', serviceDate: '2024-01-10', manualUrl: 'https://www.thermofisher.com/nanodrop-manual' },
    { name: 'Bio-Rad ChemiDoc', category: 'Equipment', location: 'Bench 2', serialNumber: 'BR-CD-2022-015', serviceDate: '2023-12-01', manualUrl: 'https://www.bio-rad.com/chemidoc-manual' },
    { name: 'AKTA Pure 25', category: 'Equipment', location: '4°C Fridge', serialNumber: 'GE-AKTA-2021-008', serviceDate: '2024-03-20', manualUrl: 'https://www.cytivalifesciences.com/akta-manual', calendarUrl: 'https://calendar.google.com/calendar/embed?src=akta-booking' },
    { name: 'Vitrobot Mark IV', category: 'Equipment', location: 'Cryo Storage', serialNumber: 'FEI-VB-2020-003', serviceDate: '2024-05-01', manualUrl: 'https://www.thermofisher.com/vitrobot-manual', calendarUrl: 'https://calendar.google.com/calendar/embed?src=vitrobot-booking' },
];

async function seedItems() {
    console.log(`Seeding ${items.length} inventory items...`);

    for (const item of items) {
        const doc = {
            _type: 'inventoryItem',
            itemId: randId(),
            stock: randStock(),
            minStock: 5,
            status: 'In Stock',
            ...item,
        };

        try {
            const result = await client.create(doc);
            console.log(`✅ Created: ${item.name} (${item.category}) - ${result._id}`);
        } catch (err) {
            console.error(`❌ Failed to create ${item.name}:`, err.message);
        }
    }

    console.log('\n🎉 Seeding complete!');
}

seedItems();
