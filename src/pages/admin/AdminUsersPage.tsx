import React, { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import { profileService } from '@/services/profileService';
import { UserProfile, GlobalRole } from '@/types';
import { Users, Shield, UserCheck } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await profileService.searchProfiles();
      setUsers(data);
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: GlobalRole) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      alert('Đã cập nhật role thành công!');
      fetchUsers();
    } catch {
      // Handled
    }
  };

  return (
    <div className="space-y-8">
      
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-emerald-600" /> Quản Lý Thành Viên & Global Roles
        </h1>
        <p className="text-xs text-slate-600 mt-1">Cấp quyền hoặc thay đổi quyền vai trò người dùng hệ thống.</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500 text-sm">Đang tải danh sách thành viên...</div>
      ) : (
        <div className="tech-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs uppercase font-mono font-bold text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Thành Viên</th>
                  <th className="px-6 py-4">Kỹ Năng Đã Đăng Ký</th>
                  <th className="px-6 py-4">Global Role Hiện Tại</th>
                  <th className="px-6 py-4 text-right">Cập Nhật Quyền Hạn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    <td className="px-6 py-4 flex items-center gap-3">
                      {u.avatarUrl ? (
                        <img src={u.avatarUrl} alt={u.fullName} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-emerald-700 flex items-center justify-center font-bold text-xs border border-slate-200">
                          {u.fullName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <span className="font-bold text-slate-900 block">{u.fullName}</span>
                        <span className="text-[11px] text-slate-500 font-mono font-semibold">User ID: {u.id}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs font-mono text-slate-600">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {u.skills.map((skill, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-bold border border-slate-200">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                        u.globalRole === 'Admin'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : u.globalRole === 'LabManager'
                          ? 'bg-teal-100 text-teal-800 border border-teal-300'
                          : 'bg-slate-100 text-slate-700 border border-slate-300'
                      }`}>
                        {u.globalRole}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <select
                        value={u.globalRole}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as GlobalRole)}
                        className="px-3 py-1.5 bg-slate-50 border border-slate-300 text-xs font-mono font-bold text-slate-900 rounded focus:outline-none"
                      >
                        <option value="Visitor">Visitor (Khách)</option>
                        <option value="Member">Member (Thành viên)</option>
                        <option value="LabManager">LabManager (Quản lý Lab)</option>
                        <option value="Admin">Admin (Quản trị viên)</option>
                      </select>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
