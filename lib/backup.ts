import { createClient } from '@sanity/client';
import nodemailer from 'nodemailer';

// Initialize Sanity Client
const sanityClient = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-01-20',
    token: process.env.SANITY_API_TOKEN, // Needed for export
    useCdn: false,
});

export async function performBackup() {
    try {
        console.log('Starting email backup process...');

        // 1. Check Email Config
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            throw new Error('EMAIL_USER or EMAIL_PASS not set');
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `cui-lab-backup-${timestamp}.ndjson`;

        // 2. Export Data from Sanity
        const { projectId, dataset } = sanityClient.config();
        // Use v1 export endpoint (v2 is for queries/mutations)
        const exportUrl = `https://${projectId}.api.sanity.io/v1/data/export/${dataset}`;

        console.log(`Fetching data from: ${exportUrl}`);

        const response = await fetch(exportUrl, {
            headers: {
                Authorization: `Bearer ${process.env.SANITY_API_TOKEN}`
            }
        });

        if (!response.body) throw new Error('Failed to get export stream from Sanity');

        // Get text content (efficient enough for <100MB files, if huge we'd stream but email has limits anyway)
        const data = await response.text();
        const buffer = Buffer.from(data, 'utf-8');
        const fileSizeMb = buffer.length / 1024 / 1024;

        console.log(`Download complete. Size: ${fileSizeMb.toFixed(2)} MB`);

        if (fileSizeMb > 25) {
            throw new Error(`Backup too large for email (${fileSizeMb.toFixed(2)} MB). Limit is ~25MB.`);
        }

        // 3. Send Email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        console.log(`Sending email to ${process.env.EMAIL_USER}...`);

        const mailOptions = {
            from: `"Cui Lab Backup Bot" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // Send to self (Admin)
            subject: `[Backup] CUI Lab Website - ${new Date().toLocaleDateString()}`,
            text: `Attached is the weekly full data backup for the CUI Lab Website.
            
Date: ${new Date().toLocaleString()}
File: ${fileName}
Size: ${fileSizeMb.toFixed(2)} MB
Status: SUCCESS

Keep this file safe. To restore, use 'sanity dataset import'.`,
            attachments: [
                {
                    filename: fileName,
                    content: buffer
                }
            ]
        };

        await transporter.sendMail(mailOptions);

        console.log('Backup email sent successfully.');
        return { success: true, method: 'email', size: fileSizeMb };

    } catch (error) {
        console.error('Backup failed:', error);
        return { success: false, error };
    }
}
