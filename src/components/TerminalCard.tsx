import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TerminalEffect } from './TerminalEffect';

interface TerminalCardProps {
    name: string;
    codename: string;
    role: string;
    github: string;
    institute: string;
}

const generateAsciiArt = (text: string) => {
    const lines = [
        "╔══════════════════╗",
        `║  ${text.padEnd(14, ' ')}  ║`,
        "╚══════════════════╝"
    ];
    return lines.join('\n');
};

const maskData = (text: string) => {
    return text.replace(/[a-zA-Z0-9]/g, '*');
};

export const TerminalCard = ({ name, codename, role, github, institute }: TerminalCardProps) => {
    const [text, setText] = useState('');
    const [isTyping, setIsTyping] = useState(true);
    const [currentLine, setCurrentLine] = useState(0);
    const [isDataMasked, setIsDataMasked] = useState(true);

    const getTerminalLines = (masked: boolean) => [
        "\x1b[38;2;0;255;0m$ Initializing secure connection...\x1b[0m",
        "\x1b[38;2;0;255;0m$ ============================\x1b[0m",
        `\x1b[38;2;0;255;0m$ CODENAME:\x1b[0m \x1b[38;2;255;255;0m${codename}\x1b[0m`,
        `\x1b[38;2;0;255;0m$ AGENT:\x1b[0m \x1b[38;2;0;255;255m${masked ? maskData(name) : name}\x1b[0m`,
        `\x1b[38;2;0;255;0m$ ROLE:\x1b[0m \x1b[38;2;255;165;0m${masked ? maskData(role) : role}\x1b[0m`,
        `\x1b[38;2;0;255;0m$ LOCATION:\x1b[0m \x1b[38;2;255;0;0mCLASSIFIED\x1b[0m`,
        `\x1b[38;2;0;255;0m$ INSTITUTE:\x1b[0m \x1b[38;2;147;112;219m${masked ? maskData(institute) : institute}\x1b[0m`,
        `\x1b[38;2;0;255;0m$ FACULTY:\x1b[0m \x1b[38;2;147;112;219m${masked ? maskData("School of IT") : "School of IT"}\x1b[0m`,
        "\x1b[38;2;0;255;0m$ ============================\x1b[0m",
        generateAsciiArt(codename),
        "\x1b[38;2;0;255;0m$ ============================\x1b[0m",
        `\x1b[38;2;0;255;0m$ SECURITY CLEARANCE:\x1b[0m \x1b[38;2;255;255;0mLEVEL 5\x1b[0m`,
        `\x1b[38;2;0;255;0m$ GITHUB:\x1b[0m \x1b[38;2;255;105;180m${masked ? maskData(github) : github}\x1b[0m`,
        "\x1b[38;2;0;255;0m$ END TRANSMISSION\x1b[0m"
    ];

    useEffect(() => {
        if (!isTyping) {
            setText(getTerminalLines(false).join('\n'));
            return;
        }

        let timeoutId: NodeJS.Timeout;
        let currentText = '';
        let currentChar = 0;
        const lines = getTerminalLines(true);

        const typeNextChar = () => {
            if (currentLine >= lines.length) {
                setIsTyping(false);
                setIsDataMasked(false);
                return;
            }

            if (currentChar < lines[currentLine].length) {
                currentText = lines[currentLine].substring(0, currentChar + 1);
                setText(prevText => prevText + currentText.charAt(currentText.length - 1));
                currentChar++;
                timeoutId = setTimeout(typeNextChar, Math.random() * 5 + 2);
            } else {
                setText(prevText => prevText + '\n');
                setCurrentLine(prev => prev + 1);
                currentChar = 0;
                currentText = '';
                timeoutId = setTimeout(typeNextChar, 15);
            }
        };

        timeoutId = setTimeout(typeNextChar, 15);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [currentLine, isTyping, name, codename, role, github, institute]);

    return (
        <motion.div
            className="w-full aspect-[4/3] sm:aspect-[3/2] lg:aspect-[4/3] relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="absolute inset-0 bg-black rounded-lg overflow-hidden border-2 border-green-500/30 shadow-lg shadow-green-500/20">
                <div className="absolute top-0 left-0 right-0 h-6 sm:h-8 bg-green-900/30 flex items-center px-2 sm:px-3 border-b-2 border-green-500/30">
                    <div className="flex space-x-1.5 sm:space-x-2">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer" />
                        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 cursor-pointer" />
                        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500 hover:bg-green-600 cursor-pointer" />
                    </div>
                    <div className="flex-1 text-center text-xs sm:text-sm text-green-500 font-mono font-bold truncate px-2">
                        SECURE TERMINAL - {codename.toUpperCase()}
                    </div>
                </div>

                <div className="absolute top-6 sm:top-8 left-0 right-0 bottom-0 overflow-hidden">
                    <TerminalEffect text={text} progress={isTyping ? (currentLine / getTerminalLines(true).length) * 100 : 100} />
                </div>
            </div>
        </motion.div>
    );
}; 