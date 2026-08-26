import React, { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import { profileService } from '@/services/profileService';
import { UserProfile, GlobalRole } from '@/types';
import { Dialog } from '@/components/Dialog';
import { UserPlus } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [globalRole, setGlobalRole] = useState<GlobalRole>('Member');

  useEffect(() => {
    void fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await profileService.searchProfiles();
      setUsers(data || []);
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: GlobalRole) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      alert('Role updated successfully!');
      await fetchUsers();
    } catch {
      // Handled
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) return;

    setCreating(true);
    try {
      await adminService.createUser({
        fullName,
        email,
        password,
        globalRole
      });
      alert('Tạo tài khoản người dùng mới thành công!');
      setModalOpen(false);
      setFullName('');
      setEmail('');
      setPassword('');
      setGlobalRole('Member');
      await fetchUsers();
    } catch {
      alert('Không thể tạo tài khoản người dùng lúc này.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            Members & global roles
          </h1>
          <p className="text-xs text-slate-600 mt-1">Grant or update system permissions.</p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="btn-primary text-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          + Tạo tài khoản mới
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500 text-sm">Loading member directory...</div>
      ) : (
        <div className="tech-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs uppercase font-mono font-bold text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Member</th>
                  <th className="px-6 py-4">Registered skills</th>
                  <th className="px-6 py-4">Current global role</th>
                  <th className="px-6 py-4 text-right">Update permissions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {(users || []).map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    <td className="px-6 py-4 flex items-center gap-3">
                      {u.avatarUrl ? (
                        <img src={u.avatarUrl} alt={u.fullName} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-emerald-700 flex items-center justify-center font-bold text-xs border border-slate-200">
                          {(u.fullName || 'U').charAt(0)}
                        </div>
                      )}
                      <div>
                        <span className="font-bold text-slate-900 block">{u.fullName}</span>
                        <span className="text-[11px] text-slate-500 font-mono font-semibold">User ID: {u.id}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs font-mono text-slate-600">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {(u.skills || []).map((skill, idx) => (
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
                        <option value="Visitor">Visitor</option>
                        <option value="Member">Member</option>
                        <option value="LabManager">LabManager</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create User Dialog */}
      {modalOpen && (
        <Dialog open={modalOpen} onClose={() => setModalOpen(false)} title="Tạo tài khoản người dùng mới">
          <form onSubmit={handleCreateUser} className="space-y-4 pt-2">
            <div>
              <label htmlFor="user-fullname" className="field-label">Họ và tên thành viên</label>
              <input
                id="user-fullname"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Văn A"
                className="form-field"
              />
            </div>

            <div>
              <label htmlFor="user-email" className="field-label">Địa chỉ Email đăng nhập</label>
              <input
                id="user-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@vuonai.space"
                className="form-field"
              />
            </div>

            <div>
              <label htmlFor="user-password" className="field-label">Mật khẩu khởi tạo</label>
              <input
                id="user-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu ban đầu cho tài khoản"
                className="form-field"
              />
            </div>

            <div>
              <label htmlFor="user-role" className="field-label">Phân quyền hệ thống (Global Role)</label>
              <select
                id="user-role"
                value={globalRole}
                onChange={(e) => setGlobalRole(e.target.value as GlobalRole)}
                className="form-field"
              >
                <option value="Member">Member (Thành viên)</option>
                <option value="LabManager">LabManager (Quản lý Lab)</option>
                <option value="Admin">Admin (Quản trị viên)</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 border-t border-[var(--line)] pt-4 mt-6">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="btn-secondary text-xs"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={creating}
                className="btn-primary text-xs"
              >
                {creating ? 'Đang khởi tạo...' : 'Xác nhận tạo tài khoản'}
              </button>
            </div>
          </form>
        </Dialog>
      )}
    </div>
  );
};
