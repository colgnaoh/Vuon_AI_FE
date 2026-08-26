import { apiClient } from './apiClient';
import { Project, ProjectStatus } from '@/types';

export const mockProjects: Project[] = [
  {
    id: 'proj-01',
    title: 'Autonomous Mobile Robot (AMR) for a Smart Warehouse',
    summary: 'An autonomous mobile robot using SLAM, 2D LiDAR and the ROS2 Nav2 navigation stack.',
    description: 'Research and build an AMR prototype for moving goods through the VUON AI SPACE mini warehouse. Integrate a RealSense camera for dynamic obstacle avoidance with LiDAR localization.',
    leaderId: 'usr-104',
    leaderName: 'Hoàng Nam',
    leaderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    techStack: ['ROS2 Nav2', 'LiDAR', 'C++', 'Python', 'STM32', 'Gazebo'],
    domainCategory: 'Robotics',
    status: 'Building',
    equipmentUsed: ['Raspberry Pi 5', 'Depth Camera RealSense D435', 'STM32F4 Board'],
    members: [
      {
        userId: 'usr-104',
        fullName: 'Hoàng Nam',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        roleInProject: 'Project Leader / Robotics Engineer',
        status: 'Active',
        joinedAt: '2026-07-01T00:00:00Z',
      },
      {
        userId: 'usr-102',
        fullName: 'Minh Trần',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        roleInProject: 'Embedded Engineer',
        status: 'Active',
        joinedAt: '2026-07-05T00:00:00Z',
      },
      {
        userId: 'usr-103',
        fullName: 'Thu Hà',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
        roleInProject: 'Fullstack Dev (Monitoring Web)',
        status: 'Pending',
        joinedAt: '2026-08-18T09:00:00Z',
      },
    ],
    createdAt: '2026-07-01T00:00:00Z',
  },
  {
    id: 'proj-02',
    title: 'Edge AI Camera for Lab Safety Monitoring',
    summary: 'A real-time system for detecting unsafe behavior, such as missing safety glasses, smoke and fire.',
    description: 'Deploy an optimized YOLOv8 Nano model through TensorRT on NVIDIA Jetson Orin Nano, sending alerts through Discord or Telegram webhooks.',
    leaderId: 'usr-101',
    leaderName: 'Alex Nguyễn',
    leaderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    techStack: ['YOLOv8', 'TensorRT', 'NVIDIA Jetson', 'Python', 'FastAPI'],
    domainCategory: 'AI',
    status: 'Recruiting',
    equipmentUsed: ['Jetson Orin Nano 8GB', 'Camera USB Full HD'],
    members: [
      {
        userId: 'usr-101',
        fullName: 'Alex Nguyễn',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        roleInProject: 'Project Leader / AI Engineer',
        status: 'Active',
        joinedAt: '2026-08-01T00:00:00Z',
      },
    ],
    createdAt: '2026-08-01T00:00:00Z',
  },
];

export const projectService = {
  async getProjects(category?: string): Promise<Project[]> {
    try {
      const response = await apiClient.get('/projects', { params: { category } });
      return Array.isArray(response.data) ? response.data : mockProjects;
    } catch {
      if (!category || category === 'All') return mockProjects;
      return mockProjects.filter((p) => p.domainCategory.toLowerCase() === category.toLowerCase());
    }
  },

  async getProjectById(id: string): Promise<Project> {
    try {
      const response = await apiClient.get(`/projects/${id}`);
      return response.data;
    } catch {
      return mockProjects.find((p) => p.id === id) || mockProjects[0];
    }
  },

  async createProject(data: Omit<Project, 'id' | 'leaderId' | 'members' | 'status' | 'createdAt'>): Promise<Project> {
    try {
      const response = await apiClient.post('/projects', data);
      return response.data;
    } catch {
      const newProj: Project = {
        ...data,
        id: 'proj-' + Date.now(),
        leaderId: 'usr-101',
        leaderName: 'Alex Nguyễn',
        leaderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        status: 'Recruiting',
        members: [
          {
            userId: 'usr-101',
            fullName: 'Alex Nguyễn',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            roleInProject: 'Project Leader',
            status: 'Active',
            joinedAt: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
      };
      mockProjects.unshift(newProj);
      return newProj;
    }
  },

  async joinProject(projectId: string, roleInProject: string): Promise<void> {
    try {
      await apiClient.post(`/projects/${projectId}/join`, { roleInProject });
    } catch {
      const proj = mockProjects.find((p) => p.id === projectId);
      if (proj) {
        proj.members.push({
          userId: 'usr-101',
          fullName: 'Alex Nguyễn',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          roleInProject: roleInProject || 'Team Member',
          status: 'Pending',
          joinedAt: new Date().toISOString(),
        });
      }
    }
  },

  async approveMember(projectId: string, targetUserId: string): Promise<void> {
    try {
      await apiClient.patch(`/projects/${projectId}/members/${targetUserId}/approve`);
    } catch {
      const proj = mockProjects.find((p) => p.id === projectId);
      if (proj) {
        const member = proj.members.find((m) => m.userId === targetUserId);
        if (member) member.status = 'Active';
      }
    }
  },

  async updateStatus(projectId: string, status: ProjectStatus): Promise<void> {
    try {
      await apiClient.patch(`/projects/${projectId}/status`, { status });
    } catch {
      const proj = mockProjects.find((p) => p.id === projectId);
      if (proj) proj.status = status;
    }
  },
};
