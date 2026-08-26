import { apiClient } from './apiClient';
import { SystemMetrics, Equipment, GlobalRole, AdminBookingApproval, AdminIdeaApproval, AdminProjectApproval } from '@/types';
import { mockEquipment, mockBookings } from './equipmentService';
import { mockProfiles } from './profileService';
import { mockIdeas } from './ideaService';
import { mockProjects } from './projectService';

export const adminService = {
  async getMetrics(): Promise<SystemMetrics> {
    try {
      const response = await apiClient.get('/admin/metrics');
      return response.data;
    } catch {
      return {
        totalUsers: 48,
        totalIdeas: 12,
        activeProjects: 6,
        activeBookings: 5,
        totalEquipment: 24,
      };
    }
  },

  async addEquipment(data: Omit<Equipment, 'id'>): Promise<Equipment> {
    try {
      const response = await apiClient.post('/admin/equipment', data);
      return response.data;
    } catch {
      const newEq: Equipment = {
        ...data,
        id: 'eq-' + Date.now(),
      };
      mockEquipment.push(newEq);
      return newEq;
    }
  },

  async updateEquipmentStatus(id: string, status: Equipment['status']): Promise<void> {
    try {
      await apiClient.patch(`/admin/equipment/${id}/status`, { status });
    } catch {
      const eq = mockEquipment.find((e) => e.id === id);
      if (eq) eq.status = status;
    }
  },

  async updateUserRole(userId: string, role: GlobalRole): Promise<void> {
    try {
      await apiClient.patch(`/admin/users/${userId}/role`, { globalRole: role });
    } catch {
      const user = mockProfiles.find((u) => u.id === userId);
      if (user) user.globalRole = role;
    }
  },

  async createUser(data: { email: string; password?: string; fullName: string; globalRole: GlobalRole; bio?: string; expertise?: string[] }): Promise<void> {
    try {
      await apiClient.post('/admin/users', data);
    } catch {
      const newUser = {
        id: 'usr-' + Date.now(),
        fullName: data.fullName,
        globalRole: data.globalRole,
        skills: data.expertise || ['AI', 'Python'],
        interests: ['Machine Learning'],
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        createdAt: new Date().toISOString()
      };
      mockProfiles.unshift(newUser);
    }
  },

  // Booking Approvals
  async getPendingBookings(): Promise<AdminBookingApproval[]> {
    try {
      const response = await apiClient.get('/admin/bookings');
      return response.data;
    } catch {
      return mockBookings.map((b) => ({
        id: b.id,
        equipmentId: b.equipmentId,
        equipmentName: b.equipmentName,
        userId: b.userId,
        userName: b.userName,
        startDate: b.startDate,
        endDate: b.endDate,
        purpose: b.purpose,
        status: b.status,
        createdAt: b.createdAt
      }));
    }
  },

  async approveBooking(bookingId: string): Promise<void> {
    try {
      await apiClient.post(`/admin/bookings/${bookingId}/approve`);
    } catch {
      const bk = mockBookings.find((b) => b.id === bookingId);
      if (bk) bk.status = 'Active';
    }
  },

  async rejectBooking(bookingId: string, reason?: string): Promise<void> {
    try {
      await apiClient.post(`/admin/bookings/${bookingId}/reject`, { reason });
    } catch {
      const bk = mockBookings.find((b) => b.id === bookingId);
      if (bk) bk.status = 'Cancelled';
    }
  },

  // Idea Approvals
  async getAdminIdeas(): Promise<AdminIdeaApproval[]> {
    try {
      const response = await apiClient.get('/admin/ideas');
      return response.data;
    } catch {
      return mockIdeas.map((i) => ({
        id: i.id,
        title: i.title,
        summary: i.summary,
        authorName: i.authorName,
        authorId: i.authorId,
        requiredTech: i.requiredTech,
        status: i.status,
        createdAt: i.createdAt
      }));
    }
  },

  async approveIdea(ideaId: string): Promise<void> {
    try {
      await apiClient.post(`/admin/ideas/${ideaId}/approve`);
    } catch {
      const idea = mockIdeas.find((i) => i.id === ideaId);
      if (idea) idea.status = 'Open';
    }
  },

  async rejectIdea(ideaId: string): Promise<void> {
    try {
      await apiClient.post(`/admin/ideas/${ideaId}/reject`);
    } catch {
      const idea = mockIdeas.find((i) => i.id === ideaId);
      if (idea) idea.status = 'Closed';
    }
  },

  // Project Approvals
  async getAdminProjects(): Promise<AdminProjectApproval[]> {
    try {
      const response = await apiClient.get('/admin/projects');
      return response.data;
    } catch {
      return mockProjects.map((p) => ({
        id: p.id,
        title: p.title,
        summary: p.summary,
        leaderName: p.leaderName,
        leaderId: p.leaderId,
        techStack: p.techStack,
        domainCategory: p.domainCategory,
        status: p.status,
        createdAt: p.createdAt
      }));
    }
  },

  async approveProject(projectId: string): Promise<void> {
    try {
      await apiClient.post(`/admin/projects/${projectId}/approve`);
    } catch {
      const proj = mockProjects.find((p) => p.id === projectId);
      if (proj) proj.status = 'Building';
    }
  },

  async rejectProject(projectId: string): Promise<void> {
    try {
      await apiClient.post(`/admin/projects/${projectId}/reject`);
    } catch {
      const proj = mockProjects.find((p) => p.id === projectId);
      if (proj) proj.status = 'Paused';
    }
  }
};

