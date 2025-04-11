import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import { useLanguageStore, translations } from '../lib/i18n';

const FAQ = () => {
  const { language } = useLanguageStore();
  const t = translations[language].support;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-white mb-4">{t.faq.title}</h1>
        <p className="text-gray-300 max-w-2xl mx-auto">{t.description}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="backdrop-blur-md bg-gray-800/50 p-8 rounded-2xl shadow-lg border border-gray-700"
      >
        <div className="space-y-6">
          {t.faq.questions.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border-b border-gray-700 pb-6 last:border-0"
            >
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-purple-400" />
                {faq.q}
              </h3>
              <p className="text-gray-300">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default FAQ;