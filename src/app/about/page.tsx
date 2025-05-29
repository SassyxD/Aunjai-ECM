'use client';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';

const translations = {
    en: {
        title: 'About Us',
        role: 'Creator & Developer',
        institute: 'King Mongkut\'s Institute of Technology Ladkrabang',
        viewGithub: 'View on GitHub'
    },
    th: {
        title: 'เกี่ยวกับเรา',
        role: 'ผู้สร้างและพัฒนา',
        institute: 'สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง',
        viewGithub: 'ดูใน GitHub'
    }
};

export default function About() {
    const { language } = useLanguage();
    const t = translations[language];

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col">
            <Navbar />
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="max-w-2xl w-full text-center space-y-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-700">
                        {t.title}
                    </h1>
                    <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
                        <div className="w-32 h-32 mx-auto relative">
                            <img
                                src="/path/to/image.png"
                                alt="Profile picture of Nattapong Pudtipatkosit"
                                className="w-full h-full rounded-full object-cover"
                            />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-semibold text-gray-800">Nattapong Pudtipatkosit</h2>
                            <p className="text-gray-600">{t.role}</p>
                            <p className="text-gray-600">{t.institute}</p>
                        </div>
                        <Link
                            href="https://github.com/SassyxD"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-2 bg-gray-800 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" clipRule="evenodd" />
                            </svg>
                            <span>{t.viewGithub}</span>
                        </Link>
                    </div>
                </div>
            </main>
            <footer className="py-4 text-center text-gray-600">
                Made with <span className="text-red-500">❤️</span> by{' '}
                <Link
                    href="https://github.com/SassyxD"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-500 hover:text-indigo-600 transition-colors"
                >
                    SassyxD
                </Link>
            </footer>
        </div>
    );
} 