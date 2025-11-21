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

    const getFontSizeClass = () => {
        switch (preferences.fontSize) {
            case 'small':
                return 'prose-base';
            case 'large':
                return 'prose-xl';
            case 'medium':
            default:
                return 'prose-lg';
        }
    };

    const getLineHeightClass = () => {
        switch (preferences.lineHeight) {
            case 'compact':
                return 'leading-normal';
            case 'relaxed':
                return 'leading-loose';
            case 'normal':
            default:
                return 'leading-relaxed';
        }
    };

    const setFontSize = (size: ReadingPreferences['fontSize']) => {
        setPreferences({ ...preferences, fontSize: size });
    };

    const setLineHeight = (height: ReadingPreferences['lineHeight']) => {
        setPreferences({ ...preferences, lineHeight: height });
    };

    return {
        preferences,
        getFontSizeClass,
        getLineHeightClass,
        setFontSize,
        setLineHeight
    };
};
