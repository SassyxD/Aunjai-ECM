'use client';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { TerminalEffect } from '@/components/TerminalEffect';
import { TerminalCard } from '@/components/TerminalCard';
import Link from 'next/link';

const translations = {
    en: {
        title: 'CLASSIFIED PERSONNEL FILES',
        role: 'Creator & Developer',
        institute: 'King Mongkut\'s Institute of Technology Ladkrabang',
        viewGithub: 'View on GitHub'
    },
    th: {
        title: 'แฟ้มข้อมูลลับ',
        role: 'ผู้สร้างและพัฒนา',
        institute: 'สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง',
        viewGithub: 'ดูใน GitHub'
    }
};

const teamMembers = [
    {
        name: "Nattapong Pudtipatkosit",
        codename: "SassyxD",
        role: "Lead Developer",
        github: "SassyxD",
        institute: "KMITL"
    },
    {
        name: "Pavarisa Bunditsen",
        codename: "pbundit",
        role: "Developer",
        github: "pbundit",
        institute: "KMITL"
    }
];

const terminalLines = [
    "$ initializing secure connection...",
    "$ establishing encrypted tunnel...",
    "$ authenticating credentials...",
    "$ accessing classified database...",
    "$ decrypting team profiles...",
    "$ access granted. welcome, operator.",
    "$ loading team data..."
];

const matrixCharacters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンガギグゲゴザジズゼゾダヂヅデド';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 1.5
        }
    }
};

const itemVariants = {
    hidden: {
        opacity: 0,
        filter: 'blur(10px) brightness(0.5)',
    },
    visible: {
        opacity: 1,
        filter: 'blur(0px) brightness(1)',
        transition: {
            duration: 0.8
        }
    }
};

const figletTitle = `
 █████╗ ██████╗  ██████╗ ██╗   ██╗████████╗    ██╗   ██╗███████╗
██╔══██╗██╔══██╗██╔═══██╗██║   ██║╚══██╔══╝    ██║   ██║██╔════╝
███████║██████╔╝██║   ██║██║   ██║   ██║       ██║   ██║███████╗
██╔══██║██╔══██╗██║   ██║██║   ██║   ██║       ██║   ██║╚════██║
██║  ██║██████╔╝╚██████╔╝╚██████╔╝   ██║       ╚██████╔╝███████║
╚═╝  ╚═╝╚═════╝  ╚═════╝  ╚═════╝    ╚═╝        ╚═════╝ ╚══════╝
`.trim();

const AboutPage = () => {
    const { language } = useLanguage();
    const t = translations[language];
    const [isLoading, setIsLoading] = useState(true);
    const [currentLine, setCurrentLine] = useState(0);
    const [text, setText] = useState('');
    const [progress, setProgress] = useState(0);
    const [glitchText, setGlitchText] = useState('');
    const [showProfiles, setShowProfiles] = useState(false);

    useEffect(() => {
        if (isLoading) return;
        setTimeout(() => setShowProfiles(true), 500);
    }, [isLoading]);

    useEffect(() => {
        let currentText = '';
        let currentChar = 0;
        let glitchInterval: NodeJS.Timeout;

        glitchInterval = setInterval(() => {
            let glitch = '';
            for (let i = 0; i < 50; i++) {
                glitch += matrixCharacters[Math.floor(Math.random() * matrixCharacters.length)];
            }
            setGlitchText(glitch);
        }, 50);

        const typeInterval = setInterval(() => {
            if (currentLine >= terminalLines.length) {
                clearInterval(typeInterval);
                clearInterval(glitchInterval);
                setTimeout(() => setIsLoading(false), 300);
                return;
            }

            if (currentChar < terminalLines[currentLine].length) {
                currentText = terminalLines[currentLine].substring(0, currentChar + 1);
                setText(currentText + '\n' + terminalLines.slice(0, currentLine).join('\n'));
                currentChar++;
            } else {
                setTimeout(() => {
                    setCurrentLine(prev => prev + 1);
                    currentChar = 0;
                    const progressIncrement = (currentLine / terminalLines.length) * 100;
                    setProgress(Math.min(progressIncrement * 1.2, 100));
                }, 100);
            }
        }, 20);

        return () => {
            clearInterval(typeInterval);
            clearInterval(glitchInterval);
        };
    }, [currentLine]);

    return (
        <AnimatePresence mode="wait">
            {isLoading ? (
                <motion.div
                    key="loader"
                    className="fixed inset-0 bg-black z-50 flex items-center justify-center overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className="absolute top-0 left-0 right-0 overflow-hidden text-[8px] text-green-500 opacity-20 font-mono">
                        {glitchText}
                    </div>
                    <div className="w-full max-w-[90vw] md:max-w-[80vw] lg:max-w-[1024px] aspect-square">
                        <TerminalEffect text={text} progress={progress} />
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="min-h-screen bg-black flex flex-col"
                >
                    <Navbar />
                    <main className="flex-1 container mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-center mb-6 sm:mb-8 md:mb-12"
                        >
                            <div className="overflow-x-auto">
                                <pre
                                    className="text-green-500 font-mono text-xs sm:text-sm md:text-base lg:text-xl inline-block whitespace-pre"
                                    style={{
                                        textShadow: '0 0 10px rgba(0, 255, 0, 0.7), 0 0 20px rgba(0, 255, 0, 0.5), 0 0 30px rgba(0, 255, 0, 0.3)'
                                    }}
                                >
                                    {figletTitle}
                                </pre>
                            </div>
                            <div className="h-1 w-32 bg-green-500/30 mx-auto mt-4" />
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                    opacity: 1,
                                    transition: {
                                        staggerChildren: 0.3
                                    }
                                }
                            }}
                            className="flex flex-col lg:grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 max-w-7xl mx-auto"
                        >
                            {teamMembers.map((member, index) => (
                                <motion.div
                                    key={member.codename}
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0 }
                                    }}
                                    className="w-full flex-shrink-0"
                                >
                                    <TerminalCard
                                        name={member.name}
                                        codename={member.codename}
                                        role={member.role}
                                        github={member.github}
                                        institute={member.institute}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    </main>

                    <footer className="py-4 md:py-6 text-center text-green-500/60 font-mono">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2 }}
                        >
                            {'<EOF> // End of File'}
                        </motion.div>
                    </footer>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AboutPage; 