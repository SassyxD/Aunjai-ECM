'use client';
import React from 'react';

type Language = 'en' | 'th';

type ScamToolsProps = {
    onQuickPrompt: (prompt: string) => void;
    language: Language;
};

const tools = {
    en: [
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
    ],
    th: [
        {
            label: 'ตรวจสอบบัญชีธนาคาร',
            prompt: 'ช่วยตรวจสอบเลขบัญชีธนาคารนี้ว่ามีประวัติการหลอกลวงหรือไม่:',
            icon: '🏦',
            color: 'bg-rose-200 hover:bg-rose-300'
        },
        {
            label: 'แจ้งการหลอกลวง',
            prompt: 'ฉันต้องการแจ้งเรื่องการถูกหลอกลวง',
            icon: '🚨',
            color: 'bg-amber-200 hover:bg-amber-300'
        },
        {
            label: 'ขอความช่วยเหลือ',
            prompt: 'ฉันควรทำอย่างไรถ้าถูกหลอกลวง?',
            icon: '🆘',
            color: 'bg-indigo-200 hover:bg-indigo-300'
        },
        {
            label: 'ตรวจสอบเบอร์โทร',
            prompt: 'ช่วยตรวจสอบว่าเบอร์โทรนี้เกี่ยวข้องกับการหลอกลวงหรือไม่:',
            icon: '📱',
            color: 'bg-purple-200 hover:bg-purple-300'
        },
        {
            label: 'คำแนะนำทางกฎหมาย',
            prompt: 'ฉันมีทางเลือกทางกฎหมายอะไรบ้างในการจัดการกับการถูกหลอกลวง?',
            icon: '⚖️',
            color: 'bg-emerald-200 hover:bg-emerald-300'
        }
    ]
};

const ScamTools: React.FC<ScamToolsProps> = ({ onQuickPrompt, language }) => (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-indigo-100">
        <h2 className="text-xl font-medium text-gray-700 mb-4">
            {language === 'th' ? 'เครื่องมือฉุกเฉิน' : 'Emergency Tools'}
        </h2>
        <div className="flex flex-col items-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl">
                {tools[language].map((tool, index) => (
                    <button
                        key={tool.label}
                        className={`${tool.color} text-gray-700 px-4 py-5 rounded-2xl hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center gap-3 text-center min-h-[120px] border border-white/50 ${index === tools[language].length - 1 ? 'sm:col-span-2' : ''}`}
                        onClick={() => onQuickPrompt(tool.prompt)}
                    >
                        <span className="text-3xl">{tool.icon}</span>
                        <span className="text-sm font-medium leading-tight">{tool.label}</span>
                    </button>
                ))}
            </div>
        </div>
    </div>
);

export default ScamTools; 