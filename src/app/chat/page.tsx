'use client';
import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import ChatUI from '../../components/ChatUI';
import ScamTools from '../../components/ScamTools';
import BlacklistChecker from '../../components/BlacklistChecker';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

const translations = {
    en: {
        typeMessage: "Type your message...",
        send: "Send",
        error: "Error contacting AI.",
        noResponse: "No response."
    },
    th: {
        typeMessage: "พิมพ์ข้อความของคุณ...",
        send: "ส่ง",
        error: "เกิดข้อผิดพลาดในการติดต่อ AI",
        noResponse: "ไม่มีการตอบกลับ"
    }
};

export default function ChatPage() {
    const { language } = useLanguage();
    const t = translations[language];

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
                body: JSON.stringify({ message: userMsg, language }),
            });
            const data = await res.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.reply || data.error || t.noResponse }]);
        } catch (e) {
            setMessages(prev => [...prev, { role: 'assistant', content: t.error }]);
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
                <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-4">
                    <div className="lg:w-2/3">
                        <ScamTools onQuickPrompt={handleQuickPrompt} />
                        <ChatUI
                            messages={messages}
                            input={input}
                            setInput={setInput}
                            onSend={() => sendMessage()}
                            loading={loading}
                            language={language}
                            translations={t}
                        />
                    </div>
                    <div className="lg:w-1/3">
                        <BlacklistChecker />
                    </div>
                </div>
            </main>
            <footer className="py-4 text-center text-gray-600">
                Made with <span className="text-red-500">❤️</span> by{' '}
                <Link
                    href="https://github.com/SassyxD"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-500 hover:text-indigo-600 transition-colors"
                >
                    SassyxD
                </Link>
            </footer>
        </div>
    );
} 