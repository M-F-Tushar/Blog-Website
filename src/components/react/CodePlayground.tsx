import React, { useState, useRef, useCallback, useEffect } from 'react';

interface Props {
  initialCode?: string;
  packages?: string[];
}

const CodePlayground: React.FC<Props> = ({
  initialCode = '# Write Python code here\nprint("Hello from Pyodide!")\n\nimport sys\nprint(f"Python version: {sys.version}")',
  packages = [],
}) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pyodide, setPyodide] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const loadPyodide = useCallback(async () => {
    if (pyodide) return pyodide;

    setIsLoading(true);
    setError(null);

    try {
      // Load Pyodide from CDN
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js';
      document.head.appendChild(script);

      await new Promise<void>((resolve, reject) => {
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Pyodide'));
      });

      const py = await (window as any).loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/',
      });

      // Install requested packages
      if (packages.length > 0) {
        setOutput(`Installing packages: ${packages.join(', ')}...\n`);
        await py.loadPackage('micropip');
        const micropip = py.pyimport('micropip');
        for (const pkg of packages) {
          await micropip.install(pkg);
        }
        setOutput('');
      }

      setPyodide(py);
      setIsLoading(false);
      return py;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load Python runtime');
      setIsLoading(false);
      return null;
    }
  }, [pyodide, packages]);

  const runCode = useCallback(async () => {
    setIsRunning(true);
    setOutput('');
    setError(null);

    try {
      const py = await loadPyodide();
      if (!py) return;

      // Redirect stdout/stderr
      py.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
      `);

      try {
        py.runPython(code);
        const stdout = py.runPython('sys.stdout.getvalue()');
        const stderr = py.runPython('sys.stderr.getvalue()');
        setOutput(stdout + (stderr ? `\n[stderr] ${stderr}` : ''));
      } catch (pyErr: any) {
        setOutput(pyErr.message || String(pyErr));
        setError('Execution error');
      }

      // Reset stdout/stderr
      py.runPython(`
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
      `);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Runtime error');
    } finally {
      setIsRunning(false);
    }
  }, [code, loadPyodide]);

  // Handle Tab key in textarea
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newCode);
      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      });
    }
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      runCode();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
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
            className="text-yellow-500"
          >
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Python Playground
          </span>
          {isLoading && (
            <span className="text-xs text-amber-600 dark:text-amber-400 animate-pulse">
              Loading Python runtime...
            </span>
          )}
          {pyodide && (
            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full">
              Ready
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 hidden sm:inline">Ctrl+Enter to run</span>
          <button
            onClick={runCode}
            disabled={isRunning || isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isRunning ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Running...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Run
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code editor */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full min-h-[200px] p-4 font-mono text-sm bg-gray-900 text-gray-100 resize-y focus:outline-none"
          spellCheck={false}
          placeholder="# Write Python code here..."
        />
      </div>

      {/* Output */}
      {(output || error) && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <span>Output</span>
            {error && <span className="text-red-500">({error})</span>}
          </div>
          <pre
            className={`p-4 text-sm font-mono overflow-x-auto max-h-64 ${error ? 'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/10' : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800'}`}
          >
            {output || 'No output'}
          </pre>
        </div>
      )}
    </div>
  );
};

export default CodePlayground;
