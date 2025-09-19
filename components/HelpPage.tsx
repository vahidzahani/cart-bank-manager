import React from 'react';
import { CloudIcon, AppDownloadIcon, EditIcon } from './icons';

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
          به برنامه مدیریت کارت بانکی خوش آمدید! این برنامه به شما کمک می‌کند تا اطلاعات کارت‌های بانکی خود را به صورت امن ذخیره کرده و با قابلیت همگام‌سازی ابری (Cloud Sync)، از هر دستگاهی به آن‌ها دسترسی داشته باشید.
        </p>
        
        <h3 className="text-xl font-semibold text-blue-700 !mt-8">ویژگی‌های اصلی:</h3>
        <ul className="list-disc pr-5 space-y-2">
          <li><strong>افزودن کارت:</strong> با کلیک روی دکمه "افزودن کارت"، می‌توانید اطلاعات کارت خود شامل نام بانک، شماره کارت، شبا، CVV2 و تاریخ انقضا را وارد کنید.</li>
          <li><strong>کپی سریع:</strong> کنار شماره کارت و شماره شبا، یک دکمه برای کپی سریع اطلاعات وجود دارد تا به راحتی از آن‌ها در برنامه‌های دیگر استفاده کنید.</li>
          <li><strong>ویرایش و حذف:</strong> هر زمان که بخواهید می‌توانید اطلاعات یک کارت را ویرایش یا آن را به طور کامل حذف کنید.</li>
          <li><strong>جستجو:</strong> از نوار جستجو در بالای صفحه برای پیدا کردن سریع کارت مورد نظر خود بر اساس نام بانک، عنوان دلخواه یا بخشی از شماره کارت استفاده کنید.</li>
        </ul>

        <h3 className="text-xl font-semibold text-blue-700 !mt-8">همگام‌سازی ابری و مدیریت داده‌ها:</h3>
        <ul className="list-disc pr-5 space-y-3">
            <li><strong>حساب کاربری و همگام‌سازی:</strong> با ایجاد حساب کاربری، می‌توانید کارت‌های خود را به صورت امن در سرور ذخیره کنید. این کار به شما امکان می‌دهد تا اطلاعات خود را بین دستگاه‌های مختلف همگام‌سازی کرده و یک نسخه پشتیبان آنلاین داشته باشید.</li>
            <li><strong>ذخیره در سرور:</strong> با استفاده از این گزینه در منو، تمام کارت‌های جدید یا ویرایش‌شده از دستگاه شما به سرور ارسال و ذخیره می‌شوند.</li>
            <li><strong>بارگیری از سرور:</strong> این گزینه کارت‌های ذخیره‌شده روی سرور را به دستگاه شما اضافه می‌کند. این عملیات هوشمند است و کارت‌هایی که فقط روی دستگاه شما وجود دارند را حذف نمی‌کند.</li>
            <li><strong>خروج امن:</strong> اگر کارت‌های ذخیره‌نشده داشته باشید و قصد خروج از حساب کاربری خود را داشته باشید، برنامه به شما هشدار می‌دهد تا از از دست رفتن اطلاعات جلوگیری شود.</li>
        </ul>

        <h4 className="text-lg font-semibold text-gray-800 !mt-6">وضعیت کارت‌ها:</h4>
        <p>هر کارت دارای یک آیکون است که وضعیت همگام‌سازی آن را نشان می‌دهد:</p>
        <ul className="!mt-2 list-none p-0 space-y-3">
            <li className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <CloudIcon className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                <div>
                    <strong>ذخیره شده در سرور (Synced):</strong>
                    <p className="text-sm text-gray-600">این کارت به صورت امن در سرور ذخیره شده و با حساب شما همگام است.</p>
                </div>
            </li>
            <li className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <AppDownloadIcon className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                    <strong>ذخیره شده روی دستگاه (Local):</strong>
                    <p className="text-sm text-gray-600">این یک کارت جدید است که فقط روی این دستگاه ذخیره شده و هنوز به سرور ارسال نشده است.</p>
                </div>
            </li>
            <li className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <EditIcon className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                <div>
                    <strong>ویرایش شده (Edited):</strong>
                    <p className="text-sm text-gray-600">این کارت قبلاً از سرور دریافت شده اما روی دستگاه شما ویرایش شده است. برای ثبت تغییرات، باید اطلاعات را در سرور ذخیره کنید.</p>
                </div>
            </li>
        </ul>

        <p className="!mt-8 p-4 bg-yellow-50 border-r-4 border-yellow-400 text-yellow-800 rounded">
          <strong>نکته امنیتی:</strong> اطلاعات شما همیشه به صورت محلی روی دستگاه شما ذخیره می‌شود. هنگام استفاده از قابلیت همگام‌سازی، اطلاعات شما با استفاده از پروتکل‌های امن به سرور منتقل و نگهداری می‌شود تا امنیت حریم خصوصی شما تضمین شود.
        </p>
      </div>
    </div>
  );
};

export default HelpPage;
