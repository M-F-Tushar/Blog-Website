import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AdminStarryBackground from './ui/AdminStarryBackground';
import AdminNebulaGradient from './ui/AdminNebulaGradient';
import AdminShootingStar from './ui/AdminShootingStar';
import { cosmic } from './ui/cosmicClassNames';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn(email, password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Invalid credentials');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-void relative overflow-hidden">
      <AdminStarryBackground density="normal" />
      <AdminNebulaGradient variant="hero" />
      <AdminShootingStar />

      <div className="relative z-10 max-w-md w-full mx-4">
        <div className="admin-glow-border rounded-2xl">
          <div className="admin-glass-cosmic rounded-2xl p-8">
            <h1 className="text-3xl font-bold font-serif text-center admin-text-gradient-cosmic mb-2">
              Admin Login
            </h1>
            <p className="text-center text-secondary-500 text-sm mb-8">
              Sign in to manage your website
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className={cosmic.label}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cosmic.input}
                  placeholder="admin@example.com"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="password" className={cosmic.label}>
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={cosmic.input}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
              </div>

              {error && (
                <div className={cosmic.alertError}>
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold rounded-lg shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:from-primary-500 hover:to-accent-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
