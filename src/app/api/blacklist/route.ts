import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { query } = body;

        if (!query || typeof query !== 'string') {
            return NextResponse.json(
                { error: 'Invalid request. Please provide a search query.' },
                { status: 400 }
            );
        }

        // Try direct search on blacklistseller.com
        const searchUrl = `https://blacklistseller.com/search/${encodeURIComponent(query)}`;
        const response = await fetch(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'th-TH,th;q=0.9,en-US;q=0.8,en;q=0.7'
            }
        });

        const html = await response.text();

        // Extract scammer information
        const scammerInfo = {
            name: extractContent(html, '<h1 class="entry-title">', '</h1>'),
            details: extractContent(html, '<div class="entry-content">', '</div>'),
            bankAccounts: extractListItems(html, 'เลขที่บัญชี') || extractListItems(html, 'Bank Account'),
            phoneNumbers: extractListItems(html, 'เบอร์โทร') || extractListItems(html, 'Phone Number'),
            reportCount: extractContent(html, 'จำนวนรายงาน:', '<') || extractContent(html, 'Report Count:', '<')
        };

        return NextResponse.json({
            success: true,
            data: scammerInfo
        });

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch data from blacklistseller.com' },
            { status: 500 }
        );
    }
}

function extractContent(html: string, startMarker: string, endMarker: string): string {
    const startIndex = html.indexOf(startMarker);
    if (startIndex === -1) return '';

    const contentStart = startIndex + startMarker.length;
    const endIndex = html.indexOf(endMarker, contentStart);
    if (endIndex === -1) return '';

    return html.substring(contentStart, endIndex).trim();
}

function extractListItems(html: string, marker: string): string[] {
    const items = [];
    const markerIndex = html.indexOf(marker);
    if (markerIndex === -1) return [];

    const ulStart = html.indexOf('<ul>', markerIndex);
    if (ulStart === -1) return [];

    const ulEnd = html.indexOf('</ul>', ulStart);
    if (ulEnd === -1) return [];

    const listContent = html.substring(ulStart, ulEnd);
    const liRegex = /<li>(.*?)<\/li>/g;
    let match;

    while ((match = liRegex.exec(listContent)) !== null) {
        items.push(match[1].trim());
    }

    return items;
} 