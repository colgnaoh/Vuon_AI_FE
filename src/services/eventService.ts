import { apiClient } from './apiClient';
import { TechEvent } from '@/types';

export const mockEvents: TechEvent[] = [
  {
    id: 'evt-01',
    title: 'VUON Build Night #12 — Real-time Vision Language Model on Jetson Orin',
    category: 'Build Night',
    speaker: 'Alex Nguyễn (AI Lead)',
    date: '2026-08-28T18:30:00Z',
    location: 'Zone 02 - AI Lab',
    description: 'Thực hành tối ưu hóa mô hình VLM nén chạy trực tiếp trên Jetson Orin Nano trong 3 giờ làm việc thực tế.',
    registeredCount: 18,
    isRegistered: false,
  },
  {
    id: 'evt-02',
    title: 'VUON Tech Talk: Tự Động Hóa Kho Hàng với ROS2 Nav2 & Custom SLAM',
    category: 'Tech Talk',
    speaker: 'Hoàng Nam (Robotics Engineer)',
    date: '2026-09-05T09:00:00Z',
    location: 'Zone 07 - Event Space & Online Stream',
    description: 'Chia sẻ kiến trúc lập trình điều khiển xe AMR, cấu hình bản đồ môi trường động và thuật toán tránh vật cản.',
    registeredCount: 34,
    isRegistered: true,
  },
  {
    id: 'evt-03',
    title: 'VUON Workshop: Thiết Kế Mạch PCB 2 Lớp với KiCAD từ Ý Tưởng tới Sản Xuất',
    category: 'Workshop',
    speaker: 'Minh Trần (Embedded Expert)',
    date: '2026-09-12T13:30:00Z',
    location: 'Zone 04 - IoT & Embedded Lab',
    description: 'Hướng dẫn vẽ sơ đồ nguyên lý, bố trí linh kiện chuẩn EMC và xuất file Gerber gửi nhà máy đặt làm PCB.',
    registeredCount: 22,
    isRegistered: false,
  },
];

export const eventService = {
  async getEvents(): Promise<TechEvent[]> {
    try {
      const response = await apiClient.get('/events');
      return response.data;
    } catch {
      return mockEvents;
    }
  },

  async registerEvent(eventId: string): Promise<void> {
    try {
      await apiClient.post(`/events/${eventId}/register`);
    } catch {
      const evt = mockEvents.find((e) => e.id === eventId);
      if (evt && !evt.isRegistered) {
        evt.isRegistered = true;
        evt.registeredCount += 1;
      }
    }
  },
};
