import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AdminStarryBackground from './ui/AdminStarryBackground';
import AdminNebulaGradient from './ui/AdminNebulaGradient';
import AdminShootingStar from './ui/AdminShootingStar';
import { cosmic } from './ui/cosmicClassNames';

const MAX_ATTEMPTS = 5;
const BASE_DELAY_MS = 2000;
const isLocalDevAdmin =
  typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname);
const localDevEmail = import.meta.env.PUBLIC_LOCAL_ADMIN_EMAIL || 'admin@local.dev';
const localDevPassword = import.meta.env.PUBLIC_LOCAL_ADMIN_PASSWORD || 'admin12345';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [lockedUntil, setLockedUntil] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const attemptsRef = useRef(0);
  const navigate = useNavigate();
  const { signIn, isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  useEffect(() => {
    if (!lockedUntil) return;
    const timer = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(timer);
  }, [lockedUntil]);

  const isLocked = lockedUntil > now;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (Date.now() < lockedUntil) {
      setError('Too many attempts. Please wait before trying again.');
      return;
    }

    setError('');
    setLoading(true);

    const result = await signIn(email, password);

    if (result.success) {
      attemptsRef.current = 0;
      navigate('/dashboard');
    } else {
      attemptsRef.current += 1;
      if (attemptsRef.current >= MAX_ATTEMPTS) {
        const delay = BASE_DELAY_MS * Math.pow(2, attemptsRef.current - MAX_ATTEMPTS);
        setLockedUntil(Date.now() + delay);
        setError(`Too many failed attempts. Please wait ${Math.round(delay / 1000)}s.`);
      } else {
        setError(result.error || 'Invalid credentials');
      }
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

            {isLocalDevAdmin && (
              <div className="mb-6 rounded-xl border border-primary-500/20 bg-primary-500/10 p-4 text-sm text-secondary-300">
                <p className="font-semibold text-secondary-100">Local dev credentials</p>
                <p className="mt-2">
                  Email: <span className="font-mono text-primary-300">{localDevEmail}</span>
                </p>
                <p className="mt-1">
                  Password: <span className="font-mono text-primary-300">{localDevPassword}</span>
                </p>
              </div>
            )}

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
                  placeholder={isLocalDevAdmin ? localDevEmail : 'admin@example.com'}
                  required
                  disabled={loading || isLocked}
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
                  placeholder={isLocalDevAdmin ? localDevPassword : 'Enter your password'}
                  required
                  disabled={loading || isLocked}
                />
              </div>

              {error && (
                <div role="alert" className={cosmic.alertError}>
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || isLocked}
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
