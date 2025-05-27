'use client';
import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import ChatUI from '../../components/ChatUI';
import ScamTools from '../../components/ScamTools';

export default function ChatPage() {
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const sendMessage = async (msg?: string) => {
        const userMsg = msg || input.trim();
        if (!userMsg) return;
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput('');
        setLoading(true);
        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg }),
            });
            const data = await res.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.reply || data.error || 'No response.' }]);
        } catch (e) {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Error contacting AI.' }]);
        }
        setLoading(false);
    };

    const handleQuickPrompt = (prompt: string) => {
        setInput(prompt);
        sendMessage(prompt);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <Navbar />
            <main className="flex-1 flex flex-col items-center justify-start px-2 py-4">
                <div className="w-full max-w-md">
                    <ScamTools onQuickPrompt={handleQuickPrompt} />
                    <ChatUI
                        messages={messages}
                        input={input}
                        setInput={setInput}
                        onSend={() => sendMessage()}
                        loading={loading}
                    />
                </div>
            </main>
        </div>
    );
} 