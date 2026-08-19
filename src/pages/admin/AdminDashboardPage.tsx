import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '@/services/adminService';
import { SystemMetrics } from '@/types';
import { ErrorState, LoadingState } from '@/components/AsyncState';

export const AdminDashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminService.getMetrics();
      setMetrics(data);
    } catch {
      setError('System metrics could not be loaded.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Loading system metrics..." />;
  if (error || !metrics) return <ErrorState message={error || 'No system data available.'} onRetry={fetchMetrics} />;

  const statCards = [
    { label: 'Total members', value: metrics.totalUsers, link: '/admin/users' },
    { label: 'Total ideas', value: metrics.totalIdeas, link: '/ideas' },
    { label: 'Active projects', value: metrics.activeProjects, link: '/projects' },
    { label: 'Active equipment bookings', value: metrics.activeBookings, link: '/admin/equipment' },
    { label: 'Total lab equipment', value: metrics.totalEquipment, link: '/admin/equipment' },
  ];

  return (
    <div className="space-y-8">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            System dashboard
          </h1>
          <p className="text-xs text-slate-600 mt-1">Real-time activity across VUON AI SPACE.</p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, idx) => {
          return (
            <Link
              key={idx}
              to={card.link}
              className="tech-card p-6 flex items-center justify-between group hover:border-emerald-400"
            >
              <div className="space-y-1">
                <span className="text-xs font-mono text-slate-500 font-bold uppercase block">{card.label}</span>
                <span className="text-3xl font-extrabold font-mono text-[var(--accent-strong)]">{card.value}</span>
              </div>
              <span className="font-mono text-[0.62rem] uppercase tracking-widest text-slate-400">open</span>
            </Link>
          );
        })}
      </div>

      {/* Quick Action Shortcuts */}
      <div className="tech-card p-6 space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider font-mono">Quick admin actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/admin/equipment"
            className="p-4 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 flex items-center justify-between text-slate-800 transition-colors group shadow-2xs"
          >
            <div>
              <span className="font-bold text-sm block group-hover:text-emerald-700 transition-colors">Add new equipment to the lab</span>
              <span className="text-xs text-slate-600">Add Jetson, Raspberry Pi, 3D printers or new sensors</span>
            </div>
            <span className="font-mono text-[0.62rem] text-slate-400">01</span>
          </Link>

          <Link
            to="/admin/users"
            className="p-4 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 flex items-center justify-between text-slate-800 transition-colors group shadow-2xs"
          >
            <div>
              <span className="font-bold text-sm block group-hover:text-emerald-700 transition-colors">Manage user roles</span>
              <span className="text-xs text-slate-600">Update GlobalRole (Member, LabManager, Admin)</span>
            </div>
            <span className="font-mono text-[0.62rem] text-slate-400">02</span>
          </Link>
        </div>
      </div>

    </div>
  );
};
