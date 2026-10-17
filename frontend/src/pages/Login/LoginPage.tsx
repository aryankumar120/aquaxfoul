import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, ArrowRight, AlertCircle, Shield } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('aryan@aqua-xfoul.com');
  const [password, setPassword] = useState('••••••••••••');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Invalid credentials. Please verify your email.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('aryan@aqua-xfoul.com');
    setLoading(true);
    try {
      await login({ email: 'aryan@aqua-xfoul.com' });
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070f14] flex flex-col justify-center py-12 px-6 lg:px-8 relative overflow-hidden select-none">
      {/* Background maritime waves */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="oceanGlow" cx="50%" cy="30%" r="60%">
              <stop offset="0%" stopColor="#00c9a7" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#070f14" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#oceanGlow)" />
        </svg>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        {/* Brand Logo */}
        <div className="inline-flex w-16 h-16 rounded-2xl bg-[#0e272a]/90 border border-sky-400/30 items-center justify-center mb-4 shadow-xl shadow-sky-500/10 overflow-hidden">
          <img src="/logo.png" alt="Aqua-X-Foul Logo" className="w-12 h-12 object-contain" />
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Aqua-X-Foul</h2>
        <p className="mt-1.5 text-xs text-slate-400 font-medium">
          Cleaner Vessels. <span className="text-[#00c9a7]">Greener Oceans.</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#0c161d] border border-[#162938] hover:border-[#00c9a7]/30 py-8 px-6 shadow-2xl rounded-2xl sm:px-10 card-subtle">
          {error && (
            <div className="mb-4 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs p-3 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Enterprise Email / Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@maritime.com"
                  className="w-full pl-9 pr-3 py-2 bg-[#091117] border border-[#1b3244] focus:border-[#00c9a7] text-white rounded-lg text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#00c9a7] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-9 pr-3 py-2 bg-[#091117] border border-[#1b3244] focus:border-[#00c9a7] text-white rounded-lg text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#00c9a7] transition-colors"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg text-xs font-bold text-slate-950 bg-[#00c9a7] hover:bg-[#02b395] transition-all btn-press shadow-lg shadow-[#00c9a7]/20 disabled:opacity-50"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Demo Access */}
          <div className="mt-6 pt-5 border-t border-[#162938] text-center">
            <button
              onClick={handleDemoLogin}
              className="text-xs text-slate-400 hover:text-[#00c9a7] transition-all btn-press font-medium flex items-center justify-center space-x-1.5 mx-auto"
            >
              <Shield className="w-3.5 h-3.5 text-[#00c9a7]" />
              <span>Use 1-Click Administrator Session (Demo)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
