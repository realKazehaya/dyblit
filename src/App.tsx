import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Gamepad2 } from 'lucide-react';
import { useAuthStore } from './store/authStore';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { profile } = useAuthStore();
  if (!profile) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { profile, isAdmin } = useAuthStore();
  if (!profile || !isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        {/* Header */}
        <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Gamepad2 className="w-8 h-8 text-purple-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
                Dyblit
              </span>
            </div>
          </div>
        </header>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Routes>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-8 mt-auto text-center text-gray-400">
          <p>© 2025 Dyblit. Not affiliated with Garena Free Fire.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App