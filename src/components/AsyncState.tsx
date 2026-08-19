import React from 'react';

export const LoadingState: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => (
  <div className="loading-state" role="status" aria-live="polite">
    <div className="mx-auto mb-4 h-8 w-8 animate-pulse border border-[var(--accent)] bg-[var(--accent-soft)]" aria-hidden="true" />
    <p>{message}</p>
  </div>
);

export const ErrorState: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => (
  <div className="error-state" role="alert">
    <p>{message}</p>
    {onRetry && <button type="button" onClick={onRetry} className="btn-secondary mt-5">Try again</button>}
  </div>
);
