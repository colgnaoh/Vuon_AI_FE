import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { notificationService } from '@/services/notificationService';
import { NotificationItem } from '@/types';
import { Bell, Check, ExternalLink } from 'lucide-react';

export const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    void fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch {
      // Ignore notification fetch errors
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await notificationService.markAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-white rounded-xl bg-gray-900/60 border border-gray-800 transition-colors"
        title="Thông báo"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse shadow-lg shadow-red-500/50">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">Thông báo</h3>
              <Link
                to="/notifications"
                onClick={() => setIsOpen(false)}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium"
              >
                Xem tất cả &rarr;
              </Link>
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-gray-800/60">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-xs text-gray-500">
                  Không có thông báo mới.
                </div>
              ) : (
                notifications.slice(0, 5).map((n) => (
                  <div
                    key={n.id}
                    className={`p-4 transition-colors ${!n.isRead ? 'bg-blue-950/20' : 'hover:bg-gray-800/40'}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-white line-clamp-1">{n.title}</h4>
                      {!n.isRead && (
                        <button
                          onClick={(e) => handleMarkRead(n.id, e)}
                          title="Đánh dấu đã đọc"
                          className="text-gray-500 hover:text-emerald-400 p-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{n.message}</p>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-gray-500">
                      <span>{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {n.linkUrl && (
                        <Link
                          to={n.linkUrl}
                          onClick={() => setIsOpen(false)}
                          className="text-blue-400 hover:underline flex items-center gap-0.5"
                        >
                          Chi tiết <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
