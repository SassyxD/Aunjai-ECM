import OpenAI from 'openai';

// Types for our chat messages
export type ChatMessage = {
    role: 'user' | 'assistant' | 'system';
    content: string;
};

export type ChatResponse = {
    reply: string;
    error?: string;
};

// OpenAI configuration
const config = {
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-3.5-turbo',
    maxTokens: 512,
    temperature: 0.7,
    systemPrompt: `You are an emergency assistant specializing in helping people who might be victims of scams or fraud.
Your primary goals are:
1. Provide immediate, practical guidance
2. Help users identify if they're being scammed
3. Guide them on immediate actions to take
4. Maintain a calm and supportive tone
5. Provide specific steps for reporting and preventing further damage

Always prioritize user safety and encourage them to:
- Contact relevant authorities when necessary
- Not share sensitive information
- Document everything
- Stay calm and methodical in their response`,
};

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: config.apiKey,
});

export class OpenAIService {
    private static instance: OpenAIService;
    private constructor() { }

    public static getInstance(): OpenAIService {
        if (!OpenAIService.instance) {
            OpenAIService.instance = new OpenAIService();
        }
        return OpenAIService.instance;
    }

    public async generateResponse(message: string, context: ChatMessage[] = []): Promise<ChatResponse> {
        try {
            if (!config.apiKey) {
                throw new Error('OpenAI API key not configured');
            }

            const messages: ChatMessage[] = [
                { role: 'system', content: config.systemPrompt },
                ...context,
                { role: 'user', content: message }
            ];

            const completion = await openai.chat.completions.create({
                model: config.model,
                messages,
                max_tokens: config.maxTokens,
                temperature: config.temperature,
            });

            const reply = completion.choices[0]?.message?.content || '';
            return { reply };

        } catch (error: any) {
            console.error('OpenAI API Error:', error);
            return {
                reply: '',
                error: error.message || 'Failed to generate response'
            };
        }
    }
} 