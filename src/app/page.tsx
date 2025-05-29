'use client';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import Navbar from '@/components/Navbar';

const LearnScamsButton = ({ language }: { language: 'en' | 'th' }) => {
  const handleClick = () => {
    window.open('https://www.police.go.th/scam-alert', '_blank');
  };

  return (
    <button
      className="bg-white text-indigo-500 border-2 border-indigo-300 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl text-base sm:text-lg font-medium hover:bg-indigo-50 transition-all shadow-sm hover:shadow w-full sm:w-auto"
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
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-3xl text-center space-y-6 sm:space-y-8 px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight font-sans">
            <span className="bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
              {language === 'th' ? 'ความช่วยเหลือฉุกเฉิน' : 'Emergency Assistance'}
            </span>
            <span className="block mt-2 bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              {language === 'th' ? 'ต่อต้านการหลอกลวงและฉ้อโกง' : 'Against Scams & Fraud'}
            </span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto font-medium">
            {language === 'th'
              ? 'รับความช่วยเหลือและคำแนะนำทันทีหากคุณสงสัยว่ากำลังถูกหลอกลวง ผู้ช่วย AI ของเราพร้อมให้บริการตลอด 24 ชั่วโมง'
              : "Get immediate help and guidance if you suspect you're being scammed. Our AI-powered assistant is here to help 24/7."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6 sm:mt-8 px-4 sm:px-0">
            <Link
              href="/chat"
              className="bg-indigo-400 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl text-base sm:text-lg font-medium hover:bg-indigo-500 transition-all transform hover:scale-102 shadow-md hover:shadow-lg w-full sm:w-auto"
            >
              {language === 'th' ? 'เริ่มแชทฉุกเฉิน' : 'Start Emergency Chat'}
            </Link>
            <LearnScamsButton language={language} />
          </div>
          <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-0">
            <div className="p-6 sm:p-8 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow border border-indigo-100">
              <div className="text-3xl mb-3">🚨</div>
              <h3 className="font-medium text-gray-700 text-lg mb-2">
                {language === 'th' ? 'ให้บริการ 24/7' : '24/7 Support'}
              </h3>
              <p className="text-gray-500 text-sm sm:text-base">
                {language === 'th' ? 'ความช่วยเหลือทันทีเมื่อคุณต้องการ' : 'Immediate assistance whenever you need it'}
              </p>
            </div>
            <div className="p-6 sm:p-8 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow border border-indigo-100">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="font-medium text-gray-700 text-lg mb-2">
                {language === 'th' ? 'ปลอดภัยและเป็นส่วนตัว' : 'Secure & Private'}
              </h3>
              <p className="text-gray-500 text-sm sm:text-base">
                {language === 'th' ? 'ข้อมูลของคุณถูกเก็บเป็นความลับ' : 'Your information is kept confidential'}
              </p>
            </div>
            <div className="p-6 sm:p-8 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow border border-indigo-100">
              <div className="text-3xl mb-3">📱</div>
              <h3 className="font-medium text-gray-700 text-lg mb-2">
                {language === 'th' ? 'เข้าถึงง่าย' : 'Easy Access'}
              </h3>
              <p className="text-gray-500 text-sm sm:text-base">
                {language === 'th' ? 'ใช้งานได้บนทุกอุปกรณ์ของคุณ' : 'Available on all your devices'}
              </p>
            </div>
          </div>
        </div>
      </div>
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
