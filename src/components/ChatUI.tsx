'use client';
import React, { useRef, useEffect } from 'react';

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
};

const ChatUI: React.FC<ChatUIProps> = ({ messages, input, setInput, onSend, loading }) => {
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
        <div className="flex flex-col h-[calc(100vh-12rem)] bg-gradient-to-b from-gray-50 to-white rounded-xl shadow-lg border border-gray-100">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end space-x-2`}
                    >
                        {msg.role === 'assistant' && (
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                🤖
                            </div>
                        )}
                        <div
                            className={`px-4 py-3 rounded-2xl max-w-[80%] ${msg.role === 'user'
                                ? 'bg-blue-600 text-white rounded-br-none'
                                : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                }`}
                        >
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                        </div>
                        {msg.role === 'user' && (
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white flex-shrink-0">
                                👤
                            </div>
                        )}
                    </div>
                ))}
                {loading && (
                    <div className="flex items-center space-x-2 text-gray-500">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            🤖
                        </div>
                        <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    </div>
                )}
                <div ref={endRef} />
            </div>
            <div className="border-t bg-white p-4 rounded-b-xl">
                <div className="flex items-end space-x-2">
                    <div className="flex-1 relative">
                        <textarea
                            ref={inputRef}
                            className="w-full resize-none rounded-lg border-2 border-gray-200 px-4 py-2 focus:outline-none focus:border-blue-500 pr-12 min-h-[44px] max-h-[150px]"
                            rows={1}
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value);
                                adjustTextareaHeight();
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message..."
                            disabled={loading}
                        />
                        <button
                            className="absolute right-2 bottom-2 text-gray-400 hover:text-gray-600"
                            onClick={() => setInput('')}
                            type="button"
                        >
                            ✕
                        </button>
                    </div>
                    <button
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed h-[44px] flex items-center justify-center"
                        onClick={onSend}
                        disabled={loading || !input.trim()}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatUI; 