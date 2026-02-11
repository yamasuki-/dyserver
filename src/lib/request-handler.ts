import { NextRequest, NextResponse } from 'next/server';
import { repository } from '@/lib/store';
import { EndpointConfig, ResponseSet, HttpMethod } from '@/types';

function matchCondition(reqValues: { header: any, body: any, query: any }, condition: any): boolean {
    const { target, key, value } = condition;
    const targetVal = reqValues[target]?.[key];
    return targetVal === value;
}

export async function handleRequest(request: NextRequest, params: { slug: string[] }) {
    const path = '/' + params.slug.join('/');
    const method = request.method as HttpMethod;

    // 1. Get Endpoints
    const endpoints = await repository.getEndpoints();

    // 2. Find matching endpoint
    // Exact match for now. TODO: Support parameterized paths like /api/users/[id]
    // Ideally we use a routing library or regex matching.
    // For MVP: Exact string match of configured path vs request path.
    // Note: configured path might be "api/users" (no leading slash?) or "/api/users".
    // Let's normalize to leading slash.

    const endpoint = endpoints.find(e => {
        // Normalize both to have leading slash
        const ePath = e.path.startsWith('/') ? e.path : '/' + e.path;
        return ePath === path;
    });

    const requestBodyStr = await request.text();
    let requestBodyJson = {};
    try {
        requestBodyJson = JSON.parse(requestBodyStr);
    } catch {
        // ignore
    }

    const queryObj: Record<string, string> = {};
    request.nextUrl.searchParams.forEach((val, key) => {
        queryObj[key] = val;
    });

    const headersObj: Record<string, string> = {};
    request.headers.forEach((val, key) => {
        headersObj[key] = val;
    });


    // Logging data prep
    const startTime = Date.now();

    if (!endpoint) {
        return NextResponse.json({ error: 'Endpoint not found', path }, { status: 404 });
    }

    const methodConfig = endpoint.methods[method];
    if (!methodConfig || !methodConfig.enabled) {
        return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
    }

    // 3. Select Response Set
    let selectedSet: ResponseSet | undefined;
    let selectionReason = 'default';

    if (methodConfig.mode === 'random') {
        const sets = methodConfig.responseSets;
        if (sets.length > 0) {
            const idx = Math.floor(Math.random() * sets.length);
            selectedSet = sets[idx];
            selectionReason = 'random';
        }
    } else if (methodConfig.mode === 'conditional') {
        // Check conditions
        for (const condition of methodConfig.conditions) {
            // Prepare values for check
            const values = {
                header: headersObj,
                body: requestBodyJson,
                query: queryObj
            };
            if (matchCondition(values, condition)) {
                selectedSet = methodConfig.responseSets.find(s => s.id === condition.responseSetId);
                selectionReason = `condition:${condition.key}=${condition.value}`;
                if (selectedSet) break;
            }
        }
        // Fallback to active/default if no condition met?
        if (!selectedSet && methodConfig.activeResponseSetId) {
            selectedSet = methodConfig.responseSets.find(s => s.id === methodConfig.activeResponseSetId);
        }
    } else {
        // Default
        if (methodConfig.activeResponseSetId) {
            selectedSet = methodConfig.responseSets.find(s => s.id === methodConfig.activeResponseSetId);
        }
    }

    // Fallback if no set selected
    if (!selectedSet && methodConfig.responseSets.length > 0) {
        selectedSet = methodConfig.responseSets[0];
    }

    if (!selectedSet) {
        return NextResponse.json({ error: 'No response set configured' }, { status: 500 });
    }

    if (selectedSet.isNoResponse) {
        // Simulate no response (timeout or connection close)? 
        // In HTTP, we must return something or close. 
        // Next.js middleware/route cannot easily just "drop".
        // We can return a specific status or just hang (not recommended).
        // Requirement says "Return no response".
        // Maybe return 444 (Nginx no response) or just nothing?
        // For now, let's return a 200 with empty body but log it as "No Response".
        // Or maybe abort?
        // Let's assume 444 No Response for now.
        // But actually, "応答を返さない" might mean "Disconnect".
        // We can't do that easily in Vercel/NextJS functions.
        // We'll return 444.
    }

    // 4. Send Response
    const responseHeaders = new Headers();
    Object.entries(selectedSet.headers || {}).forEach(([k, v]) => responseHeaders.set(k, v));

    let responseBody = selectedSet.body;
    // If JSON content type, ensure body is stringified if it's object?
    // The model says body is string.

    const finalStatus = selectedSet.statusCode;

    // 5. Logging
    const endTime = Date.now();
    const duration = endTime - startTime;

    // Check global config for logging
    const globalConfig = await repository.getGlobalConfig();

    if (globalConfig.logging.request) {
        const logEntry = {
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            method,
            path,
            statusCode: finalStatus,
            request: {
                headers: headersObj,
                query: queryObj,
                body: requestBodyStr
            },
            response: globalConfig.logging.response ? {
                headers: selectedSet.headers,
                body: responseBody,
                responseSetId: selectedSet.id,
                responseSetName: selectedSet.name
            } : undefined,
            durationMs: duration
        };
        await repository.addLog(logEntry);
    }

    // Return
    if (selectedSet.isNoResponse) {
        // abort
        // In node we can req.destroy()?
        // In Next.js App Router, maybe just throw error?
        return new NextResponse(null, { status: 444 });
    }

    return new NextResponse(responseBody, {
        status: finalStatus,
        headers: responseHeaders
    });
}
