import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ideaService } from '@/services/ideaService';
import { ErrorState, LoadingState } from '@/components/AsyncState';
import { Idea, Comment } from '@/types';

export const IdeaDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [idea, setIdea] = useState<Idea | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [converting, setConverting] = useState(false);

  useEffect(() => {
    if (id) fetchIdeaDetail(id);
  }, [id]);

  const fetchIdeaDetail = async (ideaId: string) => {
    setLoading(true);
    setError('');
    try {
      const data = await ideaService.getIdeaById(ideaId);
      setIdea(data.idea);
      setComments(data.comments);
    } catch {
      setError('Idea details could not be loaded.');
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
    if (!window.confirm('Are you sure you want to turn this idea into an official VUON AI SPACE project?')) return;

    setConverting(true);
    try {
      const res = await ideaService.convertIdeaToProject(id);
      alert('Conversion complete. The new project is ready.');
      navigate(`/projects`);
    } catch {
      // Handled
    } finally {
      setConverting(false);
    }
  };

  if (loading) return <LoadingState message="Loading idea details..." />;
  if (error || !idea) return <ErrorState message={error || 'Idea not found.'} onRetry={() => id && fetchIdeaDetail(id)} />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Back button */}
      <Link to="/ideas" className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-500 hover:text-emerald-700">
        Back to idea board
      </Link>

      {/* Main Idea Details */}
      <div className="tech-card p-6 md:p-8 space-y-6 border-amber-200">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="space-y-2">
            <span className={`px-2.5 py-1 rounded text-xs font-mono font-semibold ${
              idea.status === 'Converted' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
            }`}>
              {idea.status === 'Converted' ? 'Converted to project' : 'Open for discussion and team building'}
            </span>

            <h1 className="text-2xl font-extrabold text-slate-900 leading-tight">{idea.title}</h1>
          </div>

          {/* Convert to Project Action */}
          {idea.status !== 'Converted' && (
            <button
              onClick={handleConvertToProject}
              disabled={converting}
              className="btn-primary self-start sm:self-auto disabled:cursor-wait disabled:opacity-50"
            >
            {converting ? 'Starting project...' : 'Convert to project'}
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
              <span className="text-sm font-bold text-slate-900 block">{idea.authorName}</span>
            <span className="text-xs text-slate-500 font-mono">Posted {new Date(idea.createdAt).toLocaleDateString('en-US')}</span>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
          <p className="font-bold text-slate-900 text-base">{idea.summary}</p>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
            {idea.description}
          </div>
        </div>

        {/* Required Tech & Roles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
          <div>
            <span className="text-xs font-mono text-slate-500 uppercase tracking-wider block mb-2">Suggested technologies:</span>
            <div className="flex flex-wrap gap-1.5">
              {idea.requiredTech.map((tech, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded text-xs font-mono bg-sky-50 text-sky-800 border border-sky-200">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-mono text-slate-500 uppercase tracking-wider block mb-2">Roles we are looking for:</span>
            <div className="flex flex-wrap gap-1.5">
              {idea.lookingForRoles.map((role, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded text-xs font-mono bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Discussion & Comments */}
      <div className="tech-card p-6 space-y-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          Community discussion ({comments.length})
        </h3>

        {/* Comment List */}
        <div className="space-y-4">
          {comments.map((c) => (
            <div key={c.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {c.authorAvatar ? (
                    <img src={c.authorAvatar} alt={c.authorName} className="w-6 h-6 rounded-full object-cover" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      {c.authorName.charAt(0)}
                    </div>
                  )}
                  <span className="text-xs font-bold text-slate-900">{c.authorName}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">
                  {new Date(c.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-xs text-slate-700 pl-8 leading-relaxed">{c.content}</p>
            </div>
          ))}
        </div>

        {/* Post Comment Form */}
        <form onSubmit={handlePostComment} className="flex flex-col gap-3 pt-4 border-t border-slate-200 sm:flex-row">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share feedback or suggest how to join the team..."
            className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-lg flex items-center gap-1.5"
          >
            Post comment
          </button>
        </form>

      </div>

    </div>
  );
};
