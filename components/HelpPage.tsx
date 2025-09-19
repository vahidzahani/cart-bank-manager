import React from 'react';

interface HelpPageProps {
  onBack: () => void;
}

const HelpPage: React.FC<HelpPageProps> = ({ onBack }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 animate-fade-in-up">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-800">راهنمای برنامه</h2>
        <button
          onClick={onBack}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          بازگشت به لیست
        </button>
      </div>
      <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
        <p>
          به برنامه مدیریت کارت بانکی خوش آمدید! این برنامه به شما کمک می‌کند تا اطلاعات کارت‌های بانکی خود را به صورت امن و با دسترسی آسان ذخیره و مدیریت کنید.
        </p>
        <h3 className="text-xl font-semibold text-blue-700 !mt-6">ویژگی‌ها:</h3>
        <ul className="list-disc pr-5 space-y-2">
          <li><strong>افزودن کارت:</strong> با کلیک روی دکمه "افزودن کارت"، می‌توانید اطلاعات کارت خود شامل نام بانک، شماره کارت، شبا، CVV2 و تاریخ انقضا را وارد کنید.</li>
          <li><strong>کپی سریع:</strong> کنار شماره کارت و شماره شبا، یک دکمه برای کپی سریع اطلاعات وجود دارد تا به راحتی از آن‌ها در برنامه‌های دیگر استفاده کنید.</li>
          <li><strong>ویرایش و حذف:</strong> هر زمان که بخواهید می‌توانید اطلاعات یک کارت را ویرایش یا آن را به طور کامل حذف کنید.</li>
          <li><strong>جستجو:</strong> از نوار جستجو در بالای صفحه برای پیدا کردن سریع کارت مورد نظر خود بر اساس نام بانک، عنوان دلخواه یا بخشی از شماره کارت استفاده کنید.</li>
          <li><strong>پشتیبان‌گیری و بازیابی:</strong> از طریق منوی کناری، می‌توانید از تمام اطلاعات خود یک فایل پشتیبان تهیه کنید (پشتیبان‌گیری) و یا اطلاعات را از یک فایل پشتیبان بازگردانی کنید (بازیابی اطلاعات). این ویژگی برای انتقال اطلاعات به دستگاه دیگر یا پس از نصب مجدد برنامه بسیار مفید است.</li>
        </ul>
        <p className="!mt-6 p-4 bg-yellow-50 border-r-4 border-yellow-400 text-yellow-800 rounded">
          <strong>نکته امنیتی:</strong> تمام اطلاعات شما فقط روی دستگاه شما ذخیره می‌شود و به هیچ سرور آنلاینی ارسال نمی‌گردد.
        </p>
      </div>
    </div>
  );
};

export default HelpPage;
