import React, { useState, useEffect, useRef } from 'react';
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
  const [isBankSelectorOpen, setIsBankSelectorOpen] = useState(false);
  const [bankSearchTerm, setBankSearchTerm] = useState('');
  const bankSelectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
        if (cardToEdit) {
            setCard(cardToEdit);
        } else {
            setCard(initialState);
        }
    } else {
      setIsBankSelectorOpen(false);
      setBankSearchTerm('');
    }
  }, [cardToEdit, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bankSelectorRef.current && !bankSelectorRef.current.contains(event.target as Node)) {
        setIsBankSelectorOpen(false);
      }
    };
    if (isBankSelectorOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isBankSelectorOpen]);

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
  
  const filteredBanks = bankData.banks.filter(bank =>
    bank.name_fa.toLowerCase().includes(bankSearchTerm.toLowerCase())
  );

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
          <div className="relative" ref={bankSelectorRef}>
            <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">نام بانک <span className="text-red-500">*</span></label>
            <button
                type="button"
                onClick={() => setIsBankSelectorOpen(!isBankSelectorOpen)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right flex items-center justify-between"
                aria-haspopup="listbox"
                aria-expanded={isBankSelectorOpen}
            >
                {card.bankName ? (
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-5 bg-gray-200 rounded-sm flex items-center justify-center">
                            <svg className="w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                        </div>
                        <span>{card.bankName}</span>
                    </div>
                ) : (
                    <span className="text-gray-500">یک بانک را انتخاب کنید</span>
                )}
                <svg className={`w-5 h-5 text-gray-400 transition-transform ${isBankSelectorOpen ? 'transform rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </button>
            {isBankSelectorOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm" role="listbox">
                    <div className="p-2 sticky top-0 bg-white z-10">
                        <input
                            type="text"
                            placeholder="جستجوی بانک..."
                            value={bankSearchTerm}
                            onChange={(e) => setBankSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <ul className="py-1">
                        {filteredBanks.length > 0 ? filteredBanks.map(bank => (
                            <li key={bank.name_fa} role="option" aria-selected={card.bankName === bank.name_fa}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCard({ ...card, bankName: bank.name_fa });
                                        setIsBankSelectorOpen(false);
                                        setBankSearchTerm('');
                                    }}
                                    className="w-full text-right text-gray-900 cursor-pointer select-none py-2 px-4 hover:bg-blue-100 flex items-center gap-3"
                                >
                                   <div className="w-10 h-6 bg-gray-100 border border-gray-200 rounded flex items-center justify-center">
                                       <svg className="w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                   </div>
                                    <span className="flex-1">{bank.name_fa}</span>
                                </button>
                            </li>
                        )) : (
                            <li className="text-center text-gray-500 py-2 px-4">بانکی یافت نشد.</li>
                        )}
                    </ul>
                </div>
            )}
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