'use client';
import React from 'react';

type ScamToolsProps = {
    onQuickPrompt: (prompt: string) => void;
};

const tools = [
    {
        label: 'Check Bank Account',
        prompt: 'Check this bank account number for scam activity:',
        icon: '🏦',
        color: 'bg-rose-200 hover:bg-rose-300'
    },
    {
        label: 'Report Scam',
        prompt: 'I want to report a scam.',
        icon: '🚨',
        color: 'bg-amber-200 hover:bg-amber-300'
    },
    {
        label: 'Get Help',
        prompt: 'What should I do if I have been scammed?',
        icon: '🆘',
        color: 'bg-indigo-200 hover:bg-indigo-300'
    },
    {
        label: 'Check Phone Number',
        prompt: 'Can you check if this phone number is associated with scams:',
        icon: '📱',
        color: 'bg-purple-200 hover:bg-purple-300'
    },
    {
        label: 'Legal Advice',
        prompt: 'What are my legal options for dealing with this scam?',
        icon: '⚖️',
        color: 'bg-emerald-200 hover:bg-emerald-300'
    }
];

const ScamTools: React.FC<ScamToolsProps> = ({ onQuickPrompt }) => (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-indigo-100">
        <h2 className="text-xl font-medium text-gray-700 mb-4">Emergency Tools</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {tools.map(tool => (
                <button
                    key={tool.label}
                    className={`${tool.color} text-gray-700 p-4 rounded-2xl hover:shadow transition-all duration-200 flex flex-col items-center justify-center gap-3 text-center h-28 border border-white/50`}
                    onClick={() => onQuickPrompt(tool.prompt)}
                >
                    <span className="text-3xl">{tool.icon}</span>
                    <span className="text-sm font-medium leading-tight">{tool.label}</span>
                </button>
            ))}
        </div>
    </div>
);

export default ScamTools; 