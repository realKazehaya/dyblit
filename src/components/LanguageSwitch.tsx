import React from 'react';
import { motion } from 'framer-motion';
import { useLanguageStore } from '../lib/i18n';

const LanguageSwitch = () => {
  const { language, setLanguage } = useLanguageStore();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed bottom-4 right-4 flex gap-2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg border border-white/20"
    >
      <button
        onClick={() => setLanguage('en')}
        className={`w-8 h-8 rounded-full overflow-hidden transition-transform ${language === 'en' ? 'scale-110 ring-2 ring-purple-500' : 'opacity-70 hover:opacity-100'}`}
        title="English"
      >
        <img
          src="https://flagcdn.com/w80/us.png"
          alt="USA Flag"
          className="w-full h-full object-cover"
        />
      </button>
      <button
        onClick={() => setLanguage('es')}
        className={`w-8 h-8 rounded-full overflow-hidden transition-transform ${language === 'es' ? 'scale-110 ring-2 ring-purple-500' : 'opacity-70 hover:opacity-100'}`}
        title="Español"
      >
        <img
          src="https://flagcdn.com/w80/ve.png"
          alt="Venezuela Flag"
          className="w-full h-full object-cover"
        />
      </button>
    </motion.div>
  );
};

export default LanguageSwitch;