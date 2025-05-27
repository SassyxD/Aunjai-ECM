'use client';
import React from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => (
    <nav className="sticky top-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <Link href="/" className="flex items-center space-x-3">
                    <span className="text-2xl">🆘</span>
                    <span className="font-bold text-lg text-gray-800">Emergency Assistant</span>
                </Link>
                <div className="flex items-center space-x-4">
                    <Link
                        href="/chat"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                        <span>Chat</span>
                        <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    </Link>
                    <button
                        onClick={() => window.open('tel:191')}
                        className="text-gray-600 hover:text-blue-600 transition-colors"
                        title="Emergency Call"
                    >
                        <span className="text-xl">📞</span>
                    </button>
                </div>
            </div>
        </div>
    </nav>
);

export default Navbar; 