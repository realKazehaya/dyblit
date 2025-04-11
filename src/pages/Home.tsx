import React from 'react';
import { motion } from 'framer-motion';
import { Diamond, CheckCircle, DollarSign } from 'lucide-react';
import { useLanguageStore, translations } from '../lib/i18n';

const Home = () => {
  const { language } = useLanguageStore();
  const t = translations[language].home;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
          {t.title}
        </h1>
        <p className="mt-4 text-xl text-gray-300">
          {t.subtitle}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        <div className="backdrop-blur-md bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700">
          <Diamond className="w-12 h-12 text-purple-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-white">{t.features.earn.title}</h3>
          <p className="text-gray-300">
            {t.features.earn.description}
          </p>
        </div>

        <div className="backdrop-blur-md bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700">
          <CheckCircle className="w-12 h-12 text-purple-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-white">{t.features.withdraw.title}</h3>
          <p className="text-gray-300">
            {t.features.withdraw.description}
          </p>
        </div>

        <div className="backdrop-blur-md bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700">
          <DollarSign className="w-12 h-12 text-purple-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-white">{t.features.daily.title}</h3>
          <p className="text-gray-300">
            {t.features.daily.description}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;