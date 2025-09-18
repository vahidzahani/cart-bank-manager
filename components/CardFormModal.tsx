import React, { useState, useEffect } from 'react';
import type { BankCard } from '../types';
import { CloseIcon } from './icons';
import { bankData } from '../data/banks';

interface CardFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (card: BankCard) => void;
  cardToEdit: BankCard | null;
}

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#14b8a6',
  '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#ec4899', '#78716c'
];

const initialState: Omit<BankCard, 'id'> = {
  bankName: '',
  customTitle: '',
  cardNumber: '',
  iban: '',
  cvv: '',
  expiryDate: '',
  customColor: undefined,
};

const CardFormModal: React.FC<CardFormModalProps> = ({ isOpen, onClose, onSave, cardToEdit }) => {
  const [card, setCard] = useState<Omit<BankCard, 'id'>>(initialState);

  useEffect(() => {
    if (isOpen) {
        if (cardToEdit) {
            setCard(cardToEdit);
        } else {
            setCard(initialState);
        }
    }
  }, [cardToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;
    if(name === 'cardNumber') {
        formattedValue = value.replace(/\D/g, '').slice(0, 16);
    }
    if(name === 'iban') {
        formattedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 24);
    }
    if(name === 'cvv') {
        formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }
    if(name === 'expiryDate') {
        formattedValue = value.replace(/\D/g, '').slice(0, 4);
        if (formattedValue.length > 2) {
            formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2);
        }
    }
    setCard({ ...card, [name]: formattedValue });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const requiredFields: (keyof Omit<BankCard, 'id' | 'customTitle' | 'customColor' | 'bankColor' | 'bankNameEn'>)[] = ['bankName', 'cardNumber', 'iban', 'cvv', 'expiryDate'];
    for(const field of requiredFields) {
        if(!card[field]) {
            alert('لطفا همه فیلدهای ستاره‌دار را پر کنید.');
            return;
        }
    }
    onSave({
      ...card,
      id: cardToEdit ? cardToEdit.id : new Date().toISOString(),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 transition-opacity duration-300" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md transform animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-blue-800">{cardToEdit ? 'ویرایش کارت' : 'افزودن کارت جدید'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">نام بانک <span className="text-red-500">*</span></label>
            <select name="bankName" id="bankName" value={card.bankName} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required>
                <option value="" disabled>یک بانک را انتخاب کنید</option>
                {bankData.banks.map(bank => (
                    <option key={bank.name_fa} value={bank.name_fa}>{bank.name_fa}</option>
                ))}
            </select>
          </div>
           <div>
            <label htmlFor="customTitle" className="block text-sm font-medium text-gray-700">عنوان دلخواه (اختیاری)</label>
            <input type="text" name="customTitle" id="customTitle" value={card.customTitle || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="مثال: کارت حقوق" />
          </div>
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">شماره کارت (۱۶ رقم) <span className="text-red-500">*</span></label>
            <input type="text" name="cardNumber" id="cardNumber" value={card.cardNumber} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ltr-input" placeholder="۶۰۳۷۹۹۷۵۱۲۳۴۵۶۷۸" dir="ltr" maxLength={16} required />
          </div>
          <div>
            <label htmlFor="iban" className="block text-sm font-medium text-gray-700">شماره شبا (بدون IR) <span className="text-red-500">*</span></label>
            <input type="text" name="iban" id="iban" value={card.iban.replace(/^IR/i, '')} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ltr-input" placeholder="۰۱۸۰۶۰۰۱۲۳۴۵۶۷۸۹۰۱۲۳۴۵۶" dir="ltr" maxLength={24} required />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">CVV2 <span className="text-red-500">*</span></label>
              <input type="text" name="cvv" id="cvv" value={card.cvv} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="۱۲۳" dir="ltr" maxLength={4} required />
            </div>
            <div className="flex-1">
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">تاریخ انقضا <span className="text-red-500">*</span></label>
              <input type="text" name="expiryDate" id="expiryDate" value={card.expiryDate} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="YY/MM (مثال: ۰۳/۰۵)" dir="ltr" maxLength={5} required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">رنگ دلخواه کارت</label>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              {PRESET_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setCard({ ...card, customColor: color })}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${card.customColor === color ? 'ring-2 ring-offset-2 ring-blue-500 border-white' : 'border-transparent hover:border-gray-400'}`}
                  style={{ backgroundColor: color }}
                  aria-label={`انتخاب رنگ ${color}`}
                />
              ))}
              <button
                type="button"
                onClick={() => setCard({ ...card, customColor: undefined })}
                className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors"
                aria-label="پاک کردن رنگ انتخابی"
                title="پاک کردن رنگ انتخابی"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
              </button>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              انصراف
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              ذخیره
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CardFormModal;