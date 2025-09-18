import React, { useState } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import type { BankCard } from './types';
import { bankData } from './data/banks';
import CardDisplay from './components/CardDisplay';
import CardFormModal from './components/CardFormModal';
import ConfirmationModal from './components/ConfirmationModal';
import { PlusIcon, DownloadIcon, SearchIcon } from './components/icons';

const App: React.FC = () => {
  const [cards, setCards] = useLocalStorage<BankCard[]>('bankCards', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardToEdit, setCardToEdit] = useState<BankCard | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [cardToDeleteId, setCardToDeleteId] = useState<string | null>(null);

  const handleOpenModal = (card: BankCard | null = null) => {
    setCardToEdit(card);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setCardToEdit(null);
    setIsModalOpen(false);
  };

  const findBankMatch = (name: string) => {
    if (!name) return null;
    return bankData.banks.find(bank => bank.name_fa === name) || null;
  }

  const handleSaveCard = (card: BankCard) => {
    const bankMatch = findBankMatch(card.bankName);

    const finalCard = { 
        ...card, 
        iban: card.iban.toUpperCase().startsWith('IR') ? card.iban : `IR${card.iban}`,
        bankColor: bankMatch ? bankMatch.color : undefined,
        bankNameEn: bankMatch ? bankMatch.name_en : undefined,
    };
    
    if (cardToEdit) {
      setCards(cards.map((c) => (c.id === finalCard.id ? finalCard : c)));
    } else {
      setCards([...cards, finalCard]);
    }
    handleCloseModal();
  };

  const handleDeleteCard = (id: string) => {
    setCardToDeleteId(id);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (cardToDeleteId) {
      setCards(cards.filter((card) => card.id !== cardToDeleteId));
    }
    setCardToDeleteId(null);
    setIsConfirmModalOpen(false);
  };
  
  const handleCloseConfirmModal = () => {
    setCardToDeleteId(null);
    setIsConfirmModalOpen(false);
  };

  const handleExport = () => {
    if (cards.length === 0) {
      alert('هیچ کارتی برای خروجی گرفتن وجود ندارد.');
      return;
    }

    const jsonString = JSON.stringify(cards, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bank-cards-backup.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredCards = cards.filter(card => {
    const term = searchTerm.toLowerCase();
    const cardNum = card.cardNumber.replace(/\s/g, '');
    return (
        card.bankName.toLowerCase().includes(term) ||
        cardNum.includes(term.replace(/\s/g, '')) ||
        (card.customTitle && card.customTitle.toLowerCase().includes(term))
    );
  });


  return (
    <div className="min-h-screen bg-blue-50 text-gray-800">
      <header className="bg-gradient-to-r from-blue-700 to-blue-500 shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-2xl font-bold text-white tracking-wide">مدیریت کارت‌های بانکی</h1>
          
          <div className="relative w-full sm:w-auto flex-grow order-3 sm:order-2 sm:flex-grow-0 sm:max-w-xs">
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <SearchIcon className="w-5 h-5 text-gray-400" />
            </span>
            <input
              type="text"
              placeholder="جستجو..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-3 pr-10 py-2 border border-transparent rounded-md leading-5 bg-blue-100 text-gray-700 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-white focus:ring-white focus:text-gray-900 sm:text-sm"
              aria-label="جستجوی کارت"
            />
          </div>

          <div className="flex items-center gap-2 order-2 sm:order-3">
             <button
              onClick={handleExport}
              disabled={cards.length === 0}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-700 bg-white rounded-lg shadow-md hover:bg-blue-100 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="خروجی گرفتن اطلاعات"
            >
              <DownloadIcon className="w-5 h-5" />
              خروجی
            </button>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-700 bg-white rounded-lg shadow-md hover:bg-blue-100 transition-all duration-300 transform hover:scale-105"
            >
              <PlusIcon className="w-5 h-5" />
              افزودن کارت جدید
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cards.length === 0 ? (
          <div className="text-center py-20">
            <div className="mx-auto h-24 w-24 text-blue-200">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h2 className="mt-2 text-xl font-semibold text-blue-800">هیچ کارتی یافت نشد.</h2>
            <p className="mt-1 text-blue-600">برای شروع، یک کارت جدید اضافه کنید.</p>
          </div>
        ) : filteredCards.length === 0 ? (
            <div className="text-center py-20">
                <div className="mx-auto h-24 w-24 text-blue-200">
                    <SearchIcon className="w-24 h-24"/>
                </div>
                <h2 className="mt-2 text-xl font-semibold text-blue-800">نتیجه‌ای یافت نشد.</h2>
                <p className="mt-1 text-blue-600">برای عبارت "{searchTerm}" نتیجه‌ای پیدا نشد.</p>
            </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCards.map((card) => (
              <CardDisplay
                key={card.id}
                card={card}
                onEdit={handleOpenModal}
                onDelete={handleDeleteCard}
              />
            ))}
          </div>
        )}
      </main>

      <CardFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveCard}
        cardToEdit={cardToEdit}
      />

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={handleCloseConfirmModal}
        onConfirm={handleConfirmDelete}
        title="تایید حذف"
      >
        <p>آیا از حذف این کارت مطمئن هستید؟ این عمل قابل بازگشت نیست.</p>
      </ConfirmationModal>
    </div>
  );
};

export default App;
