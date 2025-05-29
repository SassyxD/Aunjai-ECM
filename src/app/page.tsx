'use client';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';

const LearnScamsButton = ({ language }: { language: 'en' | 'th' }) => {
  const handleClick = () => {
    window.open('https://www.police.go.th/scam-alert', '_blank');
  };

  return (
    <button
      className="bg-white text-indigo-500 border-2 border-indigo-300 px-8 py-4 rounded-2xl text-lg font-medium hover:bg-indigo-50 transition-all shadow-sm hover:shadow"
      onClick={handleClick}
    >
      {language === 'th' ? 'เรียนรู้เกี่ยวกับการหลอกลวง' : 'Learn About Scams'}
    </button>
  );
};

export default function Home() {
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col">
      <div className="w-full max-w-7xl mx-auto px-4 py-4 flex justify-end">
        <button
          onClick={toggleLanguage}
          className="px-4 py-2 rounded-xl bg-white/80 hover:bg-white transition-colors duration-200 flex items-center gap-2 text-gray-700 border border-indigo-100 shadow-sm hover:shadow"
        >
          <span className="text-sm font-medium">{language.toUpperCase()}</span>
          <span className="text-lg">🌐</span>
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-3xl text-center space-y-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-700 leading-tight font-sans">
            {language === 'th' ? 'ความช่วยเหลือฉุกเฉิน' : 'Emergency Assistance'}
            <span className="block text-indigo-500">
              {language === 'th' ? 'ต่อต้านการหลอกลวงและฉ้อโกง' : 'Against Scams & Fraud'}
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
            {language === 'th'
              ? 'รับความช่วยเหลือและคำแนะนำทันทีหากคุณสงสัยว่ากำลังถูกหลอกลวง ผู้ช่วย AI ของเราพร้อมให้บริการตลอด 24 ชั่วโมง'
              : "Get immediate help and guidance if you suspect you're being scammed. Our AI-powered assistant is here to help 24/7."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link
              href="/chat"
              className="bg-indigo-400 text-white px-8 py-4 rounded-2xl text-lg font-medium hover:bg-indigo-500 transition-all transform hover:scale-102 shadow-md hover:shadow-lg"
            >
              {language === 'th' ? 'เริ่มแชทฉุกเฉิน' : 'Start Emergency Chat'}
            </Link>
            <LearnScamsButton language={language} />
          </div>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="p-8 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow border border-indigo-100">
              <div className="text-3xl mb-3">🚨</div>
              <h3 className="font-medium text-gray-700 text-lg mb-2">
                {language === 'th' ? 'ให้บริการ 24/7' : '24/7 Support'}
              </h3>
              <p className="text-gray-500">
                {language === 'th' ? 'ความช่วยเหลือทันทีเมื่อคุณต้องการ' : 'Immediate assistance whenever you need it'}
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow border border-indigo-100">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="font-medium text-gray-700 text-lg mb-2">
                {language === 'th' ? 'ปลอดภัยและเป็นส่วนตัว' : 'Secure & Private'}
              </h3>
              <p className="text-gray-500">
                {language === 'th' ? 'ข้อมูลของคุณถูกเก็บเป็นความลับ' : 'Your information is kept confidential'}
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow border border-indigo-100">
              <div className="text-3xl mb-3">📱</div>
              <h3 className="font-medium text-gray-700 text-lg mb-2">
                {language === 'th' ? 'เข้าถึงง่าย' : 'Easy Access'}
              </h3>
              <p className="text-gray-500">
                {language === 'th' ? 'ใช้งานได้บนทุกอุปกรณ์ของคุณ' : 'Available on all your devices'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
