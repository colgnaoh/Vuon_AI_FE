import React, { useEffect, useState } from 'react';
import { LoadingState, ErrorState } from '@/components/AsyncState';
import { adminService } from '@/services/adminService';
import { AdminIdeaApproval } from '@/types';
import { CheckCircle2, XCircle, Lightbulb, User, Calendar } from 'lucide-react';

export const AdminIdeasPage: React.FC = () => {
  const [ideas, setIdeas] = useState<AdminIdeaApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    void fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminService.getAdminIdeas();
      setIdeas(data);
    } catch {
      setError('Không thể tải danh sách ý tưởng.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      await adminService.approveIdea(id);
      setIdeas(prev => prev.map(i => i.id === id ? { ...i, status: 'Open' } : i));
    } catch {
      setError('Không thể phê duyệt ý tưởng.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setProcessingId(id);
    try {
      await adminService.rejectIdea(id);
      setIdeas(prev => prev.map(i => i.id === id ? { ...i, status: 'Closed' } : i));
    } catch {
      setError('Không thể từ chối ý tưởng.');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <header className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-extrabold text-slate-900">Quản lý Phê duyệt Ý tưởng Dự án</h1>
        <p className="text-xs text-slate-600 mt-1">Duyệt đề xuất ý tưởng của thành viên trước khi công khai lên Idea Board.</p>
      </header>

      {loading ? (
        <LoadingState message="Đang tải danh sách ý tưởng..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchIdeas} />
      ) : ideas.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-slate-300 rounded-2xl bg-white">
          <p className="text-slate-500 text-xs font-mono">Chưa có ý tưởng nào đăng ký.</p>
        </div>
      ) : (
        <div className="tech-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs font-mono font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Tên Ý tưởng</th>
                  <th className="px-6 py-4">Tác giả</th>
                  <th className="px-6 py-4">Công nghệ</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {ideas.map((idea) => (
                  <tr key={idea.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                        <div>
                          <div className="text-slate-900 font-extrabold">{idea.title}</div>
                          <div className="text-xs text-slate-500 font-normal line-clamp-1 mt-0.5">{idea.summary}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{idea.authorName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {idea.requiredTech.map(tech => (
                          <span key={tech} className="bg-slate-100 text-slate-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-slate-200">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono font-bold ${
                        idea.status === 'Open'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-100 text-slate-700 border border-slate-300'
                      }`}>
                        {idea.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleApprove(idea.id)}
                          disabled={processingId === idea.id}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs transition-all flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Phê duyệt
                        </button>
                        <button
                          onClick={() => handleReject(idea.id)}
                          disabled={processingId === idea.id}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Từ chối
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
