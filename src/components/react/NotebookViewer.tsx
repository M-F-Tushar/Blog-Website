import React, { useState, useMemo } from 'react';

interface NotebookCell {
  cell_type: 'code' | 'markdown' | 'raw';
  source: string[];
  outputs?: NotebookOutput[];
  execution_count?: number | null;
}

interface NotebookOutput {
  output_type: string;
  text?: string[];
  data?: Record<string, string[]>;
  ename?: string;
  evalue?: string;
  traceback?: string[];
}

interface NotebookData {
  cells: NotebookCell[];
  metadata?: {
    kernelspec?: { display_name?: string; language?: string };
    language_info?: { name?: string; version?: string };
  };
}

interface Props {
  notebook: NotebookData | string;
  title?: string;
}

const NotebookViewer: React.FC<Props> = ({ notebook: notebookProp, title }) => {
  const [showOutput, setShowOutput] = useState(true);
  const [filter, setFilter] = useState<'all' | 'code' | 'markdown'>('all');
  const [expandedCells, setExpandedCells] = useState<Set<number>>(new Set());

  const notebook: NotebookData | null = useMemo(() => {
    if (typeof notebookProp === 'string') {
      try {
        return JSON.parse(notebookProp);
      } catch {
        return null;
      }
    }
    return notebookProp;
  }, [notebookProp]);

  if (!notebook) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
        <p className="text-red-600 dark:text-red-400">Failed to parse notebook data.</p>
      </div>
    );
  }

  const kernelName = notebook.metadata?.kernelspec?.display_name || 'Python';
  const langVersion = notebook.metadata?.language_info?.version || '';

  const filteredCells = notebook.cells.filter((cell) => {
    if (filter === 'all') return true;
    return cell.cell_type === filter;
  });

  const toggleCell = (index: number) => {
    setExpandedCells((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const renderOutput = (output: NotebookOutput, key: number) => {
    if (output.output_type === 'stream' && output.text) {
      return (
        <pre
          key={key}
          className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-3 rounded overflow-x-auto"
        >
          {output.text.join('')}
        </pre>
      );
    }
    if (output.output_type === 'error') {
      return (
        <pre
          key={key}
          className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded overflow-x-auto"
        >
          {output.ename}: {output.evalue}
        </pre>
      );
    }
    if (output.data) {
      if (output.data['image/png']) {
        return (
          <img
            key={key}
            src={`data:image/png;base64,${output.data['image/png'].join('')}`}
            alt="Notebook output"
            className="max-w-full rounded"
          />
        );
      }
      if (output.data['text/html']) {
        return (
          <div
            key={key}
            className="overflow-x-auto text-sm"
            dangerouslySetInnerHTML={{ __html: output.data['text/html'].join('') }}
          />
        );
      }
      if (output.data['text/plain']) {
        return (
          <pre
            key={key}
            className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-3 rounded overflow-x-auto"
          >
            {output.data['text/plain'].join('')}
          </pre>
        );
      }
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-400" />
            <span className="w-3 h-3 rounded-full bg-yellow-400" />
            <span className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
            {title || 'Jupyter Notebook'}
          </h3>
          <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded-full">
            {kernelName} {langVersion}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'code' | 'markdown')}
            className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          >
            <option value="all">All Cells</option>
            <option value="code">Code Only</option>
            <option value="markdown">Markdown Only</option>
          </select>
          <label className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
            <input
              type="checkbox"
              checked={showOutput}
              onChange={(e) => setShowOutput(e.target.checked)}
              className="rounded"
            />
            Outputs
          </label>
        </div>
      </div>

      {/* Cells */}
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {filteredCells.map((cell, i) => (
          <div key={i} className="group">
            <div className="flex">
              {/* Cell number gutter */}
              <div
                className="w-12 flex-shrink-0 flex items-start justify-center pt-3 text-xs text-gray-400 dark:text-gray-500 cursor-pointer select-none hover:text-gray-600 dark:hover:text-gray-300"
                onClick={() => toggleCell(i)}
              >
                {cell.cell_type === 'code'
                  ? `[${cell.execution_count ?? ' '}]`
                  : cell.cell_type === 'markdown'
                    ? 'MD'
                    : ''}
              </div>

              <div className="flex-1 min-w-0 py-2 pr-4">
                {/* Source */}
                <pre
                  className={`text-sm overflow-x-auto p-3 rounded ${
                    cell.cell_type === 'code'
                      ? 'bg-gray-50 dark:bg-gray-900 font-mono text-gray-800 dark:text-gray-200'
                      : 'text-gray-700 dark:text-gray-300 whitespace-pre-wrap'
                  } ${expandedCells.has(i) ? '' : 'max-h-96'}`}
                >
                  {cell.source.join('')}
                </pre>

                {/* Outputs */}
                {showOutput && cell.outputs && cell.outputs.length > 0 && (
                  <div className="mt-2 space-y-2 pl-2 border-l-2 border-blue-200 dark:border-blue-800">
                    {cell.outputs.map((output, j) => renderOutput(output, j))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
        {notebook.cells.length} cells ({notebook.cells.filter((c) => c.cell_type === 'code').length}{' '}
        code, {notebook.cells.filter((c) => c.cell_type === 'markdown').length} markdown)
      </div>
    </div>
  );
};

export default NotebookViewer;
