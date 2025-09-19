import React from 'react';

interface SupportPageProps {
  onBack: () => void;
}

const SupportPage: React.FC<SupportPageProps> = ({ onBack }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 animate-fade-in-up">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-800">پشتیبانی و ارتباط با ما</h2>
        <button
          onClick={onBack}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          بازگشت به لیست
        </button>
      </div>
      <div className="text-center space-y-4 text-gray-700">
        <p className="text-lg">
          این برنامه به رایگان در اختیار شما قرار گرفته است.
        </p>
        <p>
          در صورت مشاهده هرگونه مشکل یا داشتن پیشنهاد برای بهبود برنامه، لطفاً از طریق تلگرام به من اطلاع دهید.
        </p>
        <div className="my-4">
          <a
            href="https://t.me/vahidzahani"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 text-white font-semibold bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 transition-colors"
          >
            ارتباط در تلگرام: @vahidzahani
          </a>
        </div>
        <p className="text-lg font-semibold pt-4">با تشکر، وحید زهانی</p>
      </div>
    </div>
  );
};

export default SupportPage;
