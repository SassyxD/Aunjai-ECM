'use client';
import React, { useState } from 'react';
import { checkBlacklist } from '@/services/blacklist';
import { useLanguage } from '@/context/LanguageContext';

type ScamToolsProps = {
    onQuickPrompt: (prompt: string) => void;
};

const tools = {
    en: [
        {
            label: 'Check Bank Account',
            prompt: 'Check this bank account number for scam activity:',
            icon: '🏦',
            color: 'bg-rose-200 hover:bg-rose-300',
            isBlacklistCheck: true,
            type: 'bankAccount'
        },
        {
            label: 'Check Phone Number',
            prompt: 'Can you check if this phone number is associated with scams:',
            icon: '📱',
            color: 'bg-purple-200 hover:bg-purple-300',
            isBlacklistCheck: true,
            type: 'phone'
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
            color: 'bg-rose-200 hover:bg-rose-300',
            isBlacklistCheck: true,
            type: 'bankAccount'
        },
        {
            label: 'ตรวจสอบเบอร์โทร',
            prompt: 'ช่วยตรวจสอบว่าเบอร์โทรนี้เกี่ยวข้องกับการหลอกลวงหรือไม่:',
            icon: '📱',
            color: 'bg-purple-200 hover:bg-purple-300',
            isBlacklistCheck: true,
            type: 'phone'
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
            label: 'คำแนะนำทางกฎหมาย',
            prompt: 'ฉันมีทางเลือกทางกฎหมายอะไรบ้างในการจัดการกับการถูกหลอกลวง?',
            icon: '⚖️',
            color: 'bg-emerald-200 hover:bg-emerald-300'
        }
    ]
};

const translations = {
    en: {
        title: 'Emergency Tools',
        blacklistFound: 'Found in blacklist',
        blacklistNotFound: 'Not found in blacklist',
        name: 'Name',
        description: 'Description',
        reportCount: 'Report Count'
    },
    th: {
        title: 'เครื่องมือฉุกเฉิน',
        blacklistFound: 'พบข้อมูลในแบล็คลิสต์',
        blacklistNotFound: 'ไม่พบข้อมูลในแบล็คลิสต์',
        name: 'ชื่อ',
        description: 'รายละเอียด',
        reportCount: 'จำนวนรายงาน'
    }
};

const ScamTools: React.FC<ScamToolsProps> = ({ onQuickPrompt }) => {
    const { language } = useLanguage();
    const t = translations[language];
    const [loading, setLoading] = useState<string | null>(null);
    const [blacklistResult, setBlacklistResult] = useState<any>(null);

    const handleToolClick = async (tool: any) => {
        if (tool.isBlacklistCheck) {
            setLoading(tool.type);
            setBlacklistResult(null);
            try {
                const result = await checkBlacklist(prompt);
                setBlacklistResult({
                    type: tool.type,
                    ...result
                });
            } catch (error) {
                console.error('Error checking blacklist:', error);
            }
            setLoading(null);
        }
        onQuickPrompt(tool.prompt);
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-indigo-100">
            <h2 className="text-xl font-medium text-gray-700 mb-4">
                {t.title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {tools[language].map(tool => (
                    <button
                        key={tool.label}
                        className={`${tool.color} text-gray-700 px-4 py-5 rounded-2xl hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center gap-3 text-center min-h-[120px] border border-white/50 relative ${loading === tool.type ? 'opacity-75 cursor-wait' : ''}`}
                        onClick={() => handleToolClick(tool)}
                        disabled={loading !== null}
                    >
                        <span className="text-3xl">{tool.icon}</span>
                        <span className="text-sm font-medium leading-tight">{tool.label}</span>
                        {loading === tool.type && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-2xl">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                            </div>
                        )}
                    </button>
                ))}
            </div>
            {blacklistResult && (
                <div className={`mt-4 p-4 rounded-lg ${blacklistResult.isBlacklisted ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
                    <p className={`font-medium ${blacklistResult.isBlacklisted ? 'text-red-800' : 'text-green-800'}`}>
                        {blacklistResult.isBlacklisted ? t.blacklistFound : t.blacklistNotFound}
                    </p>
                    {blacklistResult.isBlacklisted && blacklistResult.details && (
                        <div className="mt-2 space-y-2 text-sm text-gray-700">
                            {blacklistResult.details.name && (
                                <p><strong>{t.name}:</strong> {blacklistResult.details.name}</p>
                            )}
                            {blacklistResult.details.description && (
                                <p><strong>{t.description}:</strong> {blacklistResult.details.description}</p>
                            )}
                            {blacklistResult.details.reportCount > 0 && (
                                <p><strong>{t.reportCount}:</strong> {blacklistResult.details.reportCount}</p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ScamTools; 