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
        color: 'bg-red-500 hover:bg-red-600'
    },
    {
        label: 'Report Scam',
        prompt: 'I want to report a scam.',
        icon: '🚨',
        color: 'bg-yellow-500 hover:bg-yellow-600'
    },
    {
        label: 'Get Help',
        prompt: 'What should I do if I have been scammed?',
        icon: '🆘',
        color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
        label: 'Check Phone Number',
        prompt: 'Can you check if this phone number is associated with scams:',
        icon: '📱',
        color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
        label: 'Legal Advice',
        prompt: 'What are my legal options for dealing with this scam?',
        icon: '⚖️',
        color: 'bg-green-500 hover:bg-green-600'
    }
];

const ScamTools: React.FC<ScamToolsProps> = ({ onQuickPrompt }) => (
    <div className="bg-white rounded-xl shadow-lg p-4 mb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Emergency Tools</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {tools.map(tool => (
                <button
                    key={tool.label}
                    className={`${tool.color} text-white p-3 rounded-lg hover:shadow-lg transition-all duration-200 flex flex-col items-center justify-center gap-2 text-center h-24`}
                    onClick={() => onQuickPrompt(tool.prompt)}
                >
                    <span className="text-2xl">{tool.icon}</span>
                    <span className="text-sm font-medium">{tool.label}</span>
                </button>
            ))}
        </div>
    </div>
);

export default ScamTools; 