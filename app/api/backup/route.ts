import { NextResponse } from 'next/server';
import { performBackup } from '@/lib/backup';

export const maxDuration = 60; // Allow 60 seconds for backup

export async function GET(request: Request) {
    // 1. Verify Authentication
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        // Allow running in dev mode without secret for testing
        if (process.env.NODE_ENV !== 'development') {
            return new NextResponse('Unauthorized', { status: 401 });
        }
    }

    try {
        const result = await performBackup();

        if (result.success) {
            return NextResponse.json({ success: true, ...result });
        } else {
            return NextResponse.json({ success: false, error: String(result.error) }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}
