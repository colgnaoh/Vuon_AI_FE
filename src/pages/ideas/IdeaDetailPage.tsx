import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ideaService } from '@/services/ideaService';
import { Idea, Comment } from '@/types';
import { Lightbulb, MessageSquare, Send, ArrowLeft, Rocket, CheckCircle2, UserCheck } from 'lucide-react';

export const IdeaDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [idea, setIdea] = useState<Idea | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [converting, setConverting] = useState(false);

  useEffect(() => {
    if (id) fetchIdeaDetail(id);
  }, [id]);

  const fetchIdeaDetail = async (ideaId: string) => {
    setLoading(true);
    try {
      const data = await ideaService.getIdeaById(ideaId);
      setIdea(data.idea);
      setComments(data.comments);
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !id) return;

    try {
      const added = await ideaService.addComment(id, newComment);
      setComments([...comments, added]);
      setNewComment('');
      if (idea) setIdea({ ...idea, commentCount: idea.commentCount + 1 });
    } catch {
      // Handled
    }
  };

  const handleConvertToProject = async () => {
    if (!id || !idea) return;
    if (!window.confirm('Bạn có chắc chắn muốn chuyển đổi Ý Tưởng này thành Dự Án chính thức tại VUON AI SPACE?')) return;

    setConverting(true);
    try {
      const res = await ideaService.convertIdeaToProject(id);
      alert('Chuyển đổi thành công! Dự án mới đã được khởi tạo.');
      navigate(`/projects`);
    } catch {
      // Handled
    } finally {
      setConverting(false);
    }
  };

  if (loading || !idea) {
    return <div className="text-center py-20 text-slate-500 text-sm">Đang tải chi tiết ý tưởng...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Back button */}
      <Link to="/ideas" className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-400">
        <ArrowLeft className="w-4 h-4" /> Trở về Bảng Ý Tưởng
      </Link>

      {/* Main Idea Details */}
      <div className="tech-card p-6 md:p-8 space-y-6 border-amber-500/30">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-2">
            <span className={`px-2.5 py-1 rounded text-xs font-mono font-semibold ${
              idea.status === 'Converted' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
            }`}>
              {idea.status === 'Converted' ? '✓ Đã Chuyển Đổi Thành Project' : '● Đang Thảo Luận & Tìm Team'}
            </span>

            <h1 className="text-2xl font-extrabold text-white leading-tight">{idea.title}</h1>
          </div>

          {/* Convert to Project Action */}
          {idea.status !== 'Converted' && (
            <button
              onClick={handleConvertToProject}
              disabled={converting}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all self-start sm:self-auto"
            >
              <Rocket className="w-4 h-4" />
              {converting ? 'Đang khởi tạo Project...' : 'Chuyển Thành Project'}
            </button>
          )}
        </div>

        {/* Author info */}
        <div className="flex items-center gap-3">
          {idea.authorAvatar ? (
            <img src={idea.authorAvatar} alt={idea.authorName} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center">
              {idea.authorName.charAt(0)}
            </div>
          )}
          <div>
            <span className="text-sm font-bold text-white block">{idea.authorName}</span>
            <span className="text-xs text-slate-500 font-mono">Đăng ngày {new Date(idea.createdAt).toLocaleDateString('vi-VN')}</span>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <p className="font-medium text-slate-200 text-base">{idea.summary}</p>
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300">
            {idea.description}
          </div>
        </div>

        {/* Required Tech & Roles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-2">Công nghệ đề xuất:</span>
            <div className="flex flex-wrap gap-1.5">
              {idea.requiredTech.map((tech, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded text-xs font-mono bg-slate-900 text-cyan-300 border border-slate-800">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-2">Vị trí đang tìm kiếm:</span>
            <div className="flex flex-wrap gap-1.5">
              {idea.lookingForRoles.map((role, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded text-xs font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <UserCheck className="w-3 h-3" /> {role}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Discussion & Comments */}
      <div className="tech-card p-6 space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-amber-400" /> Thảo Luận Cộng Đồng ({comments.length})
        </h3>

        {/* Comment List */}
        <div className="space-y-4">
          {comments.map((c) => (
            <div key={c.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {c.authorAvatar ? (
                    <img src={c.authorAvatar} alt={c.authorName} className="w-6 h-6 rounded-full object-cover" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center font-bold text-xs">
                      {c.authorName.charAt(0)}
                    </div>
                  )}
                  <span className="text-xs font-bold text-white">{c.authorName}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">
                  {new Date(c.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-xs text-slate-300 pl-8 leading-relaxed">{c.content}</p>
            </div>
          ))}
        </div>

        {/* Post Comment Form */}
        <form onSubmit={handlePostComment} className="flex gap-3 pt-4 border-t border-slate-800">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Viết ý kiến thảo luận hoặc đề xuất tham gia team..."
            className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-lg text-sm text-white focus:outline-none"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-lg flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" /> Gửi
          </button>
        </form>

      </div>

    </div>
  );
};
