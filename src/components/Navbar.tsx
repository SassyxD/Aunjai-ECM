'use client';
import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

const translations = {
    en: {
        emergencyAssistant: 'Emergency Assistant',
        chat: 'Chat',
        emergencyCall: 'Emergency Call'
    },
    th: {
        emergencyAssistant: 'ผู้ช่วยฉุกเฉิน',
        chat: 'แชท',
        emergencyCall: 'โทรฉุกเฉิน'
    }
};

const Navbar: React.FC = () => {
    const { language, toggleLanguage } = useLanguage();
    const t = translations[language];

    return (
        <nav className="sticky top-0 w-full bg-white/90 backdrop-blur-md shadow-sm z-50 border-b border-indigo-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center space-x-3">
                        <span className="text-2xl">🆘</span>
                        <span className="font-medium text-lg text-gray-700">{t.emergencyAssistant}</span>
                    </Link>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={toggleLanguage}
                            className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors duration-200 flex items-center gap-2 text-gray-700"
                        >
                            <span className="text-sm font-medium">{language.toUpperCase()}</span>
                            <span className="text-lg">🌐</span>
                        </button>
                        <Link
                            href="/chat"
                            className="bg-indigo-400 text-white px-5 py-2 rounded-2xl hover:bg-indigo-500 transition-colors flex items-center space-x-2 shadow-sm"
                        >
                            <span className="font-medium">{t.chat}</span>
                            <span className="inline-block w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
                        </Link>
                        <button
                            onClick={() => window.open('tel:191')}
                            className="text-gray-500 hover:text-indigo-500 transition-colors p-2 rounded-full hover:bg-indigo-50"
                            title={t.emergencyCall}
                        >
                            <span className="text-xl">📞</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 