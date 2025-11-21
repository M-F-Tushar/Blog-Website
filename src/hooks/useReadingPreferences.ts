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

    const getFontSize = () => {
        switch (preferences.fontSize) {
            case 'small':
                return '16px';
            case 'large':
                return '20px';
            case 'medium':
            default:
                return '18px';
        }
    };

    const getLineHeight = () => {
        switch (preferences.lineHeight) {
            case 'compact':
                return '1.5';
            case 'relaxed':
                return '2';
            case 'normal':
            default:
                return '1.75';
        }
    };

    const getStyles = () => ({
        fontSize: getFontSize(),
        lineHeight: getLineHeight(),
    });

    const setFontSize = (size: ReadingPreferences['fontSize']) => {
        setPreferences({ ...preferences, fontSize: size });
    };

    const setLineHeight = (height: ReadingPreferences['lineHeight']) => {
        setPreferences({ ...preferences, lineHeight: height });
    };

    return {
        preferences,
        getStyles,
        getFontSize,
        getLineHeight,
        setFontSize,
        setLineHeight
    };
};
