import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Diamond, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../lib/auth';
import { supabase } from '../lib/supabase';

const Withdraw = () => {
  const { user } = useAuthStore();
  const [freeFireId, setFreeFireId] = useState('');
  const [diamonds, setDiamonds] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Basic validation
      if (!user) throw new Error('You must be logged in to withdraw');
      if (!freeFireId) throw new Error('Free Fire ID is required');
      if (!diamonds) throw new Error('Amount of diamonds is required');

      const diamondsAmount = parseInt(diamonds);
      if (isNaN(diamondsAmount)) throw new Error('Invalid amount of diamonds');
      if (diamondsAmount < 100) throw new Error('Minimum withdrawal is 100 diamonds');
      if (diamondsAmount > (user.diamonds_balance || 0)) throw new Error('Insufficient balance');

      // Create withdrawal request
      const { error: withdrawalError } = await supabase
        .from('withdrawals')
        .insert({
          user_id: user.id,
          free_fire_id: freeFireId,
          diamonds: diamondsAmount,
          status: 'pending'
        });

      if (withdrawalError) throw withdrawalError;

      // Update user's balance
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          diamonds_balance: (user.diamonds_balance || 0) - diamondsAmount 
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setSuccess(true);
      setFreeFireId('');
      setDiamonds('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-md bg-gray-800/50 p-8 rounded-2xl shadow-lg border border-gray-700"
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Withdraw Diamonds</h1>
          <Diamond className="w-8 h-8 text-purple-400" />
        </div>

        {/* Balance Display */}
        <div className="mb-8 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Available Balance</span>
            <span className="text-2xl font-bold text-purple-400">
              {user?.diamonds_balance || 0} 💎
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="freeFireId" className="block text-sm font-medium text-gray-300 mb-2">
              Free Fire ID
            </label>
            <input
              type="text"
              id="freeFireId"
              value={freeFireId}
              onChange={(e) => setFreeFireId(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter your Free Fire ID"
              required
            />
          </div>

          <div>
            <label htmlFor="diamonds" className="block text-sm font-medium text-gray-300 mb-2">
              Amount of Diamonds
            </label>
            <input
              type="number"
              id="diamonds"
              value={diamonds}
              onChange={(e) => setDiamonds(e.target.value)}
              min="100"
              step="1"
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Minimum: 100 diamonds"
              required
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 bg-red-900/50 border border-red-700 rounded-lg flex items-center gap-2 text-red-200"
            >
              <AlertCircle className="w-5 h-5" />
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 bg-green-900/50 border border-green-700 rounded-lg flex items-center gap-2 text-green-200"
            >
              <CheckCircle className="w-5 h-5" />
              Withdrawal request submitted successfully!
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg shadow-lg hover:shadow-xl transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              'Request Withdrawal'
            )}
          </button>
        </form>

        <div className="mt-8 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-400" />
            Processing Times
          </h3>
          <ul className="text-sm text-gray-300 space-y-2">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-400"></div>
              Withdrawals are processed within 24 hours
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-400"></div>
              Minimum withdrawal: 100 diamonds
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-400"></div>
              Make sure your Free Fire ID is correct
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default Withdraw;