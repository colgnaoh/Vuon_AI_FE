import { apiClient } from './apiClient';
import { Lab } from '@/types';

export const mockLabs: Lab[] = [
  {
    id: 'lab-01',
    name: 'Zone 02 — Smart Vision & Edge AI Lab',
    location: 'Tầng 2, Tòa nhà Công nghệ Vườn AI',
    description: 'Không gian chuyên dụng cho phát triển mô hình Thị giác máy tính (Computer Vision), Camera AI thông minh và thiết bị tính toán biên NVIDIA Jetson / Hailo.',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
    status: 'Open',
    capacity: 25,
    activeWorkstations: 18,
    equipmentCount: 14,
    aiCameraActive: true,
    facilities: ['Workstation RT-X4090', 'Kit NVIDIA Jetson Orin', 'RealSense 3D Cameras', 'Màn hình hiển thị 4K Multi-view']
  },
  {
    id: 'lab-02',
    name: 'Zone 03 — Robotics & Autonomous Systems Lab',
    location: 'Tầng 1, Khu Thí nghiệm Robot',
    description: 'Phòng Lab với sàn mô phỏng địa hình cho Robot di chuyển tự hành (AMR), Cánh tay robot công nghiệp FAIRINO và cảm biến LiDAR.',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800',
    status: 'Open',
    capacity: 20,
    activeWorkstations: 12,
    equipmentCount: 10,
    aiCameraActive: true,
    facilities: ['Cobot FAIRINO FR5/FR3', 'LiDAR 3D Ouster & Velodyne', 'Môi trường Isaac Sim Dedicated Rig', 'Trạm sạc tự động AMR']
  },
  {
    id: 'lab-03',
    name: 'Zone 05 — IoT & Hardware Prototyping Maker Space',
    location: 'Tầng Trệt, Xưởng Chế tạo',
    description: 'Không gian gia công nhanh prototype, in 3D Bambu Lab, máy cắt Laser CNC và trạm hàn vi mạch điện tử cho các ý tưởng IoT.',
    imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=800',
    status: 'Open',
    capacity: 35,
    activeWorkstations: 28,
    equipmentCount: 22,
    aiCameraActive: false,
    facilities: ['Máy in 3D Bambu Lab P1S', 'Máy hàn vi mạch Weller', 'Oscilloscope 100MHz', 'Khu vực lưu trữ linh kiện ESP32/STM32']
  }
];

export const labService = {
  async getLabs(): Promise<Lab[]> {
    try {
      const response = await apiClient.get('/labs');
      return response.data;
    } catch {
      return mockLabs;
    }
  },

  async getLabById(id: string): Promise<Lab> {
    try {
      const response = await apiClient.get(`/labs/${id}`);
      return response.data;
    } catch {
      return mockLabs.find((l) => l.id === id) || mockLabs[0];
    }
  }
};
