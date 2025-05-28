import { NextRequest, NextResponse } from 'next/server';
import { OpenAIService } from '@/services/openai';
import { rateLimit } from '@/utils/rate-limit';

const limiter = rateLimit({
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 500, // Max 500 users per interval
});

export async function POST(req: NextRequest) {
    try {
        // Apply rate limiting
        try {
            await limiter.check(req, 10); // 10 requests per minute
        } catch {
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                { status: 429 }
            );
        }

        // Validate request
        const { message, context } = await req.json();

        if (!message || typeof message !== 'string' || message.length > 1000) {
            return NextResponse.json(
                { error: 'Invalid message. Message must be a string under 1000 characters.' },
                { status: 400 }
            );
        }

        // Generate response using OpenAI
        const openaiService = OpenAIService.getInstance();
        const response = await openaiService.generateResponse(message, context);

        if (response.error) {
            return NextResponse.json(
                { error: response.error },
                { status: 500 }
            );
        }

        return NextResponse.json({ reply: response.reply });

    } catch (err: any) {
        console.error('Chat API Error:', err);
        return NextResponse.json(
            { error: 'An unexpected error occurred. Please try again.' },
            { status: 500 }
        );
    }
} 