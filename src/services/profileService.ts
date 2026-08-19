import { apiClient } from './apiClient';
import { UserProfile } from '@/types';

export const mockProfiles: UserProfile[] = [
  {
    id: 'usr-101',
    fullName: 'Alex Nguyễn',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    bio: 'AI Engineer | Computer Vision & Edge AI Specialist',
    skills: ['Python', 'YOLOv8', 'Jetson Orin', 'PyTorch', 'ROS2'],
    interests: ['Autonomous Robot', 'Vision Language Model', 'Edge Computing'],
    lookingFor: 'Seeking Embedded Developer & Mechanical Engineer for Robot Vision project',
    globalRole: 'Admin',
  },
  {
    id: 'usr-102',
    fullName: 'Minh Trần',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    bio: 'Embedded Systems Developer & Robotics Enthusiast',
    skills: ['ESP32', 'STM32', 'C++', 'Arduino', 'FreeRTOS', 'PCB Design'],
    interests: ['Smart Factory', 'AGV/AMR', 'IoT Sensors'],
    lookingFor: 'Looking for AI developer to integrate VLM into mobile robot platform',
    globalRole: 'Member',
  },
  {
    id: 'usr-103',
    fullName: 'Thu Hà',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    bio: 'Fullstack Software Engineer & Maker Space Advocate',
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'Docker', 'MQTT'],
    interests: ['Digital Twin', 'Cloud IoT Platform', 'AI Agent'],
    lookingFor: 'Looking for Hardware Mentor to review PCB design',
    globalRole: 'Member',
  },
  {
    id: 'usr-104',
    fullName: 'Hoàng Nam',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    bio: 'Robotics Control Engineer & ROS2 Developer',
    skills: ['ROS2', 'Gazebo', 'Robot Arm', 'Control Theory', 'C++'],
    interests: ['Collaborative Robot', 'Inverse Kinematics', 'SLAM'],
    lookingFor: 'Building autonomous delivery robot prototype',
    globalRole: 'LabManager',
  },
];

export const profileService = {
  async getMyProfile(): Promise<UserProfile> {
    try {
      const response = await apiClient.get('/profiles/me');
      return response.data;
    } catch {
      return mockProfiles[0];
    }
  },

  async updateMyProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const response = await apiClient.put('/profiles/me', data);
      return response.data;
    } catch {
      return { ...mockProfiles[0], ...data };
    }
  },

  async searchProfiles(skill?: string): Promise<UserProfile[]> {
    try {
      const response = await apiClient.get(`/profiles/search`, { params: { skill } });
      return response.data;
    } catch {
      if (!skill) return mockProfiles;
      return mockProfiles.filter((p) =>
        p.skills.some((s) => s.toLowerCase().includes(skill.toLowerCase()))
      );
    }
  },
};
