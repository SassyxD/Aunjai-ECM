import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { message, language } = await req.json();
        if (!message || typeof message !== 'string' || message.length > 1000) {
            return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
        }
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'OpenAI API key not set' }, { status: 500 });
        }

        const systemMessage = language === 'th'
            ? 'คุณเป็นผู้ช่วยฉุกเฉินสำหรับสถานการณ์การหลอกลวงและฉ้อโกง กรุณาตอบกลับเป็นภาษาไทยเสมอ'
            : 'You are an emergency assistant for scam and fraud situations.';

        const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: systemMessage },
                    { role: 'user', content: message },
                ],
                max_tokens: 512,
            }),
        });
        if (!openaiRes.ok) {
            const error = await openaiRes.json();
            return NextResponse.json({ error: error.error?.message || 'OpenAI error' }, { status: 500 });
        }
        const data = await openaiRes.json();
        const aiMessage = data.choices?.[0]?.message?.content || '';
        return NextResponse.json({ reply: aiMessage });
    } catch (err) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
} 