import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const AdminLayout: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="tech-card p-8 max-w-md w-full text-center space-y-4 border-rose-300">
          <p className="eyebrow">access / 403</p>
          <h2 className="text-xl font-bold text-slate-900">403 — Access denied</h2>
          <p className="text-sm text-slate-600">
            You need <strong>Admin</strong> or <strong>LabManager</strong> access to open the VUON AI SPACE admin console.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium text-sm transition-all"
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  const adminNav = [
    { name: 'Dashboard Overview', path: '/admin/dashboard', index: '01' },
    { name: 'Equipment inventory', path: '/admin/equipment', index: '02' },
    { name: 'Members & roles', path: '/admin/users', index: '03' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-6 flex flex-col justify-between shadow-xs">
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 font-display">V</div>
            <div>
              <h2 className="text-xs font-extrabold text-slate-900 tracking-wider">ADMIN PORTAL</h2>
              <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase">{user?.globalRole} Control</span>
            </div>
          </div>

          <nav className="space-y-1">
            {adminNav.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    active
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs'
                      : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
                  }`}
                >
                  <span className={`font-mono text-[0.62rem] ${active ? 'text-emerald-600' : 'text-slate-400'}`}>{item.index}</span>
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-200">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-mono font-bold text-slate-500 hover:text-emerald-700 transition-colors"
          >
            Back to main website
          </Link>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
