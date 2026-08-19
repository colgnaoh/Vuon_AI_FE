import { apiClient } from './apiClient';
import { Idea, Comment } from '@/types';

export const mockIdeas: Idea[] = [
  {
    id: 'idea-01',
    title: 'AI Robot Phân Loại Rác Tự Động bằng Vision Language Model',
    summary: 'Robot di động tích hợp camera depth và VLM (Vision Language Model) để nhận diện và tự động phân loại rác tái chế trong khuôn viên lab.',
    description: 'Ý tưởng xây dựng một robot di động nhỏ chạy trên NVIDIA Jetson Orin Nano, kết hợp camera RealSense D435 và thuật toán VLM để phân loại rác thải phức tạp mà mô hình YOLO chuẩn chưa hỗ trợ.',
    authorId: 'usr-101',
    authorName: 'Alex Nguyễn',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    requiredTech: ['YOLOv8', 'ROS2', 'ESP32', 'NVIDIA Jetson', 'VLM'],
    lookingForRoles: ['1 AI Developer', '1 Embedded Developer', '1 Mechanical Designer'],
    status: 'Open',
    commentCount: 4,
    createdAt: '2026-08-15T10:00:00Z',
  },
  {
    id: 'idea-02',
    title: 'Hệ Thống Giám Sát Điện Năng Smart Factory Qua LoRaWAN',
    summary: 'Mạng cảm biến nhúng đo công suất và phát hiện bất thường máy sản xuất thời gian thực bằng Edge Machine Learning.',
    description: 'Sử dụng dòng chip STM32/ESP32 kết hợp biến dòng CT Sensor truyền dữ liệu qua giao thức LoRaWAN về server trung tâm, ứng dụng mô hình TinyML phát hiện sự cố động cơ.',
    authorId: 'usr-102',
    authorName: 'Minh Trần',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    requiredTech: ['STM32', 'LoRaWAN', 'TinyML', 'React Dashboard'],
    lookingForRoles: ['1 Cloud Frontend Dev', '1 Data Engineer'],
    status: 'Open',
    commentCount: 2,
    createdAt: '2026-08-17T14:30:00Z',
  },
  {
    id: 'idea-03',
    title: 'Cánh Tay Robot Gắp Vật Thể Tự Động Kết Hợp Digital Twin',
    summary: 'Mô phỏng Digital Twin của robot gắp công nghiệp trong môi trường Gazebo/NVIDIA Isaac Sim trước khi chạy thực tế.',
    description: 'Xây dựng bản sao số (Digital Twin) để thử nghiệm tính toán động lực học ngược (Inverse Kinematics) và tránh vật cản trước khi truyền lệnh tới Robot Arm trong phòng lab.',
    authorId: 'usr-104',
    authorName: 'Hoàng Nam',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    requiredTech: ['ROS2', 'Digital Twin', 'Gazebo', 'Python'],
    lookingForRoles: ['1 Simulation Engineer', '1 UI Designer'],
    status: 'Converted',
    commentCount: 6,
    createdAt: '2026-08-10T09:15:00Z',
  },
];

export const mockComments: Record<string, Comment[]> = {
  'idea-01': [
    {
      id: 'c-1',
      ideaId: 'idea-01',
      authorId: 'usr-102',
      authorName: 'Minh Trần',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      content: 'Ý tưởng rất hay! Mình có sẵn bo mạch ESP32-S3 Cam và kinh nghiệm điều khiển động cơ bước, mình xin đăng ký vị trí Embedded Dev nhé!',
      createdAt: '2026-08-15T11:20:00Z',
    },
    {
      id: 'c-2',
      ideaId: 'idea-01',
      authorId: 'usr-104',
      authorName: 'Hoàng Nam',
      authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      content: 'Bên Robotics Lab đang có sẵn khung xe Mobile Robot 4 bánh Mecanum và Jetson Orin Nano khả dụng, team có thể mượn sử dụng ngay!',
      createdAt: '2026-08-15T14:05:00Z',
    },
  ],
};

export const ideaService = {
  async getIdeas(): Promise<Idea[]> {
    try {
      const response = await apiClient.get('/ideas');
      return response.data;
    } catch {
      return mockIdeas;
    }
  },

  async getIdeaById(id: string): Promise<{ idea: Idea; comments: Comment[] }> {
    try {
      const response = await apiClient.get(`/ideas/${id}`);
      return response.data;
    } catch {
      const idea = mockIdeas.find((i) => i.id === id) || mockIdeas[0];
      const comments = mockComments[id] || [];
      return { idea, comments };
    }
  },

  async createIdea(data: Omit<Idea, 'id' | 'authorId' | 'commentCount' | 'status' | 'createdAt'>): Promise<Idea> {
    try {
      const response = await apiClient.post('/ideas', data);
      return response.data;
    } catch {
      const newIdea: Idea = {
        ...data,
        id: 'idea-' + Date.now(),
        authorId: 'usr-101',
        authorName: 'Alex Nguyễn',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        status: 'Open',
        commentCount: 0,
        createdAt: new Date().toISOString(),
      };
      mockIdeas.unshift(newIdea);
      return newIdea;
    }
  },

  async addComment(ideaId: string, content: string): Promise<Comment> {
    try {
      const response = await apiClient.post(`/ideas/${ideaId}/comments`, { content });
      return response.data;
    } catch {
      const newComment: Comment = {
        id: 'c-' + Date.now(),
        ideaId,
        authorId: 'usr-101',
        authorName: 'Alex Nguyễn',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        content,
        createdAt: new Date().toISOString(),
      };
      if (!mockComments[ideaId]) mockComments[ideaId] = [];
      mockComments[ideaId].push(newComment);
      return newComment;
    }
  },

  async convertIdeaToProject(ideaId: string): Promise<{ projectId: string }> {
    try {
      const response = await apiClient.post(`/ideas/${ideaId}/convert-to-project`);
      return response.data;
    } catch {
      const targetIdea = mockIdeas.find((i) => i.id === ideaId);
      if (targetIdea) targetIdea.status = 'Converted';
      return { projectId: 'proj-converted-' + ideaId };
    }
  },
};
