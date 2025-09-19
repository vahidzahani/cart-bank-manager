import React from 'react';
import { AndroidIcon, WindowsIcon, AppleIcon } from './icons';

interface DownloadPageProps {
  onBack: () => void;
}

const DownloadPage: React.FC<DownloadPageProps> = ({ onBack }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 animate-fade-in-up">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-blue-800">دانلود اپلیکیشن</h2>
        <button
          onClick={onBack}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          بازگشت به لیست
        </button>
      </div>

      <div className="space-y-6">
        <p className="text-center text-gray-600">
          برای تجربه بهتر و دسترسی آفلاین، می‌توانید نسخه مخصوص سیستم‌عامل خود را دانلود کنید.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Android Card */}
          <a
            href="/cardman.apk"
            download
            className="group block p-6 bg-green-50 rounded-lg border-2 border-green-200 hover:border-green-400 hover:bg-green-100 transition-all duration-300 text-center shadow-sm"
          >
            <AndroidIcon className="w-16 h-16 mx-auto text-green-500 mb-4" />
            <h3 className="text-xl font-bold text-green-800">اندروید</h3>
            <p className="mt-2 text-green-600">دانلود مستقیم فایل APK</p>
            <span className="mt-4 inline-block px-5 py-2 text-sm font-semibold text-white bg-green-500 rounded-full group-hover:bg-green-600 transition-colors">
              دانلود
            </span>
          </a>

          {/* Windows Card */}
          <div
            className="group block p-6 bg-gray-50 rounded-lg border-2 border-gray-200 text-center shadow-sm cursor-not-allowed opacity-60"
          >
            <WindowsIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-700">ویندوز</h3>
            <p className="mt-2 text-gray-500">نسخه دسکتاپ</p>
            <span className="mt-4 inline-block px-5 py-2 text-sm font-semibold text-gray-600 bg-gray-200 rounded-full">
              به زودی
            </span>
          </div>
          
          {/* iOS Card */}
          <div
            className="group block p-6 bg-gray-50 rounded-lg border-2 border-gray-200 text-center shadow-sm cursor-not-allowed opacity-60"
          >
            <AppleIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-700">آی‌او‌اس (iOS)</h3>
            <p className="mt-2 text-gray-500">نسخه آیفون و آیپد</p>
             <span className="mt-4 inline-block px-5 py-2 text-sm font-semibold text-gray-600 bg-gray-200 rounded-full">
              به زودی
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;
