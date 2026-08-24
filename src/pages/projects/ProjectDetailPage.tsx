import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Dialog } from '@/components/Dialog';
import { ErrorState, LoadingState } from '@/components/AsyncState';
import { projectService } from '@/services/projectService';
import { Project } from '@/types';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [roleInProject, setRoleInProject] = useState('');
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    if (id) fetchProject(id);
  }, [id]);

  const fetchProject = async (projId: string) => {
    setLoading(true);
    setError('');
    try {
      const data = await projectService.getProjectById(projId);
      setProject(data);
    } catch {
      setError('Project details could not be loaded.');
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

  if (loading) return <LoadingState message="Loading project details..." />;
  if (error || !project) return <ErrorState message={error || 'Project not found.'} onRetry={() => id && fetchProject(id)} />;

  const isLeader = user?.fullName === project.leaderName || user?.globalRole === 'Admin';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Navigation & Actions */}
      <div className="flex items-center justify-between">
        <Link to="/projects" className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-500 hover:text-emerald-700">
          Back to projects
        </Link>

        {isLeader && (
          <Link
            to={`/projects/${project.id}/manage`}
            className="px-4 py-2 bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-2xs"
          >
            Manage team & approve members
          </Link>
        )}
      </div>

      {/* Main Project Details */}
      <div className="tech-card p-6 md:p-8 space-y-6 border-emerald-300">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="space-y-2">
            <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              Field: {project.domainCategory}
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900">{project.title}</h1>
          </div>

          <button
            onClick={() => setJoinModalOpen(true)}
            disabled={applied}
            className={`btn-primary self-start sm:self-auto ${applied ? '!cursor-default !bg-emerald-100 !text-emerald-800 !shadow-none' : ''}`}
          >
            {applied ? 'Request sent' : 'Join this team'}
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
            <span className="text-xs text-slate-500 font-mono">Started {new Date(project.createdAt).toLocaleDateString('en-US')}</span>
          </div>
        </div>

        {/* Overview & Description */}
        <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
          <h3 className="text-xs font-mono text-slate-500 uppercase tracking-wider font-bold">Project overview</h3>
          <p className="font-bold text-slate-900 text-base">{project.summary}</p>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-medium">
            {project.description}
          </div>
        </div>

        {/* Tech Stack & Equipment Used */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
          <div>
            <span className="text-xs font-mono text-slate-500 uppercase tracking-wider block mb-2 font-bold">Technology stack:</span>
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map((tech, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded text-xs font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-mono text-slate-500 uppercase tracking-wider block mb-2 font-bold">Equipment in use:</span>
            <div className="flex flex-wrap gap-1.5">
              {project.equipmentUsed.map((eq, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded text-xs font-mono bg-teal-50 text-teal-800 border border-teal-200 font-semibold flex items-center gap-1">
                  {eq}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Team Members List */}
      <div className="tech-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            Team members ({project.members.length})
          </h3>
          {isLeader && (
            <Link
              to={`/projects/${project.id}/manage`}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline"
            >
              Manage in Console &rarr;
            </Link>
          )}
        </div>

        {/* Pending Requests Alert for Leaders */}
        {isLeader && project.members.some((m) => m.status === 'Pending') && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 space-y-3">
            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              Pending Join Applications ({project.members.filter((m) => m.status === 'Pending').length})
            </h4>
            <div className="space-y-2">
              {project.members
                .filter((m) => m.status === 'Pending')
                .map((pendingMember) => (
                  <div key={pendingMember.userId} className="flex items-center justify-between bg-white p-3 rounded-lg border border-amber-200">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center">
                        {pendingMember.fullName.charAt(0)}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{pendingMember.fullName}</span>
                        <span className="text-[11px] text-slate-600">Role requested: <strong>{pendingMember.roleInProject}</strong></span>
                      </div>
                    </div>
                    <button
                      onClick={async () => {
                        await projectService.approveMember(project.id, pendingMember.userId);
                        fetchProject(project.id);
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm"
                    >
                      Approve Member
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

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

              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  member.status === 'Active' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                  {member.status === 'Active' ? 'Active' : 'Pending'}
                </span>

                {isLeader && member.status === 'Pending' && (
                  <button
                    onClick={async () => {
                      await projectService.approveMember(project.id, member.userId);
                      fetchProject(project.id);
                    }}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded"
                  >
                    Approve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Join Request Modal */}
      {joinModalOpen && (
        <Dialog open={joinModalOpen} onClose={() => setJoinModalOpen(false)} title="Join the team" size="sm">
            <form onSubmit={handleApplyJoin} className="space-y-4">
              <div>
                <label htmlFor="project-role" className="block text-xs font-mono text-slate-700 mb-1 uppercase font-bold">Preferred role</label>
                <input
                  id="project-role"
                  type="text"
                  required
                  value={roleInProject}
                  onChange={(e) => setRoleInProject(e.target.value)}
                  placeholder="e.g. Embedded Developer / ROS2 Programmer..."
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
                />
              </div>

              <div className="p-3 rounded bg-slate-50 border border-slate-200 text-xs text-slate-600">
                Your request will be sent to the project leader (<strong>{project.leaderName}</strong>) for review.
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setJoinModalOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Send request
                </button>
              </div>
            </form>
        </Dialog>
      )}

    </div>
  );
};
