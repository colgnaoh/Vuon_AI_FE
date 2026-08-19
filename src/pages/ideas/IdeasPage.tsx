import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ideaService } from '@/services/ideaService';
import { Idea } from '@/types';
import { Lightbulb, Plus, MessageSquare, ArrowUpRight, Sparkles, CheckCircle2, User } from 'lucide-react';

export const IdeasPage: React.FC = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [techInput, setTechInput] = useState('');
  const [requiredTech, setRequiredTech] = useState<string[]>(['YOLOv8', 'ROS2']);

  const navigate = useNavigate();

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    setLoading(true);
    try {
      const data = await ideaService.getIdeas();
      setIdeas(data);
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !summary) return;

    try {
      await ideaService.createIdea({
        title,
        summary,
        description: description || summary,
        authorName: 'Alex Nguyễn',
        requiredTech,
        lookingForRoles: ['1 Embedded Dev', '1 AI Dev'],
      });
      setCreateModalOpen(false);
      fetchIdeas();
    } catch {
      // Handled
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-xs font-mono font-bold">
            <Lightbulb className="w-3.5 h-3.5 text-amber-600" /> IDEA BOARD & BRAINSTORM HUB
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Bảng Ý Tưởng Công Nghệ</h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Nơi đăng tải các ý tưởng AI, Robotics, IoT hoàn toàn mới chưa có đồng đội. Thảo luận, hoàn thiện và chuyển đổi ý tưởng thành Dự Án thực tế.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-extrabold text-sm rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Đăng Ý Tưởng Mới
        </button>
      </div>

      {/* Ideas Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-500 text-sm">Đang tải danh sách ý tưởng...</div>
      ) : ideas.length === 0 ? (
        <div className="tech-card p-12 text-center text-slate-600">Chưa có ý tưởng nào được đăng. Hãy là người đầu tiên!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideas.map((idea) => (
            <div
              key={idea.id}
              onClick={() => navigate(`/ideas/${idea.id}`)}
              className="tech-card p-6 flex flex-col justify-between space-y-4 cursor-pointer hover:border-amber-400 group"
            >
              <div className="space-y-3">
                {/* Author & Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {idea.authorAvatar ? (
                      <img src={idea.authorAvatar} alt={idea.authorName} className="w-7 h-7 rounded-full object-cover border border-slate-200" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-slate-100 text-amber-600 flex items-center justify-center font-bold text-xs border border-slate-200">
                        {idea.authorName.charAt(0)}
                      </div>
                    )}
                    <span className="text-xs text-slate-700 font-bold">{idea.authorName}</span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      idea.status === 'Converted'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    {idea.status === 'Converted' ? 'Đã Chuyển Thành Project' : 'Đang Tìm Team'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-2">
                  {idea.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {idea.summary}
                </p>

                {/* Tech Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {idea.requiredTech.map((tech, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer info */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 font-semibold">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400" /> {idea.commentCount} bình luận
                </span>
                <span className="text-amber-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 font-bold">
                  Chi tiết <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Idea Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="tech-card p-6 md:p-8 max-w-lg w-full space-y-6 relative border-amber-300 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-600" /> Đăng Ý Tưởng Công Nghệ Mới
              </h3>
              <button onClick={() => setCreateModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleCreateIdea} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-700 mb-1 uppercase font-bold">Tiêu đề ý tưởng</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="VD: AI Robot phục vụ nước tự động bằng VLM..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-700 mb-1 uppercase font-bold">Tóm tắt ngắn</label>
                <textarea
                  rows={2}
                  required
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="VD: Mô tả ngắn gọn bài toán và hướng giải pháp trong 2-3 câu..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-700 mb-1 uppercase font-bold">Mô tả chi tiết giải pháp</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Chi tiết về thuật toán, phần cứng (Jetson, STM32, Sensor) và mô hình..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-amber-500"
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
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm rounded-lg"
                >
                  Đăng Ý Tưởng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
