import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const Discord = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="backdrop-blur-md bg-gray-800/50 p-8 rounded-2xl shadow-lg border border-gray-700">
          <MessageCircle className="w-16 h-16 text-purple-400 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4">Join Our Discord Community</h1>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join our Discord server to get help, stay updated with the latest news, and connect with other members of the FF Rewards community.
          </p>
          <a
            href="https://discord.gg/P2mByEf4pB"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-3 rounded-lg bg-[#5865F2] text-white font-semibold hover:bg-[#4752C4] transition-colors"
          >
            <img
              src="https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_white_RGB.png"
              alt="Discord"
              className="w-6 h-6 mr-2"
            />
            Join Discord Server
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default Discord;