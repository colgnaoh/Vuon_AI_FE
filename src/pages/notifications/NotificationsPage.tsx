import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LoadingState, ErrorState } from '@/components/AsyncState';
import { notificationService } from '@/services/notificationService';
import { NotificationItem } from '@/types';
import { Bell, CheckCheck, ExternalLink, Calendar, Info } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'All' | 'Unread'>('All');

  useEffect(() => {
    void fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch {
      setError('Không thể tải thông báo.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleMarkRead = async (id: string) => {
    await notificationService.markAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const filteredNotifications = notifications.filter(n => filter === 'All' || !n.isRead);

  return (
    <div className="page-shell max-w-4xl mx-auto">
      <header className="page-head flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="page-kicker">05 / notification center</p>
          <h1 className="page-title">Trung tâm Thông báo.</h1>
          <p className="page-intro">Cập nhật tin tức mới nhất về đơn mượn thiết bị, dự án và sự kiện Vườn AI.</p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-xs text-gray-300 font-semibold px-4 py-2.5 rounded-xl transition-all self-start sm:self-auto"
        >
          <CheckCheck className="w-4 h-4 text-emerald-400" /> Đánh dấu tất cả đã đọc
        </button>
      </header>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-800 pb-4 mb-6">
        <button
          onClick={() => setFilter('All')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            filter === 'All' ? 'bg-blue-600 text-white' : 'bg-gray-900/60 text-gray-400 hover:text-white border border-gray-800'
          }`}
        >
          Tất cả thông báo ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('Unread')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            filter === 'Unread' ? 'bg-blue-600 text-white' : 'bg-gray-900/60 text-gray-400 hover:text-white border border-gray-800'
          }`}
        >
          Chưa đọc ({notifications.filter(n => !n.isRead).length})
        </button>
      </div>

      {loading ? (
        <LoadingState message="Đang tải thông báo..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchNotifications} />
      ) : filteredNotifications.length === 0 ? (
        <div className="p-16 text-center border border-dashed border-gray-800 rounded-2xl">
          <Bell className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Bạn không có thông báo nào.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.isRead && handleMarkRead(n.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                !n.isRead
                  ? 'bg-blue-950/20 border-blue-500/30 hover:border-blue-500/50'
                  : 'bg-gray-900/40 border-gray-800/80 hover:border-gray-700'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-gray-800 text-blue-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-gray-700">
                      {n.type}
                    </span>
                    <h3 className="text-base font-bold text-white">{n.title}</h3>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed pt-1">{n.message}</p>
                </div>

                {!n.isRead && (
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0 mt-1" title="Chưa đọc" />
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-800/60 flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(n.createdAt).toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' })}
                </span>

                {n.linkUrl && (
                  <Link
                    to={n.linkUrl}
                    className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    Xem thông tin <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
