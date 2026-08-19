import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectService } from '@/services/projectService';
import { Project, ProjectStatus } from '@/types';
import { ArrowLeft, CheckCircle2, UserCheck, Shield, Clock } from 'lucide-react';

export const ProjectManagePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchProject(id);
  }, [id]);

  const fetchProject = async (projId: string) => {
    setLoading(true);
    try {
      const data = await projectService.getProjectById(projId);
      setProject(data);
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (targetUserId: string) => {
    if (!id) return;
    try {
      await projectService.approveMember(id, targetUserId);
      alert('Đã phê duyệt thành viên chính thức!');
      fetchProject(id);
    } catch {
      // Handled
    }
  };

  const handleStatusChange = async (status: ProjectStatus) => {
    if (!id) return;
    try {
      await projectService.updateStatus(id, status);
      fetchProject(id);
    } catch {
      // Handled
    }
  };

  if (loading || !project) {
    return <div className="text-center py-20 text-slate-500 text-sm">Đang tải thông tin quản lý dự án...</div>;
  }

  const pendingMembers = project.members.filter((m) => m.status === 'Pending');
  const activeMembers = project.members.filter((m) => m.status === 'Active');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <Link to={`/projects/${project.id}`} className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-500 hover:text-emerald-700">
        <ArrowLeft className="w-4 h-4" /> Trở về Chi Tiết Dự Án
      </Link>

      <div className="tech-card p-6 md:p-8 space-y-6 border-emerald-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <span className="text-xs font-mono text-emerald-700 font-bold uppercase tracking-wider">PROJECT LEADER CONSOLE</span>
            <h1 className="text-2xl font-extrabold text-slate-900">{project.title}</h1>
          </div>

          {/* Status Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-600 font-bold">Trạng thái:</span>
            <select
              value={project.status}
              onChange={(e) => handleStatusChange(e.target.value as ProjectStatus)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-300 text-slate-900 rounded text-xs font-mono font-bold focus:outline-none"
            >
              <option value="Recruiting">Recruiting (Tuyển quân)</option>
              <option value="Building">Building (Đang phát triển)</option>
              <option value="Testing">Testing (Thử nghiệm)</option>
              <option value="Completed">Completed (Hoàn thành)</option>
              <option value="Paused">Paused (Tạm dừng)</option>
            </select>
          </div>
        </div>

        {/* Pending Join Requests */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" /> Yêu Cầu Xin Tham Gia Đang Chờ Duyệt ({pendingMembers.length})
          </h3>

          {pendingMembers.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 italic">
              Không có yêu cầu xin tham gia mới nào.
            </div>
          ) : (
            <div className="space-y-3">
              {pendingMembers.map((m) => (
                <div key={m.userId} className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                      {m.fullName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{m.fullName}</h4>
                      <p className="text-xs text-slate-600">Ứng tuyển vị trí: <strong className="text-amber-800">{m.roleInProject}</strong></p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleApprove(m.userId)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Phê Duyệt
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Team Members */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-600" /> Thành Viên Chính Thức ({activeMembers.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeMembers.map((m) => (
              <div key={m.userId} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  {m.fullName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{m.fullName}</h4>
                  <p className="text-[11px] text-slate-600">{m.roleInProject}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
