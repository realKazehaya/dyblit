import React from 'react';
import { motion } from 'framer-motion';
import { Diamond, ExternalLink, Gift, AlertCircle } from 'lucide-react';

interface OfferWallProps {
  name: string;
  description: string;
  logo: string;
  minReward: number;
  maxReward: number;
  backgroundColor: string;
}

const OfferWall: React.FC<OfferWallProps> = ({ name, description, logo, minReward, maxReward, backgroundColor }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="backdrop-blur-md bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700 hover:shadow-xl transition-shadow"
  >
    <div className="flex items-center space-x-4">
      <img src={logo} alt={name} className="w-12 h-12 rounded-lg" />
      <div>
        <h3 className="text-xl font-semibold text-white">{name}</h3>
        <p className="text-gray-300 text-sm">{description}</p>
      </div>
    </div>
    <div className="mt-4 flex items-center justify-between">
      <div className="text-sm text-gray-300">
        <span className="font-semibold text-purple-400">{minReward}-{maxReward}</span> diamonds per offer
      </div>
      <button 
        className={`px-4 py-2 rounded-lg text-white font-medium flex items-center space-x-2 ${backgroundColor}`}
      >
        <span>Earn</span>
        <ExternalLink size={16} />
      </button>
    </div>
  </motion.div>
);

const Earn = () => {
  const offerwalls = [
    {
      name: "Lootably",
      description: "Complete surveys and simple tasks",
      logo: "https://lootably.com/assets/img/lootably.png",
      minReward: 50,
      maxReward: 500,
      backgroundColor: "bg-[#8B5CF6] hover:bg-[#7C3AED]"
    },
    {
      name: "AdGateMedia",
      description: "Earn by installing apps and games",
      logo: "https://adgatemedia.com/assets/logo-dark.png",
      minReward: 100,
      maxReward: 1000,
      backgroundColor: "bg-[#2563EB] hover:bg-[#1D4ED8]"
    },
    {
      name: "CPX Research",
      description: "High-quality surveys",
      logo: "https://cpx-research.com/wp-content/uploads/2022/11/CPX-Research-Logo-Blue.png",
      minReward: 75,
      maxReward: 800,
      backgroundColor: "bg-[#059669] hover:bg-[#047857]"
    },
    {
      name: "AyetStudios",
      description: "Special offers and promotions",
      logo: "https://www.ayetstudios.com/img/logo/AyetStudios_Logo_bubble.png",
      minReward: 60,
      maxReward: 600,
      backgroundColor: "bg-[#DC2626] hover:bg-[#B91C1C]"
    },
    {
      name: "OfferToro",
      description: "Multiple ways to earn",
      logo: "https://www.offertoro.com/assets/images/offertoro-logo.png",
      minReward: 40,
      maxReward: 700,
      backgroundColor: "bg-[#7C3AED] hover:bg-[#6D28D9]"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-white mb-4">Earn Diamonds</h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Choose any of our offerwalls to start earning diamonds. 
          Complete surveys, try applications, and more.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-md bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-6 rounded-2xl shadow-lg border border-gray-700"
        >
          <div className="flex items-center space-x-3 text-purple-400 mb-3">
            <Gift className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Guaranteed Rewards</h2>
          </div>
          <p className="text-gray-300">
            All completed offers are verified and rewarded automatically.
            Diamonds will be added to your account instantly.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="backdrop-blur-md bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-6 rounded-2xl shadow-lg border border-gray-700"
        >
          <div className="flex items-center space-x-3 text-purple-400 mb-3">
            <AlertCircle className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Important Tips</h2>
          </div>
          <ul className="text-gray-300 space-y-2">
            <li>• Use real information in surveys</li>
            <li>• Complete offers until the end</li>
            <li>• Don't use VPN or fake data</li>
          </ul>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offerwalls.map((offerwall, index) => (
          <motion.div
            key={offerwall.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <OfferWall {...offerwall} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Earn;