import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, HelpCircle, Coins, MessageSquareMore } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const { profile } = useAuthStore();
  const location = useLocation();

  return (
    <nav className="flex-1">
      <ul className="flex items-center justify-center space-x-1 md:space-x-4">
        {location.pathname !== '/' && (
          <>
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                    isActive
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'hover:bg-gray-700/50 text-gray-300'
                  }`
                }
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/withdraw"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                    isActive
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'hover:bg-gray-700/50 text-gray-300'
                  }`
                }
              >
                <Coins className="w-4 h-4" />
                <span>Withdraw</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/faq"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                    isActive
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'hover:bg-gray-700/50 text-gray-300'
                  }`
                }
              >
                <HelpCircle className="w-4 h-4" />
                <span>FAQ</span>
              </NavLink>
            </li>
            <li>
              <a
                href="https://discord.gg/P2mByEf4pB"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors hover:bg-gray-700/50 text-gray-300"
              >
                <MessageSquareMore className="w-4 h-4" />
                <span>Support</span>
              </a>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}