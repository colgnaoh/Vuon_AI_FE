import { apiClient } from './apiClient';
import { Equipment, Booking } from '@/types';

export const mockEquipment: Equipment[] = [
  {
    id: 'eq-01',
    name: 'NVIDIA Jetson Orin Nano Developer Kit (8GB)',
    category: 'AI',
    description: 'Compact AI edge board delivering up to 40 TOPS for computer vision and VLM applications.',
    specifications: 'GPU 1024-core NVIDIA Ampere, 6-core Arm Cortex-A78AE, 8GB LPDDR5',
    status: 'Available',
    location: 'Zone 02 - AI Lab (Cabinet A1)',
    imageUrl: '/equipment/jetson-orin-nano.jpg',
  },
  {
    id: 'eq-02',
    name: 'Raspberry Pi 5 Model B (8GB RAM)',
    category: 'IoT',
    description: 'Next-generation single-board computer with a 2.4GHz quad-core 64-bit Arm Cortex-A76.',
    specifications: 'Broadcom BCM2712, 8GB LPDDR4X, Dual 4K display output, PCIe 2.0 interface',
    status: 'Borrowed',
    location: 'Zone 04 - IoT Lab (Bench 3)',
    imageUrl: '/equipment/raspberry-pi-5.png',
  },
  {
    id: 'eq-03',
    name: 'Intel RealSense Depth Camera D435i',
    category: 'Vision',
    description: 'Stereo depth camera for robot vision, SLAM and 3D perception.',
    specifications: 'Range: 0.3m - 3m, integrated 6-DOF IMU, RGB 1920x1080 @ 30fps',
    status: 'Available',
    location: 'Zone 03 - Robotics Lab (Shelf C2)',
    imageUrl: '/equipment/realsense-d435i.jpg',
  },
  {
    id: 'eq-04',
    name: 'Bambu Lab P1S 3D Printer',
    category: 'Maker',
    description: 'High-speed enclosed 3D printer with automatic bed leveling for stable prototypes.',
    specifications: '256x256x256mm build volume, 500mm/s print speed, AI failure-detection camera',
    status: 'Available',
    location: 'Zone 05 - Maker Space',
    imageUrl: '/equipment/bambu-lab-p1s.jpg',
  },
  {
    id: 'eq-05',
    name: 'FAIRINO FR5 and FR3 arms',
    category: 'Robotics',
    description: '6-axis cobots for pick-and-place, inspection and automation experiments in the lab.',
    specifications: 'FR5: 5kg payload, 922mm reach · FR3: 3kg payload, 622mm reach',
    status: 'Reserved',
    location: 'Zone 03 - Robotics Lab',
    imageUrl: '/equipment/fairino-fr3-fr5.jpg',
  },
];

export const mockBookings: Booking[] = [
  {
    id: 'bk-01',
    equipmentId: 'eq-02',
    equipmentName: 'Raspberry Pi 5 Model B (8GB RAM)',
    userId: 'usr-104',
    userName: 'Hoàng Nam',
    startDate: '2026-08-15',
    endDate: '2026-08-22',
    purpose: 'Test SLAM algorithms on a physical AMR',
    status: 'Active',
    createdAt: '2026-08-14T08:00:00Z',
  },
  {
    id: 'bk-02',
    equipmentId: 'eq-01',
    equipmentName: 'NVIDIA Jetson Orin Nano Developer Kit (8GB)',
    userId: 'usr-101',
    userName: 'Alex Nguyễn',
    startDate: '2026-08-01',
    endDate: '2026-08-10',
    purpose: 'Benchmark a YOLOv8 model with TensorRT',
    status: 'Returned',
    returnedAt: '2026-08-10T16:00:00Z',
    createdAt: '2026-07-31T10:00:00Z',
  },
];

export const equipmentService = {
  async getEquipment(category?: string): Promise<Equipment[]> {
    try {
      const response = await apiClient.get('/equipment', { params: { category } });
      return Array.isArray(response.data) ? response.data : mockEquipment;
    } catch {
      if (!category || category === 'All') return mockEquipment;
      return mockEquipment.filter((e) => e.category.toLowerCase() === category.toLowerCase());
    }
  },

  async getEquipmentById(id: string): Promise<Equipment> {
    try {
      const response = await apiClient.get(`/equipment/${id}`);
      return response.data;
    } catch {
      return mockEquipment.find((e) => e.id === id) || mockEquipment[0];
    }
  },

  async getMyBookings(): Promise<Booking[]> {
    try {
      const response = await apiClient.get('/equipment/my-bookings');
      return Array.isArray(response.data) ? response.data : mockBookings;
    } catch {
      return mockBookings;
    }
  },

  async createBooking(equipmentId: string, startDate: string, endDate: string, purpose: string): Promise<Booking> {
    try {
      const response = await apiClient.post(`/equipment/${equipmentId}/bookings`, { startDate, endDate, purpose });
      return response.data;
    } catch (err: any) {
      // Handle overlap date check simulation
      const item = mockEquipment.find((e) => e.id === equipmentId);
      if (item && item.status === 'Borrowed') {
        throw new Error('This equipment is already booked for the selected dates. Please choose another date range.');
      }

      const newBk: Booking = {
        id: 'bk-' + Date.now(),
        equipmentId,
        equipmentName: item ? item.name : 'Hardware Device',
        userId: 'usr-101',
        userName: 'Alex Nguyễn',
        startDate,
        endDate,
        purpose,
        status: 'Active',
        createdAt: new Date().toISOString(),
      };
      if (item) item.status = 'Borrowed';
      mockBookings.unshift(newBk);
      return newBk;
    }
  },

  async returnEquipment(bookingId: string): Promise<void> {
    try {
      await apiClient.patch(`/equipment/bookings/${bookingId}/return`);
    } catch {
      const bk = mockBookings.find((b) => b.id === bookingId);
      if (bk) {
        bk.status = 'Returned';
        bk.returnedAt = new Date().toISOString();
        const eq = mockEquipment.find((e) => e.id === bk.equipmentId);
        if (eq) eq.status = 'Available';
      }
    }
  },

  async checkAvailability(id: string, startDate: string, endDate: string): Promise<{ isAvailable: boolean; message?: string }> {
    try {
      const response = await apiClient.get(`/equipment/${id}/availability`, {
        params: { startDate, endDate }
      });
      return response.data;
    } catch {
      // Mock logic check
      const isOverlapped = mockBookings.some((b) =>
        b.equipmentId === id &&
        b.status === 'Active' &&
        ((startDate >= b.startDate && startDate <= b.endDate) || (endDate >= b.startDate && endDate <= b.endDate))
      );
      return { isAvailable: !isOverlapped };
    }
  },
};
