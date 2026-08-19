import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  Sprout, 
  Lightbulb, 
  FolderGit2, 
  Wrench, 
  Calendar, 
  Users, 
  ShieldAlert, 
  LogOut, 
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  Clock
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Directory', path: '/directory', icon: Users },
    { name: 'Ý Tưởng (Ideas)', path: '/ideas', icon: Lightbulb },
    { name: 'Dự Án (Projects)', path: '/projects', icon: FolderGit2 },
    { name: 'Kho Thiết Bị', path: '/equipment', icon: Wrench },
    { name: 'Sự Kiện', path: '/events', icon: Calendar },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-amber-500 p-[1px] shadow-md shadow-emerald-500/20">
              <div className="w-full h-full bg-white rounded-[11px] flex items-center justify-center group-hover:bg-transparent transition-all">
                <Sprout className="w-5 h-5 text-emerald-600 group-hover:text-white transition-colors" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-emerald-700 via-teal-700 to-amber-600 bg-clip-text text-transparent">
                VUON <span className="text-emerald-600">AI SPACE</span>
              </span>
              <span className="block text-[10px] text-slate-500 font-mono tracking-widest uppercase">Where Ideas Grow</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    active
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-xs'
                      : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-emerald-600' : 'text-slate-400'}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* User Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border transition-all ${
                    userMenuOpen 
                      ? 'bg-slate-100 border-slate-300 shadow-inner' 
                      : 'bg-slate-50 border-slate-200/80 hover:border-emerald-300 hover:bg-white shadow-2xs'
                  }`}
                >
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.fullName} className="w-7 h-7 rounded-full object-cover ring-2 ring-emerald-500/20" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-800 leading-tight">{user.fullName}</span>
                    {isAdmin && (
                      <span className="text-[9px] font-extrabold text-amber-600 tracking-wider uppercase">Admin</span>
                    )}
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${userMenuOpen ? 'rotate-180 text-emerald-600' : ''}`} />
                </button>

                {/* User Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* User Header */}
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Tài khoản</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{user.fullName}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>

                    {/* Navigation items */}
                    <div className="py-1">
                      <Link
                        to="/profile/me"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-700 font-medium transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-slate-400" />
                        Hồ sơ cá nhân
                      </Link>
                      <Link
                        to="/my-bookings"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-700 font-medium transition-colors"
                      >
                        <Clock className="w-4 h-4 text-slate-400" />
                        Lịch mượn thiết bị
                      </Link>
                    </div>

                    {/* Admin Portal section if Admin */}
                    {isAdmin && (
                      <>
                        <div className="border-t border-slate-100 my-1"></div>
                        <div className="px-2 py-0.5">
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 transition-all shadow-2xs"
                          >
                            <ShieldAlert className="w-4 h-4 text-amber-600" />
                            <span>Admin Portal</span>
                          </Link>
                        </div>
                      </>
                    )}

                    <div className="border-t border-slate-100 my-1"></div>
                    <div className="px-1">
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-emerald-700 transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-lg shadow-md shadow-emerald-600/20 transition-all"
                >
                  Tham gia Lab
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-semibold text-slate-700 hover:bg-slate-100"
            >
              {link.name}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-bold text-amber-800 bg-amber-50 border border-amber-200"
            >
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              Admin Portal
            </Link>
          )}

          <div className="pt-4 border-t border-slate-200 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile/me"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-slate-700 font-semibold"
                >
                  <UserIcon className="w-4 h-4 text-emerald-600" /> Hồ sơ cá nhân ({user?.fullName})
                </Link>
                <Link
                  to="/my-bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-slate-700 font-semibold"
                >
                  <Clock className="w-4 h-4 text-emerald-600" /> Lịch mượn thiết bị
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-md font-semibold"
                >
                  <LogOut className="w-4 h-4" /> Đăng xuất
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-slate-700 bg-slate-100 rounded-lg font-semibold"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-white bg-emerald-600 rounded-lg font-semibold"
                >
                  Tham gia Lab
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

