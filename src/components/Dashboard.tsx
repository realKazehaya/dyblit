import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Gift, Coins } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Dashboard() {
  const { profile, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!profile) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src="https://i.ibb.co/yByHyLP/YhXo2LW.png"
                alt="Profile"
                className="w-16 h-16 rounded-full bg-gray-700"
              />
              <div>
                <h2 className="text-xl font-bold">
                  {profile.nickname || `Player ${profile.free_fire_id}`}
                </h2>
                <p className="text-gray-400">ID: {profile.free_fire_id}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="px-4 py-2 text-white bg-red-500/20 hover:bg-red-500/30 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
          
          <div className="mt-6 flex items-center justify-between">
            <div className="text-center">
              <p className="text-gray-400">Balance</p>
              <p className="text-2xl font-bold flex items-center justify-center">
                <Coins className="w-5 h-5 mr-2 text-yellow-500" />
                {profile.diamonds}
              </p>
            </div>
          </div>
        </div>

        {/* Offerwalls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
            <h3 className="text-xl font-bold mb-4">Earn Diamonds</h3>
            <div className="grid grid-cols-1 gap-4">
              {['Lootably', 'CPX Research', 'AdGateMedia', 'Ayet Studios', 'Torox'].map((provider) => (
                <button
                  key={provider}
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-600/20 to-blue-500/20 hover:from-purple-600/30 hover:to-blue-500/30 rounded-lg flex items-center justify-between transition-colors"
                >
                  <span className="font-medium">{provider}</span>
                  <Gift className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          {/* Recent Withdrawals */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
            <h3 className="text-xl font-bold mb-4">Recent Withdrawals</h3>
            <div className="space-y-4">
              <p className="text-gray-400 text-center py-8">No withdrawals yet</p>
            </div>
          </div>
        </div>

        {/* Promocode Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
          <h3 className="text-xl font-bold mb-4">Enter Promocode</h3>
          <form className="flex gap-4">
            <input
              type="text"
              placeholder="Enter your promocode"
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg hover:from-purple-700 hover:to-blue-600 transition-colors"
            >
              Redeem
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}