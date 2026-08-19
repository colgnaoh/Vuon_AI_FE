import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/authService';
import { Sprout, User, Mail, Sparkles, CheckCircle2 } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['AI']);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const interestsOptions = ['AI', 'Robotics', 'IoT', 'Embedded System', 'Software', 'Maker'];

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;

    setLoading(true);

    try {
      const res = await authService.register({ fullName, email, interests: selectedInterests });
      login(res.token, res.user);
      navigate('/directory');
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#F8FAFC]">
      <div className="max-w-md w-full space-y-8">
        
        <div className="text-center space-y-3">
          <div className="inline-flex p-3 rounded-2xl bg-teal-100 border border-teal-300 text-teal-700 mb-2 shadow-2xs">
            <Sprout className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Gia Nhập VUON AI SPACE</h1>
          <p className="text-sm text-slate-600">
            Trở thành một phần của cộng đồng ươm mầm sản phẩm công nghệ thực tế.
          </p>
        </div>

        <div className="tech-card p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-xs font-mono text-slate-700 mb-1.5 uppercase tracking-wider font-bold">Họ và Tên</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 focus:border-emerald-500 rounded-lg text-sm text-slate-900 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-700 mb-1.5 uppercase tracking-wider font-bold">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 focus:border-emerald-500 rounded-lg text-sm text-slate-900 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-700 mb-2 uppercase tracking-wider font-bold">Lĩnh Vực Đam Mê</label>
              <div className="flex flex-wrap gap-2">
                {interestsOptions.map((item) => {
                  const active = selectedInterests.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleInterest(item)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                        active
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {active && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-lg text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {loading ? 'Đang khởi tạo hồ sơ...' : 'Đăng Ký Thành Viên'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-600">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-emerald-700 hover:underline font-bold">
            Đăng nhập ngay
          </Link>
        </p>

      </div>
    </div>
  );
};
