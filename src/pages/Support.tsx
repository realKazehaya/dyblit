import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, HelpCircle, Users } from 'lucide-react';
import { useLanguageStore, translations } from '../lib/i18n';

const Support = () => {
  const { language } = useLanguageStore();
  const t = translations[language].support;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{t.title}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">{t.description}</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="backdrop-blur-md bg-white/30 p-6 rounded-2xl shadow-lg border border-white/20"
        >
          <HelpCircle className="w-12 h-12 text-purple-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">{t.categories.faq}</h3>
          <p className="text-gray-600">Find answers to common questions about our platform.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-md bg-white/30 p-6 rounded-2xl shadow-lg border border-white/20"
        >
          <MessageCircle className="w-12 h-12 text-purple-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">{t.categories.contact}</h3>
          <p className="text-gray-600">Get in touch with our support team.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="backdrop-blur-md bg-white/30 p-6 rounded-2xl shadow-lg border border-white/20"
        >
          <Users className="w-12 h-12 text-purple-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">{t.categories.discord}</h3>
          <p className="text-gray-600">Join our community for instant support.</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="backdrop-blur-md bg-white/30 p-8 rounded-2xl shadow-lg border border-white/20"
      >
        <h2 className="text-2xl font-bold mb-6">{t.faq.title}</h2>
        <div className="space-y-6">
          {t.faq.questions.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{faq.q}</h3>
              <p className="text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Support;