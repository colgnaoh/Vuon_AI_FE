import React, { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import { equipmentService } from '@/services/equipmentService';
import { Equipment, EquipmentCategory } from '@/types';
import { Wrench, Plus, Edit2, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

export const AdminEquipmentPage: React.FC = () => {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<EquipmentCategory>('AI');
  const [description, setDescription] = useState('');
  const [specifications, setSpecifications] = useState('');
  const [location, setLocation] = useState('Zone 02 - AI Lab');

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    setLoading(true);
    try {
      const data = await equipmentService.getEquipment();
      setEquipmentList(data);
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  const handleAddEquipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) return;

    try {
      await adminService.addEquipment({
        name,
        category,
        description,
        specifications,
        location,
        status: 'Available',
      });
      setAddModalOpen(false);
      setName('');
      setDescription('');
      fetchEquipment();
    } catch {
      // Handled
    }
  };

  const handleStatusToggle = async (id: string, newStatus: Equipment['status']) => {
    try {
      await adminService.updateEquipmentStatus(id, newStatus);
      fetchEquipment();
    } catch {
      // Handled
    }
  };

  return (
    <div className="space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Wrench className="w-6 h-6 text-emerald-600" /> Quản Lý Kho Thiết Bị Lab
          </h1>
          <p className="text-xs text-slate-600 mt-1">Thêm thiết bị mới và override trạng thái hoạt động trong kho.</p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
        >
          <Plus className="w-4 h-4" /> Thêm Thiết Bị Mới
        </button>
      </div>

      {/* Equipment Data Table */}
      {loading ? (
        <div className="text-center py-20 text-slate-500 text-sm">Đang tải kho thiết bị...</div>
      ) : (
        <div className="tech-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs uppercase font-mono font-bold text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Mã / Tên Thiết Bị</th>
                  <th className="px-6 py-4">Phân Loại</th>
                  <th className="px-6 py-4">Vị Trí Cất Giữ</th>
                  <th className="px-6 py-4">Trạng Thái</th>
                  <th className="px-6 py-4 text-right">Đổi Trạng Thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {equipmentList.map((eq) => (
                  <tr key={eq.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900 block">{eq.name}</span>
                      <span className="text-[11px] text-slate-500 font-mono">ID: {eq.id}</span>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono font-bold text-emerald-700">
                      {eq.category}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600 font-medium">
                      {eq.location || 'Zone Lab'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                        eq.status === 'Available'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : eq.status === 'Borrowed'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}>
                        {eq.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select
                        value={eq.status}
                        onChange={(e) => handleStatusToggle(eq.id, e.target.value as any)}
                        className="px-2.5 py-1 bg-slate-50 border border-slate-300 text-xs font-mono font-bold text-slate-900 rounded focus:outline-none"
                      >
                        <option value="Available">Available (Sẵn sàng)</option>
                        <option value="Borrowed">Borrowed (Đang mượn)</option>
                        <option value="Maintenance">Maintenance (Bảo trì)</option>
                        <option value="Reserved">Reserved (Đặt trước)</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Equipment Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="tech-card p-6 md:p-8 max-w-md w-full space-y-6 relative border-emerald-300 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-emerald-600" /> Thêm Thiết Bị Vào Kho
              </h3>
              <button onClick={() => setAddModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleAddEquipment} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-700 mb-1 uppercase font-bold">Tên Thiết Bị</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="VD: NVIDIA Jetson Orin Nano (8GB)..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-700 mb-1 uppercase font-bold">Danh Mục Kho</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-emerald-500"
                >
                  <option value="AI">AI & Edge Compute</option>
                  <option value="Robotics">Robotics & Motors</option>
                  <option value="IoT">IoT & Microcontrollers</option>
                  <option value="Embedded">Embedded Hardware</option>
                  <option value="Maker">Maker & 3D Printer</option>
                  <option value="Vision">Vision & Depth Cameras</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-700 mb-1 uppercase font-bold">Mô Tả Công Dụng</label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Bo mạch nén AI Edge 40 TOPS cho Computer Vision..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-700 mb-1 uppercase font-bold">Thông Số Kỹ Thuật (Specs)</label>
                <input
                  type="text"
                  value={specifications}
                  onChange={(e) => setSpecifications(e.target.value)}
                  placeholder="GPU 1024-core Ampere, 8GB LPDDR5"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-700 mb-1 uppercase font-bold">Vị Trí Cất Giữ Trong Lab</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Zone 02 - AI Lab (Tủ A1)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold text-sm rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-lg"
                >
                  Thêm Thiết Bị
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
