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
      <header className="border-b border-gray-800 pb-5">
        <h1 className="text-2xl font-bold text-white">Quản lý Phê duyệt Ý tưởng Dự án</h1>
        <p className="text-sm text-gray-400 mt-1">Duyệt đề xuất ý tưởng của thành viên trước khi công khai lên Idea Board.</p>
      </header>

      {loading ? (
        <LoadingState message="Đang tải danh sách ý tưởng..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchIdeas} />
      ) : ideas.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-gray-800 rounded-2xl">
          <p className="text-gray-400 text-sm">Chưa có ý tưởng nào đăng ký.</p>
        </div>
      ) : (
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-gray-950/80 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-800">
                <tr>
                  <th className="px-6 py-4">Tên Ý tưởng</th>
                  <th className="px-6 py-4">Tác giả</th>
                  <th className="px-6 py-4">Công nghệ</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/80">
                {ideas.map((idea) => (
                  <tr key={idea.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-white">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                        <div>
                          <div>{idea.title}</div>
                          <div className="text-xs text-gray-400 font-normal line-clamp-1 mt-0.5">{idea.summary}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <span>{idea.authorName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {idea.requiredTech.map(tech => (
                          <span key={tech} className="bg-gray-950 text-gray-300 text-[10px] px-2 py-0.5 rounded border border-gray-800">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        idea.status === 'Open'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-gray-800 text-gray-400'
                      }`}>
                        {idea.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleApprove(idea.id)}
                          disabled={processingId === idea.id}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Phê duyệt
                        </button>
                        <button
                          onClick={() => handleReject(idea.id)}
                          disabled={processingId === idea.id}
                          className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1"
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
