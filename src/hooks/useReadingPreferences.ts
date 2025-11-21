import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export interface ReadingPreferences {
    fontSize: 'small' | 'medium' | 'large';
    lineHeight: 'compact' | 'normal' | 'relaxed';
}

const defaultPreferences: ReadingPreferences = {
    fontSize: 'medium',
    lineHeight: 'normal'
};

export const useReadingPreferences = () => {
    const [preferences, setPreferences] = useLocalStorage<ReadingPreferences>(
        'reading-preferences',
        defaultPreferences
    );

    // Inject dynamic styles into the document
    useEffect(() => {
        const styleId = 'reading-preferences-styles';
        let styleElement = document.getElementById(styleId) as HTMLStyleElement;

        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            document.head.appendChild(styleElement);
        }

        const fontSize = preferences.fontSize === 'small' ? '16px' :
            preferences.fontSize === 'large' ? '20px' : '18px';
        const lineHeight = preferences.lineHeight === 'compact' ? '1.5' :
            preferences.lineHeight === 'relaxed' ? '2' : '1.75';

        styleElement.textContent = `
            .prose-reading-preferences * {
                font-size: ${fontSize} !important;
                line-height: ${lineHeight} !important;
            }
            .prose-reading-preferences h1 {
                font-size: calc(${fontSize} * 2.25) !important;
            }
            .prose-reading-preferences h2 {
                font-size: calc(${fontSize} * 1.875) !important;
            }
            .prose-reading-preferences h3 {
                font-size: calc(${fontSize} * 1.5) !important;
            }
            .prose-reading-preferences h4 {
                font-size: calc(${fontSize} * 1.25) !important;
            }
            .prose-reading-preferences code {
                font-size: calc(${fontSize} * 0.875) !important;
            }
        `;

        return () => {
            // Cleanup on unmount
            if (styleElement && styleElement.parentNode) {
                styleElement.parentNode.removeChild(styleElement);
            }
        };
    }, [preferences.fontSize, preferences.lineHeight]);

    const setFontSize = (size: ReadingPreferences['fontSize']) => {
        setPreferences({ ...preferences, fontSize: size });
    };

    const setLineHeight = (height: ReadingPreferences['lineHeight']) => {
        setPreferences({ ...preferences, lineHeight: height });
    };

    return {
        preferences,
        setFontSize,
        setLineHeight
    };
};
