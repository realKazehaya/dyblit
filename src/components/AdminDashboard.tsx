import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Withdrawal, Promocode } from '../types/database';

export default function AdminDashboard() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [promocodes, setPromocodes] = useState<Promocode[]>([]);
  const [newPromocode, setNewPromocode] = useState({
    code: '',
    diamonds: 0,
    max_uses: 0,
  });

  useEffect(() => {
    loadWithdrawals();
    loadPromocodes();
  }, []);

  const loadWithdrawals = async () => {
    const { data, error } = await supabase
      .from('withdrawals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading withdrawals:', error);
      return;
    }

    setWithdrawals(data);
  };

  const loadPromocodes = async () => {
    const { data, error } = await supabase
      .from('promocodes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading promocodes:', error);
      return;
    }

    setPromocodes(data);
  };

  const updateWithdrawalStatus = async (id: string, status: 'pending' | 'processing' | 'completed') => {
    const { error } = await supabase
      .from('withdrawals')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating withdrawal:', error);
      return;
    }

    await loadWithdrawals();
  };

  const createPromocode = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase
      .from('promocodes')
      .insert([newPromocode]);

    if (error) {
      console.error('Error creating promocode:', error);
      return;
    }

    setNewPromocode({ code: '', diamonds: 0, max_uses: 0 });
    await loadPromocodes();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        {/* Withdrawals Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
          <h2 className="text-2xl font-bold mb-4">Withdrawals</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="pb-4">ID</th>
                  <th className="pb-4">Amount</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4">Created At</th>
                  <th className="pb-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((withdrawal) => (
                  <tr key={withdrawal.id} className="border-b border-gray-700/50">
                    <td className="py-4">{withdrawal.profile_id}</td>
                    <td className="py-4">{withdrawal.amount}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        withdrawal.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                        withdrawal.status === 'processing' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-gray-500/20 text-gray-300'
                      }`}>
                        {withdrawal.status}
                      </span>
                    </td>
                    <td className="py-4">
                      {new Date(withdrawal.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4">
                      <select
                        value={withdrawal.status}
                        onChange={(e) => updateWithdrawalStatus(withdrawal.id, e.target.value as any)}
                        className="bg-gray-700 rounded px-2 py-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Promocodes Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
          <h2 className="text-2xl font-bold mb-4">Promocodes</h2>
          
          {/* Create Promocode Form */}
          <form onSubmit={createPromocode} className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              value={newPromocode.code}
              onChange={(e) => setNewPromocode({ ...newPromocode, code: e.target.value })}
              placeholder="Promocode"
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
              required
            />
            <input
              type="number"
              value={newPromocode.diamonds}
              onChange={(e) => setNewPromocode({ ...newPromocode, diamonds: parseInt(e.target.value) })}
              placeholder="Diamonds"
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
              required
            />
            <input
              type="number"
              value={newPromocode.max_uses}
              onChange={(e) => setNewPromocode({ ...newPromocode, max_uses: parseInt(e.target.value) })}
              placeholder="Max Uses"
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
              required
            />
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg hover:from-purple-700 hover:to-blue-600 transition-colors"
            >
              Create Promocode
            </button>
          </form>

          {/* Promocodes Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="pb-4">Code</th>
                  <th className="pb-4">Diamonds</th>
                  <th className="pb-4">Uses</th>
                  <th className="pb-4">Created At</th>
                  <th className="pb-4">Expires At</th>
                </tr>
              </thead>
              <tbody>
                {promocodes.map((promocode) => (
                  <tr key={promocode.id} className="border-b border-gray-700/50">
                    <td className="py-4">{promocode.code}</td>
                    <td className="py-4">{promocode.diamonds}</td>
                    <td className="py-4">
                      {promocode.current_uses} / {promocode.max_uses}
                    </td>
                    <td className="py-4">
                      {new Date(promocode.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4">
                      {promocode.expires_at
                        ? new Date(promocode.expires_at).toLocaleDateString()
                        : 'Never'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}