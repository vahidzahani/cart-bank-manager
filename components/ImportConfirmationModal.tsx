import React from 'react';
import { CloseIcon } from './icons';

interface ImportConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMerge: () => void;
  onReplace: () => void;
}

const ImportConfirmationModal: React.FC<ImportConfirmationModalProps> = ({ isOpen, onClose, onMerge, onReplace }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="import-modal-title"
    >
      <div
        className="bg-white rounded-lg shadow-2xl w-full max-w-md transform animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 id="import-modal-title" className="text-lg font-bold text-gray-800">وارد کردن اطلاعات کارت</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="بستن">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 text-gray-600 space-y-4">
            <p>یک فایل پشتیبان انتخاب شده است. چگونه می‌خواهید اطلاعات را وارد کنید؟</p>
            <div className="p-3 bg-blue-50 border-l-4 border-blue-400 text-blue-800">
                <p className="font-semibold">ادغام</p>
                <p className="text-sm">کارت‌های جدید از فایل پشتیبان به لیست فعلی شما اضافه می‌شوند. کارت‌های تکراری (با شماره کارت یکسان) نادیده گرفته می‌شوند.</p>
            </div>
             <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800">
                <p className="font-semibold">جایگزینی</p>
                <p className="text-sm"><strong>احتیاط:</strong> تمام کارت‌های فعلی شما حذف شده و کارت‌های موجود در فایل پشتیبان جایگزین آن‌ها می‌شوند.</p>
            </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            انصراف
          </button>
          <button
            type="button"
            onClick={onReplace}
            className="px-4 py-2 text-sm font-medium text-white bg-orange-500 border border-transparent rounded-md shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            جایگزینی
          </button>
          <button
            type="button"
            onClick={onMerge}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            ادغام
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportConfirmationModal;
