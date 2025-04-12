import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useLanguageStore, translations } from '../lib/i18n';

const WelcomePopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguageStore();
  const t = translations[language];

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('hasSeenWelcomePopup');
    if (!hasSeenPopup) {
      setIsOpen(true);
      localStorage.setItem('hasSeenWelcomePopup', 'true');
    }
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gradient-to-br from-red-900/90 to-gray-900/90 rounded-2xl p-6 max-w-md w-full shadow-xl border border-red-500/20"
        >
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-white">{t.welcome.title}</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>
          
          <p className="text-gray-300 mb-6">{t.welcome.message}</p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://discord.gg/P2mByEf4pB"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-[#5865F2] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#4752C4] transition-colors text-center"
            >
              {t.welcome.discord}
            </a>
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 bg-red-600/20 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600/30 transition-colors"
            >
              {t.welcome.close}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default WelcomePopup;