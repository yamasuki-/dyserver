import { NextResponse } from 'next/server';
import { repository } from '@/lib/store';

export async function GET() {
    const endpoints = await repository.getEndpoints();
    const globalConfig = await repository.getGlobalConfig();

    const exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        globalConfig,
        endpoints
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
        headers: {
            'Content-Type': 'application/json',
            'Content-Disposition': `attachment; filename="dyserver-config-${new Date().toISOString().slice(0, 10)}.json"`
        }
    });
}
