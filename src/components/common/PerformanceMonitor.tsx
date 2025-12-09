import React, { useEffect, useState } from 'react';
import { webVitalsMonitor, type VitalsMetric } from '../../utils/webVitals';
import {
  getPerformanceGrade,
  getNavigationTiming,
  getResourceTiming,
  type PerformanceMetrics,
} from '../../utils/performanceMetrics';

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<Map<string, VitalsMetric>>(new Map());
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'vitals' | 'navigation' | 'resources'>('vitals');
  const [grade, setGrade] = useState<string>('N/A');

  useEffect(() => {
    // Only show in development
    if (!import.meta.env.DEV) return;

    let previousMetricsSize = 0;

    // Update metrics every second, but only if changed
    const interval = setInterval(() => {
      const currentMetrics = webVitalsMonitor.getMetrics();

      // Only update state if metrics have changed
      if (currentMetrics.size !== previousMetricsSize) {
        previousMetricsSize = currentMetrics.size;
        const newMetrics = new Map(currentMetrics);
        setMetrics(newMetrics);

        // Calculate performance grade
        const metricsObj: PerformanceMetrics = {
          CLS: newMetrics.get('CLS')?.value ?? null,
          FID: newMetrics.get('FID')?.value ?? null,
          FCP: newMetrics.get('FCP')?.value ?? null,
          LCP: newMetrics.get('LCP')?.value ?? null,
          TTFB: newMetrics.get('TTFB')?.value ?? null,
          INP: newMetrics.get('INP')?.value ?? null,
        };
        setGrade(getPerformanceGrade(metricsObj));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Don't render in production
  if (!import.meta.env.DEV) return null;

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good':
        return 'text-green-600';
      case 'needs-improvement':
        return 'text-yellow-600';
      case 'poor':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getGradeColor = (gradeValue: string) => {
    switch (gradeValue) {
      case 'A':
        return 'text-green-600';
      case 'B':
        return 'text-blue-600';
      case 'C':
        return 'text-yellow-600';
      case 'D':
        return 'text-orange-600';
      case 'F':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatValue = (name: string, value: number) => {
    if (name === 'CLS') {
      return value.toFixed(3);
    }
    return `${Math.round(value)}ms`;
  };

  const navigationTiming = getNavigationTiming();
  const resourceTiming = getResourceTiming();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-gray-900 text-white px-3 py-2 rounded-lg text-xs font-mono shadow-lg hover:bg-gray-800 transition-colors"
        aria-label="Toggle performance monitor"
      >
        ⚡ Performance <span className={getGradeColor(grade)}>({grade})</span>
      </button>

      {isVisible && (
        <div className="mt-2 bg-gray-900 text-white p-4 rounded-lg shadow-xl max-w-md">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold font-mono">Performance Monitor</h3>
            <span className={`text-2xl font-bold ${getGradeColor(grade)}`}>{grade}</span>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-3 border-b border-gray-700">
            <button
              onClick={() => setActiveTab('vitals')}
              className={`px-2 py-1 text-xs font-mono ${
                activeTab === 'vitals' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400'
              }`}
            >
              Web Vitals
            </button>
            <button
              onClick={() => setActiveTab('navigation')}
              className={`px-2 py-1 text-xs font-mono ${
                activeTab === 'navigation'
                  ? 'border-b-2 border-blue-500 text-white'
                  : 'text-gray-400'
              }`}
            >
              Navigation
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`px-2 py-1 text-xs font-mono ${
                activeTab === 'resources'
                  ? 'border-b-2 border-blue-500 text-white'
                  : 'text-gray-400'
              }`}
            >
              Resources
            </button>
          </div>

          {/* Web Vitals Tab */}
          {activeTab === 'vitals' && (
            <div>
              {metrics.size === 0 ? (
                <p className="text-xs text-gray-400">Loading metrics...</p>
              ) : (
                <div className="space-y-2">
                  {Array.from(metrics.values()).map((metric) => (
                    <div
                      key={metric.name}
                      className="flex justify-between items-center text-xs font-mono"
                    >
                      <span className="font-semibold">{metric.name}:</span>
                      <span className={getRatingColor(metric.rating)}>
                        {formatValue(metric.name, metric.value)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-3 pt-3 border-t border-gray-700">
                <div className="flex gap-2 text-xs">
                  <span className="text-green-600">● Good</span>
                  <span className="text-yellow-600">● Needs Improvement</span>
                  <span className="text-red-600">● Poor</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Timing Tab */}
          {activeTab === 'navigation' && navigationTiming && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {Object.entries(navigationTiming).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center text-xs font-mono">
                  <span className="font-semibold capitalize">{key}:</span>
                  <span className="text-gray-300">{Math.round(value as number)}ms</span>
                </div>
              ))}
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === 'resources' && (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              <div>
                <p className="text-xs text-gray-400 mb-2">
                  Total: {resourceTiming.total} resources
                </p>
                <div className="space-y-1">
                  {Object.entries(resourceTiming.byType).map(([type, count]) => (
                    <div key={type} className="flex justify-between items-center text-xs font-mono">
                      <span className="font-semibold">{type}:</span>
                      <span className="text-gray-300">{count as React.ReactNode}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PerformanceMonitor;
