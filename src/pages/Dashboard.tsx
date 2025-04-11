import React from 'react';
import { motion } from 'framer-motion';
import { History, Diamond } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { User, Reward, Withdrawal } from '../types';

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {/* Balance Card */}
        <div className="backdrop-blur-md bg-white/30 p-6 rounded-2xl shadow-lg border border-white/20">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-800">Tu Balance</h2>
            <Diamond className="w-8 h-8 text-purple-600" />
          </div>
          <p className="mt-4 text-4xl font-bold text-purple-600">0</p>
          <p className="text-gray-600">Diamantes disponibles</p>
        </div>

        {/* Stats Card */}
        <div className="backdrop-blur-md bg-white/30 p-6 rounded-2xl shadow-lg border border-white/20">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-800">Estadísticas</h2>
            <History className="w-8 h-8 text-purple-600" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-bold text-purple-600">0</p>
              <p className="text-gray-600">Ofertas completadas</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">0</p>
              <p className="text-gray-600">Retiros realizados</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {/* Rewards History */}
        <div className="backdrop-blur-md bg-white/30 p-6 rounded-2xl shadow-lg border border-white/20">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Historial de Recompensas</h2>
          <div className="space-y-4">
            <p className="text-gray-600 text-center py-4">No hay recompensas recientes</p>
          </div>
        </div>

        {/* Withdrawals History */}
        <div className="backdrop-blur-md bg-white/30 p-6 rounded-2xl shadow-lg border border-white/20">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Historial de Retiros</h2>
          <div className="space-y-4">
            <p className="text-gray-600 text-center py-4">No hay retiros recientes</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;