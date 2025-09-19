import React, { useState, useEffect } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import type { BankCard } from './types';
import CardDisplay from './components/CardDisplay';
import CardFormModal from './components/CardFormModal';
import ConfirmationModal from './components/ConfirmationModal';
import SideMenu from './components/SideMenu';
import HelpPage from './components/HelpPage';
import SupportPage from './components/SupportPage';
import DownloadPage from './components/DownloadPage';
import AuthForm from './components/AuthForm';
import ChangePasswordModal from './components/ChangePasswordModal';
import { PlusIcon, SearchIcon, MenuIcon } from './components/icons';
import { bankData } from './data/banks';

const AUTH_API_URL = 'https://card.cloudecode.ir/auth.php';
const DATA_API_URL = 'https://card.cloudecode.ir/data.php';

const App: React.FC = () => {
  const [token, setToken] = useLocalStorage<string | null>('authToken', null);
  const [cards, setCards] = useState<BankCard[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardToEdit, setCardToEdit] = useState<BankCard | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [cardToDeleteId, setCardToDeleteId] = useState<string | null>(null);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'main' | 'help' | 'support' | 'download'>('main');
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Auto-load cards when user logs in (token is set)
  useEffect(() => {
    if (token) {
      handleLoadCardsFromServer(true); // silent load on startup
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  
  const handleApiRequest = async (url: string, options: RequestInit, errorMessage: string) => {
    setLoading(true);
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      if (data.status !== 'success') {
        throw new Error(data.message || errorMessage);
      }
      return data;
    } catch (error) {
      alert((error as Error).message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (username: string, password: string) => {
    setAuthError(null);
    try {
      await handleApiRequest(AUTH_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, action: 'register', device: navigator.userAgent }),
      }, 'خطا در ثبت‌نام');
      alert('ثبت‌نام با موفقیت انجام شد. اکنون می‌توانید وارد شوید.');
      return true; // Indicate success
    } catch (error) {
      setAuthError((error as Error).message);
      return false;
    }
  };

  const handleLogin = async (username: string, password: string) => {
    setAuthError(null);
    try {
      const data = await handleApiRequest(AUTH_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, action: 'login', device: navigator.userAgent }),
      }, 'نام کاربری یا رمز عبور نامعتبر است');
      setToken(data.token);
    } catch (error) {
       setAuthError((error as Error).message);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setCards([]);
    setCurrentPage('main');
  };

  const handleChangePassword = async (password: string, new_password: string) => {
    try {
      await handleApiRequest(AUTH_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ action: 'change_password', password, new_password }),
      }, 'خطا در تغییر رمز عبور');
      alert('رمز عبور با موفقیت تغییر کرد.');
      setIsChangePasswordModalOpen(false);
    } catch (error) {
      // Error is already alerted by handleApiRequest
    }
  };

  const handleSaveCardsToServer = async () => {
    if(cards.length === 0) {
        alert('هیچ کارتی برای ذخیره وجود ندارد.');
        return;
    }
    try {
      const cardsToSave = cards.map(card => ({
        bankName: card.bankName,
        customTitle: card.customTitle || '',
        cardNumber: card.cardNumber,
        iban: card.iban,
        cvv: card.cvv,
        expiryDate: card.expiryDate,
        bankColor: card.customColor || card.bankColor,
      }));
      await handleApiRequest(DATA_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ cards: cardsToSave }),
      }, 'خطا در ذخیره کارت‌ها');
      alert('کارت‌ها با موفقیت در سرور ذخیره شدند.');
    } catch (error) {
       // Error is already alerted by handleApiRequest
    }
  };
  
  const handleLoadCardsFromServer = async (silent = false) => {
    try {
      const data = await handleApiRequest(DATA_API_URL, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      }, 'خطا در بارگیری کارت‌ها');
      
      const loadedCards = data.cards.map((card: any) => {
        const bankInfo = bankData.banks.find(b => b.name_fa === card.bank_name);
        return {
          id: card.id.toString(),
          bankName: card.bank_name || '',
          customTitle: card.card_name || '',
          cardNumber: card.card_number || '',
          iban: card.shaba_number || '',
          cvv: card.cvv || '',
          expiryDate: card.expire_date || '',
          customColor: card.bankColor,
          bankColor: bankInfo?.color,
        }
      });
      setCards(loadedCards);
      if(!silent) alert(`تعداد ${loadedCards.length} کارت با موفقیت از سرور بارگیری شد.`);
    } catch (error) {
       // Error is already alerted by handleApiRequest
    }
  };

  const handleOpenModal = (card: BankCard | null = null) => {
    setCardToEdit(card);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setCardToEdit(null);
    setIsModalOpen(false);
  };

  const handleSaveCard = (card: BankCard) => {
    const bankInfo = bankData.banks.find(b => b.name_fa === card.bankName);
    const finalCard = { 
        ...card, 
        iban: card.iban.toUpperCase().startsWith('IR') ? card.iban : `IR${card.iban}`,
        bankColor: bankInfo?.color,
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

  const handleToggleExpand = (id: string) => {
    setExpandedCardId(prevId => (prevId === id ? null : id));
  };

  const handleShareCard = async (card: BankCard) => {
    const shareText = `عنوان: ${card.customTitle || card.bankName}\nبانک: ${card.bankName}\nشماره کارت: ${card.cardNumber.replace(/\s/g, '')}\nشماره شبا: ${card.iban}`;
    
    // Using modern share APIs
    if (navigator.share) {
      try {
        await navigator.share({
          title: `اطلاعات کارت ${card.bankName}`,
          text: shareText,
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
           console.error('Web Share API failed:', error);
           alert('خطایی در هنگام اشتراک‌گذاری رخ داد.');
        }
      }
    } else {
       // Fallback for desktop or unsupported browsers
      try {
        await navigator.clipboard.writeText(shareText);
        alert('اطلاعات کارت در کلیپ‌بورد کپی شد.');
      } catch (err) {
        alert('اشتراک‌گذاری در این مرورگر پشتیبانی نمی‌شود.');
      }
    }
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

  const handleNavigate = (page: 'main' | 'help' | 'support' | 'download') => {
    setCurrentPage(page);
    setSearchTerm(''); 
  };

  const pageTitles = {
    main: 'مدیریت کارت‌ها',
    help: 'راهنما',
    support: 'پشتیبانی و ارتباط با ما',
    download: 'دانلود اپلیکیشن'
  };
  
  if (!token) {
    return (
        <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
            <AuthForm 
                onLogin={handleLogin} 
                onRegister={handleRegister}
                error={authError}
                loading={loading} 
            />
        </div>
    );
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'help':
        return <HelpPage onBack={() => handleNavigate('main')} />;
      case 'support':
        return <SupportPage onBack={() => handleNavigate('main')} />;
      case 'download':
        return <DownloadPage onBack={() => handleNavigate('main')} />;
      case 'main':
      default:
        return (
          <>
            {cards.length === 0 && !loading ? (
              <div className="text-center py-20 flex flex-col items-center">
                <div className="mx-auto h-24 w-24 text-blue-200">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h2 className="mt-2 text-xl font-semibold text-blue-800">هیچ کارتی یافت نشد.</h2>
                <p className="mt-1 text-blue-600 mb-8">می‌توانید کارت‌ها را از سرور بارگیری کنید یا یک کارت جدید اضافه نمایید.</p>
                <button
                  onClick={() => handleOpenModal()}
                  className="flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  aria-label="افزودن کارت جدید"
                >
                  <PlusIcon className="w-8 h-8" />
                </button>
              </div>
            ) : filteredCards.length === 0 && !loading ? (
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
                    onShare={handleShareCard}
                    isExpanded={card.id === expandedCardId}
                    onToggleExpand={handleToggleExpand}
                  />
                ))}
              </div>
            )}
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 text-gray-800">
      <header className="bg-gradient-to-r from-blue-700 to-blue-500 shadow-lg sticky top-0 z-30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center gap-4">
          <div className="flex items-center gap-4">
             <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 text-white rounded-full hover:bg-white/20 transition-colors"
              aria-label="باز کردن منو"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">{pageTitles[currentPage]}</h1>
          </div>
          
          <div className="flex items-center gap-2">
            {currentPage === 'main' && (
              <>
                <div className="relative w-full sm:w-auto">
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
                <button
                  onClick={() => handleOpenModal()}
                  className="flex-shrink-0 flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-semibold text-blue-700 bg-white rounded-lg shadow-md hover:bg-blue-100 transition-all duration-300 transform hover:scale-105"
                  aria-label="افزودن کارت جدید"
                >
                  <PlusIcon className="w-5 h-5" />
                  <span className="hidden sm:inline">افزودن کارت</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>
      
      <SideMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNavigate={handleNavigate}
        onSaveToServer={handleSaveCardsToServer}
        onLoadFromServer={() => handleLoadCardsFromServer(false)}
        onChangePassword={() => setIsChangePasswordModalOpen(true)}
        onLogout={handleLogout}
      />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="text-center py-10 text-blue-600">
            <p>در حال ارتباط با سرور...</p>
          </div>
        )}
        {!loading && renderContent()}
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

      <ChangePasswordModal 
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        onSave={handleChangePassword}
        loading={loading}
      />
    </div>
  );
};

export default App;