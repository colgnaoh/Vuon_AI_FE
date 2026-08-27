import React, { useEffect, useState } from 'react';
import { LoadingState, ErrorState } from '@/components/AsyncState';
import { adminService } from '@/services/adminService';
import { AdminBookingApproval } from '@/types';
import { CheckCircle2, XCircle, Clock, Calendar, User, Package, AlertCircle } from 'lucide-react';

export const AdminBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<AdminBookingApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('Pending');

  // Reject Modal state
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    void fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminService.getPendingBookings();
      setBookings(data);
    } catch {
      setError('Không thể tải danh sách đơn đăng ký mượn thiết bị.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      await adminService.approveBooking(id);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'Active' } : b));
    } catch {
      setError('Không thể phê duyệt đơn. Vui lòng thử lại.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectId) return;
    setProcessingId(rejectId);
    try {
      await adminService.rejectBooking(rejectId, rejectReason);
      setBookings(prev => prev.map(b => b.id === rejectId ? { ...b, status: 'Cancelled' } : b));
      setRejectId(null);
      setRejectReason('');
    } catch {
      setError('Không thể từ chối đơn.');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (filterStatus === 'Pending') return b.status === 'Pending';
    if (filterStatus === 'Active') return b.status === 'Active';
    if (filterStatus === 'History') return b.status === 'Returned' || b.status === 'Cancelled';
    return true;
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Quản lý Phê duyệt Đơn mượn Thiết bị</h1>
          <p className="text-xs text-slate-600 mt-1">Duyệt hoặc từ chối các yêu cầu mượn tài nguyên phần cứng trong phòng Lab.</p>
        </div>
      </header>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="tech-card p-4">
          <div className="text-xs font-mono font-bold text-slate-500 uppercase">Chờ phê duyệt</div>
          <div className="text-2xl font-extrabold text-amber-600 font-mono mt-1">
            {bookings.filter(b => b.status === 'Pending').length}
          </div>
        </div>
        <div className="tech-card p-4">
          <div className="text-xs font-mono font-bold text-slate-500 uppercase">Đang hoạt động</div>
          <div className="text-2xl font-extrabold text-emerald-600 font-mono mt-1">
            {bookings.filter(b => b.status === 'Active').length}
          </div>
        </div>
        <div className="tech-card p-4">
          <div className="text-xs font-mono font-bold text-slate-500 uppercase">Đã trả / Lịch sử</div>
          <div className="text-2xl font-extrabold text-blue-600 font-mono mt-1">
            {bookings.filter(b => b.status === 'Returned' || b.status === 'ReturnedLate').length}
          </div>
        </div>
        <div className="tech-card p-4">
          <div className="text-xs font-mono font-bold text-slate-500 uppercase">Tổng đơn đăng ký</div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">{bookings.length}</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-3">
        {['Pending', 'Active', 'History'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filterStatus === st
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:text-emerald-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {st === 'Pending' ? 'Chờ duyệt' : st === 'Active' ? 'Đang mượn' : 'Lịch sử trả / hủy'}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingState message="Đang danh sách đơn mượn..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchBookings} />
      ) : filteredBookings.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-slate-300 rounded-2xl bg-white">
          <p className="text-slate-500 text-xs font-mono">Không có đơn mượn nào ở trạng thái này.</p>
        </div>
      ) : (
        <div className="tech-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs font-mono font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Thiết bị</th>
                  <th className="px-6 py-4">Người mượn</th>
                  <th className="px-6 py-4">Thời gian mượn</th>
                  <th className="px-6 py-4">Mục đích</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-2">
                      <Package className="w-4 h-4 text-emerald-600 shrink-0" />
                      {b.equipmentName}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{b.userName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-600">
                      <div>{b.startDate}</div>
                      <div className="text-slate-400">đến {b.endDate}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600 max-w-xs truncate">
                      {b.purpose}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono font-bold ${
                        b.status === 'Pending'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : b.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-100 text-slate-700 border border-slate-300'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {b.status === 'Pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleApprove(b.id)}
                            disabled={processingId === b.id}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs transition-all flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Duyệt
                          </button>
                          <button
                            onClick={() => setRejectId(b.id)}
                            disabled={processingId === b.id}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Từ chối
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 font-mono">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-extrabold text-slate-900 mb-1">Từ chối đơn đăng ký mượn</h3>
            <p className="text-xs text-slate-600 mb-4">Vui lòng nhập lý do từ chối để gửi thông báo cho thành viên.</p>
            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <textarea
                required
                rows={3}
                placeholder="Ví dụ: Thiết bị đang trong đợt bảo trì định kỳ..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
              />
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectId(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-sm transition-colors"
                >
                  Xác nhận từ chối
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
