import React from 'react';
import type { BankCard } from '../types';
import { EditIcon, TrashIcon, ChipIcon, ShareIcon } from './icons';
import CopyToClipboardButton from './CopyToClipboardButton';

interface CardDisplayProps {
  card: BankCard;
  onEdit: (card: BankCard) => void;
  onDelete: (id: string) => void;
  onShare: (card: BankCard) => void;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
}

const formatCardNumber = (num: string) => {
  return num.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
};

const CardDisplay: React.FC<CardDisplayProps> = ({ card, onEdit, onDelete, onShare, isExpanded, onToggleExpand }) => {
  const displayColor = card.customColor || card.bankColor || '#2563eb';

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const darkenColor = (rgb: { r: number, g: number, b: number } | null, percent: number) => {
    if (!rgb) return '#000000';
    const amount = 1 - percent / 100;
    const r = Math.round(rgb.r * amount);
    const g = Math.round(rgb.g * amount);
    const b = Math.round(rgb.b * amount);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const gradientEndColor = darkenColor(hexToRgb(displayColor), 20);

  const cardStyle = {
    background: `linear-gradient(135deg, ${displayColor} 0%, ${gradientEndColor} 100%)`,
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fade-in-up">
      {/* Visual Card Part */}
      <div 
        className="relative p-5 flex flex-col justify-between aspect-[1.586/1] text-white md:cursor-auto cursor-pointer" 
        style={cardStyle}
        onClick={() => onToggleExpand(card.id)}
        role="button"
        aria-expanded={isExpanded}
        tabIndex={0}
      >
        {/* Top Row: Bank Name & Logo/Chip */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold">{card.customTitle || card.bankName}</h3>
            {card.customTitle && <p className="text-sm text-white/90 mt-1">{card.bankName}</p>}
          </div>
          <ChipIcon className="w-12 h-auto" />
        </div>

        {/* Middle: Card Number */}
        <div className="py-2 flex items-center justify-center gap-2">
          <span className="font-mono text-2xl tracking-widest" dir="ltr">
            {formatCardNumber(card.cardNumber)}
          </span>
          <CopyToClipboardButton textToCopy={card.cardNumber.replace(/\s/g, '')} variant="dark" />
        </div>

        {/* Bottom Row: Expiry, CVV */}
        <div className={`flex items-end text-sm transition-all duration-300
          md:visible md:opacity-100 md:h-auto
          ${isExpanded ? 'visible opacity-100 h-auto' : 'invisible opacity-0 h-0'}`}>
          <div className="flex items-center gap-6 font-mono" dir="ltr">
             <div>
                <p className="text-xs uppercase text-white/70">CVV2</p>
                <p>{card.cvv}</p>
             </div>
             <div>
                <p className="text-xs uppercase text-white/70">Expires</p>
                <p>{card.expiryDate}</p>
             </div>
          </div>
        </div>
      </div>

      {/* Info & Actions Part */}
      <div className={`transition-all duration-300 ease-in-out grid 
        md:grid-rows-[1fr]
        ${isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">شماره شبا (IBAN)</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-semibold text-gray-800 tracking-wider" dir="ltr">
                    {card.iban}
                  </span>
                  <CopyToClipboardButton textToCopy={card.iban} />
                </div>
            </div>
            <div className="pt-3 mt-2 border-t border-gray-100 flex justify-end items-center gap-2">
                <button onClick={(e) => { e.stopPropagation(); onShare(card); }} className="flex items-center gap-1 px-3 py-1 text-sm text-green-700 bg-green-100 rounded-md hover:bg-green-200 transition-colors">
                    <ShareIcon className="w-4 h-4" />
                    اشتراک
                </button>
                <button onClick={(e) => { e.stopPropagation(); onEdit(card); }} className="flex items-center gap-1 px-3 py-1 text-sm text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors">
                    <EditIcon className="w-4 h-4" />
                    ویرایش
                </button>
                <button onClick={(e) => { e.stopPropagation(); onDelete(card.id); }} className="flex items-center gap-1 px-3 py-1 text-sm text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors">
                    <TrashIcon className="w-4 h-4" />
                    حذف
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDisplay;