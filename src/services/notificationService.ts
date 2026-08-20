import { apiClient } from './apiClient';
import { NotificationItem } from '@/types';

export const mockNotifications: NotificationItem[] = [
  {
    id: 'notif-01',
    userId: 'usr-101',
    title: 'Đơn mượn thiết bị đã được duyệt',
    message: 'Yêu cầu mượn "NVIDIA Jetson Orin Nano Developer Kit (8GB)" của bạn đã được Lab Manager chấp nhận.',
    type: 'Booking',
    isRead: false,
    createdAt: '2026-08-20T10:15:00Z',
    linkUrl: '/my-bookings'
  },
  {
    id: 'notif-02',
    userId: 'usr-101',
    title: 'Ý tưởng mới nhận được phản hồi',
    message: 'Mentor TS. Nguyễn Văn Hoàng đã bình luận trên Ý tưởng "AI Camera đếm lưu lượng giao thông nút giao".',
    type: 'Idea',
    isRead: false,
    createdAt: '2026-08-19T16:40:00Z',
    linkUrl: '/ideas/idea-01'
  },
  {
    id: 'notif-03',
    userId: 'usr-101',
    title: 'Nhắc nhở tham gia sự kiện',
    message: 'Sự kiện "Workshop: Tối ưu hoá YOLOv8 trên Jetson" sẽ diễn ra vào ngày 28/08 tới.',
    type: 'Event',
    isRead: true,
    createdAt: '2026-08-18T09:00:00Z',
    linkUrl: '/events/ev-02'
  }
];

export const notificationService = {
  async getNotifications(): Promise<NotificationItem[]> {
    try {
      const response = await apiClient.get('/notifications');
      return response.data;
    } catch {
      return mockNotifications;
    }
  },

  async markAsRead(id: string): Promise<void> {
    try {
      await apiClient.put(`/notifications/${id}/read`);
    } catch {
      const item = mockNotifications.find((n) => n.id === id);
      if (item) item.isRead = true;
    }
  },

  async markAllAsRead(): Promise<void> {
    try {
      await apiClient.put('/notifications/read-all');
    } catch {
      mockNotifications.forEach((n) => (n.isRead = true));
    }
  }
};
