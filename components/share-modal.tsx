'use client';

import { useState } from 'react';
import { X, Copy, Mail, MessageCircle, Share2, Link as LinkIcon, Check } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  resourceId: number;
}

export function ShareModal({ isOpen, onClose, title, resourceId }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/?resource=${resourceId}&title=${encodeURIComponent(title)}`
    : '';

  const shareText = `Check out this resource: "${title}"`;
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(shareUrl);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('[v0] Error copying to clipboard:', error);
    }
  };

  const shareOptions = [
    {
      id: 'copy',
      label: 'Copy Link',
      icon: Copy,
      color: 'bg-blue-100 hover:bg-blue-200 text-blue-700',
      action: handleCopyLink,
    },
    {
      id: 'email',
      label: 'Email',
      icon: Mail,
      color: 'bg-red-100 hover:bg-red-200 text-red-700',
      action: () => {
        const subject = `Check out: ${title}`;
        const body = `${shareText}\n\n${shareUrl}`;
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      },
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-green-100 hover:bg-green-200 text-green-700',
      action: () => {
        const message = `${shareText}\n\n${shareUrl}`;
        window.open(`https://wa.me/?text=${encodedText}%20${encodedUrl}`, '_blank');
      },
    },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:flex md:items-center md:justify-center"
        onClick={onClose}
      />

      {/* Modal Container - Mobile Bottom Sheet / Desktop Center */}
      <div className="fixed inset-0 md:flex md:items-center md:justify-center z-50 pointer-events-none">
        {/* Modal Card */}
        <div 
          className="fixed bottom-0 left-0 right-0 md:relative md:bottom-auto md:left-auto md:right-auto bg-white dark:bg-slate-900 rounded-t-2xl md:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto md:max-w-md w-full md:w-96 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 flex items-center justify-between p-4 md:p-6 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-t-2xl md:rounded-t-2xl z-10">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">Share Resource</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X size={20} className="text-gray-900 dark:text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 md:p-6 space-y-6">
            {/* Resource Title */}
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Sharing</p>
              <p className="font-semibold text-gray-900 dark:text-white line-clamp-2">{title}</p>
            </div>

            {/* Share Options Grid */}
            <div className="grid grid-cols-3 gap-3">
              {shareOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={option.action}
                    className={`flex flex-col items-center gap-2 p-3 md:p-4 rounded-lg transition-all ${option.color}`}
                  >
                    <IconComponent size={20} className="md:w-6 md:h-6" />
                    <span className="text-xs font-medium text-center line-clamp-2">{option.label}</span>
                    {copied && option.id === 'copy' && (
                      <Check size={14} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Share URL Section */}
            <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-medium">Share Link</p>
              <div className="flex flex-col md:flex-row gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg text-xs md:text-sm bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-300 cursor-pointer truncate"
                  onClick={(e) => {
                    (e.target as HTMLInputElement).select();
                    navigator.clipboard.writeText(shareUrl);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                />
                <button
                  onClick={handleCopyLink}
                  className={`px-3 py-2 rounded-lg font-medium text-xs md:text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
                    copied
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check size={14} />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Tip Section */}
            <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-800 dark:text-blue-200">
                <span className="font-semibold">Tip:</span> Share this resource with your friends and classmates to help them access important study materials!
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-slate-700 p-4 md:p-6 bg-gray-50 dark:bg-slate-800 rounded-b-2xl">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-[#1782C5] text-white font-medium rounded-lg hover:bg-[#1F2557] dark:hover:bg-[#2a3a6e] transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
