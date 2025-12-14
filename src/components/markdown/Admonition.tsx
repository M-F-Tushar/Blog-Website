import React from 'react';
import { AlertCircle, AlertTriangle, Info, Lightbulb } from 'lucide-react';
import { cn } from '../../utils/cn';

export type AdmonitionType = 'note' | 'tip' | 'info' | 'warning' | 'danger';

interface AdmonitionProps {
  type: AdmonitionType;
  title?: string;
  children: React.ReactNode;
}

const icons = {
  note: Info,
  tip: Lightbulb,
  info: Info,
  warning: AlertTriangle,
  danger: AlertCircle,
};

const styles = {
  note: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
  tip: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
  info: 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200',
  warning:
    'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200',
  danger:
    'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
};

const Admonition: React.FC<AdmonitionProps> = ({ type, title, children }) => {
  const Icon = icons[type] || Info;
  const style = styles[type] || styles.note;

  return (
    <div className={cn('my-6 rounded-lg border p-4', style)}>
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          {title && <h5 className="font-semibold mb-1 capitalize">{title}</h5>}
          <div className="text-sm [&>p:last-child]:mb-0">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Admonition;
