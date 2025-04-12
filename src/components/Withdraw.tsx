import React, { useState } from 'react';
import { Coins } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';

export default function Withdraw() {
  const { profile } = useAuthStore();
  const [amount, setAmount] = useState<number>(100);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    try {
      // Validate amount
      if (!amount || amount < 100 || amount % 100 !== 0) {
        throw new Error('Amount must be at least 100 and a multiple of 100');
      }

      if (amount > (profile?.diamonds || 0)) {
        throw new Error('Insufficient balance');
      }

      // Create withdrawal request
      const { error: withdrawalError } = await supabase
        .from('withdrawals')
        .insert([
          {
            profile_id: profile?.id,
            amount,
            status: 'pending',
          },
        ]);

      if (withdrawalError) throw withdrawalError;

      // Update user's balance
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          diamonds: (profile?.diamonds || 0) - amount,
        })
        .eq('id', profile?.id);

      if (updateError) throw updateError;

      setSuccess(true);
      setAmount(100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!profile) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-xl mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Coins className="w-8 h-8 text-yellow-500" />
            <h1 className="text-2xl font-bold">Withdraw Diamonds</h1>
          </div>

          <div className="mb-6 p-4 bg-gray-700/30 rounded-lg">
            <p className="text-gray-300">Current Balance</p>
            <p className="text-2xl font-bold">{profile.diamonds} Diamonds</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Amount to Withdraw
              </label>
              <input
                type="number"
                id="amount"
                min="100"
                step="100"
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value))}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                required
              />
              <p className="mt-2 text-sm text-gray-400">
                Minimum: 100 diamonds. Must be in multiples of 100.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300">
                Withdrawal request submitted successfully!
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || amount > (profile?.diamonds || 0)}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg hover:from-purple-700 hover:to-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : 'Submit Withdrawal Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}