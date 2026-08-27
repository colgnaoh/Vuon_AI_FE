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
        className="relative p-2.5 text-slate-700 hover:text-emerald-700 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 transition-colors shadow-2xs"
        title="Thông báo"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse shadow-xs">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <h3 className="font-extrabold text-sm text-slate-900">Thông báo</h3>
              <Link
                to="/notifications"
                onClick={() => setIsOpen(false)}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-bold"
              >
                Xem tất cả &rarr;
              </Link>
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-xs font-mono text-slate-500">
                  Không có thông báo mới.
                </div>
              ) : (
                notifications.slice(0, 5).map((n) => (
                  <div
                    key={n.id}
                    className={`p-4 transition-colors ${
                      !n.isRead
                        ? 'bg-emerald-50/60 border-l-4 border-l-emerald-600'
                        : 'bg-white hover:bg-slate-50/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-extrabold text-slate-900 line-clamp-1">{n.title}</h4>
                      {!n.isRead && (
                        <button
                          onClick={(e) => handleMarkRead(n.id, e)}
                          title="Đánh dấu đã đọc"
                          className="text-slate-400 hover:text-emerald-600 p-1 transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">{n.message}</p>
                    <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {n.linkUrl && (
                        <Link
                          to={n.linkUrl}
                          onClick={() => setIsOpen(false)}
                          className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-0.5"
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
