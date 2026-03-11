import React from 'react';
import { AuthProvider } from '../hooks/useAuth';
import { ThemeProvider } from '../hooks/useTheme';
import { SiteSettingsProvider } from '../hooks/useSiteSettings';
import { PostsProvider } from '../hooks/usePosts';
import { ProfileProvider } from '../hooks/useProfile';
import { RecommendationsProvider } from '../hooks/useRecommendations';
import { BookmarksProvider } from '../context/BookmarksContext';
import { ToastProvider } from '../context/ToastContext';
import { CommandPaletteProvider } from '../context/CommandPaletteContext';

interface ProvidersProps {
    children: React.ReactNode;
}

/**
 * Composed providers wrapper to reduce nesting depth in App.tsx
 * Centralizes all context providers for easier maintenance
 *
 * Provider order matters:
 * 1. Auth - required by other providers for user state
 * 2. Theme - UI theming, should be early
 * 3. Toast/CommandPalette - UI utilities
 * 4. SiteSettings - site configuration
 * 5. Posts/Profile/Recommendations - content providers
 * 6. Bookmarks - requires user auth
 */
const Providers: React.FC<ProvidersProps> = ({ children }) => {
    return (
        <AuthProvider>
            <ThemeProvider>
                <ToastProvider>
                    <CommandPaletteProvider>
                        <SiteSettingsProvider>
                            <PostsProvider>
                                <ProfileProvider>
                                    <RecommendationsProvider>
                                        <BookmarksProvider>
                                            {children}
                                        </BookmarksProvider>
                                    </RecommendationsProvider>
                                </ProfileProvider>
                            </PostsProvider>
                        </SiteSettingsProvider>
                    </CommandPaletteProvider>
                </ToastProvider>
            </ThemeProvider>
        </AuthProvider>
    );
};

export default Providers;
