# Architecture Documentation

This document explains the architecture, design patterns, and data flow of the blog application.

## Table of Contents

- [Project Structure](#project-structure)
- [Design Patterns](#design-patterns)
- [State Management](#state-management)
- [Data Flow](#data-flow)
- [Performance Optimizations](#performance-optimizations)

---

## Project Structure

```
Blog-Website/
├── .github/              # GitHub Actions workflows
│   ├── workflows/        # CI/CD pipelines
│   └── dependabot.yml    # Dependency updates
├── .husky/               # Git hooks
├── docs/                 # Documentation
├── e2e/                  # E2E tests (Playwright)
│   └── visual/           # Visual regression tests
├── public/               # Static assets
│   ├── _headers          # Netlify headers
│   ├── robots.txt        # SEO robots file
│   └── manifest.json     # PWA manifest
├── scripts/              # Build scripts
│   └── generate-seo.ts   # Sitemap/RSS generation
├── src/
│   ├── components/       # React components
│   │   ├── admin/        # Admin panel components
│   │   ├── blog/         # Blog-specific components
│   │   ├── comments/     # Comment system
│   │   └── common/       # Reusable components
│   ├── config/           # Configuration files
│   │   └── validateEnv.ts # Environment validation
│   ├── context/          # React Context providers
│   │   ├── AuthContext.tsx
│   │   ├── BookmarksContext.tsx
│   │   └── ThemeContext.tsx
│   ├── hooks/            # Custom React hooks
│   │   ├── useAnalytics.ts
│   │   ├── useBookmarks.ts
│   │   ├── useLocalStorage.ts
│   │   ├── usePosts.ts
│   │   └── useTheme.ts
│   ├── services/         # API services
│   │   └── supabaseService.ts
│   ├── styles/           # Global styles
│   │   ├── accessibility.css
│   │   └── index.css
│   ├── test/             # Test utilities
│   │   └── setup.ts
│   ├── types/            # TypeScript types
│   │   └── types.ts
│   ├── utils/            # Utility functions
│   │   ├── analytics.ts
│   │   ├── errorTracking.ts
│   │   ├── readingTime.ts
│   │   ├── sanitize.ts
│   │   ├── seo.ts
│   │   └── webVitals.ts
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   └── vite-env.d.ts     # Vite types
├── supabase/             # Supabase migrations
│   └── migrations/       # Database migrations
├── .lintstagedrc.json    # Lint-staged config
├── package.json          # Dependencies
├── playwright.config.ts  # Playwright config
├── tailwind.config.js    # Tailwind config
├── tsconfig.json         # TypeScript config
├── vite.config.ts        # Vite config
└── vitest.config.ts      # Vitest config
```

---

## Design Patterns

### Component Composition

Components are designed to be composable and reusable:

```tsx
// Composition pattern
<ErrorBoundary>
  <Suspense fallback={<Loading />}>
    <BlogPost />
  </Suspense>
</ErrorBoundary>
```

### Custom Hooks Pattern

Business logic is extracted into custom hooks:

```tsx
// Hook encapsulates logic
function usePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchPosts().then(setPosts).finally(() => setLoading(false));
  }, []);
  
  return { posts, loading };
}
```

### Context Provider Pattern

Global state is managed through Context API:

```tsx
// Provider wraps app
<BookmarksProvider>
  <App />
</BookmarksProvider>

// Consumers use hook
function Component() {
  const { bookmarks, toggleBookmark } = useBookmarks();
}
```

### Render Props Pattern

Used for flexible component composition:

```tsx
<ErrorBoundary fallback={<CustomError />}>
  {children}
</ErrorBoundary>
```

---

## State Management

### Local State

Component-specific state using `useState`:

```tsx
const [isOpen, setIsOpen] = useState(false);
```

### Global State

Application-wide state using Context API:

- **AuthContext**: User authentication state
- **ThemeContext**: Dark/light theme preference
- **BookmarksContext**: User bookmarks
- **PostsContext**: Blog posts data
- **SiteSettingsContext**: Site configuration

### Persistent State

State persisted to localStorage using `useLocalStorage` hook:

```tsx
const [theme, setTheme] = useLocalStorage('theme', 'light');
```

### Server State

Data from Supabase managed through custom hooks:

```tsx
const { posts, loading, error } = usePosts();
```

---

## Data Flow

### Data Fetching Flow

```
User Action → Component → Custom Hook → Supabase Service → Supabase API
                                              ↓
                                         Update State
                                              ↓
                                         Re-render UI
```

### Authentication Flow

```
1. User enters credentials
2. AuthContext.signIn() called
3. Supabase authentication
4. User state updated
5. Protected routes accessible
6. User data persisted
```

### Bookmark Flow

```
1. User clicks bookmark button
2. toggleBookmark() called
3. Check authentication
4. Update Supabase database
5. Update local state (BookmarksContext)
6. UI reflects new state
```

### Comment Flow

```
1. User submits comment
2. Validate authentication
3. Save to Supabase
4. Realtime subscription updates
5. New comment appears instantly
```

---

## Performance Optimizations

### Code Splitting

Routes are lazy-loaded to reduce initial bundle size:

```tsx
const BlogPost = lazy(() => import('./components/BlogPost'));
```

### React Compiler

Automatic memoization using React 19 Compiler:

```tsx
// Automatically optimized by compiler
function Component({ data }) {
  const processed = expensiveOperation(data);
  return <div>{processed}</div>;
}
```

### Image Optimization

- Lazy loading with `loading="lazy"`
- Responsive images with `srcset`
- WebP format with fallbacks

### Bundle Optimization

- Tree-shaking unused code
- Manual chunk splitting
- Dependency pre-bundling
- CSS code splitting

### Caching Strategy

**Service Worker (PWA):**
- App shell cached
- Static assets cached
- Network-first for API calls

**HTTP Caching:**
- Static assets: 1 year cache
- HTML: No cache
- API responses: Conditional caching

---

## Security Architecture

### Input Sanitization

All user input is sanitized using DOMPurify:

```tsx
import { sanitizeHtml } from './utils/sanitize';

const safe = sanitizeHtml(userInput);
```

### Content Security Policy

Strict CSP headers prevent XSS attacks:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'
```

### Row Level Security

Supabase RLS policies protect data:

```sql
-- Public read, authenticated write
CREATE POLICY "Allow public read" ON posts FOR SELECT USING (true);
CREATE POLICY "Allow auth write" ON posts FOR INSERT TO authenticated;
```

### Environment Variables

Sensitive data stored in environment variables:

```env
VITE_SUPABASE_URL=***
VITE_SUPABASE_ANON_KEY=***
```

---

## Testing Architecture

### Unit Tests (Vitest)

Test individual functions and components:

```tsx
test('calculates reading time', () => {
  expect(calculateReadingTime(content)).toBe(5);
});
```

### E2E Tests (Playwright)

Test complete user flows:

```tsx
test('user can bookmark post', async ({ page }) => {
  await page.goto('/blog');
  await page.click('[aria-label="Bookmark"]');
  await expect(page.locator('.bookmarked')).toBeVisible();
});
```

### Visual Regression

Screenshot comparison for UI consistency:

```tsx
await expect(page).toHaveScreenshot('homepage.png');
```

---

## Deployment Architecture

### Build Process

```
1. Run tests (unit + E2E)
2. Lint and type check
3. Generate sitemap/RSS
4. Build optimized bundle
5. Compress assets (gzip + brotli)
6. Deploy to Netlify/Vercel
```

### CI/CD Pipeline

```
Push to GitHub
    ↓
GitHub Actions
    ↓
Run Tests → Build → Deploy
    ↓
Production
```

### Environment Strategy

- **Development**: Local Vite server
- **Staging**: Preview deployments
- **Production**: Optimized build with CDN

---

## Monitoring & Analytics

### Web Vitals

Core Web Vitals tracked and reported:

- CLS (Cumulative Layout Shift)
- INP (Interaction to Next Paint)
- FCP (First Contentful Paint)
- LCP (Largest Contentful Paint)
- TTFB (Time to First Byte)

### Error Tracking

Errors captured and logged:

- Unhandled errors
- Promise rejections
- Component errors (ErrorBoundary)

### Analytics

Privacy-focused analytics:

- Page views
- Search queries
- Bookmark actions
- Comment interactions
- No PII collection
- GDPR compliant

---

## Future Improvements

- [ ] Implement server-side rendering (SSR)
- [ ] Add GraphQL API layer
- [ ] Implement real-time collaboration
- [ ] Add multi-language support (i18n)
- [ ] Implement advanced caching strategies
- [ ] Add A/B testing framework
