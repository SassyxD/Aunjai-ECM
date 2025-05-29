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
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`flex items-start space-x-2 sm:space-x-3 max-w-[85%] sm:max-w-[75%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse sm:space-x-reverse' : ''
                                }`}
                        >
                            <div
                                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center ${message.role === 'user' ? 'bg-indigo-400 text-white' : 'bg-indigo-100'
                                    }`}
                            >
                                {message.role === 'user' ? '👤' : '🤖'}
                            </div>
                            <div
                                className={`rounded-2xl px-4 py-3 sm:px-5 sm:py-3 ${message.role === 'user'
                                    ? 'bg-indigo-400 text-white'
                                    : 'bg-gray-100 text-gray-700'
                                    }`}
                            >
                                <p className="text-sm sm:text-base whitespace-pre-wrap">{message.content}</p>
                            </div>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex items-center space-x-2 sm:space-x-3 text-gray-500">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-indigo-100 flex items-center justify-center">
                            🤖
                        </div>
                        <div className="flex space-x-1 sm:space-x-2">
                            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    </div>
                )}
                <div ref={endRef} />
            </div>
            <div className="border-t border-gray-100 p-4 sm:p-6">
                <div className="flex items-end space-x-2 sm:space-x-3">
                    <div className="flex-1 relative">
                        <textarea
                            ref={inputRef}
                            className="w-full resize-none rounded-2xl border-2 border-indigo-100 px-4 sm:px-5 py-2 sm:py-3 focus:outline-none focus:border-indigo-300 pr-10 sm:pr-12 min-h-[44px] sm:min-h-[52px] max-h-[120px] sm:max-h-[150px] text-sm sm:text-base text-gray-700 placeholder-gray-400 bg-white"
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
                                className="absolute right-2 sm:right-3 bottom-2 sm:bottom-3 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                                onClick={() => setInput('')}
                                type="button"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                    <button
                        className="bg-indigo-400 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-2xl hover:bg-indigo-500 transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed h-[44px] sm:h-[52px] flex items-center justify-center font-medium shadow-sm text-sm sm:text-base"
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