'use client';
import React, { useRef, useEffect } from 'react';

type Language = 'en' | 'th';

type Message = {
    role: 'user' | 'assistant';
    content: string;
};

type ChatUIProps = {
    messages: Message[];
    input: string;
    setInput: (val: string) => void;
    onSend: () => void;
    loading: boolean;
    language: Language;
    translations: {
        typeMessage: string;
        send: string;
        error: string;
        noResponse: string;
    };
};

const ChatUI: React.FC<ChatUIProps> = ({
    messages,
    input,
    setInput,
    onSend,
    loading,
    language,
    translations
}) => {
    const endRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    };

    const adjustTextareaHeight = () => {
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
            inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 150)}px`;
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-12rem)] bg-gradient-to-b from-indigo-50 to-white rounded-2xl shadow-lg border border-indigo-100">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end space-x-3`}
                    >
                        {msg.role === 'assistant' && (
                            <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                🤖
                            </div>
                        )}
                        <div
                            className={`px-5 py-3 rounded-2xl max-w-[80%] ${msg.role === 'user'
                                ? 'bg-indigo-400 text-white rounded-br-lg'
                                : 'bg-white text-gray-700 rounded-bl-lg shadow-sm border border-indigo-100'
                                }`}
                        >
                            <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                        </div>
                        {msg.role === 'user' && (
                            <div className="w-10 h-10 rounded-2xl bg-indigo-400 flex items-center justify-center text-white flex-shrink-0">
                                👤
                            </div>
                        )}
                    </div>
                ))}
                {loading && (
                    <div className="flex items-center space-x-3 text-gray-500">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center">
                            🤖
                        </div>
                        <div className="flex space-x-2">
                            <div className="w-3 h-3 bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-3 h-3 bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-3 h-3 bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    </div>
                )}
                <div ref={endRef} />
            </div>
            <div className="border-t border-indigo-100 bg-white p-6 rounded-b-2xl">
                <div className="flex items-end space-x-3">
                    <div className="flex-1 relative">
                        <textarea
                            ref={inputRef}
                            className="w-full resize-none rounded-2xl border-2 border-indigo-100 px-5 py-3 focus:outline-none focus:border-indigo-300 pr-12 min-h-[52px] max-h-[150px] text-gray-700 placeholder-gray-400 bg-white"
                            rows={1}
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value);
                                adjustTextareaHeight();
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder={translations.typeMessage}
                            disabled={loading}
                        />
                        {input && (
                            <button
                                className="absolute right-3 bottom-3 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                                onClick={() => setInput('')}
                                type="button"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                    <button
                        className="bg-indigo-400 text-white px-6 py-3 rounded-2xl hover:bg-indigo-500 transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed h-[52px] flex items-center justify-center font-medium shadow-sm"
                        onClick={onSend}
                        disabled={loading || !input.trim()}
                    >
                        {translations.send}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatUI; 