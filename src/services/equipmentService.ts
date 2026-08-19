import { apiClient } from './apiClient';
import { Equipment, Booking } from '@/types';

export const mockEquipment: Equipment[] = [
  {
    id: 'eq-01',
    name: 'NVIDIA Jetson Orin Nano Developer Kit (8GB)',
    category: 'AI',
    description: 'Bo mạch AI Edge siêu nhỏ gọn hiệu năng tới 40 TOPS cho ứng dụng Computer Vision và VLM.',
    specifications: 'GPU 1024-core NVIDIA Ampere, 6-core Arm Cortex-A78AE, 8GB LPDDR5',
    status: 'Available',
    location: 'Zone 02 - AI Lab (Tủ A1)',
    imageUrl: 'https://images.unsplash.com/photo-1608564697071-ddf6e1e813d6?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'eq-02',
    name: 'Raspberry Pi 5 Model B (8GB RAM)',
    category: 'IoT',
    description: 'Máy tính bo mạch đơn thế hệ mới tốc độ 2.4GHz lõi tứ 64-bit Arm Cortex-A76.',
    specifications: 'Broadcom BCM2712, 8GB LPDDR4X, Dual 4K display output, PCIe 2.0 interface',
    status: 'Borrowed',
    location: 'Zone 04 - IoT Lab (Bàn 3)',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'eq-03',
    name: 'Intel RealSense Depth Camera D435i',
    category: 'Vision',
    description: 'Camera đo chiều sâu stereo chuyên dụng cho Robot Vision, SLAM và nhận diện 3D.',
    specifications: 'Range: 0.3m - 3m, IMU 6-DOF tích hợp, RGB 1920x1080 @ 30fps',
    status: 'Available',
    location: 'Zone 03 - Robotics Lab (Kệ C2)',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'eq-04',
    name: 'Máy In 3D Bambu Lab X1 Carbon',
    category: 'Maker',
    description: 'Máy in 3D tốc độ cao có LiDAR căn chỉnh bàn in tự động và đầu đùn 300°C hỗ trợ sợi carbon.',
    specifications: 'Khổ in 256x256x256mm, Tốc độ in 500mm/s, Camera AI phát hiện lỗi in',
    status: 'Available',
    location: 'Zone 05 - Maker Space',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'eq-05',
    name: 'Cánh Tay Robot 6 Trục DOBOT Magician Lite',
    category: 'Robotics',
    description: 'Robot Arm giáo dục hỗ trợ đầu gắp tay kẹp khí nén, đầu hút chân không và bút vẽ.',
    specifications: 'Payload 250g, Độ chính xác 0.2mm, Giao tiếp USB / Bluetooth',
    status: 'Reserved',
    location: 'Zone 03 - Robotics Lab',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=400&q=80',
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
    purpose: 'Thử nghiệm thuật toán SLAM trên xe AMR thực tế',
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
    purpose: 'Benchmark mô hình YOLOv8 trên TensorRT',
    status: 'Returned',
    returnedAt: '2026-08-10T16:00:00Z',
    createdAt: '2026-07-31T10:00:00Z',
  },
];

export const equipmentService = {
  async getEquipment(category?: string): Promise<Equipment[]> {
    try {
      const response = await apiClient.get('/equipment', { params: { category } });
      return response.data;
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
      return response.data;
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
        throw new Error('Thiết bị này đã có người đặt mượn trong khoảng thời gian trên. Vui lòng chọn khoảng ngày khác!');
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
};
