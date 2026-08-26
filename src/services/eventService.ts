import { apiClient } from './apiClient';
import { TechEvent, EventAttendee } from '@/types';

export const mockEvents: TechEvent[] = [
  {
    id: 'ev-01',
    title: 'Vườn AI Hackathon 2026: Edge AI & Vision Solutions',
    category: 'Hackathon',
    speaker: 'TS. Nguyễn Văn Hoàng',
    speakerRole: 'Head of AI Research @ Vườn AI',
    speakerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    date: '2026-09-10T08:30:00Z',
    location: 'Zone 01 - Main Stage & Zone 02 Lab',
    description: 'Cuộc thi thiết kế giải pháp Edge AI sử dụng NVIDIA Jetson Orin và camera RealSense. Tổng giải thưởng lên đến 50.000.000 VNĐ kèm cơ hội ươm tạo dự án.',
    agenda: [
      { time: '08:30 - 09:00', topic: 'Check-in & Khai mạc' },
      { time: '09:00 - 12:00', topic: 'Vòng Hackathon Live Coding & Prototype Build' },
      { time: '13:30 - 16:00', topic: 'Thuyết trình Demo & Chấm điểm từ Hội đồng Chuyên gia' },
      { time: '16:30', topic: 'Trao giải & Giao lưu kết nối' }
    ],
    registeredCount: 42,
    maxParticipants: 60,
    isRegistered: false,
    imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'ev-02',
    title: 'Workshop: Tối ưu hoá YOLOv8 & TensorRT trên Jetson Orin Nano',
    category: 'Workshop',
    speaker: 'Kỹ sư Lê Minh Tú',
    speakerRole: 'Senior Computer Vision Engineer',
    speakerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    date: '2026-08-28T14:00:00Z',
    location: 'Zone 02 - AI Lab',
    description: 'Hướng dẫn thực chiến convert model PyTorch sang ONNX và FP16 TensorRT engine để đạt 60+ FPS trên phần cứng nhúng.',
    agenda: [
      { time: '14:00 - 14:30', topic: 'Tổng quan kiến trúc TensorRT & INT8 Quantization' },
      { time: '14:30 - 16:00', topic: 'Thực hành Convert & Benchmark trên Jetson Orin' },
      { time: '16:00 - 16:30', topic: 'Q&A và giải đáp sự cố tối ưu' }
    ],
    registeredCount: 28,
    maxParticipants: 30,
    isRegistered: true,
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'ev-03',
    title: 'Tech Talk: Xu hướng Large Vision-Language Models (VLM) 2026',
    category: 'Tech Talk',
    speaker: 'Dr. Sarah Trần',
    speakerRole: 'AI Research Director',
    speakerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    date: '2026-09-05T18:30:00Z',
    location: 'Online Stream & Hybrid Lab 1',
    description: 'Chia sẻ sâu về cách kết hợp Multimodal Vision-Language Models vào tự động hoá nhà xưởng và robot dịch vụ.',
    agenda: [
      { time: '18:30 - 19:30', topic: 'Bài phát biểu: Future of Robotics & Multimodal AI' },
      { time: '19:30 - 20:00', topic: 'Panel Discussion với dàn Mentor Vườn AI' }
    ],
    registeredCount: 85,
    maxParticipants: 150,
    isRegistered: false,
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800'
  }
];

export const eventService = {
  async getEvents(category?: string): Promise<TechEvent[]> {
    try {
      const response = await apiClient.get('/events', { params: { category } });
      return Array.isArray(response.data) ? response.data : mockEvents;
    } catch {
      if (!category || category === 'All') return mockEvents;
      return mockEvents.filter((e) => e.category.toLowerCase() === category.toLowerCase());
    }
  },

  async getEventById(id: string): Promise<TechEvent> {
    try {
      const response = await apiClient.get(`/events/${id}`);
      return response.data;
    } catch {
      return mockEvents.find((e) => e.id === id) || mockEvents[0];
    }
  },

  async registerForEvent(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post(`/events/${id}/register`);
      return response.data;
    } catch {
      const ev = mockEvents.find((e) => e.id === id);
      if (ev) {
        ev.isRegistered = true;
        ev.registeredCount += 1;
      }
      return { success: true, message: 'Đăng ký tham gia sự kiện thành công!' };
    }
  },

  async createEvent(data: Omit<TechEvent, 'id' | 'registeredCount' | 'isRegistered'>): Promise<TechEvent> {
    try {
      const response = await apiClient.post('/events', data);
      return response.data;
    } catch {
      const newEv: TechEvent = {
        ...data,
        id: 'ev-' + Date.now(),
        registeredCount: 0,
        isRegistered: false,
      };
      mockEvents.unshift(newEv);
      return newEv;
    }
  },

  async getEventAttendees(eventId: string): Promise<EventAttendee[]> {
    try {
      const response = await apiClient.get(`/events/${eventId}/attendees`);
      return response.data;
    } catch {
      return [
        {
          userId: 'usr-101',
          fullName: 'Alex Nguyễn',
          email: 'alex.nguyen@vuonai.space',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          registeredAt: '2026-08-20T10:00:00Z',
          isCheckedIn: false,
        },
        {
          userId: 'usr-104',
          fullName: 'Hoàng Nam',
          email: 'hoang.nam@vuonai.space',
          avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
          registeredAt: '2026-08-21T14:30:00Z',
          isCheckedIn: true,
          checkedInAt: '2026-08-24T08:00:00Z',
        },
        {
          userId: 'usr-102',
          fullName: 'Minh Trần',
          email: 'minh.tran@vuonai.space',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
          registeredAt: '2026-08-22T09:15:00Z',
          isCheckedIn: false,
        },
      ];
    }
  },

  async checkInAttendee(eventId: string, attendeeUserId: string): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.patch(`/events/${eventId}/checkin/${attendeeUserId}`);
      return response.data;
    } catch {
      return { success: true };
    }
  }
};
