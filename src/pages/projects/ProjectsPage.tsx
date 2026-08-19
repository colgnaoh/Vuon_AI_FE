import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Dialog } from '@/components/Dialog';
import { ErrorState, LoadingState } from '@/components/AsyncState';
import { projectService } from '@/services/projectService';
import { Project } from '@/types';

const categories = ['All', 'AI', 'Robotics', 'IoT', 'Embedded', 'Software'];

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [domainCategory, setDomainCategory] = useState<'AI' | 'Robotics' | 'IoT' | 'Embedded' | 'Software'>('AI');
  const [techStackInput, setTechStackInput] = useState('Python, ROS2, Jetson');

  useEffect(() => {
    void fetchProjects();
  }, [selectedCategory]);

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      setProjects(await projectService.getProjects(selectedCategory));
    } catch {
      setError('The project list could not be loaded.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title || !summary) return;
    try {
      await projectService.createProject({ title, summary, description: description || summary, domainCategory, leaderName: 'Alex Nguyễn', techStack: techStackInput.split(',').map((item) => item.trim()).filter(Boolean), equipmentUsed: ['Jetson Orin Nano'] });
      setCreateModalOpen(false);
      setTitle('');
      setSummary('');
      setDescription('');
      await fetchProjects();
    } catch {
      setError('The project could not be created right now.');
    }
  };

  return (
    <div className="page-shell">
      <header className="page-head">
        <div>
          <p className="page-kicker">02 / project room</p>
          <h1 className="page-title">Things being made for real.</h1>
          <p className="page-intro">Teams are testing, recruiting and moving prototypes off the drawing board. Choose a project to see the pace and where you can help.</p>
        </div>
        <button type="button" onClick={() => setCreateModalOpen(true)} className="btn-primary self-start">Create a project</button>
      </header>

      <div className="filter-row" aria-label="Filter by field">
        <span className="mr-3 self-center font-mono text-[0.63rem] uppercase tracking-wider text-[var(--ink-soft)]">filter by</span>
        {categories.map((category) => <button key={category} type="button" onClick={() => setSelectedCategory(category)} aria-pressed={selectedCategory === category} className="filter-chip">{category}</button>)}
      </div>

      {loading ? <LoadingState message="Loading projects..." /> : error ? <ErrorState message={error} onRetry={fetchProjects} /> : projects.length === 0 ? <div className="empty-state"><p>No projects match this field.</p></div> : (
        <div className="resource-grid !grid-cols-1 md:!grid-cols-2">
          {projects.map((project) => <Link key={project.id} to={`/projects/${project.id}`} className="tech-card resource-card project-card group">
            <div>
              <h2 className="mt-6 text-3xl">{project.title}</h2>
              <p>{project.summary}</p>
              <div className="mt-5 flex flex-wrap gap-1.5">{project.techStack.map((tech) => <span key={tech} className="tag">{tech}</span>)}</div>
            </div>
          </Link>)}
        </div>
      )}

      {createModalOpen && <Dialog open={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Create a new project">
        <form onSubmit={handleCreateProject} className="space-y-5">
          <div><label htmlFor="project-title" className="field-label">project name</label><input id="project-title" required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. autonomous warehouse robot" className="form-field" /></div>
          <div><label htmlFor="project-category" className="field-label">field</label><select id="project-category" value={domainCategory} onChange={(event) => setDomainCategory(event.target.value as typeof domainCategory)} className="form-field"><option value="AI">AI & Computer Vision</option><option value="Robotics">Robotics & ROS2</option><option value="IoT">IoT & Smart Devices</option><option value="Embedded">Embedded Systems</option><option value="Software">Software & Cloud</option></select></div>
          <div><label htmlFor="project-summary" className="field-label">summary</label><textarea id="project-summary" required rows={3} value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="The problem your team is solving" className="form-field" /></div>
          <div><label htmlFor="project-description" className="field-label">description</label><textarea id="project-description" rows={4} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What the team wants to test first" className="form-field" /></div>
          <div><label htmlFor="project-stack" className="field-label">stack / equipment</label><input id="project-stack" value={techStackInput} onChange={(event) => setTechStackInput(event.target.value)} className="form-field" /></div>
          <div className="flex justify-end gap-3 border-t border-[var(--line)] pt-4"><button type="button" onClick={() => setCreateModalOpen(false)} className="btn-secondary">Cancel</button><button type="submit" className="btn-primary">Create project</button></div>
        </form>
      </Dialog>}
    </div>
  );
};
