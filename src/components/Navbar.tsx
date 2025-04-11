import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Diamond, Coins, LayoutDashboard, Wallet2, HelpCircle, MessageCircle } from 'lucide-react';
import { useLanguageStore, translations } from '../lib/i18n';
import { useAuthStore } from '../lib/auth';
import { useDiscordAuth } from '../lib/discord';

const Navbar = () => {
  const { language } = useLanguageStore();
  const { isAuthenticated, user } = useAuthStore();
  const { login } = useDiscordAuth();
  const t = translations[language].nav;

  return (
    <nav className="backdrop-blur-md bg-gray-900/50 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="text-purple-400"
            >
              <Diamond size={24} />
            </motion.div>
            <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
              Dyblit
            </span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link
              to="/earn"
              className="text-gray-300 hover:text-purple-400 transition-colors flex items-center gap-2"
            >
              <Coins size={20} />
              {t.earn}
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-300 hover:text-purple-400 transition-colors flex items-center gap-2"
                >
                  <LayoutDashboard size={20} />
                  {t.dashboard}
                </Link>
                <div className="text-purple-400 flex items-center gap-2">
                  <Diamond size={16} />
                  {user?.diamonds_balance || 0}
                </div>
              </>
            )}
            <Link
              to="/faq"
              className="text-gray-300 hover:text-purple-400 transition-colors flex items-center gap-2"
            >
              <HelpCircle size={20} />
              FAQ
            </Link>
            <Link
              to="/discord"
              className="text-gray-300 hover:text-purple-400 transition-colors flex items-center gap-2"
            >
              <MessageCircle size={20} />
              Discord
            </Link>
            {isAuthenticated ? (
              <Link
                to="/withdraw"
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2"
              >
                <Wallet2 size={20} />
                {t.withdraw}
              </Link>
            ) : (
              <button
                onClick={() => login()}
                className="bg-[#5865F2] text-white px-4 py-2 rounded-lg shadow-lg hover:bg-[#4752C4] transition-colors flex items-center gap-2"
              >
                <img
                  src="https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_white_RGB.png"
                  alt="Discord"
                  className="w-5 h-5"
                />
                {t.login}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;