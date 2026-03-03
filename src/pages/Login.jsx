import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Navbar from '../components/layout/Navbar';
import Logo from '../components/layout/Logo';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/courses';

  useEffect(() => {
    api.get('/health').catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-[80vh] bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-slate-200 p-8">
          <div className="flex items-center justify-center gap-2.5 mb-2">
            <Logo className="w-10 h-10 shrink-0" iconClassName="text-brand-accent" />
            <span className="font-brand text-xl font-bold tracking-tight text-slate-900">Learn Master</span>
          </div>
          <h1 className="text-2xl font-bold text-center text-slate-900 mt-4">Log in</h1>
          <p className="text-center text-slate-600 text-sm mt-1 mb-6">Sign in to continue to your courses.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-brand-accent focus:border-brand-accent"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-brand-accent focus:border-brand-accent"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-brand-accent hover:bg-brand-accentHover text-slate-900 rounded-md disabled:opacity-50 font-medium transition-colors"
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-600">
            Don't have an account? <Link to="/signup" className="text-brand-accent hover:underline font-medium">Sign up</Link>
          </p>
        </div>
      </div>
    </>
  );
}
