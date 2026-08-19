import React, { useState, useEffect } from 'react';
import { equipmentService } from '@/services/equipmentService';
import { Booking } from '@/types';
import { Wrench, Calendar, CheckCircle2, RotateCcw, Clock } from 'lucide-react';

export const MyBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    setLoading(true);
    try {
      const data = await equipmentService.getMyBookings();
      setBookings(data);
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  const handleReturnEquipment = async (bookingId: string) => {
    if (!window.confirm('Xác nhận bạn đã bàn giao và trả thiết bị về cho Lab Manager?')) return;

    try {
      await equipmentService.returnEquipment(bookingId);
      alert('Đã cập nhật trạng thái: Đã trả thiết bị.');
      fetchMyBookings();
    } catch {
      // Handled
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-mono font-bold">
          <Calendar className="w-3.5 h-3.5 text-emerald-600" /> MY EQUIPMENT BOOKINGS
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Lịch Sử Mượn Thiết Bị Của Tôi</h1>
        <p className="text-sm text-slate-600">
          Theo dõi hạn mượn, mục đích sử dụng và thực hiện thủ tục trả thiết bị về kho chung VUON AI SPACE.
        </p>
      </div>

      {/* Bookings Table */}
      {loading ? (
        <div className="text-center py-20 text-slate-500 text-sm">Đang tải danh sách lịch mượn...</div>
      ) : bookings.length === 0 ? (
        <div className="tech-card p-12 text-center text-slate-600">Bạn chưa từng đặt mượn thiết bị nào.</div>
      ) : (
        <div className="tech-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs uppercase font-mono font-bold text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Tên Thiết Bị</th>
                  <th className="px-6 py-4">Ngày Mượn → Ngày Trả</th>
                  <th className="px-6 py-4">Mục Đích</th>
                  <th className="px-6 py-4">Trạng Thái</th>
                  <th className="px-6 py-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {bookings.map((bk) => (
                  <tr key={bk.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-emerald-600 shrink-0" />
                      {bk.equipmentName}
                    </td>

                    <td className="px-6 py-4 text-xs font-mono font-bold text-slate-700">
                      {bk.startDate} <span className="text-slate-400">→</span> {bk.endDate}
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-600 max-w-xs truncate font-medium">
                      {bk.purpose}
                    </td>

                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                        bk.status === 'Active'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}>
                        {bk.status === 'Active' ? 'Đang Mượn' : 'Đã Trả Về Lab'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      {bk.status === 'Active' ? (
                        <button
                          onClick={() => handleReturnEquipment(bk.id)}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold rounded-lg inline-flex items-center gap-1.5 transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-emerald-600" /> Báo Trả Thiết Bị
                        </button>
                      ) : (
                        <span className="text-xs text-slate-500 font-mono font-bold">Hoàn thành</span>
                      )}
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
