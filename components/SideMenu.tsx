import React from 'react';
import { CloseIcon, CloudUploadIcon, CloudDownloadIcon, KeyIcon, LogoutIcon, AppDownloadIcon } from './icons';

const HomeIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const HelpIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const SupportIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: 'main' | 'help' | 'support' | 'download') => void;
  onSaveToServer: () => void;
  onLoadFromServer: () => void;
  onChangePassword: () => void;
  onLogout: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose, onNavigate, onSaveToServer, onLoadFromServer, onChangePassword, onLogout }) => {
  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="menu-title"
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 id="menu-title" className="text-xl font-bold text-blue-800">منو</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="بستن منو">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <nav className="p-4">
          <ul>
            <MenuItem icon={<HomeIcon />} text="کارت‌های من" onClick={() => handleAction(() => onNavigate('main'))} />
            <div className="my-2 border-t border-gray-200"></div>
            <MenuItem icon={<CloudUploadIcon />} text="ذخیره در سرور" onClick={() => handleAction(onSaveToServer)} />
            <MenuItem icon={<CloudDownloadIcon />} text="بارگیری از سرور" onClick={() => handleAction(onLoadFromServer)} />
            <MenuItem icon={<KeyIcon />} text="تغییر رمز عبور" onClick={() => handleAction(onChangePassword)} />
            <div className="my-2 border-t border-gray-200"></div>
            <MenuItem icon={<HelpIcon />} text="راهنما" onClick={() => handleAction(() => onNavigate('help'))} />
            <MenuItem icon={<SupportIcon />} text="پشتیبانی" onClick={() => handleAction(() => onNavigate('support'))} />
            <MenuItem icon={<AppDownloadIcon />} text="دانلود اپلیکیشن" onClick={() => handleAction(() => onNavigate('download'))} />
             <div className="my-2 border-t border-gray-200"></div>
            <MenuItem icon={<LogoutIcon />} text="خروج" onClick={() => handleAction(onLogout)} />
          </ul>
        </nav>
      </div>
    </>
  );
};

interface MenuItemProps {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, text, onClick }) => (
  <li>
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 px-3 py-3 text-lg text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-700 transition-colors"
    >
      <span className="text-blue-600">{icon}</span>
      {text}
    </button>
  </li>
);

export default SideMenu;