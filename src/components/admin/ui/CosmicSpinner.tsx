import React from 'react';

interface CosmicSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const sizes = {
  sm: 'w-5 h-5 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-3',
};

const CosmicSpinner: React.FC<CosmicSpinnerProps> = ({ size = 'md', label }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizes[size]} rounded-full border-primary-500/30 border-t-primary-400 animate-spin`}
        style={{ boxShadow: '0 0 15px rgba(6,182,212,0.15)' }}
        role="status"
        aria-label={label || 'Loading'}
      />
      {label && <p className="text-sm text-secondary-400 animate-pulse">{label}</p>}
    </div>
  );
};

export default CosmicSpinner;
