import { NextRequest } from 'next/server';
import { LRUCache } from 'lru-cache';

export interface RateLimitConfig {
    uniqueTokenPerInterval?: number;
    interval?: number;
}

export interface RateLimiter {
    check: (req: NextRequest, limit: number) => Promise<void>;
}

export function rateLimit(options?: RateLimitConfig): RateLimiter {
    const tokenCache = new LRUCache({
        max: options?.uniqueTokenPerInterval || 500,
        ttl: options?.interval || 60000,
    });

    return {
        check: async (req: NextRequest, limit: number): Promise<void> => {
            const ip = req.ip || 'anonymous';
            const tokenCount = (tokenCache.get(ip) as number[]) || [0];
            const currentUsage = tokenCount[0];
            const isRateLimited = currentUsage >= limit;

            if (isRateLimited) {
                throw new Error('Rate limit exceeded');
            }

            tokenCount[0] = currentUsage + 1;
            tokenCache.set(ip, tokenCount);
        },
    };
} 