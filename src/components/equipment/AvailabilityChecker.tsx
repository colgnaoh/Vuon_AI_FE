import React, { useState } from 'react';
import { equipmentService } from '@/services/equipmentService';
import { CalendarSearch, CheckCircle2, XCircle, Clock } from 'lucide-react';

interface AvailabilityCheckerProps {
  equipmentId: string;
}

export const AvailabilityChecker: React.FC<AvailabilityCheckerProps> = ({ equipmentId }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ checked: boolean; isAvailable: boolean } | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) return;

    if (startDate > endDate) {
      alert('Ngày bắt đầu không thể sau ngày kết thúc.');
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const res = await equipmentService.checkAvailability(equipmentId, startDate, endDate);
      setResult({ checked: true, isAvailable: res.isAvailable });
    } catch {
      setResult({ checked: true, isAvailable: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
      <div className="flex items-center gap-2 text-white font-bold text-sm">
        <CalendarSearch className="w-4 h-4 text-teal-400" />
        <span>Kiểm Tra Lịch Khả Dụng Thiết Bị</span>
      </div>

      <form onSubmit={handleCheck} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1 uppercase font-semibold">Từ ngày</label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1 uppercase font-semibold">Đến ngày</label>
            <input
              type="date"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 font-semibold text-xs rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Clock className="w-3.5 h-3.5 animate-spin" /> Đang kiểm tra...
            </>
          ) : (
            'Kiểm tra khả dụng'
          )}
        </button>
      </form>

      {/* Result Badge */}
      {result && result.checked && (
        <div className="pt-2">
          {result.isAvailable ? (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Thiết bị sẵn sàng cho mượn trong khoảng thời gian này!</span>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
              <XCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>Thiết bị đã có người mượn hoặc không sẵn sàng trong khoảng thời gian này.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
