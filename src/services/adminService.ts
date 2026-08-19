import { apiClient } from './apiClient';
import { SystemMetrics, Equipment, GlobalRole } from '@/types';
import { mockEquipment } from './equipmentService';
import { mockProfiles } from './profileService';

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
};
