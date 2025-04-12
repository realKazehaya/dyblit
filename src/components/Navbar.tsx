import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Coins, LayoutDashboard, Wallet2, HelpCircle, MessageCircle } from 'lucide-react';
import { useLanguageStore, translations } from '../lib/i18n';
import { useAuthStore } from '../lib/auth';
import { useDiscordAuth } from '../lib/discord';
import { Button } from './ui/button';

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
        <div className="h-16 flex items-center justify-center">
          <div className="flex items-center space-x-6">
            <Button variant="ghost" asChild>
              <Link to="/earn" className="flex items-center gap-2 text-white hover:text-white/80">
                <Coins size={20} />
                {t.earn}
              </Link>
            </Button>

            <Button variant="ghost" asChild>
              <Link to="/faq" className="flex items-center gap-2 text-white hover:text-white/80">
                <HelpCircle size={20} />
                FAQ
              </Link>
            </Button>

            <Button variant="ghost" asChild>
              <Link to="/support" className="flex items-center gap-2 text-white hover:text-white/80">
                <MessageCircle size={20} />
                {t.support}
              </Link>
            </Button>

            {isAuthenticated ? (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/dashboard" className="flex items-center gap-2 text-white hover:text-white/80">
                    <LayoutDashboard size={20} />
                    {t.dashboard}
                  </Link>
                </Button>
                <div className="text-white flex items-center gap-2 bg-white/10 px-3 py-1 rounded-lg">
                  <span className="font-medium">{user?.diamonds_balance || 0}</span>
                </div>
                <Button asChild>
                  <Link to="/withdraw" className="flex items-center gap-2 text-white hover:text-white/80">
                    <Wallet2 size={20} />
                    {t.withdraw}
                  </Link>
                </Button>
              </>
            ) : (
              <Button
                onClick={() => login()}
                variant="secondary"
                className="flex items-center gap-2 text-white hover:text-white/80"
              >
                <MessageCircle className="w-5 h-5" />
                {t.login}
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;