import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { projectService } from '@/services/projectService';
import { Project } from '@/types';
import { FolderGit2, Plus, Users, Cpu, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [domainCategory, setDomainCategory] = useState<'AI' | 'Robotics' | 'IoT' | 'Embedded' | 'Software'>('AI');
  const [techStackInput, setTechStackInput] = useState('Python, ROS2, Jetson');

  const navigate = useNavigate();

  const categories = ['All', 'AI', 'Robotics', 'IoT', 'Embedded', 'Software'];

  useEffect(() => {
    fetchProjects();
  }, [selectedCategory]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await projectService.getProjects(selectedCategory);
      setProjects(data);
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !summary) return;

    try {
      const techStack = techStackInput.split(',').map((s) => s.trim());
      await projectService.createProject({
        title,
        summary,
        description: description || summary,
        domainCategory,
        leaderName: 'Alex Nguyễn',
        techStack,
        equipmentUsed: ['Jetson Orin Nano'],
      });
      setCreateModalOpen(false);
      fetchProjects();
    } catch {
      // Handled
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 border border-teal-300 text-teal-800 text-xs font-mono font-bold">
            <FolderGit2 className="w-3.5 h-3.5 text-teal-600" /> PROJECT HUB & TEAM COLLABORATION
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Danh Mục Dự Án Công Nghệ</h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Các dự án thực tế đang được phát triển tại không gian lab VUON AI SPACE. Tham gia dự án để cùng xây dựng prototype và phát triển sản phẩm.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Khởi Tạo Dự Án Mới
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-200">
        <span className="text-xs font-mono text-slate-500 font-bold uppercase mr-2">Lĩnh Vực:</span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs'
                : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300'
            }`}
          >
            {cat === 'All' ? 'Tất Cả Lĩnh Vực' : cat}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-500 text-sm">Đang tải danh sách dự án...</div>
      ) : projects.length === 0 ? (
        <div className="tech-card p-12 text-center text-slate-600">Không có dự án nào thuộc lĩnh vực này.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => navigate(`/projects/${project.id}`)}
              className="tech-card p-6 flex flex-col justify-between space-y-4 cursor-pointer hover:border-emerald-400 group"
            >
              <div className="space-y-4">
                
                {/* Domain & Status Badge */}
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded text-xs font-mono font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {project.domainCategory}
                  </span>

                  <span
                    className={`px-2.5 py-1 rounded text-xs font-mono font-semibold ${
                      project.status === 'Recruiting'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-teal-100 text-teal-800 border border-teal-300'
                    }`}
                  >
                    {project.status === 'Recruiting' ? '● Đang Tuyển Member' : `● Trạng thái: ${project.status}`}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  {project.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {project.summary}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((tech, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
                      {tech}
                    </span>
                  ))}
                </div>

              </div>

              {/* Leader & Team Members Count */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {project.leaderAvatar ? (
                    <img src={project.leaderAvatar} alt={project.leaderName} className="w-6 h-6 rounded-full object-cover border border-slate-200" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-slate-100 text-emerald-700 flex items-center justify-center font-bold text-[10px] border border-slate-200">
                      {project.leaderName.charAt(0)}
                    </div>
                  )}
                  <span className="text-slate-800 font-semibold">{project.leaderName} (Leader)</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-slate-600 font-mono flex items-center gap-1 font-bold">
                    <Users className="w-3.5 h-3.5 text-emerald-600" /> {project.members.length} Thành viên
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="tech-card p-6 md:p-8 max-w-lg w-full space-y-6 relative border-emerald-300 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-emerald-600" /> Khởi Tạo Dự Án Mới
              </h3>
              <button onClick={() => setCreateModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-700 mb-1 uppercase font-bold">Tên Dự Án</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="VD: Autonomous Mobile Robot trong Nhà Kho..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-700 mb-1 uppercase font-bold">Lĩnh Vực Công Nghệ</label>
                <select
                  value={domainCategory}
                  onChange={(e) => setDomainCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-emerald-500"
                >
                  <option value="AI">AI & Computer Vision</option>
                  <option value="Robotics">Robotics & ROS2</option>
                  <option value="IoT">IoT & Smart Devices</option>
                  <option value="Embedded">Embedded Systems</option>
                  <option value="Software">Software & Cloud</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-700 mb-1 uppercase font-bold">Tóm Tắt Ngắn</label>
                <textarea
                  rows={2}
                  required
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="VD: Robot di động tự hành sử dụng thuật toán SLAM và LiDAR..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-700 mb-1 uppercase font-bold">Tech Stack (Phân cách bằng dấu phẩy)</label>
                <input
                  type="text"
                  value={techStackInput}
                  onChange={(e) => setTechStackInput(e.target.value)}
                  placeholder="ROS2, C++, LiDAR, STM32"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold text-sm rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-lg"
                >
                  Tạo Dự Án
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
