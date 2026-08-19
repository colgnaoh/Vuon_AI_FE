import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { projectService } from '@/services/projectService';
import { Project } from '@/types';
import { FolderGit2, Users, ArrowLeft, UserPlus, Settings, CheckCircle2, Cpu, Wrench } from 'lucide-react';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [roleInProject, setRoleInProject] = useState('');
  const [applied, setApplied] = useState(false);

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

  const handleApplyJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !roleInProject) return;

    try {
      await projectService.joinProject(id, roleInProject);
      setApplied(true);
      setJoinModalOpen(false);
      fetchProject(id);
    } catch {
      // Handled
    }
  };

  if (loading || !project) {
    return <div className="text-center py-20 text-slate-500 text-sm">Đang tải chi tiết dự án...</div>;
  }

  const isLeader = user?.fullName === project.leaderName || user?.globalRole === 'Admin';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Navigation & Actions */}
      <div className="flex items-center justify-between">
        <Link to="/projects" className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-500 hover:text-emerald-700">
          <ArrowLeft className="w-4 h-4" /> Trở về Danh Mục Dự Án
        </Link>

        {isLeader && (
          <Link
            to={`/projects/${project.id}/manage`}
            className="px-4 py-2 bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-2xs"
          >
            <Settings className="w-3.5 h-3.5" /> Quản Lý Team & Duyệt Member
          </Link>
        )}
      </div>

      {/* Main Project Details */}
      <div className="tech-card p-6 md:p-8 space-y-6 border-emerald-300">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="space-y-2">
            <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              Lĩnh vực: {project.domainCategory}
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900">{project.title}</h1>
          </div>

          <button
            onClick={() => setJoinModalOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4" /> Đăng Ký Tham Gia Team
          </button>
        </div>

        {/* Project Leader */}
        <div className="flex items-center gap-3">
          {project.leaderAvatar ? (
            <img src={project.leaderAvatar} alt={project.leaderName} className="w-10 h-10 rounded-full object-cover border border-emerald-300" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-100 text-emerald-700 font-bold flex items-center justify-center border border-slate-200">
              {project.leaderName.charAt(0)}
            </div>
          )}
          <div>
            <span className="text-sm font-bold text-slate-900 block">{project.leaderName} (Project Leader)</span>
            <span className="text-xs text-slate-500 font-mono">Khởi tạo ngày {new Date(project.createdAt).toLocaleDateString('vi-VN')}</span>
          </div>
        </div>

        {/* Overview & Description */}
        <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
          <h3 className="text-xs font-mono text-slate-500 uppercase tracking-wider font-bold">Mô tả dự án</h3>
          <p className="font-bold text-slate-900 text-base">{project.summary}</p>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-medium">
            {project.description}
          </div>
        </div>

        {/* Tech Stack & Equipment Used */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
          <div>
            <span className="text-xs font-mono text-slate-500 uppercase tracking-wider block mb-2 font-bold">Công nghệ sử dụng:</span>
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map((tech, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded text-xs font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-mono text-slate-500 uppercase tracking-wider block mb-2 font-bold">Thiết bị Lab mượn sử dụng:</span>
            <div className="flex flex-wrap gap-1.5">
              {project.equipmentUsed.map((eq, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded text-xs font-mono bg-teal-50 text-teal-800 border border-teal-200 font-semibold flex items-center gap-1">
                  <Wrench className="w-3 h-3 text-teal-600" /> {eq}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Team Members List */}
      <div className="tech-card p-6 space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-600" /> Danh Sách Thành Viên ({project.members.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {project.members.map((member, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {member.avatarUrl ? (
                  <img src={member.avatarUrl} alt={member.fullName} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                    {member.fullName.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{member.fullName}</h4>
                  <p className="text-xs text-slate-600">{member.roleInProject}</p>
                </div>
              </div>

              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                member.status === 'Active' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                {member.status === 'Active' ? 'Chính thức' : 'Chờ duyệt'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Join Request Modal */}
      {joinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="tech-card p-6 md:p-8 max-w-md w-full space-y-6 relative border-emerald-300 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-600" /> Xin Tham Gia Team
              </h3>
              <button onClick={() => setJoinModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleApplyJoin} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-700 mb-1 uppercase font-bold">Vị trí & Vai trò mong muốn</label>
                <input
                  type="text"
                  required
                  value={roleInProject}
                  onChange={(e) => setRoleInProject(e.target.value)}
                  placeholder="VD: Embedded Developer / ROS2 Programmer..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="p-3 rounded bg-slate-50 border border-slate-200 text-xs text-slate-600">
                Yêu cầu tham gia của bạn sẽ được gửi tới Project Leader (<strong>{project.leaderName}</strong>) để xem xét và duyệt.
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setJoinModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold text-sm rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-lg"
                >
                  Gửi Yêu Cầu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
