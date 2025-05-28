import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const MAX_RETRIES = 3;
const INITIAL_DELAY = 1000;

async function fetchWithRetry(url: string, options: RequestInit, retryCount = 0): Promise<Response> {
    try {
        const response = await fetch(url, options);

        if (response.ok) {
            return response;
        }

        if (retryCount < MAX_RETRIES) {
            const delayTime = INITIAL_DELAY * Math.pow(2, retryCount);
            await delay(delayTime);
            return fetchWithRetry(url, options, retryCount + 1);
        }

        return response;
    } catch (error) {
        if (retryCount < MAX_RETRIES) {
            const delayTime = INITIAL_DELAY * Math.pow(2, retryCount);
            await delay(delayTime);
            return fetchWithRetry(url, options, retryCount + 1);
        }
        throw error;
    }
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get('q');

        if (!query) {
            return NextResponse.json(
                { success: false, error: 'Search query is required' },
                { status: 400 }
            );
        }

        // Common headers that look more like a real browser
        const commonHeaders = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Accept-Language': 'th-TH,th;q=0.9,en-US;q=0.8,en;q=0.7',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Cache-Control': 'max-age=0',
            'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
            'Sec-Ch-Ua-Mobile': '?0',
            'Sec-Ch-Ua-Platform': '"Windows"',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
            'Upgrade-Insecure-Requests': '1',
            'DNT': '1',
            'Pragma': 'no-cache'
        };

        // Step 1: Visit the homepage first to get cookies and establish a session
        const homeResponse = await fetchWithRetry('https://blacklistseller.com', {
            headers: {
                ...commonHeaders,
                'Referer': 'https://www.google.com/'
            }
        });

        if (!homeResponse.ok) {
            console.error('Failed to fetch homepage:', homeResponse.status);
            return NextResponse.json(
                {
                    success: false,
                    error: 'Unable to access blacklistseller.com. The service might be temporarily unavailable.'
                },
                { status: 503 }
            );
        }

        // Get cookies and wait a bit to simulate human behavior
        const cookies = homeResponse.headers.get('set-cookie');
        await delay(Math.random() * 1000 + 500); // Random delay between 500-1500ms

        // Step 2: Perform the search with cookies and proper headers
        const searchUrl = `https://blacklistseller.com/?s=${encodeURIComponent(query)}`;
        const searchResponse = await fetchWithRetry(searchUrl, {
            headers: {
                ...commonHeaders,
                'Cookie': cookies || '',
                'Referer': 'https://blacklistseller.com/',
                'Sec-Fetch-Site': 'same-origin'
            }
        });

        if (!searchResponse.ok) {
            console.error('Search failed:', searchResponse.status);
            return NextResponse.json(
                {
                    success: false,
                    error: 'Unable to perform search. Please try again later.'
                },
                { status: 503 }
            );
        }

        const html = await searchResponse.text();

        // Extract search results
        const searchResults = extractSearchResults(html);

        // If we got results, return them
        if (searchResults.length > 0) {
            return NextResponse.json({
                success: true,
                data: searchResults
            });
        }

        // If no results found in the main search, try the alternative search endpoint
        const altSearchUrl = `https://blacklistseller.com/search/${encodeURIComponent(query)}`;
        const altSearchResponse = await fetchWithRetry(altSearchUrl, {
            headers: {
                ...commonHeaders,
                'Cookie': cookies || '',
                'Referer': searchUrl,
                'Sec-Fetch-Site': 'same-origin'
            }
        });

        if (!altSearchResponse.ok) {
            return NextResponse.json({
                success: true,
                data: [] // Return empty results if alternative search fails
            });
        }

        const altHtml = await altSearchResponse.text();
        const altSearchResults = extractSearchResults(altHtml);

        return NextResponse.json({
            success: true,
            data: altSearchResults
        });

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch scammer data. The service might be temporarily unavailable.'
            },
            { status: 500 }
        );
    }
}

function extractSearchResults(html: string): any[] {
    const results = [];

    // Try multiple patterns to extract results
    const patterns = [
        /<h2 class="entry-title">\s*<a href="([^"]+)"[^>]*>([^<]+)<\/a>/g,
        /<h1 class="entry-title">([^<]+)<\/h1>/g,
        /<div class="entry-content">([\s\S]*?)<\/div>/g
    ];

    for (const pattern of patterns) {
        let match;
        while ((match = pattern.exec(html)) !== null) {
            if (match[1] && match[2]) {
                results.push({
                    url: match[1],
                    title: match[2].trim()
                });
            } else if (match[1]) {
                results.push({
                    title: match[1].trim()
                });
            }
        }
    }

    return results;
} 