import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface CosmicEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const CosmicEmptyState: React.FC<CosmicEmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="text-center py-16 px-6">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-elevated/80 border border-white/[0.06] mb-4">
        <Icon size={28} className="text-secondary-500" />
      </div>
      <h3 className="text-lg font-semibold text-secondary-300 mb-1">{title}</h3>
      {description && <p className="text-sm text-secondary-500 max-w-sm mx-auto">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-5 py-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-medium rounded-lg shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 transition-all duration-200 text-sm"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default CosmicEmptyState;
