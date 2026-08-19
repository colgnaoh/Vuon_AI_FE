import React, { useState, useEffect } from 'react';
import { eventService } from '@/services/eventService';
import { TechEvent } from '@/types';
import { Calendar, Users, MapPin, CheckCircle2, Sparkles, Clock } from 'lucide-react';

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<TechEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await eventService.getEvents();
      setEvents(data);
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId: string) => {
    try {
      await eventService.registerEvent(eventId);
      alert('Đăng ký tham gia sự kiện thành công! Chúng tôi đã lưu giữ vị trí cho bạn.');
      fetchEvents();
    } catch {
      // Handled
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 border border-teal-300 text-teal-800 text-xs font-mono font-bold">
          <Calendar className="w-3.5 h-3.5 text-teal-600" /> WORKSHOPS & COMMUNITY EVENTS
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Sự Kiện & Build Night Định Kỳ</h1>
        <p className="text-sm text-slate-600 max-w-2xl">
          Nơi giao lưu kiến thức, thực hành công nghệ mới (VLM, ROS2, PCB Design) và chia sẻ kinh nghiệm phát triển sản phẩm.
        </p>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-500 text-sm">Đang tải danh sách sự kiện...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => (
            <div key={evt.id} className="tech-card p-6 flex flex-col justify-between space-y-4 border-teal-200">
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-teal-100 text-teal-800 border border-teal-300">
                    {evt.category}
                  </span>
                  <span className="text-xs font-mono text-slate-600 flex items-center gap-1 font-bold">
                    <Users className="w-3.5 h-3.5 text-emerald-600" /> {evt.registeredCount} Đã Đăng Ký
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">{evt.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{evt.description}</p>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-700 font-medium">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    <span>{new Date(evt.date).toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{evt.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Presenter: <strong>{evt.speaker}</strong></span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleRegister(evt.id)}
                disabled={evt.isRegistered}
                className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  evt.isRegistered
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 cursor-default'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-600/20'
                }`}
              >
                {evt.isRegistered ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Đã Đăng Ký Tham Gia
                  </>
                ) : (
                  'Đăng Ký Tham Gia 1-Click'
                )}
              </button>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
