'use client';
import Link from 'next/link';

const LearnScamsButton = () => {
  const handleClick = () => {
    window.open('https://www.police.go.th/scam-alert', '_blank');
  };

  return (
    <button
      className="bg-white text-indigo-500 border-2 border-indigo-300 px-8 py-4 rounded-2xl text-lg font-medium hover:bg-indigo-50 transition-all shadow-sm hover:shadow"
      onClick={handleClick}
    >
      Learn About Scams
    </button>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl text-center space-y-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-700 leading-tight font-sans">
          Emergency Assistance
          <span className="block text-indigo-500">Against Scams & Fraud</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
          Get immediate help and guidance if you suspect you're being scammed. Our AI-powered assistant is here to help 24/7.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            href="/chat"
            className="bg-indigo-400 text-white px-8 py-4 rounded-2xl text-lg font-medium hover:bg-indigo-500 transition-all transform hover:scale-102 shadow-md hover:shadow-lg"
          >
            Start Emergency Chat
          </Link>
          <LearnScamsButton />
        </div>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="p-8 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow border border-indigo-100">
            <div className="text-3xl mb-3">🚨</div>
            <h3 className="font-medium text-gray-700 text-lg mb-2">24/7 Support</h3>
            <p className="text-gray-500">Immediate assistance whenever you need it</p>
          </div>
          <div className="p-8 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow border border-indigo-100">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="font-medium text-gray-700 text-lg mb-2">Secure & Private</h3>
            <p className="text-gray-500">Your information is kept confidential</p>
          </div>
          <div className="p-8 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow border border-indigo-100">
            <div className="text-3xl mb-3">📱</div>
            <h3 className="font-medium text-gray-700 text-lg mb-2">Easy Access</h3>
            <p className="text-gray-500">Available on all your devices</p>
          </div>
        </div>
      </div>
    </div>
  );
}
