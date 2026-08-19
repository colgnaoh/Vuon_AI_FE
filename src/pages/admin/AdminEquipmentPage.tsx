import React, { useState, useEffect } from 'react';
import { Dialog } from '@/components/Dialog';
import { adminService } from '@/services/adminService';
import { equipmentService } from '@/services/equipmentService';
import { Equipment, EquipmentCategory } from '@/types';

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
            Lab equipment inventory
          </h1>
          <p className="text-xs text-slate-600 mt-1">Add equipment and override live inventory status.</p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
        >
          Add new equipment
        </button>
      </div>

      {/* Equipment Data Table */}
      {loading ? (
        <div className="text-center py-20 text-slate-500 text-sm">Loading equipment inventory...</div>
      ) : (
        <div className="tech-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs uppercase font-mono font-bold text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">ID / equipment</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Storage location</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Change status</th>
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
                        <option value="Available">Available</option>
                        <option value="Borrowed">Borrowed</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Reserved">Reserved</option>
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
        <Dialog open={addModalOpen} onClose={() => setAddModalOpen(false)} title="Add equipment to inventory" size="sm">
            <form onSubmit={handleAddEquipment} className="space-y-4">
              <div>
                <label htmlFor="equipment-name" className="block text-xs font-mono text-slate-700 mb-1 uppercase font-bold">Equipment name</label>
                <input
                  id="equipment-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="VD: NVIDIA Jetson Orin Nano (8GB)..."
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
                />
              </div>

              <div>
                <label htmlFor="equipment-category" className="block text-xs font-mono text-slate-700 mb-1 uppercase font-bold">Inventory category</label>
                <select
                  id="equipment-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
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
                <label htmlFor="equipment-description" className="block text-xs font-mono text-slate-700 mb-1 uppercase font-bold">Use case</label>
                <textarea
                  id="equipment-description"
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Compact 40 TOPS edge board for computer vision..."
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
                />
              </div>

              <div>
                <label htmlFor="equipment-specs" className="block text-xs font-mono text-slate-700 mb-1 uppercase font-bold">Technical specifications</label>
                <input
                  id="equipment-specs"
                  type="text"
                  value={specifications}
                  onChange={(e) => setSpecifications(e.target.value)}
                  placeholder="GPU 1024-core Ampere, 8GB LPDDR5"
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
                />
              </div>

              <div>
                <label htmlFor="equipment-location" className="block text-xs font-mono text-slate-700 mb-1 uppercase font-bold">Lab storage location</label>
                <input
                  id="equipment-location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Zone 02 - AI Lab (Cabinet A1)"
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Add equipment
                </button>
              </div>
            </form>
        </Dialog>
      )}

    </div>
  );
};
