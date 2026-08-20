import React, { useEffect, useState } from 'react';
import { LoadingState, ErrorState } from '@/components/AsyncState';
import { adminService } from '@/services/adminService';
import { AdminProjectApproval } from '@/types';
import { CheckCircle2, XCircle, Rocket, User } from 'lucide-react';

export const AdminProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<AdminProjectApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    void fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminService.getAdminProjects();
      setProjects(data);
    } catch {
      setError('Không thể tải danh sách dự án.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      await adminService.approveProject(id);
      setProjects(prev => prev.map(p => p.id === id ? { ...p, status: 'Building' } : p));
    } catch {
      setError('Không thể phê duyệt dự án.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setProcessingId(id);
    try {
      await adminService.rejectProject(id);
      setProjects(prev => prev.map(p => p.id === id ? { ...p, status: 'Paused' } : p));
    } catch {
      setError('Không thể từ chối dự án.');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <header className="border-b border-gray-800 pb-5">
        <h1 className="text-2xl font-bold text-white">Quản lý Phê duyệt Dự án Thực nghiệm</h1>
        <p className="text-sm text-gray-400 mt-1">Duyệt cấp quyền triển khai các dự án chính thức trong lab.</p>
      </header>

      {loading ? (
        <LoadingState message="Đang tải danh sách dự án..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchProjects} />
      ) : projects.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-gray-800 rounded-2xl">
          <p className="text-gray-400 text-sm">Chưa có dự án nào đăng ký.</p>
        </div>
      ) : (
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-gray-950/80 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-800">
                <tr>
                  <th className="px-6 py-4">Tên Dự án</th>
                  <th className="px-6 py-4">Trưởng nhóm (Leader)</th>
                  <th className="px-6 py-4">Lĩnh vực</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/80">
                {projects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-white">
                      <div className="flex items-center gap-2">
                        <Rocket className="w-4 h-4 text-purple-400 shrink-0" />
                        <div>
                          <div>{proj.title}</div>
                          <div className="text-xs text-gray-400 font-normal line-clamp-1 mt-0.5">{proj.summary}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <span>{proj.leaderName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-purple-950/80 text-purple-300 text-xs px-2.5 py-1 rounded-md border border-purple-800">
                        {proj.domainCategory}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        proj.status === 'Building' || proj.status === 'Recruiting'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-gray-800 text-gray-400'
                      }`}>
                        {proj.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleApprove(proj.id)}
                          disabled={processingId === proj.id}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Duyệt dự án
                        </button>
                        <button
                          onClick={() => handleReject(proj.id)}
                          disabled={processingId === proj.id}
                          className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Tạm dừng
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
