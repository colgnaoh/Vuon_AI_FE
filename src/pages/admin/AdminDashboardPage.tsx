import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '@/services/adminService';
import { SystemMetrics } from '@/types';
import { Users, Lightbulb, FolderGit2, Wrench, ShieldAlert, Cpu, ArrowUpRight } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const data = await adminService.getMetrics();
      setMetrics(data);
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  if (loading || !metrics) {
    return <div className="text-center py-20 text-slate-500 text-sm">Đang tải số liệu hệ thống...</div>;
  }

  const statCards = [
    { label: 'Tổng Số Thành Viên', value: metrics.totalUsers, icon: Users, color: 'text-teal-700', link: '/admin/users' },
    { label: 'Tổng Số Ý Tưởng', value: metrics.totalIdeas, icon: Lightbulb, color: 'text-amber-700', link: '/ideas' },
    { label: 'Dự Án Đang Phát Triển', value: metrics.activeProjects, icon: FolderGit2, color: 'text-emerald-700', link: '/projects' },
    { label: 'Lượt Mượn Thiết Bị Active', value: metrics.activeBookings, icon: Wrench, color: 'text-cyan-700', link: '/admin/equipment' },
    { label: 'Tổng Thiết Bị Kho Lab', value: metrics.totalEquipment, icon: Cpu, color: 'text-violet-700', link: '/admin/equipment' },
  ];

  return (
    <div className="space-y-8">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-emerald-600" /> Bảng Điều Khiển Hệ Thống (System Metrics)
          </h1>
          <p className="text-xs text-slate-600 mt-1">Thống kê dữ liệu hoạt động thời gian thực tại VUON AI SPACE.</p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              to={card.link}
              className="tech-card p-6 flex items-center justify-between group hover:border-emerald-400"
            >
              <div className="space-y-1">
                <span className="text-xs font-mono text-slate-500 font-bold uppercase block">{card.label}</span>
                <span className={`text-3xl font-extrabold font-mono ${card.color}`}>{card.value}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 group-hover:text-emerald-700 group-hover:border-emerald-300 transition-colors">
                <Icon className="w-6 h-6" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Action Shortcuts */}
      <div className="tech-card p-6 space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider font-mono">Tác Vụ Quản Trị Nhanh</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/admin/equipment"
            className="p-4 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 flex items-center justify-between text-slate-800 transition-colors group shadow-2xs"
          >
            <div>
              <span className="font-bold text-sm block group-hover:text-emerald-700 transition-colors">Thêm Thiết Bị Mới Vào Kho Lab</span>
              <span className="text-xs text-slate-600">Nhập Jetson, Raspberry Pi, Máy in 3D hay cảm biến mới</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            to="/admin/users"
            className="p-4 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 flex items-center justify-between text-slate-800 transition-colors group shadow-2xs"
          >
            <div>
              <span className="font-bold text-sm block group-hover:text-emerald-700 transition-colors">Phân Quyền Role Người Dùng</span>
              <span className="text-xs text-slate-600">Cập nhật GlobalRole (Member, LabManager, Admin)</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

    </div>
  );
};
