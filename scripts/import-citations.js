const { createClient } = require('@sanity/client');
const Cite = require('citation-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Initialize Sanity Client
const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_TOKEN, // Needs a write token!
    apiVersion: '2024-01-20',
    useCdn: false,
});

const INPUT_FILE = 'citations.txt';

async function importCitations() {
    console.log(`📖 Reading DOIs from ${INPUT_FILE}...`);

    try {
        const content = fs.readFileSync(INPUT_FILE, 'utf-8');
        const lines = content.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));

        if (lines.length === 0) {
            console.log('⚠️  No DOIs found in citations.txt');
            return;
        }

        console.log(`🔍 Found ${lines.length} citations to process.`);

        for (const id of lines) {
            console.log(`\n-----------------------------------`);
            console.log(`⚙️  Processing: ${id}`);

            try {
                // Fetch Metadata
                const citation = await Cite.async(id);
                const data = citation.data[0];

                // Helper to safely extract year
                const getYear = (d) => {
                    const sources = [d['published-print'], d['published-online'], d.issued, d.created];
                    for (const s of sources) {
                        if (s?.['date-parts']?.[0]?.[0]) return s['date-parts'][0][0];
                    }
                    return null;
                };

                const pubYear = getYear(data);

                // Format for Sanity
                const doc = {
                    _type: 'publication',
                    title: data.title,
                    doi: data.DOI,
                    journal: data['container-title'],
                    year: pubYear || new Date().getFullYear(), // Fallback only if absolutely nothing found, but usually created date exists
                    url: data.URL || (data.DOI ? `https://doi.org/${data.DOI}` : undefined),
                    authors: data.author ? data.author.map((a) => `${a.given} ${a.family}`).join(', ') : 'Unknown',
                    publishedAt: pubYear ? new Date(pubYear, 0, 1).toISOString() : new Date().toISOString(),
                };

                // Check for duplicates
                const query = `*[_type == "publication" && doi == $doi][0]`;
                const existing = await client.fetch(query, { doi: doc.doi });

                if (existing) {
                    console.log(`⏭️  Skipping (Already exists): ${doc.title}`);
                } else {
                    // Create
                    const res = await client.create(doc);
                    console.log(`✅ Imported: ${res.title}`);
                }

            } catch (err) {
                console.error(`❌ Error processing ${id}:`, err.message);
            }
        }

        console.log(`\n🎉 Done!`);

    } catch (err) {
        console.error('Failed to read input file:', err.message);
    }
}

// Check for API Token
if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ Missing SANITY_API_TOKEN in .env.local');
    console.error('Please generate a Viewer+Editor token in Sanity Manage (https://sanity.io/manage) and add it to .env.local');
    process.exit(1);
}

importCitations();
