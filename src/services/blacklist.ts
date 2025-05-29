interface BlacklistResult {
    isBlacklisted: boolean;
    details?: {
        name?: string;
        bankAccounts?: string[];
        phoneNumbers?: string[];
        socialAccounts?: string[];
        description?: string;
        reportCount?: number;
    };
    error?: string;
}

export async function checkBlacklist(query: string): Promise<BlacklistResult> {
    try {
        // First try to clean and validate the query
        const cleanQuery = query.trim();
        if (!cleanQuery) {
            return {
                isBlacklisted: false,
                error: 'Empty search query'
            };
        }

        // First try the direct search URL
        let searchUrl = `/api/blacklist-proxy/search/${encodeURIComponent(cleanQuery)}`;
        console.log('Attempting to fetch from:', searchUrl);

        let response = await fetch(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'th-TH,th;q=0.9,en-US;q=0.8,en;q=0.7',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        });

        // If direct search fails, try the homepage search
        if (!response.ok) {
            searchUrl = `/api/blacklist-proxy/?s=${encodeURIComponent(cleanQuery)}`;
            console.log('Trying alternative search URL:', searchUrl);
            response = await fetch(searchUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                    'Accept-Language': 'th-TH,th;q=0.9,en-US;q=0.8,en;q=0.7',
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const html = await response.text();
        console.log('Response HTML length:', html.length);

        // Check for no results message in both Thai and English
        if (html.includes('ไม่พบข้อมูล') || html.includes('No results found') || html.includes('ไม่พบผลลัพธ์')) {
            return {
                isBlacklisted: false,
                details: {
                    description: 'No blacklist records found for this search query.'
                }
            };
        }

        // Look for search results
        const hasSearchResults = html.includes('class="search-results"') ||
            html.includes('class="entry-title"') ||
            html.includes('class="profile-name"');

        // Extract information from the HTML response
        const details = {
            name: extractBetween(html, '<div class="profile-name">', '</div>').trim() ||
                extractBetween(html, '<h1 class="entry-title">', '</h1>').trim() ||
                extractBetween(html, '<h2 class="entry-title">', '</h2>').trim(),
            bankAccounts: [
                ...extractListItems(html, 'เลขที่บัญชี'),
                ...extractListItems(html, 'Bank Account'),
                ...extractListItems(html, 'บัญชีธนาคาร')
            ],
            phoneNumbers: [
                ...extractListItems(html, 'เบอร์โทร'),
                ...extractListItems(html, 'Phone Number'),
                ...extractListItems(html, 'เบอร์ติดต่อ')
            ],
            socialAccounts: [
                ...extractListItems(html, 'Social'),
                ...extractListItems(html, 'Social Media'),
                ...extractListItems(html, 'โซเชียลมีเดีย')
            ],
            description: extractBetween(html, '<div class="scam-detail">', '</div>').trim() ||
                extractBetween(html, '<div class="entry-content">', '</div>').trim() ||
                extractBetween(html, 'รายละเอียด:', '</div>').trim(),
            reportCount: parseInt(extractBetween(html, 'จำนวนรายงาน:', '<').trim()) ||
                parseInt(extractBetween(html, 'Report Count:', '<').trim()) || 0
        };

        // Clean up arrays to remove duplicates and empty values
        details.bankAccounts = [...new Set(details.bankAccounts.filter(Boolean))];
        details.phoneNumbers = [...new Set(details.phoneNumbers.filter(Boolean))];
        details.socialAccounts = [...new Set(details.socialAccounts.filter(Boolean))];

        console.log('Extracted details:', details);

        // Check if we found any meaningful data
        const hasData = Object.values(details).some(value =>
            Array.isArray(value) ? value.length > 0 : Boolean(value)
        );

        if (!hasData && !hasSearchResults) {
            console.log('No meaningful data found in the response');
            return {
                isBlacklisted: false,
                details: {
                    description: 'No detailed information found.'
                }
            };
        }

        // If we found search results but no specific details, it might be a search results page
        if (!hasData && hasSearchResults) {
            const searchResultLinks = extractSearchResults(html);
            if (searchResultLinks.length > 0) {
                // Get the first search result
                const firstResult = searchResultLinks[0];
                console.log('Found search result, fetching details from:', firstResult);

                // Fetch the specific result page
                const detailResponse = await fetch(`/api/blacklist-proxy${firstResult}`, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                        'Accept-Language': 'th-TH,th;q=0.9,en-US;q=0.8,en;q=0.7',
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache'
                    }
                });

                if (detailResponse.ok) {
                    return checkBlacklist(query); // Recursively process the detail page
                }
            }
        }

        return {
            isBlacklisted: true,
            details
        };

    } catch (error) {
        console.error('Error checking blacklist:', error);
        return {
            isBlacklisted: false,
            error: 'Failed to check blacklist. The service might be temporarily unavailable.'
        };
    }
}

// Helper function to extract content between two strings
function extractBetween(text: string, start: string, end: string): string {
    const startIndex = text.toLowerCase().indexOf(start.toLowerCase());
    if (startIndex === -1) return '';

    const contentStart = startIndex + start.length;
    const endIndex = text.toLowerCase().indexOf(end.toLowerCase(), contentStart);
    if (endIndex === -1) return '';

    return text.substring(contentStart, endIndex)
        .replace(/<[^>]*>/g, '') // Remove any HTML tags
        .trim();
}

// Helper function to extract list items
function extractListItems(html: string, identifier: string): string[] {
    const items: string[] = [];
    const lowerHtml = html.toLowerCase();
    const lowerIdentifier = identifier.toLowerCase();
    let startIndex = lowerHtml.indexOf(lowerIdentifier);

    while (startIndex !== -1) {
        const listStart = lowerHtml.indexOf('<ul', startIndex);
        const listEnd = lowerHtml.indexOf('</ul>', listStart);

        if (listStart === -1 || listEnd === -1) break;

        const listContent = html.substring(listStart, listEnd);
        const matches = listContent.match(/<li[^>]*>(.*?)<\/li>/gi);

        if (matches) {
            items.push(...matches.map(item =>
                item.replace(/<li[^>]*>|<\/li>|<[^>]*>/g, '').trim()
            ).filter(Boolean));
        }

        startIndex = lowerHtml.indexOf(lowerIdentifier, listEnd);
    }

    return items;
}

// Helper function to extract search result links
function extractSearchResults(html: string): string[] {
    const links: string[] = [];
    const regex = /<a[^>]+href="([^"]+)"[^>]*class="[^"]*entry-title-link[^"]*"[^>]*>/g;
    let match;

    while ((match = regex.exec(html)) !== null) {
        const url = match[1];
        if (url.startsWith('http')) {
            // Convert absolute URL to path
            const urlObj = new URL(url);
            links.push(urlObj.pathname);
        } else {
            links.push(url);
        }
    }

    return links;
} 