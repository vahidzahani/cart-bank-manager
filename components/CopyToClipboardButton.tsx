
import React, { useState } from 'react';
import { CopyIcon, CheckIcon } from './icons';

interface CopyToClipboardButtonProps {
  textToCopy: string;
}

const CopyToClipboardButton: React.FC<CopyToClipboardButtonProps> = ({ textToCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`transition-all duration-200 ease-in-out p-1 rounded-md ${
        copied ? 'text-green-500 bg-green-100' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-100'
      }`}
      aria-label="کپی"
    >
      {copied ? <CheckIcon className="w-5 h-5" /> : <CopyIcon className="w-5 h-5" />}
    </button>
  );
};

export default CopyToClipboardButton;
