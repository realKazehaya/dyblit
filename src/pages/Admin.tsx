import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Diamond, CheckCircle, XCircle, Clock, Search, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../lib/auth';
import { User, Withdrawal } from '../types';

interface WithdrawalWithUser extends Withdrawal {
  users: User;
}

const Admin = () => {
  const { user } = useAuthStore();
  const [withdrawals, setWithdrawals] = useState<WithdrawalWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'rejected'>('all');

  const fetchWithdrawals = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('withdrawals')
        .select(`
          *,
          users (
            id,
            username,
            discord_id,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWithdrawals(data || []);
    } catch (err) {
      console.error('Error fetching withdrawals:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const updateStatus = async (id: string, status: 'pending' | 'completed' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('withdrawals')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      // Refresh the list
      fetchWithdrawals();
    } catch (err) {
      console.error('Error updating withdrawal status:', err);
    }
  };

  const filteredWithdrawals = withdrawals.filter(withdrawal => {
    const matchesSearch = 
      withdrawal.users.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      withdrawal.free_fire_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || withdrawal.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'rejected':
        return 'text-red-400';
      default:
        return 'text-yellow-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-400" />;
    }
  };

  // Check if user is admin
  if (!user?.is_admin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-300">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p>You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Withdrawal Management</h1>
        <button
          onClick={fetchWithdrawals}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg text-gray-200 hover:bg-gray-600 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="backdrop-blur-md bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by username or Free Fire ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Filter */}
          <div className="flex gap-2">
            {(['all', 'pending', 'completed', 'rejected'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === status
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredWithdrawals.map((withdrawal) => (
            <motion.div
              key={withdrawal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-md bg-gray-800/50 p-6 rounded-xl border border-gray-700 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between"
            >
              <div className="flex items-center gap-4">
                <img
                  src={withdrawal.users.avatar_url || 'https://via.placeholder.com/40'}
                  alt={withdrawal.users.username}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="text-white font-medium">{withdrawal.users.username}</h3>
                  <p className="text-gray-400 text-sm">Free Fire ID: {withdrawal.free_fire_id}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Diamond className="w-5 h-5 text-purple-400" />
                <span className="text-white font-medium">{withdrawal.diamonds}</span>
              </div>

              <div className="flex items-center gap-2">
                {getStatusIcon(withdrawal.status)}
                <span className={`font-medium ${getStatusColor(withdrawal.status)}`}>
                  {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                </span>
              </div>

              <div className="text-gray-400 text-sm">
                {format(new Date(withdrawal.created_at), 'MMM d, yyyy HH:mm')}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => updateStatus(withdrawal.id, 'completed')}
                  disabled={withdrawal.status === 'completed'}
                  className="px-3 py-1 rounded bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Complete
                </button>
                <button
                  onClick={() => updateStatus(withdrawal.id, 'rejected')}
                  disabled={withdrawal.status === 'rejected'}
                  className="px-3 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reject
                </button>
              </div>
            </motion.div>
          ))}

          {filteredWithdrawals.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              No withdrawals found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;