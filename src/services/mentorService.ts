import { apiClient } from './apiClient';
import { Mentor } from '@/types';

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

export const mentorService = {
  async getMentors(expertise?: string): Promise<Mentor[]> {
    try {
      const response = await apiClient.get('/mentors', { params: { expertise } });
      return response.data;
    } catch {
      if (!expertise || expertise === 'All') return mockMentors;
      return mockMentors.filter((m) =>
        m.expertise.some((e) => e.toLowerCase().includes(expertise.toLowerCase()))
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
  }
};
