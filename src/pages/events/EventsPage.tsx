import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LoadingState, ErrorState } from '@/components/AsyncState';
import { eventService } from '@/services/eventService';
import { TechEvent } from '@/types';
import { Calendar, MapPin, Users, Sparkles, Search, Filter } from 'lucide-react';

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<TechEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Workshop', 'Tech Talk', 'Hackathon', 'Build Night', 'Demo Day'];

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
      </header>

      {/* Filter & Search Bar */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between border-b border-gray-800 pb-6">
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-gray-900/60 text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Tìm theo tên, diễn giả..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900/80 border border-gray-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {loading ? (
        <LoadingState message="Đang tải danh sách sự kiện..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchEvents} />
      ) : filteredEvents.length === 0 ? (
        <div className="empty-state py-16 text-center border border-dashed border-gray-800 rounded-2xl">
          <Sparkles className="w-10 h-10 text-blue-500 mx-auto mb-3" />
          <p className="text-gray-400">Không tìm thấy sự kiện phù hợp.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className="group bg-gray-900/60 border border-gray-800 hover:border-blue-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 flex flex-col justify-between"
            >
              <div>
                {/* Event Image Banner */}
                <div className="relative h-44 w-full overflow-hidden bg-gray-950">
                  {event.imageUrl ? (
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900/30 to-purple-900/30">
                      <Sparkles className="w-12 h-12 text-blue-400" />
                    </div>
                  )}
                  <span className="absolute top-3 left-3 bg-gray-950/80 backdrop-blur-md border border-gray-800 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full">
                    {event.category}
                  </span>
                  {event.isRegistered && (
                    <span className="absolute top-3 right-3 bg-emerald-500/90 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      Đã đăng ký
                    </span>
                  )}
                </div>

                {/* Event Card Content */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2 mb-3">
                    {event.title}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                    {event.description}
                  </p>

                  <div className="space-y-2 text-xs text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>{new Date(event.date).toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-purple-400 shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{event.registeredCount} / {event.maxParticipants || 100} lượt đăng ký</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="border-t border-gray-800/80 pt-4 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-400">Diễn giả: <strong className="text-white">{event.speaker}</strong></span>
                  <span className="text-xs text-blue-400 font-semibold group-hover:translate-x-1 transition-transform">
                    Chi tiết &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
