import React, { useState, useMemo } from 'react';

interface Column {
  name: string;
  type: 'string' | 'number' | 'boolean';
}

interface Props {
  data: Record<string, any>[];
  columns?: Column[];
  title?: string;
  pageSize?: number;
}

const DatasetViewer: React.FC<Props> = ({
  data,
  columns: columnsProp,
  title = 'Dataset Viewer',
  pageSize = 25,
}) => {
  const [page, setPage] = useState(0);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [search, setSearch] = useState('');

  // Infer columns from data if not provided
  const columns = useMemo(() => {
    if (columnsProp) return columnsProp;
    if (data.length === 0) return [];
    return Object.keys(data[0]).map((name) => ({
      name,
      type: (typeof data[0][name] === 'number'
        ? 'number'
        : typeof data[0][name] === 'boolean'
          ? 'boolean'
          : 'string') as Column['type'],
    }));
  }, [data, columnsProp]);

  // Filter data
  const filteredData = useMemo(() => {
    if (!search) return data;
    const q = search.toLowerCase();
    return data.filter((row) =>
      columns.some((col) =>
        String(row[col.name] ?? '')
          .toLowerCase()
          .includes(q)
      )
    );
  }, [data, search, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp = typeof aVal === 'number' ? aVal - bVal : String(aVal).localeCompare(String(bVal));
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filteredData, sortColumn, sortDir]);

  // Paginate
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const pageData = sortedData.slice(page * pageSize, (page + 1) * pageSize);

  const handleSort = (colName: string) => {
    if (sortColumn === colName) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(colName);
      setSortDir('asc');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-blue-500"
          >
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M3 5V19A9 3 0 0 0 21 19V5" />
            <path d="M3 12A9 3 0 0 0 21 12" />
          </svg>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{title}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {filteredData.length.toLocaleString()} rows &times; {columns.length} cols
          </span>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          placeholder="Search..."
          className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 w-48 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900">
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 w-12">
                #
              </th>
              {columns.map((col) => (
                <th
                  key={col.name}
                  className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 select-none whitespace-nowrap"
                  onClick={() => handleSort(col.name)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.name}
                    {sortColumn === col.name && (
                      <span className="text-primary-500">
                        {sortDir === 'asc' ? '\u25B2' : '\u25BC'}
                      </span>
                    )}
                    <span className="text-gray-300 dark:text-gray-600 text-[10px]">
                      ({col.type})
                    </span>
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {pageData.map((row, i) => (
              <tr key={page * pageSize + i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-3 py-2 text-xs text-gray-400">{page * pageSize + i + 1}</td>
                {columns.map((col) => (
                  <td
                    key={col.name}
                    className={`px-3 py-2 max-w-xs truncate ${
                      col.type === 'number' ? 'text-right font-mono' : ''
                    } text-gray-700 dark:text-gray-300`}
                    title={String(row[col.name] ?? '')}
                  >
                    {row[col.name] == null ? (
                      <span className="text-gray-300 dark:text-gray-600 italic">null</span>
                    ) : col.type === 'boolean' ? (
                      <span className={row[col.name] ? 'text-green-600' : 'text-red-600'}>
                        {String(row[col.name])}
                      </span>
                    ) : (
                      String(row[col.name])
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Page {page + 1} of {totalPages}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatasetViewer;
