import { NextRequest, NextResponse } from 'next/server';

const GATEWAY_URL = process.env.GATEWAY_URL || 'http://gateway:8080';

async function proxyRequest(request: NextRequest, params: { path: string[] }) {
    const path = params.path.join('/');
    const url = `${GATEWAY_URL}/${path}`;
    
    // Forward headers
    const headers = new Headers();
    request.headers.forEach((value, key) => {
        if (key.toLowerCase() !== 'host' && key.toLowerCase() !== 'content-length') {
            headers.set(key, value);
        }
    });

    const fetchOptions: RequestInit = {
        method: request.method,
        headers,
    };

    // Forward body for methods that support it
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
        try {
            const body = await request.text();
            if (body) {
                fetchOptions.body = body;
            }
        } catch {
            // No body to forward
        }
    }

    try {
        const response = await fetch(url, fetchOptions);
        const data = await response.text();
        
        // Forward response headers
        const responseHeaders = new Headers();
        response.headers.forEach((value, key) => {
            if (!['content-encoding', 'transfer-encoding'].includes(key.toLowerCase())) {
                responseHeaders.set(key, value);
            }
        });

        return new NextResponse(data, {
            status: response.status,
            headers: responseHeaders,
        });
    } catch (error) {
        console.error('Proxy error:', error);
        return NextResponse.json(
            { error: 'Failed to proxy request' },
            { status: 502 }
        );
    }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return proxyRequest(request, await params);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return proxyRequest(request, await params);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return proxyRequest(request, await params);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return proxyRequest(request, await params);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return proxyRequest(request, await params);
}
