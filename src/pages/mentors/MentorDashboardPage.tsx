import React, { useEffect, useState } from 'react';
import { mentorService } from '@/services/mentorService';
import { MentorRequest, MentorRequestStatus } from '@/types';
import { LoadingState, ErrorState } from '@/components/AsyncState';
import { CheckCircle2, XCircle, Clock, UserCheck, FolderGit2, MessageSquare, Calendar } from 'lucide-react';

export const MentorDashboardPage: React.FC = () => {
  const [requests, setRequests] = useState<MentorRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | MentorRequestStatus>('Pending');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    void fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await mentorService.getMyMentorRequests();
      setRequests(data);
    } catch {
      setError('Không thể tải danh sách yêu cầu hướng dẫn.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId: string, status: MentorRequestStatus) => {
    setUpdatingId(requestId);
    try {
      const updated = await mentorService.updateRequestStatus(requestId, status);
      setRequests((prev) =>
        prev.map((req) => (req.id === requestId ? { ...req, status: updated.status } : req))
      );
    } catch {
      alert('Cập nhật trạng thái thất bại. Vui lòng thử lại.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredRequests = requests.filter((req) => {
    if (activeTab === 'All') return true;
    return req.status === activeTab;
  });

  const getStatusBadge = (status: MentorRequestStatus) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-300 px-2.5 py-1 rounded-full text-xs font-mono font-bold">
            <Clock className="w-3.5 h-3.5" /> Chờ phản hồi
          </span>
        );
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1 bg-[var(--accent-wash)] text-[var(--accent-strong)] border border-[var(--accent-soft)] px-2.5 py-1 rounded-full text-xs font-mono font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Đã chấp nhận
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-800 border border-rose-200 px-2.5 py-1 rounded-full text-xs font-mono font-bold">
            <XCircle className="w-3.5 h-3.5" /> Đã từ chối
          </span>
        );
    }
  };

  const pendingCount = requests.filter((r) => r.status === 'Pending').length;
  const approvedCount = requests.filter((r) => r.status === 'Approved').length;

  return (
    <div className="page-shell">
      <header className="page-head">
        <div>
          <p className="page-kicker">Mentor Portal / Requests Management</p>
          <h1 className="page-title">Bảng điều khiển Mentor.</h1>
          <p className="page-intro">
            Quản lý và phản hồi các yêu cầu tư vấn, hướng dẫn nghiên cứu từ sinh viên và các nhóm dự án tại VUON AI SPACE.
          </p>
        </div>
      </header>

      {/* Stats Summary & Filter Tabs */}
      <div className="my-8 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border-b border-[var(--line)] pb-6">
        <div className="filter-row !border-0 !p-0">
          {(['Pending', 'Approved', 'Rejected', 'All'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`filter-chip ${activeTab === tab ? '!bg-[var(--accent)] !text-white' : ''}`}
            >
              {tab === 'Pending' && `Chờ duyệt (${pendingCount})`}
              {tab === 'Approved' && `Đã nhận (${approvedCount})`}
              {tab === 'Rejected' && 'Đã từ chối'}
              {tab === 'All' && `Tất cả (${requests.length})`}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingState message="Đang tải danh sách yêu cầu tư vấn..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchRequests} />
      ) : filteredRequests.length === 0 ? (
        <div className="empty-state py-16 text-center border border-dashed border-[var(--line)] rounded-2xl">
          <UserCheck className="w-12 h-12 text-[var(--accent)] mx-auto mb-3" />
          <p className="text-[var(--ink)] font-bold text-base mb-1">Không có yêu cầu nào trong mục này</p>
          <p className="text-[var(--ink-soft)] text-xs font-mono">Các đề xuất hướng dẫn mới từ sinh viên sẽ hiển thị tại đây.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className="tech-card bg-[var(--paper-bright)] border border-[var(--line)] hover:border-[var(--accent)] rounded-2xl p-6 transition-all duration-200"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-[var(--line)]">
                {/* Student Info */}
                <div className="flex items-center gap-3">
                  {req.studentAvatar ? (
                    <img
                      src={req.studentAvatar}
                      alt={req.studentName}
                      className="w-12 h-12 rounded-full object-cover border border-[var(--line)]"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[var(--accent-soft)] text-[var(--accent-strong)] font-bold text-base flex items-center justify-center">
                      {req.studentName.charAt(0)}
                    </div>
                  )}

                  <div>
                    <h3 className="text-base font-bold text-[var(--ink)]">{req.studentName}</h3>
                    <p className="text-xs text-[var(--ink-soft)] font-mono flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-[var(--accent)]" />
                      Gửi lúc: {new Date(req.createdAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>

                <div>{getStatusBadge(req.status)}</div>
              </div>

              {/* Request Details */}
              <div className="space-y-3 mb-5">
                {req.projectTitle && (
                  <div className="flex items-start gap-2 text-xs bg-[var(--accent-wash)] border border-[var(--accent-soft)] p-2.5 rounded-lg text-[var(--accent-strong)] font-mono">
                    <FolderGit2 className="w-4 h-4 shrink-0 text-[var(--accent)] mt-0.5" />
                    <div>
                      <span className="font-bold">Dự án liên quan: </span>
                      {req.projectTitle}
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-2 text-sm text-[var(--ink)] font-bold">
                  <MessageSquare className="w-4 h-4 shrink-0 text-[var(--accent)] mt-0.5" />
                  <div>
                    <span className="text-[var(--ink-soft)] font-normal">Chủ đề: </span>
                    {req.topic}
                  </div>
                </div>

                <p className="text-xs text-[var(--ink)] bg-[var(--paper)] p-3.5 rounded-xl border border-[var(--line)] leading-relaxed">
                  {req.description}
                </p>
              </div>

              {/* Actions */}
              {req.status === 'Pending' && (
                <div className="flex items-center justify-end gap-3 border-t border-[var(--line)] pt-4">
                  <button
                    disabled={updatingId === req.id}
                    onClick={() => handleStatusUpdate(req.id, 'Rejected')}
                    className="btn-secondary text-xs !text-rose-700 !border-rose-300 hover:!bg-rose-50"
                  >
                    Từ chối
                  </button>

                  <button
                    disabled={updatingId === req.id}
                    onClick={() => handleStatusUpdate(req.id, 'Approved')}
                    className="btn-primary text-xs disabled:opacity-50"
                  >
                    {updatingId === req.id ? 'Đang xử lý...' : 'Chấp nhận hướng dẫn'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
