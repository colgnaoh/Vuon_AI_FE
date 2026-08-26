import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { authService, DEMO_PRESETS } from '@/services/authService';
import { LogIn, UserPlus, Shield, User, Wrench, GraduationCap, ArrowRight, Lock, Mail, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  
  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Sign Up Form State
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupInterest, setSignupInterest] = useState('AI & Machine Learning');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) return;

    setLoading(true);
    setError('');
    try {
      const res = await authService.login({ email: loginEmail, password: loginPassword });
      login(res.token, res.user);
      
      // Redirect depending on role
      if (res.user.globalRole === 'Admin' || res.user.globalRole === 'LabManager') {
        navigate('/admin/dashboard');
      } else {
        navigate('/profile/me');
      }
    } catch {
      setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName || !signupEmail) return;

    setLoading(true);
    setError('');
    try {
      const res = await authService.register({
        fullName: signupName,
        email: signupEmail,
        interests: [signupInterest]
      });
      login(res.token, res.user);
      setSuccessMessage('Tạo tài khoản thành công! Đang chuyển hướng...');
      setTimeout(() => {
        navigate('/profile/me');
      }, 1000);
    } catch {
      setError('Đăng ký tài khoản thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handlePresetLogin = (presetUser: typeof DEMO_PRESETS[0]['user']) => {
    setActiveTab('login');
    setLoginEmail(presetUser.email);
    setLoginPassword('');
    setError('Vui lòng nhập mật khẩu thật để đăng nhập qua hệ thống Supabase.');
  };

  return (
    <div className="page-shell min-h-[80vh] flex flex-col items-center justify-center py-12">
      
      {/* Brand Header */}
      <div className="text-center mb-8 space-y-2">
        <Link to="/" className="inline-flex items-center gap-2 mb-2">
          <img src="/vuon-logo.png" alt="Vuon AI Logo" className="w-10 h-10 object-contain" />
          <span className="font-extrabold text-2xl tracking-tight text-[var(--ink)]">VUON AI SPACE</span>
        </Link>
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--accent)]">
          where ideas grow &bull; authentication portal
        </p>
      </div>

      {/* Main Authentication Card */}
      <div className="w-full max-w-md bg-[var(--paper-bright)] border border-[var(--line)] shadow-[var(--shadow-paper)] p-6 md:p-8 space-y-6">
        
        {/* Tab Switcher: Log In vs Sign Up */}
        <div className="flex border-b border-[var(--line)]">
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setError(''); setSuccessMessage(''); }}
            className={`flex-1 py-3 text-xs font-mono font-bold uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'login'
                ? 'border-[var(--accent-strong)] text-[var(--accent-strong)]'
                : 'border-transparent text-[var(--ink-soft)] hover:text-[var(--ink)]'
            }`}
          >
            <span className="flex items-center justify-center gap-1.5">
              <LogIn className="w-4 h-4" /> Đăng Nhập
            </span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('signup'); setError(''); setSuccessMessage(''); }}
            className={`flex-1 py-3 text-xs font-mono font-bold uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'signup'
                ? 'border-[var(--accent-strong)] text-[var(--accent-strong)]'
                : 'border-transparent text-[var(--ink-soft)] hover:text-[var(--ink)]'
            }`}
          >
            <span className="flex items-center justify-center gap-1.5">
              <UserPlus className="w-4 h-4" /> Tạo Tài Khoản
            </span>
          </button>
        </div>

        {/* Notifications */}
        {error && (
          <div role="alert" className="p-3 bg-rose-50 border-l-2 border-rose-600 text-rose-800 text-xs font-medium">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-emerald-50 border-l-2 border-emerald-600 text-emerald-800 text-xs font-medium flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {successMessage}
          </div>
        )}

        {/* Tab 1: Log In Form */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block font-mono text-[0.65rem] uppercase tracking-wider text-[var(--ink-soft)] font-bold mb-1">
                Địa chỉ Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-soft)]" />
                <input
                  id="login-email"
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@vuonai.space"
                  className="w-full bg-[var(--paper)] border border-[var(--line)] pl-9 pr-3 py-2.5 text-xs text-[var(--ink)] focus:border-[var(--accent-strong)] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="block font-mono text-[0.65rem] uppercase tracking-wider text-[var(--ink-soft)] font-bold mb-1">
                Mật Khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-soft)]" />
                <input
                  id="login-password"
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[var(--paper)] border border-[var(--line)] pl-9 pr-3 py-2.5 text-xs text-[var(--ink)] focus:border-[var(--accent-strong)] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[var(--accent-strong)] hover:bg-[var(--accent)] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[var(--shadow-paper)] disabled:opacity-50"
            >
              {loading ? 'Đang xử lý...' : 'Đăng Nhập Ngay'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Tab 2: Sign Up Form */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignUpSubmit} className="space-y-4">
            <div>
              <label htmlFor="signup-name" className="block font-mono text-[0.65rem] uppercase tracking-wider text-[var(--ink-soft)] font-bold mb-1">
                Họ và Tên
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-soft)]" />
                <input
                  id="signup-name"
                  type="text"
                  required
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full bg-[var(--paper)] border border-[var(--line)] pl-9 pr-3 py-2.5 text-xs text-[var(--ink)] focus:border-[var(--accent-strong)] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="signup-email" className="block font-mono text-[0.65rem] uppercase tracking-wider text-[var(--ink-soft)] font-bold mb-1">
                Địa chỉ Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-soft)]" />
                <input
                  id="signup-email"
                  type="email"
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="your.email@gmail.com"
                  className="w-full bg-[var(--paper)] border border-[var(--line)] pl-9 pr-3 py-2.5 text-xs text-[var(--ink)] focus:border-[var(--accent-strong)] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="signup-password" className="block font-mono text-[0.65rem] uppercase tracking-wider text-[var(--ink-soft)] font-bold mb-1">
                Mật Khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-soft)]" />
                <input
                  id="signup-password"
                  type="password"
                  required
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[var(--paper)] border border-[var(--line)] pl-9 pr-3 py-2.5 text-xs text-[var(--ink)] focus:border-[var(--accent-strong)] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="signup-interest" className="block font-mono text-[0.65rem] uppercase tracking-wider text-[var(--ink-soft)] font-bold mb-1">
                Lĩnh vực quan tâm chính
              </label>
              <select
                id="signup-interest"
                value={signupInterest}
                onChange={(e) => setSignupInterest(e.target.value)}
                className="w-full bg-[var(--paper)] border border-[var(--line)] px-3 py-2.5 text-xs text-[var(--ink)] focus:border-[var(--accent-strong)] focus:outline-none font-mono"
              >
                <option value="AI & Machine Learning">AI & Machine Learning</option>
                <option value="Robotics & ROS2">Robotics & ROS2</option>
                <option value="Edge AI & Embedded">Edge AI & Embedded</option>
                <option value="Computer Vision">Computer Vision</option>
                <option value="IoT & Sensors">IoT & Sensors</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[var(--accent-strong)] hover:bg-[var(--accent)] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[var(--shadow-paper)] disabled:opacity-50"
            >
              {loading ? 'Đang tạo...' : 'Tạo Tài Khoản Mới'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Divider */}
        <div className="relative border-t border-[var(--line)] pt-4">
          <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--paper-bright)] px-3 font-mono text-[0.6rem] uppercase tracking-widest text-[var(--ink-soft)]">
            hoặc đăng nhập nhanh demo 1-click
          </span>
        </div>

        {/* Quick Demo Logins Grid */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          {DEMO_PRESETS.map((preset) => (
            <button
              key={preset.email}
              type="button"
              onClick={() => handlePresetLogin(preset.user)}
              className="p-2.5 border border-[var(--line)] bg-[var(--paper)] hover:bg-[var(--accent-wash)] hover:border-[var(--accent-strong)] text-left transition-all group"
            >
              <div className="flex items-center gap-1.5 mb-1">
                {preset.user.globalRole === 'Admin' && <Shield className="w-3.5 h-3.5 text-purple-600 shrink-0" />}
                {preset.user.globalRole === 'LabManager' && <Wrench className="w-3.5 h-3.5 text-teal-600 shrink-0" />}
                {preset.user.id === 'men-01' && <GraduationCap className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                {preset.user.globalRole === 'Member' && preset.user.id !== 'men-01' && <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                <span className="font-mono text-[0.65rem] font-bold text-[var(--ink)] group-hover:text-[var(--accent-strong)]">
                  {preset.roleLabel}
                </span>
              </div>
              <span className="block truncate font-mono text-[0.58rem] text-[var(--ink-soft)]">
                {preset.email}
              </span>
            </button>
          ))}
        </div>

      </div>

    </div>
  );
};
