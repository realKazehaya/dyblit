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
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 backdrop-blur-md bg-gradient-to-r from-red-900/30 to-gray-900/30 border-b border-red-500/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 180 }}
              transition={{ duration: 0.3 }}
              className="text-red-400"
            >
              <Diamond size={24} />
            </motion.div>
            <motion.span 
              whileHover={{ scale: 1.05 }}
              className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-400"
            >
              Dyblit
            </motion.span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                to="/earn"
                className="text-gray-300 hover:text-red-400 transition-colors flex items-center gap-2 font-medium"
              >
                <Coins size={20} />
                EARN
              </Link>
            </motion.div>

            {isAuthenticated && (
              <>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link
                    to="/dashboard"
                    className="text-gray-300 hover:text-red-400 transition-colors flex items-center gap-2 font-medium"
                  >
                    <LayoutDashboard size={20} />
                    DASHBOARD
                  </Link>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="text-red-400 flex items-center gap-2 bg-red-500/10 px-3 py-1 rounded-lg"
                >
                  <Diamond size={16} />
                  {user?.diamonds_balance || 0}
                </motion.div>
              </>
            )}

            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                to="/faq"
                className="text-gray-300 hover:text-red-400 transition-colors flex items-center gap-2 font-medium"
              >
                <HelpCircle size={20} />
                FAQ
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                to="/discord"
                className="text-gray-300 hover:text-red-400 transition-colors flex items-center gap-2 font-medium"
              >
                <MessageCircle size={20} />
                DISCORD
              </Link>
            </motion.div>

            {isAuthenticated ? (
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link
                  to="/withdraw"
                  className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 font-medium"
                >
                  <Wallet2 size={20} />
                  WITHDRAW
                </Link>
              </motion.div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => login()}
                className="bg-[#5865F2] text-white px-4 py-2 rounded-lg shadow-lg hover:bg-[#4752C4] transition-all flex items-center gap-2 font-medium"
              >
                <img
                  src="https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_white_RGB.png"
                  alt="Discord"
                  className="w-5 h-5"
                />
                LOGIN
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;