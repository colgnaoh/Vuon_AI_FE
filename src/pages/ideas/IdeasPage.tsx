import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ErrorState, LoadingState } from '@/components/AsyncState';
import { ideaService } from '@/services/ideaService';
import { Idea } from '@/types';

export const IdeasPage: React.FC = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    void fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    setLoading(true);
    setError('');
    try {
      setIdeas(await ideaService.getIdeas());
    } catch {
      setError('The idea board could not be loaded.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <header className="page-head">
        <div>
          <p className="page-kicker">01 / idea board</p>
          <h1 className="page-title">Projects to build together.</h1>
          <p className="page-intro">These projects start with a question, move through collaboration and become experiments that can run.</p>
        </div>
      </header>

      {loading ? <LoadingState message="Loading project ideas..." /> : error ? <ErrorState message={error} onRetry={fetchIdeas} /> : ideas.length === 0 ? <div className="empty-state"><p>No ideas have been posted yet. Be the first.</p></div> : (
        <div className="resource-grid">
          {ideas.map((idea) => (
            <Link key={idea.id} to={`/ideas/${idea.id}`} className="tech-card resource-card idea-card group">
              <div>
                <h2 className="text-3xl">{idea.title}</h2>
                <p>{idea.summary}</p>
                <div className="mt-5 flex flex-wrap gap-1.5">{idea.requiredTech.map((tech) => <span key={tech} className="tag">{tech}</span>)}</div>
              </div>
            </Link>
          ))}
        </div>
      )}

    </div>
  );
};
