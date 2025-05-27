'use client';
import Link from 'next/link';

const LearnScamsButton = () => {
  const handleClick = () => {
    window.open('https://www.police.go.th/scam-alert', '_blank');
  };

  return (
    <button
      className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-all"
      onClick={handleClick}
    >
      Learn About Scams
    </button>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
          Emergency Assistance
          <span className="block text-blue-600">Against Scams & Fraud</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Get immediate help and guidance if you suspect you're being scammed. Our AI-powered assistant is here to help 24/7.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            href="/chat"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Start Emergency Chat
          </Link>
          <LearnScamsButton />
        </div>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="p-6 rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow">
            <div className="text-2xl mb-2">🚨</div>
            <h3 className="font-semibold text-gray-800">24/7 Support</h3>
            <p className="text-gray-600 text-sm">Immediate assistance whenever you need it</p>
          </div>
          <div className="p-6 rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow">
            <div className="text-2xl mb-2">🔒</div>
            <h3 className="font-semibold text-gray-800">Secure & Private</h3>
            <p className="text-gray-600 text-sm">Your information is kept confidential</p>
          </div>
          <div className="p-6 rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow">
            <div className="text-2xl mb-2">📱</div>
            <h3 className="font-semibold text-gray-800">Easy Access</h3>
            <p className="text-gray-600 text-sm">Available on all your devices</p>
          </div>
        </div>
      </div>
    </div>
  );
}
