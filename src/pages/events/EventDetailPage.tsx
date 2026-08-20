import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LoadingState, ErrorState } from '@/components/AsyncState';
import { eventService } from '@/services/eventService';
import { TechEvent } from '@/types';
import { Calendar, MapPin, Users, ArrowLeft, CheckCircle2, Clock, Award, Share2 } from 'lucide-react';

export const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<TechEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [registering, setRegistering] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại danh sách sự kiện
      </button>

      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gray-900 border border-gray-800 mb-8">
        <div className="h-64 md:h-80 w-full overflow-hidden relative">
          {event.imageUrl ? (
            <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover opacity-60" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-900 to-purple-900 opacity-60" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="bg-blue-600/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full">
              {event.category}
            </span>
            <span className="bg-gray-800/80 text-gray-300 text-xs px-3 py-1 rounded-full border border-gray-700">
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
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-400" /> Giới thiệu sự kiện
            </h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line text-base">
              {event.description}
            </p>
          </div>

          {/* Agenda Section */}
          {event.agenda && event.agenda.length > 0 && (
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 md:p-8">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-400" /> Lịch trình chi tiết (Agenda)
              </h2>
              <div className="space-y-4">
                {event.agenda.map((item, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row gap-2 sm:gap-6 p-4 rounded-xl bg-gray-950/60 border border-gray-800/80">
                    <div className="text-blue-400 font-mono font-bold text-sm shrink-0 sm:w-36">
                      {item.time}
                    </div>
                    <div className="text-gray-200 text-sm font-medium">
                      {item.topic}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Speaker Card */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold text-white mb-4">Diễn giả chính</h2>
            <div className="flex items-center gap-4">
              {event.speakerAvatar ? (
                <img src={event.speakerAvatar} alt={event.speaker} className="w-16 h-16 rounded-full object-cover border-2 border-blue-500/40" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-blue-600/30 flex items-center justify-center text-blue-400 font-bold text-xl">
                  {event.speaker.charAt(0)}
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-white">{event.speaker}</h3>
                <p className="text-sm text-gray-400">{event.speakerRole || 'Chuyên gia Công nghệ Vườn AI'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info & Action */}
        <div className="space-y-6">
          <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 space-y-6 sticky top-6">
            <h3 className="text-lg font-bold text-white border-b border-gray-800 pb-3">
              Thông tin đăng ký
            </h3>

            {successMessage && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <div className="space-y-4 text-sm text-gray-300">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Thời gian</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {new Date(event.date).toLocaleString('vi-VN', { dateStyle: 'full', timeStyle: 'short' })}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Địa điểm</div>
                  <div className="text-xs text-gray-400 mt-0.5">{event.location}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Số lượng tham gia</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {event.registeredCount} / {event.maxParticipants || 100} thành viên đã đăng ký
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              {event.isRegistered ? (
                <button
                  disabled
                  className="w-full bg-emerald-600/30 text-emerald-300 font-semibold py-3 rounded-xl border border-emerald-500/40 flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  <CheckCircle2 className="w-5 h-5" /> Đã đăng ký tham gia
                </button>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={registering}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2"
                >
                  {registering ? 'Đang đăng ký...' : 'Đăng ký tham gia ngay'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
