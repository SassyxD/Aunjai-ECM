'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

const translations = {
    en: {
        emergencyAssistant: 'Emergency Assistant',
        chat: 'Chat',
        emergencyCall: 'Emergency Call',
        about: 'About Us'
    },
    th: {
        emergencyAssistant: 'ผู้ช่วยฉุกเฉิน',
        chat: 'แชท',
        emergencyCall: 'โทรฉุกเฉิน',
        about: 'เกี่ยวกับเรา'
    }
};

const Navbar: React.FC = () => {
    const { language, toggleLanguage } = useLanguage();
    const t = translations[language];
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                buttonRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-3">
                        <Link href="/" className="flex items-center space-x-3">
                            <span className="text-xl sm:text-2xl">🆘</span>
                            <span className="font-medium text-base sm:text-lg text-gray-700">{t.emergencyAssistant}</span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-4">
                        {/* Language toggle - always visible */}
                        <button
                            onClick={toggleLanguage}
                            className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors duration-200 flex items-center gap-2 text-gray-700"
                        >
                            <span className="text-sm font-medium">{language.toUpperCase()}</span>
                            <span className="text-lg">🌐</span>
                        </button>

                        {/* Menu button - always visible */}
                        <div className="relative">
                            <button
                                ref={buttonRef}
                                onClick={toggleMenu}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                aria-label="Toggle menu"
                            >
                                <svg
                                    className="w-6 h-6 text-gray-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    {isMenuOpen ? (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    ) : (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    )}
                                </svg>
                            </button>

                            {/* Menu popup */}
                            {isMenuOpen && (
                                <div
                                    className="absolute right-0 top-12 w-48 py-2 bg-white rounded-xl shadow-lg border border-gray-100 z-50"
                                    tabIndex={-1}
                                    ref={menuRef}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Escape') {
                                            toggleMenu();
                                        }
                                    }}
                                >
                                    <Link
                                        href="/chat"
                                        className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center space-x-2"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <span className="text-indigo-400">💬</span>
                                        <span className="font-medium text-gray-700">{t.chat}</span>
                                    </Link>
                                    <button
                                        onClick={() => {
                                            window.open('tel:191');
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center space-x-2"
                                    >
                                        <span className="text-red-500">📞</span>
                                        <span className="text-gray-700">{t.emergencyCall}</span>
                                    </button>
                                    <Link
                                        href="/about"
                                        className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center space-x-2"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <span className="text-gray-600">👥</span>
                                        <span className="text-gray-700">{t.about}</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay backdrop */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/10 z-40"
                    onClick={toggleMenu}
                    aria-hidden="true"
                ></div>
            )}
        </nav>
    );
};

export default Navbar; 