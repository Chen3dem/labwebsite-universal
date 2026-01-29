import nodemailer from 'nodemailer';

export async function sendApprovalRequestEmail({
    itemName,
    itemId,
    requestedQuantity,
    requesterName
}: {
    itemName: string;
    itemId: string;
    requestedQuantity: number;
    requesterName: string;
}) {
    // 1. Check if env vars are set
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn("EMAIL_USER or EMAIL_PASS not set. Skipping email notification.");
        return;
    }

    // 2. Create Transporter (Gmail)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // 3. Email Content
    const mailOptions = {
        from: `"Cui Lab Inventory" <${process.env.EMAIL_USER}>`,
        to: 'cuilabmanager@gmail.com', // Fixed recipient as requested
        subject: `[Approval Needed] ${itemName} (Qty: ${requestedQuantity})`,
        text: `
Item Requested: ${itemName}
ID: ${itemId}
Quantity: ${requestedQuantity}
Requested By: ${requesterName}

Please review and approve this request on the Intranet:
${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/ordering
        `,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <h2 style="color: #0f172a;">Item Approval Requested</h2>
                <p>A new item has been requested and needs your approval.</p>
                
                <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                    <tr style="background-color: #f8fafc;">
                        <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Item</td>
                        <td style="padding: 10px; border: 1px solid #e2e8f0;">${itemName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">ID</td>
                        <td style="padding: 10px; border: 1px solid #e2e8f0;">${itemId}</td>
                    </tr>
                    <tr style="background-color: #f8fafc;">
                        <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Quantity</td>
                        <td style="padding: 10px; border: 1px solid #e2e8f0;">${requestedQuantity}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Requested By</td>
                        <td style="padding: 10px; border: 1px solid #e2e8f0;">${requesterName}</td>
                    </tr>
                </table>

                <div style="margin-top: 30px;">
                    <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/ordering" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Review Request</a>
                </div>
                
                <p style="margin-top: 30px; font-size: 12px; color: #64748b;">
                    Sent from Cui Lab Inventory System
                </p>
            </div>
        `
    };

    // 4. Send Email
    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to cuilabmanager@gmail.com for ${itemName}`);
    } catch (error) {
        console.error("Failed to send email:", error);

    }
}

export async function sendRepairRequestEmail({
    itemName,
    itemId,
    issueDescription,
    requesterName
}: {
    itemName: string;
    itemId: string;
    issueDescription: string;
    requesterName: string;
}) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn("EMAIL_USER or EMAIL_PASS not set. Repair email not sent.");
        return { success: false, error: "Missing EMAIL_USER or EMAIL_PASS env vars" };
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"Cui Lab Inventory" <${process.env.EMAIL_USER}>`,
        to: 'cuilabmanager@gmail.com',
        subject: `[Repair Requested] ${itemName}`,
        text: `
Repair Requested for: ${itemName}
ID: ${itemId}
Issue: ${issueDescription}
Requested By: ${requesterName}

Approve repair at: ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/ordering
        `,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <h2 style="color: #b91c1c;">Repair Requested</h2>
                <div style="background-color: #fef2f2; padding: 15px; border-radius: 6px; border: 1px solid #fecaca; margin-bottom: 20px;">
                    <strong>Issue:</strong> ${issueDescription}
                </div>
                
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: 8px; font-weight: bold;">Item</td><td style="padding: 8px;">${itemName}</td></tr>
                    <tr><td style="padding: 8px; font-weight: bold;">ID</td><td style="padding: 8px;">${itemId}</td></tr>
                    <tr><td style="padding: 8px; font-weight: bold;">By</td><td style="padding: 8px;">${requesterName}</td></tr>
                </table>

                <div style="margin-top: 30px;">
                    <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/ordering" style="background-color: #b91c1c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Review Request</a>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error: unknown) {
        console.error("Failed to send repair email:", error);
        return { success: false, error: (error as Error).message || "Unknown email error" };
    }
}
