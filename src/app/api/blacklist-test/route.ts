import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    try {
        // Try to fetch the homepage of blacklistseller.com
        const response = await fetch('https://blacklistseller.com', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'th-TH,th;q=0.9,en-US;q=0.8,en;q=0.7'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const html = await response.text();

        // Try to extract recent scam cases from the homepage
        const scamCases = extractScamCases(html);

        return NextResponse.json({ success: true, scamCases });
    } catch (error) {
        console.error('Error fetching blacklist data:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch blacklist data' },
            { status: 500 }
        );
    }
}

function extractScamCases(html: string) {
    const cases = [];
    const regex = /<h2 class="entry-title">[^<]*<a[^>]+href="([^"]+)"[^>]*>([^<]+)<\/a>/g;
    let match;

    while ((match = regex.exec(html)) !== null) {
        cases.push({
            url: match[1],
            title: match[2].trim()
        });
    }

    return cases;
} 