import React, { useEffect, useState } from 'react';
import { webVitalsMonitor, type VitalsMetric } from '../../utils/webVitals';

const PerformanceMonitor: React.FC = () => {
    const [metrics, setMetrics] = useState<Map<string, VitalsMetric>>(new Map());
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Only show in development
        if (!import.meta.env.DEV) return;

        // Update metrics every second
        const interval = setInterval(() => {
            setMetrics(new Map(webVitalsMonitor.getMetrics()));
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

    const formatValue = (name: string, value: number) => {
        if (name === 'CLS') {
            return value.toFixed(3);
        }
        return `${Math.round(value)}ms`;
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <button
                onClick={() => setIsVisible(!isVisible)}
                className="bg-gray-900 text-white px-3 py-2 rounded-lg text-xs font-mono shadow-lg hover:bg-gray-800 transition-colors"
                aria-label="Toggle performance monitor"
            >
                ⚡ Web Vitals
            </button>

            {isVisible && (
                <div className="mt-2 bg-gray-900 text-white p-4 rounded-lg shadow-xl max-w-xs">
                    <h3 className="text-sm font-bold mb-3 font-mono">Core Web Vitals</h3>

                    {metrics.size === 0 ? (
                        <p className="text-xs text-gray-400">Loading metrics...</p>
                    ) : (
                        <div className="space-y-2">
                            {Array.from(metrics.values()).map((metric) => (
                                <div key={metric.name} className="flex justify-between items-center text-xs font-mono">
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
        </div>
    );
};

export default PerformanceMonitor;
