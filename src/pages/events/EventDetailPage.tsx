import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LoadingState, ErrorState } from '@/components/AsyncState';
import { eventService } from '@/services/eventService';
import { TechEvent } from '@/types';
import { EventCheckinModal } from '@/components/events/EventCheckinModal';
import { Calendar, MapPin, Users, ArrowLeft, CheckCircle2, Clock, Award, UserCheck } from 'lucide-react';

export const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [event, setEvent] = useState<TechEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [registering, setRegistering] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [checkinModalOpen, setCheckinModalOpen] = useState(false);

  const canManageEvents = isAdmin || user?.globalRole === 'LabManager';

  useEffect(() => {
    if (id) {
      void fetchEventDetail(id);
    }
  }, [id]);

  const fetchEventDetail = async (eventId: string) => {
    setLoading(true);
    setError('');
    try {
      const data = await eventService.getEventById(eventId);
      setEvent(data);
    } catch {
      setError('Không tìm thấy thông tin chi tiết sự kiện.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!event) return;
    setRegistering(true);
    try {
      const res = await eventService.registerForEvent(event.id);
      setSuccessMessage(res.message);
      setEvent({ ...event, isRegistered: true, registeredCount: event.registeredCount + 1 });
    } catch {
      setError('Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return <LoadingState message="Đang tải thông tin sự kiện..." />;
  if (error || !event) return <ErrorState message={error || 'Sự kiện không tồn tại'} onRetry={() => id && fetchEventDetail(id)} />;

  return (
    <div className="page-shell">
      <button
        onClick={() => navigate('/events')}
        className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[var(--ink-soft)] hover:text-[var(--accent)] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại danh sách sự kiện
      </button>

      {/* Header Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-[var(--paper-bright)] border border-[var(--line)] shadow-[var(--shadow-paper)] mb-8">
        <div className="h-64 md:h-80 w-full overflow-hidden relative bg-[var(--paper-deep)]">
          {event.imageUrl ? (
            <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover opacity-90" />
          ) : (
            <div className="w-full h-full bg-[var(--accent-wash)] flex items-center justify-center text-[var(--accent)]">
              <Award className="w-16 h-16" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/80 via-[var(--ink)]/30 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="bg-[var(--accent-strong)] text-white text-xs font-mono font-bold px-3 py-1 rounded shadow-md uppercase border border-white/20">
              {event.category}
            </span>
            <span className="bg-[var(--accent-wash)] text-[var(--accent-strong)] text-xs font-mono font-semibold px-3 py-1 rounded border border-[var(--accent-soft)]">
              Vườn AI Space Official Event
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white max-w-4xl leading-tight">
            {event.title}
          </h1>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description Section */}
          <div className="tech-card bg-[var(--paper-bright)] p-6 md:p-8 space-y-4">
            <h2 className="text-xl font-bold text-[var(--ink)] flex items-center gap-2">
              <Award className="w-5 h-5 text-[var(--accent)]" /> Giới thiệu sự kiện
            </h2>
            <p className="text-[var(--ink)] leading-relaxed whitespace-pre-line text-sm">
              {event.description}
            </p>
          </div>

          {/* Agenda Section */}
          {event.agenda && event.agenda.length > 0 && (
            <div className="tech-card bg-[var(--paper-bright)] p-6 md:p-8 space-y-6">
              <h2 className="text-xl font-bold text-[var(--ink)] flex items-center gap-2">
                <Clock className="w-5 h-5 text-[var(--accent)]" /> Lịch trình chi tiết (Agenda)
              </h2>
              <div className="space-y-3">
                {event.agenda.map((item, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row gap-2 sm:gap-6 p-4 rounded-xl bg-[var(--paper)] border border-[var(--line)]">
                    <div className="text-[var(--accent)] font-mono font-bold text-xs shrink-0 sm:w-36">
                      {item.time}
                    </div>
                    <div className="text-[var(--ink)] text-xs font-semibold">
                      {item.topic}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Speaker Card */}
          <div className="tech-card bg-[var(--paper-bright)] p-6 md:p-8 space-y-4">
            <h2 className="text-xl font-bold text-[var(--ink)]">Diễn giả chính</h2>
            <div className="flex items-center gap-4">
              {event.speakerAvatar ? (
                <img src={event.speakerAvatar} alt={event.speaker} className="w-16 h-16 rounded-full object-cover border-2 border-[var(--accent-soft)]" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent-strong)] font-bold text-xl">
                  {event.speaker.charAt(0)}
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-[var(--ink)]">{event.speaker}</h3>
                <p className="text-xs text-[var(--ink-soft)] font-medium">{event.speakerRole || 'Chuyên gia Công nghệ Vườn AI'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info & Action */}
        <div className="space-y-6">
          <div className="tech-card bg-[var(--paper-bright)] p-6 space-y-6 sticky top-6">
            <h3 className="text-lg font-bold text-[var(--ink)] border-b border-[var(--line)] pb-3">
              Thông tin đăng ký
            </h3>

            {successMessage && (
              <div className="p-4 rounded-xl bg-[var(--accent-wash)] border border-[var(--accent-soft)] text-[var(--accent-strong)] text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <div className="space-y-4 text-xs text-[var(--ink)]">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-[var(--accent)] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-[var(--ink)]">Thời gian</div>
                  <div className="text-[var(--ink-soft)] font-mono mt-0.5">
                    {new Date(event.date).toLocaleString('vi-VN', { dateStyle: 'full', timeStyle: 'short' })}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[var(--accent)] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-[var(--ink)]">Địa điểm</div>
                  <div className="text-[var(--ink-soft)] mt-0.5">{event.location}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-[var(--accent)] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-[var(--ink)]">Số lượng tham gia</div>
                  <div className="text-[var(--ink-soft)] font-mono mt-0.5">
                    {event.registeredCount} / {event.maxParticipants || 100} thành viên đã đăng ký
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 space-y-3">
              {canManageEvents && (
                <button
                  onClick={() => setCheckinModalOpen(true)}
                  className="w-full bg-[var(--accent-soft)] hover:bg-[var(--accent-wash)] text-[var(--accent-strong)] border border-[var(--accent)] font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-xs"
                >
                  <UserCheck className="w-4 h-4" /> Quản lý Điểm danh Tham gia
                </button>
              )}

              {event.isRegistered ? (
                <button
                  disabled
                  className="w-full bg-[var(--accent-wash)] text-[var(--accent-strong)] font-bold py-3 rounded-xl border border-[var(--accent-soft)] flex items-center justify-center gap-2 cursor-not-allowed text-xs"
                >
                  <CheckCircle2 className="w-4 h-4" /> Đã đăng ký tham gia
                </button>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={registering}
                  className="btn-primary w-full text-xs"
                >
                  {registering ? 'Đang đăng ký...' : 'Đăng ký tham gia ngay'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {checkinModalOpen && event && (
        <EventCheckinModal
          event={event}
          open={checkinModalOpen}
          onClose={() => setCheckinModalOpen(false)}
        />
      )}
    </div>
  );
};
