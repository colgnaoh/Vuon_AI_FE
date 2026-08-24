import React, { useEffect, useState } from 'react';
import { Dialog } from '@/components/Dialog';
import { eventService } from '@/services/eventService';
import { EventAttendee, TechEvent } from '@/types';
import { Search, CheckCircle2, UserCheck, Clock } from 'lucide-react';

interface EventCheckinModalProps {
  event: TechEvent;
  open: boolean;
  onClose: () => void;
}

export const EventCheckinModal: React.FC<EventCheckinModalProps> = ({ event, open, onClose }) => {
  const [attendees, setAttendees] = useState<EventAttendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [checkinProgressId, setCheckinProgressId] = useState<string | null>(null);

  useEffect(() => {
    if (open && event.id) {
      void fetchAttendees();
    }
  }, [open, event.id]);

  const fetchAttendees = async () => {
    setLoading(true);
    try {
      const data = await eventService.getEventAttendees(event.id);
      setAttendees(data);
    } catch {
      // Fallback handled inside service
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (attendeeUserId: string) => {
    setCheckinProgressId(attendeeUserId);
    try {
      await eventService.checkInAttendee(event.id, attendeeUserId);
      setAttendees((prev) =>
        prev.map((a) =>
          a.userId === attendeeUserId
            ? { ...a, isCheckedIn: true, checkedInAt: new Date().toISOString() }
            : a
        )
      );
    } catch {
      alert('Điểm danh thất bại. Vui lòng thử lại.');
    } finally {
      setCheckinProgressId(null);
    }
  };

  const filteredAttendees = attendees.filter(
    (a) =>
      a.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.email && a.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const checkedInCount = attendees.filter((a) => a.isCheckedIn).length;

  return (
    <Dialog open={open} onClose={onClose} title={`Điểm danh tham gia — ${event.title}`} size="lg">
      <div className="space-y-4">
        {/* Event Stats Summary */}
        <div className="flex items-center justify-between p-3 bg-[var(--accent-wash)] border border-[var(--accent-soft)] rounded-xl text-xs font-mono text-[var(--accent-strong)]">
          <div>
            <span>Đã đăng ký: <strong>{attendees.length} sinh viên</strong></span>
          </div>
          <div>
            <span>Đã điểm danh: <strong>{checkedInCount} / {attendees.length}</strong></span>
          </div>
        </div>

        {/* Search Attendees */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-soft)]" />
          <input
            type="text"
            placeholder="Tìm tên hoặc email sinh viên điểm danh..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[var(--paper)] border border-[var(--line)] rounded-xl text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] font-mono"
          />
        </div>

        {/* Attendees List */}
        {loading ? (
          <div className="text-center py-8 text-xs text-[var(--ink-soft)] font-mono">Đang tải danh sách tham gia...</div>
        ) : filteredAttendees.length === 0 ? (
          <div className="text-center py-8 text-xs text-[var(--ink-soft)] border border-dashed border-[var(--line)] rounded-xl">
            Không tìm thấy sinh viên trong danh sách đăng ký.
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
            {filteredAttendees.map((a) => (
              <div
                key={a.userId}
                className="flex items-center justify-between p-3 rounded-xl bg-[var(--paper-bright)] border border-[var(--line)] hover:border-[var(--accent-soft)] transition-all"
              >
                <div className="flex items-center gap-3">
                  {a.avatarUrl ? (
                    <img src={a.avatarUrl} alt={a.fullName} className="w-9 h-9 rounded-full object-cover border border-[var(--line)]" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[var(--accent-soft)] text-[var(--accent-strong)] flex items-center justify-center font-bold text-xs">
                      {a.fullName.charAt(0)}
                    </div>
                  )}

                  <div>
                    <h4 className="text-xs font-bold text-[var(--ink)]">{a.fullName}</h4>
                    {a.email && <p className="text-[11px] text-[var(--ink-soft)]">{a.email}</p>}
                  </div>
                </div>

                <div>
                  {a.isCheckedIn ? (
                    <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[var(--accent-strong)] bg-[var(--accent-wash)] border border-[var(--accent-soft)] px-3 py-1 rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Đã điểm danh
                    </span>
                  ) : (
                    <button
                      disabled={checkinProgressId === a.userId}
                      onClick={() => handleCheckIn(a.userId)}
                      className="btn-primary text-xs !py-1.5 !px-3 disabled:opacity-50"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      {checkinProgressId === a.userId ? 'Đang điểm danh...' : 'Điểm danh'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-[var(--line)]">
          <button type="button" onClick={onClose} className="btn-secondary text-xs">
            Đóng
          </button>
        </div>
      </div>
    </Dialog>
  );
};
