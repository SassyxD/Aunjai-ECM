'use client';
import React, { useState } from 'react';
import { checkBlacklist } from '@/services/blacklist';
import { useLanguage } from '@/context/LanguageContext';

const translations = {
    en: {
        title: 'Blacklist Check',
        checkButton: 'Check',
        loading: 'Checking...',
        searchType: {
            label: 'Search by',
            bankAccount: 'Bank Account',
            phone: 'Phone Number',
            idCard: 'ID Card',
            name: 'Name'
        },
        placeholder: {
            bankAccount: 'Enter bank account number',
            phone: 'Enter phone number',
            idCard: 'Enter ID card number',
            name: 'Enter name'
        },
        results: {
            found: 'Record found in blacklist',
            notFound: 'No records found',
            error: 'Error checking blacklist'
        }
    },
    th: {
        title: 'ตรวจสอบแบล็คลิสต์',
        checkButton: 'ตรวจสอบ',
        loading: 'กำลังตรวจสอบ...',
        searchType: {
            label: 'ค้นหาด้วย',
            bankAccount: 'เลขบัญชีธนาคาร',
            phone: 'เบอร์โทรศัพท์',
            idCard: 'เลขบัตรประชาชน',
            name: 'ชื่อ'
        },
        placeholder: {
            bankAccount: 'กรอกเลขบัญชีธนาคาร',
            phone: 'กรอกเบอร์โทรศัพท์',
            idCard: 'กรอกเลขบัตรประชาชน',
            name: 'กรอกชื่อ'
        },
        results: {
            found: 'พบข้อมูลในแบล็คลิสต์',
            notFound: 'ไม่พบข้อมูล',
            error: 'เกิดข้อผิดพลาดในการตรวจสอบ'
        }
    }
};

type SearchType = 'bankAccount' | 'phone' | 'idCard' | 'name';

export default function BlacklistChecker() {
    const { language } = useLanguage();
    const t = translations[language];

    const [searchType, setSearchType] = useState<SearchType>('bankAccount');
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCheck = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError(null);
        setResults(null);

        try {
            const result = await checkBlacklist(query.trim());
            setResults(result);
        } catch (err) {
            console.error('Search error:', err);
            setError(t.results.error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-indigo-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{t.title}</h2>

            <form onSubmit={handleCheck} className="space-y-4">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        {t.searchType.label}
                    </label>
                    <select
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value as SearchType)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-gray-800 bg-white"
                    >
                        <option value="bankAccount">{t.searchType.bankAccount}</option>
                        <option value="phone">{t.searchType.phone}</option>
                        <option value="idCard">{t.searchType.idCard}</option>
                        <option value="name">{t.searchType.name}</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={t.placeholder[searchType]}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-gray-800 placeholder-gray-400"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2.5 px-4 rounded-lg text-white font-medium transition-colors ${loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'
                        }`}
                >
                    {loading ? t.loading : t.checkButton}
                </button>
            </form>

            {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 font-medium">{error}</p>
                </div>
            )}

            {results && (
                <div className="mt-4 space-y-4">
                    {results.isBlacklisted ? (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="text-red-800 font-semibold mb-3">
                                {t.results.found}
                            </div>
                            <div className="space-y-2">
                                {results.details?.name && (
                                    <p className="text-gray-700">
                                        <strong>{language === 'th' ? 'ชื่อ' : 'Name'}:</strong> {results.details.name}
                                    </p>
                                )}
                                {results.details?.description && (
                                    <p className="text-gray-700">
                                        <strong>{language === 'th' ? 'รายละเอียด' : 'Description'}:</strong> {results.details.description}
                                    </p>
                                )}
                                {results.details?.reportCount > 0 && (
                                    <p className="text-gray-700">
                                        <strong>{language === 'th' ? 'จำนวนรายงาน' : 'Report Count'}:</strong> {results.details.reportCount}
                                    </p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-green-800 font-medium">{t.results.notFound}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
} 