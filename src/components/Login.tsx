import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gamepad2, Gift, Shield, LogIn } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const [freeFireId, setFreeFireId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  const isAdmin = useAuthStore(state => state.isAdmin);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('Attempting login with ID:', freeFireId);
      await login(freeFireId);
      console.log('Login successful, redirecting...');
      navigate(isAdmin ? '/admin' : '/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center text-center space-y-8">
        <h1 className="text-4xl md:text-5xl font-bold">
          Earn Free Fire Diamonds
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
            Watch Ads & Complete Surveys
          </span>
        </h1>
        
        <p className="text-xl text-gray-400 max-w-2xl">
          Join thousands of players earning Free Fire diamonds by completing simple tasks. 
          Safe, easy, and completely free!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl mt-12">
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
            <Gift className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Daily Rewards</h3>
            <p className="text-gray-400">Complete daily tasks to earn diamonds instantly</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
            <Shield className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">100% Safe</h3>
            <p className="text-gray-400">No password required, just your Free Fire ID</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
            <Gamepad2 className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Instant Delivery</h3>
            <p className="text-gray-400">Get your diamonds delivered automatically</p>
          </div>
        </div>

        <div className="mt-12 w-full max-w-md">
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="space-y-2">
              <label htmlFor="freeFireId" className="block text-sm font-medium text-gray-200">
                Free Fire ID
              </label>
              <input
                id="freeFireId"
                type="text"
                value={freeFireId}
                onChange={(e) => setFreeFireId(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                placeholder="Enter your Free Fire ID"
                required
                disabled={isLoading}
              />
            </div>
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
                {error}
              </div>
            )}
            <div className="text-xs text-gray-400">
              <Shield className="inline-block w-4 h-4 mr-1" />
              We will never ask for your password
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 text-white bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg hover:from-purple-700 hover:to-blue-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? (
                'Loading...'
              ) : (
                <>
                  <LogIn className="inline-block w-4 h-4 mr-2" />
                  Login to Earn Diamonds
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}