import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LoadingState, ErrorState } from '@/components/AsyncState';
import { eventService } from '@/services/eventService';
import { TechEvent } from '@/types';
import { CreateEventModal } from '@/components/events/CreateEventModal';
import { Calendar, MapPin, Users, Sparkles, Search, Plus, ArrowRight } from 'lucide-react';

export const EventsPage: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [events, setEvents] = useState<TechEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const categories = ['All', 'Workshop', 'Tech Talk', 'Hackathon', 'Build Night', 'Demo Day'];

  const canManageEvents = isAdmin || user?.globalRole === 'LabManager';

  useEffect(() => {
    void fetchEvents();
  }, [selectedCategory]);

  const fetchEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await eventService.getEvents(selectedCategory === 'All' ? undefined : selectedCategory);
      setEvents(data);
    } catch {
      setError('Không thể tải danh sách sự kiện.');
    } finally {
      setLoading(false);
    }
  };

  const handleEventCreated = (newEvent: TechEvent) => {
    setEvents((prev) => [newEvent, ...prev]);
  };

  const filteredEvents = events.filter(e =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-shell">
      <header className="page-head">
        <div>
          <p className="page-kicker">02 / tech events & workshops</p>
          <h1 className="page-title">Sự kiện & Hội thảo Công nghệ AI.</h1>
          <p className="page-intro">
            Tham gia các buổi Workshop thực chiến, Hackathon lập trình nhúng và Tech Talk chuyên sâu cùng dàn diễn giả hàng đầu.
          </p>
        </div>

        {canManageEvents && (
          <button
            onClick={() => setCreateModalOpen(true)}
            className="btn-primary shrink-0 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" /> Tạo sự kiện mới
          </button>
        )}
      </header>

      {/* Filter & Search Bar */}
      <div className="my-8 flex flex-col md:flex-row gap-4 items-center justify-between border-b border-[var(--line)] pb-6">
        <div className="filter-row !border-0 !p-0 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`filter-chip ${selectedCategory === cat ? '!bg-[var(--accent)] !text-white' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-soft)]" />
          <input
            type="text"
            placeholder="Tìm theo tên, diễn giả..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--paper-bright)] border border-[var(--line)] rounded-lg pl-9 pr-4 py-2 text-xs text-[var(--ink)] placeholder-[var(--ink-soft)] focus:outline-none focus:border-[var(--accent)]"
          />
        </div>
      </div>

      {loading ? (
        <LoadingState message="Đang tải danh sách sự kiện..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchEvents} />
      ) : filteredEvents.length === 0 ? (
        <div className="empty-state py-16 text-center border border-dashed border-[var(--line)] rounded-2xl">
          <Sparkles className="w-10 h-10 text-[var(--accent)] mx-auto mb-3" />
          <p className="text-[var(--ink-soft)] font-medium text-sm">Không tìm thấy sự kiện phù hợp.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className="group tech-card bg-[var(--paper-bright)] border border-[var(--line)] hover:border-[var(--accent)] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[var(--shadow-paper)] flex flex-col justify-between text-left no-underline"
            >
              <div>
                {/* Event Image Banner */}
                <div className="relative h-44 w-full overflow-hidden bg-[var(--paper-deep)] border-b border-[var(--line)]">
                  {event.imageUrl ? (
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[var(--accent-wash)]">
                      <Sparkles className="w-12 h-12 text-[var(--accent)]" />
                    </div>
                  )}
                  <span className="absolute top-3 left-3 bg-[var(--accent-strong)] text-white text-[0.68rem] font-mono font-bold px-2.5 py-1 rounded shadow-md uppercase border border-white/20">
                    {event.category}
                  </span>
                  {event.isRegistered && (
                    <span className="absolute top-3 right-3 bg-[var(--accent)] text-white text-[0.68rem] font-mono font-bold px-2.5 py-1 rounded shadow-md">
                      Đã đăng ký
                    </span>
                  )}
                </div>

                {/* Event Card Content */}
                <div className="p-5 space-y-3">
                  <h3 className="text-xl font-extrabold text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors line-clamp-2 leading-tight">
                    {event.title}
                  </h3>
                  <p className="text-[var(--ink-soft)] text-xs line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="space-y-2 text-xs text-[var(--ink-soft)] pt-2 border-t border-[var(--line)]">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[var(--accent)] shrink-0" />
                      <span className="font-mono text-[0.72rem]">{new Date(event.date).toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[var(--accent)] shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[var(--accent)] shrink-0" />
                      <span className="font-mono text-[0.72rem]">{event.registeredCount} / {event.maxParticipants || 100} lượt đăng ký</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="border-t border-[var(--line)] pt-3 flex items-center justify-between">
                  <span className="text-xs text-[var(--ink-soft)]">Diễn giả: <strong className="text-[var(--ink)]">{event.speaker}</strong></span>
                  <span className="text-xs text-[var(--accent-strong)] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Chi tiết <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {createModalOpen && (
        <CreateEventModal
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSuccess={handleEventCreated}
        />
      )}
    </div>
  );
};
