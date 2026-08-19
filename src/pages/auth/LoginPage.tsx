import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/authService';
import { Sprout, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');

    try {
      const res = await authService.login({ email, password });
      login(res.token, res.user);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError('Email hoặc mật khẩu không chính xác.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoAdmin = () => {
    setEmail('admin@vuon.ai');
    setPassword('admin123');
  };

  const handleQuickDemoMember = () => {
    setEmail('alex@vuon.ai');
    setPassword('member123');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#F8FAFC]">
      <div className="max-w-md w-full space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-700 mb-2 shadow-2xs">
            <Sprout className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Đăng Nhập VUON AI SPACE</h1>
          <p className="text-sm text-slate-600">
            Truy cập hệ thống quản lý dự án, kho thiết bị lab và cộng đồng sáng tạo.
          </p>
        </div>

        {/* Form Card */}
        <div className="tech-card p-8 space-y-6">
          
          {error && (
            <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-700 mb-1.5 uppercase tracking-wider font-bold">Email Cộng Đồng</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@vuon.ai"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 focus:border-emerald-500 rounded-lg text-sm text-slate-900 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-700 mb-1.5 uppercase tracking-wider font-bold">Mật Khẩu</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 focus:border-emerald-500 rounded-lg text-sm text-slate-900 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-lg text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? 'Đang xác thực...' : 'Đăng Nhập'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials for Reviewer */}
          <div className="pt-4 border-t border-slate-200 space-y-2">
            <span className="block text-[11px] font-mono text-slate-500 uppercase text-center font-bold">Thử nghiệm nhanh (Demo Presets):</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleQuickDemoMember}
                className="py-1.5 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded text-xs text-emerald-800 font-mono text-center font-bold transition-colors"
              >
                Member Demo
              </button>
              <button
                type="button"
                onClick={handleQuickDemoAdmin}
                className="py-1.5 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded text-xs text-amber-800 font-mono flex items-center justify-center gap-1 font-bold transition-colors"
              >
                <ShieldCheck className="w-3 h-3" /> Admin Demo
              </button>
            </div>
          </div>

        </div>

        <p className="text-center text-xs text-slate-600">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-emerald-700 hover:underline font-bold">
            Đăng ký thành viên mới
          </Link>
        </p>

      </div>
    </div>
  );
};
