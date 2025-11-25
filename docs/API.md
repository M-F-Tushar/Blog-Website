# API Documentation

This document provides detailed information about custom hooks, utilities, and context providers used in the blog application.

## Table of Contents

- [Custom Hooks](#custom-hooks)
- [Utility Functions](#utility-functions)
- [Context Providers](#context-providers)

---

## Custom Hooks

### useAnalytics

Track analytics events and page views.

**Location:** `src/hooks/useAnalytics.ts`

**Usage:**
```tsx
import { useAnalytics } from '../hooks/useAnalytics';

function MyComponent() {
  const { trackEvent, trackSearch, trackBookmark } = useAnalytics();
  
  const handleSearch = (query: string, results: number) => {
    trackSearch(query, results);
  };
  
  return <SearchComponent onSearch={handleSearch} />;
}
```

**Methods:**
- `trackEvent(name: string, properties?: Record<string, any>)` - Track custom event
- `trackSearch(query: string, resultsCount: number)` - Track search queries
- `trackBookmark(action: 'add' | 'remove', postId: string)` - Track bookmark actions
- `trackComment(action: 'post' | 'reply' | 'delete')` - Track comment actions
- `trackThemeChange(theme: 'light' | 'dark')` - Track theme changes

---

### useBookmarks

Manage user bookmarks with Supabase backend.

**Location:** `src/hooks/useBookmarks.ts`

**Usage:**
```tsx
import { useBookmarks } from '../hooks/useBookmarks';

function PostCard({ postId }: { postId: string }) {
  const { isBookmarked, toggleBookmark, bookmarks, isLoading } = useBookmarks();
  
  return (
    <button onClick={() => toggleBookmark(postId)}>
      {isBookmarked(postId) ? 'Remove Bookmark' : 'Add Bookmark'}
    </button>
  );
}
```

**Returns:**
- `bookmarks: string[]` - Array of bookmarked post IDs
- `isLoading: boolean` - Loading state
- `toggleBookmark: (postId: string) => Promise<void>` - Toggle bookmark
- `isBookmarked: (postId: string) => boolean` - Check if post is bookmarked

---

### useLocalStorage

Persist state in localStorage with TypeScript support.

**Location:** `src/hooks/useLocalStorage.ts`

**Usage:**
```tsx
import { useLocalStorage } from '../hooks/useLocalStorage';

function Settings() {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');
  
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle Theme
    </button>
  );
}
```

**Parameters:**
- `key: string` - localStorage key
- `initialValue: T` - Initial value if key doesn't exist

**Returns:** `[value: T, setValue: (value: T | ((prev: T) => T)) => void]`

---

### usePosts

Fetch and manage blog posts from Supabase.

**Location:** `src/hooks/usePosts.ts`

**Usage:**
```tsx
import { usePosts } from '../hooks/usePosts';

function BlogList() {
  const { posts, loading, error, refetch } = usePosts();
  
  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  
  return posts.map(post => <PostCard key={post.id} post={post} />);
}
```

**Returns:**
- `posts: Post[]` - Array of blog posts
- `loading: boolean` - Loading state
- `error: string | null` - Error message
- `refetch: () => Promise<void>` - Refetch posts

---

### useSearch

Enhanced search functionality with filtering and highlighting.

**Location:** `src/hooks/useSearch.ts`

**Usage:**
```tsx
import { useSearch } from '../hooks/useSearch';

function SearchPage() {
  const { 
    query, 
    setQuery, 
    results, 
    isSearching,
    filters,
    setFilters 
  } = useSearch(posts);
  
  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      {results.map(post => <PostCard key={post.id} post={post} highlight={query} />)}
    </div>
  );
}
```

---

### useTheme

Manage dark/light theme with localStorage persistence.

**Location:** `src/hooks/useTheme.ts`

**Usage:**
```tsx
import { useTheme } from '../hooks/useTheme';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      {theme === 'dark' ? '🌞' : '🌙'}
    </button>
  );
}
```

---

## Utility Functions

### calculateReadingTime

Calculate estimated reading time for content.

**Location:** `src/utils/readingTime.ts`

**Usage:**
```tsx
import { calculateReadingTime, formatReadingTime } from '../utils/readingTime';

const content = "Your blog post content...";
const minutes = calculateReadingTime(content);
const formatted = formatReadingTime(minutes); // "5 min read"
```

---

### sanitizeHtml

Sanitize HTML content to prevent XSS attacks.

**Location:** `src/utils/sanitize.ts`

**Usage:**
```tsx
import { sanitizeHtml } from '../utils/sanitize';

const userInput = '<script>alert("XSS")</script><p>Safe content</p>';
const safe = sanitizeHtml(userInput); // "<p>Safe content</p>"
```

---

### analytics

Privacy-focused analytics utility.

**Location:** `src/utils/analytics.ts`

**Usage:**
```tsx
import { analytics } from '../utils/analytics';

// Track page view
analytics.trackPageView('/blog/my-post', 'My Post Title');

// Track custom event
analytics.trackEvent('button_click', { button: 'subscribe' });
```

---

### webVitalsMonitor

Monitor Core Web Vitals metrics.

**Location:** `src/utils/webVitals.ts`

**Usage:**
```tsx
import { webVitalsMonitor } from '../utils/webVitals';

// Initialize monitoring
webVitalsMonitor.init();

// Get metrics
const metrics = webVitalsMonitor.getMetrics();
const lcp = webVitalsMonitor.getMetric('LCP');
```

---

### errorTracker

Track and report errors.

**Location:** `src/utils/errorTracking.ts`

**Usage:**
```tsx
import { errorTracker } from '../utils/errorTracking';

// Initialize error tracking
errorTracker.init();

// Manually capture error
try {
  // risky operation
} catch (error) {
  errorTracker.captureError(error as Error, 'error');
}

// Capture warning
errorTracker.captureWarning('Something might be wrong', { context: 'data' });
```

---

## Context Providers

### BookmarksProvider

Global state management for bookmarks.

**Location:** `src/context/BookmarksContext.tsx`

**Usage:**
```tsx
import { BookmarksProvider } from './context/BookmarksContext';

function App() {
  return (
    <BookmarksProvider>
      <YourApp />
    </BookmarksProvider>
  );
}
```

---

### ThemeProvider

Global theme management.

**Location:** `src/context/ThemeContext.tsx`

**Usage:**
```tsx
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}
```

---

### AuthProvider

Authentication state management.

**Location:** `src/context/AuthContext.tsx`

**Usage:**
```tsx
import { AuthProvider, useAuth } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <YourApp />
    </AuthProvider>
  );
}

function Profile() {
  const { user, signOut } = useAuth();
  
  return user ? (
    <button onClick={signOut}>Sign Out</button>
  ) : (
    <Link to="/login">Sign In</Link>
  );
}
```

---

## Type Definitions

All TypeScript types and interfaces are defined in `src/types/types.ts`.

### Key Types

- `Post` - Blog post interface
- `Comment` - Comment interface
- `Bookmark` - Bookmark interface
- `User` - User interface
- `SiteSettings` - Site configuration interface

See `src/types/types.ts` for complete type definitions.
