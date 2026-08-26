import { apiClient } from './apiClient';
import { Idea, Comment } from '@/types';

export const mockIdeas: Idea[] = [
  {
    id: 'idea-01',
    title: 'AI Robot for Automated Waste Sorting with a Vision Language Model',
    summary: 'A mobile robot with a depth camera and VLM (Vision Language Model) for identifying and sorting recyclable waste around the lab.',
    description: 'Build a small mobile robot on NVIDIA Jetson Orin Nano, combining a RealSense D435 camera and VLM algorithms to sort complex waste that standard YOLO models cannot yet handle.',
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
    title: 'Autonomous AGV',
    summary: 'An autonomous guided vehicle for moving materials through a smart warehouse with ROS2 and LiDAR sensors.',
    description: 'Build an autonomous vehicle that can map its surroundings, receive tasks and move safely between lab zones.',
    authorId: 'usr-102',
    authorName: 'Minh Trần',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    requiredTech: ['ROS2', 'Nav2', 'LiDAR', 'C++'],
    lookingForRoles: ['1 Robotics Developer', '1 Embedded Developer'],
    status: 'Open',
    commentCount: 2,
    createdAt: '2026-08-17T14:30:00Z',
  },
  {
    id: 'idea-03',
    title: 'Automated Robot Arm Pick-and-Place with a Digital Twin',
    summary: 'Simulate an industrial pick-and-place robot in Gazebo/NVIDIA Isaac Sim before running it in the real world.',
    description: 'Build a digital twin to test inverse kinematics and obstacle avoidance before sending commands to the lab robot arm.',
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
      content: 'Great idea! I have an ESP32-S3 Cam board and experience controlling stepper motors. I would like to join as an embedded developer.',
      createdAt: '2026-08-15T11:20:00Z',
    },
    {
      id: 'c-2',
      ideaId: 'idea-01',
      authorId: 'usr-104',
      authorName: 'Hoàng Nam',
      authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      content: 'The Robotics Lab has a four-wheel Mecanum mobile robot chassis and an available Jetson Orin Nano. The team can borrow them right away.',
      createdAt: '2026-08-15T14:05:00Z',
    },
  ],
};

export const ideaService = {
  async getIdeas(): Promise<Idea[]> {
    try {
      const response = await apiClient.get('/ideas');
      return Array.isArray(response.data) ? response.data : mockIdeas;
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
