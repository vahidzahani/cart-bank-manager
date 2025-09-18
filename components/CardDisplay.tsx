import React from 'react';
import type { BankCard } from '../types';
import { EditIcon, TrashIcon } from './icons';
import CopyToClipboardButton from './CopyToClipboardButton';

interface CardDisplayProps {
  card: BankCard;
  onEdit: (card: BankCard) => void;
  onDelete: (id: string) => void;
}

const formatCardNumber = (num: string) => {
  return num.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
};

const InfoRow: React.FC<{ label: string; value: string; isLtr?: boolean }> = ({ label, value, isLtr = false }) => (
  <div className="flex items-center justify-between py-2 border-b border-blue-100 last:border-b-0">
    <span className="text-sm text-blue-800">{label}</span>
    <div className="flex items-center gap-2">
      <span className={`font-mono text-sm font-semibold text-blue-900 ${isLtr ? 'tracking-wider' : ''}`} dir={isLtr ? 'ltr' : 'rtl'}>
        {value}
      </span>
      <CopyToClipboardButton textToCopy={value} />
    </div>
  </div>
);

const CardDisplay: React.FC<CardDisplayProps> = ({ card, onEdit, onDelete }) => {
  const displayColor = card.customColor || card.bankColor;
  const headerStyle = displayColor ? { backgroundColor: displayColor } : {};
  const headerClasses = displayColor ? '' : 'bg-gradient-to-br from-blue-600 to-blue-800';

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
      <div className={`p-5 text-white flex justify-between items-start ${headerClasses}`} style={headerStyle}>
        <div>
            <h3 className="text-xl font-bold">{card.customTitle || card.bankName}</h3>
            {card.customTitle && <p className="text-base text-white/90 mt-1">{card.bankName}</p>}
            {card.bankNameEn && <p className="text-sm text-white/80 font-playfair-display mt-1">{card.bankNameEn}</p>}
        </div>
         <div className="w-12 h-8 bg-black/20 rounded-md flex items-center justify-center flex-shrink-0">
            <div className="w-10 h-6 bg-yellow-400 rounded-sm"></div>
        </div>
      </div>
      <div className="p-5 space-y-2">
        <InfoRow label="شماره کارت" value={formatCardNumber(card.cardNumber)} isLtr />
        <InfoRow label="شماره شبا" value={card.iban} isLtr />
        <div className="flex justify-between pt-2">
            <InfoRow label="CVV2" value={card.cvv} isLtr />
            <InfoRow label="انقضا" value={card.expiryDate} isLtr />
        </div>
      </div>
       <div className="p-3 bg-blue-50 flex justify-end items-center gap-2">
        <button onClick={() => onEdit(card)} className="flex items-center gap-1 px-3 py-1 text-sm text-blue-700 bg-blue-200 rounded-md hover:bg-blue-300 transition-colors">
          <EditIcon className="w-4 h-4" />
          ویرایش
        </button>
        <button onClick={() => onDelete(card.id)} className="flex items-center gap-1 px-3 py-1 text-sm text-red-700 bg-red-200 rounded-md hover:bg-red-300 transition-colors">
          <TrashIcon className="w-4 h-4" />
          حذف
        </button>
      </div>
    </div>
  );
};

export default CardDisplay;