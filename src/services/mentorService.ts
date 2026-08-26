import { apiClient } from './apiClient';
import { Mentor, MentorRequest, MentorRequestStatus } from '@/types';

export const mockMentors: Mentor[] = [
  {
    id: 'men-01',
    fullName: 'TS. Nguyễn Văn Hoàng',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    title: 'Head of AI Research & Embedded Vision Lead',
    company: 'Vườn AI Lab & VinAI Research Alum',
    bio: 'Hơn 10 năm kinh nghiệm nghiên cứu Computer Vision, SLAM và triển khai mô hình học sâu trên các chip nhúng (NVIDIA Jetson, Hailo-8, Ambarella).',
    expertise: ['Computer Vision', 'Edge AI', 'TensorRT', 'Embedded Systems', 'SLAM'],
    lookingForMentees: true,
    rating: 4.9,
    totalMentees: 18,
    contactEmail: 'hoang.nguyen@vuonai.space',
    linkedinUrl: 'https://linkedin.com',
    githubUrl: 'https://github.com'
  },
  {
    id: 'men-02',
    fullName: 'Kỹ sư Phạm Thanh Sơn',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    title: 'Robotics Software Architect',
    company: 'Maker & Robotics Innovation Hub',
    bio: 'Chuyên gia thiết kế kiến trúc hệ thống ROS2, điều khiển Cobot và mô phỏng Gazebo / Isaac Sim cho Robot di chuyển tự hành (AMR).',
    expertise: ['ROS2', 'Robotics', 'Isaac Sim', 'Control Systems', 'C++'],
    lookingForMentees: true,
    rating: 4.8,
    totalMentees: 14,
    contactEmail: 'son.pham@vuonai.space',
    linkedinUrl: 'https://linkedin.com'
  },
  {
    id: 'men-03',
    fullName: 'ThS. Trần Thị Mai Anh',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    title: 'Senior NLP & LLM Engineer',
    company: 'AI Research Lab',
    bio: 'Tập trung nghiên cứu Fine-tuning LLM tiếng Việt, Retrieval-Augmented Generation (RAG) và tối ưu hóa latency cho chatbot doanh nghiệp.',
    expertise: ['NLP', 'LLMs', 'RAG', 'PyTorch', 'LangChain'],
    lookingForMentees: false,
    rating: 5.0,
    totalMentees: 22,
    contactEmail: 'maianh.tran@vuonai.space'
  }
];

export const mockMentorRequests: MentorRequest[] = [
  {
    id: 'req-101',
    mentorId: 'men-01',
    mentorName: 'TS. Nguyễn Văn Hoàng',
    studentId: 'usr-104',
    studentName: 'Hoàng Nam',
    studentAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    projectId: 'proj-01',
    projectTitle: 'Autonomous Mobile Robot (AMR) for a Smart Warehouse',
    topic: 'Tối ưu hóa thuật toán SLAM 2D với LiDAR trên ROS2 Nav2',
    description: 'Nhóm chúng em đang bị vướng ở bước tuning tham số Costmap và Local Planner trong Nav2 làm cho Robot di chuyển bị giật. Rất mong thầy dành chút thời gian hướng dẫn.',
    status: 'Pending',
    createdAt: '2026-08-20T09:30:00Z',
  },
  {
    id: 'req-102',
    mentorId: 'men-01',
    mentorName: 'TS. Nguyễn Văn Hoàng',
    studentId: 'usr-101',
    studentName: 'Alex Nguyễn',
    studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    projectId: 'proj-02',
    projectTitle: 'Edge AI Camera for Lab Safety Monitoring',
    topic: 'Tối ưu hóa Latency khi Export mô hình YOLOv8 sang TensorRT trên Jetson Orin Nano',
    description: 'Em cần thầy tư vấn về FP16 quantization và cấu hình CUDA stream để xử lý 4 luồng IP Camera đồng thời mà không bị drop FPS.',
    status: 'Approved',
    createdAt: '2026-08-18T14:15:00Z',
  },
  {
    id: 'req-103',
    mentorId: 'men-01',
    mentorName: 'TS. Nguyễn Văn Hoàng',
    studentId: 'usr-102',
    studentName: 'Minh Trần',
    studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    topic: 'Tư vấn định hướng học tập và chọn đề tài nghiên cứu về Cobot',
    description: 'Em là sinh viên năm 3 ngành Cơ điện tử, muốn xin tư vấn của thầy về cơ hội thực tập và định hướng làm việc với Robot FAINO.',
    status: 'Pending',
    createdAt: '2026-08-22T11:00:00Z',
  },
];

export const mentorService = {
  async getMentors(expertise?: string): Promise<Mentor[]> {
    try {
      const response = await apiClient.get('/mentors', { params: { expertise } });
      return Array.isArray(response.data) ? response.data : mockMentors;
    } catch {
      if (!expertise || expertise === 'All') return mockMentors;
      return mockMentors.filter((m) =>
        (m.expertise || []).some((e) => e.toLowerCase().includes(expertise.toLowerCase()))
      );
    }
  },

  async getMentorById(id: string): Promise<Mentor> {
    try {
      const response = await apiClient.get(`/mentors/${id}`);
      return response.data;
    } catch {
      return mockMentors.find((m) => m.id === id) || mockMentors[0];
    }
  },

  async requestConsultation(mentorId: string, data: { topic: string; description: string; preferredDate: string }): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post(`/mentors/${mentorId}/consultation`, data);
      return response.data;
    } catch {
      return { success: true, message: 'Yêu cầu kết nối / tư vấn đã được gửi thành công đến Mentor!' };
    }
  },

  async getMyMentorRequests(): Promise<MentorRequest[]> {
    try {
      const response = await apiClient.get('/mentor-requests/my-requests');
      return response.data;
    } catch {
      return mockMentorRequests;
    }
  },

  async updateRequestStatus(requestId: string, status: MentorRequestStatus): Promise<MentorRequest> {
    try {
      const response = await apiClient.patch(`/mentor-requests/${requestId}/status`, { status });
      return response.data;
    } catch {
      const req = mockMentorRequests.find((r) => r.id === requestId);
      if (req) {
        req.status = status;
        return { ...req };
      }
      throw new Error('Mentor request not found');
    }
  }
};
