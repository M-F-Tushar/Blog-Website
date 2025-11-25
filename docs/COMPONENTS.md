# Component Documentation

This document provides detailed information about React components used in the blog application.

## Table of Contents

- [Blog Components](#blog-components)
- [Common Components](#common-components)
- [Comment Components](#comment-components)
- [Layout Components](#layout-components)

---

## Blog Components

### Card

Display blog post cards with multiple view modes.

**Location:** `src/components/Card.tsx`

**Props:**
```tsx
interface CardProps {
  post: Post;
  viewMode?: 'grid' | 'list' | 'compact';
  highlight?: string;
}
```

**Usage:**
```tsx
<Card post={post} viewMode="grid" highlight="search term" />
```

**Features:**
- Three view modes: grid, list, compact
- Search term highlighting
- Bookmark integration
- Social sharing
- Animated hover effects
- Responsive design

**Accessibility:**
- Semantic HTML with `<article>` tags
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus indicators

---

### TableOfContents

Auto-generated table of contents for blog posts.

**Location:** `src/components/blog/TableOfContents.tsx`

**Props:**
```tsx
interface TableOfContentsProps {
  content: string;
}
```

**Usage:**
```tsx
<TableOfContents content={post.content} />
```

**Features:**
- Parses markdown headings (h2, h3)
- Scroll-aware active section highlighting
- Smooth scroll navigation
- Sticky positioning
- Responsive (hidden on mobile)

---

## Common Components

### BookmarkButton

Toggle bookmark status for posts.

**Location:** `src/components/common/BookmarkButton.tsx`

**Props:**
```tsx
interface BookmarkButtonProps {
  isBookmarked: boolean;
  onToggle: (e: React.MouseEvent) => void;
  className?: string;
}
```

**Usage:**
```tsx
<BookmarkButton 
  isBookmarked={isBookmarked(postId)}
  onToggle={handleToggle}
  className="custom-class"
/>
```

**Features:**
- Animated icon transitions
- Accessible button with ARIA labels
- Custom styling support

---

### Highlighter

Highlight search terms in text.

**Location:** `src/components/common/Highlighter.tsx`

**Props:**
```tsx
interface HighlighterProps {
  text: string;
  highlight: string;
}
```

**Usage:**
```tsx
<Highlighter text="Blog post title" highlight="post" />
```

**Features:**
- Case-insensitive highlighting
- Multiple occurrences support
- Styled `<mark>` tags

---

### PerformanceMonitor

Development-only performance dashboard.

**Location:** `src/components/common/PerformanceMonitor.tsx`

**Props:** None

**Usage:**
```tsx
<PerformanceMonitor />
```

**Features:**
- Displays Core Web Vitals (CLS, INP, FCP, LCP, TTFB)
- Color-coded ratings (good/needs improvement/poor)
- Toggleable dashboard
- Only visible in development mode

---

### ErrorBoundary

Catch and handle React errors gracefully.

**Location:** `src/components/common/ErrorBoundary.tsx`

**Props:**
```tsx
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}
```

**Usage:**
```tsx
<ErrorBoundary fallback={<CustomError />}>
  <YourComponent />
</ErrorBoundary>
```

**Features:**
- Catches component errors
- Displays user-friendly error message
- Logs errors to error tracking
- Reload button for recovery

---

### ThemeToggle

Toggle between light and dark themes.

**Location:** `src/components/ThemeToggle.tsx`

**Props:** None

**Usage:**
```tsx
<ThemeToggle />
```

**Features:**
- Animated icon transitions
- Persists theme preference
- Accessible button with ARIA labels
- Keyboard navigation support

---

## Comment Components

### CommentSection

Complete comment system for blog posts.

**Location:** `src/components/comments/CommentSection.tsx`

**Props:**
```tsx
interface CommentSectionProps {
  postId: string;
}
```

**Usage:**
```tsx
<CommentSection postId={post.id} />
```

**Features:**
- Real-time comment updates (Supabase Realtime)
- Nested replies support
- Authentication required
- Loading states
- Empty state handling

---

### CommentForm

Form for posting comments and replies.

**Location:** `src/components/comments/CommentForm.tsx`

**Props:**
```tsx
interface CommentFormProps {
  postId: string;
  parentId?: string;
  onSuccess?: () => void;
}
```

**Usage:**
```tsx
<CommentForm 
  postId={post.id}
  parentId={comment.id}
  onSuccess={() => console.log('Comment posted')}
/>
```

---

### CommentList

Display list of comments with nested replies.

**Location:** `src/components/comments/CommentList.tsx`

**Props:**
```tsx
interface CommentListProps {
  comments: Comment[];
  postId: string;
}
```

**Usage:**
```tsx
<CommentList comments={comments} postId={post.id} />
```

---

## Layout Components

### Header

Main navigation header.

**Location:** `src/components/Header.tsx`

**Props:** None

**Features:**
- Responsive navigation
- Mobile menu
- Theme toggle
- Search integration
- Active link highlighting

---

### Footer

Site footer with social links.

**Location:** `src/components/Footer.tsx`

**Props:** None

**Features:**
- Social media links
- Copyright information
- Newsletter signup
- Responsive layout

---

## Best Practices

### Component Guidelines

1. **Props Validation**: Use TypeScript interfaces for all props
2. **Accessibility**: Include ARIA labels and semantic HTML
3. **Performance**: Use React.memo for expensive components
4. **Styling**: Use Tailwind CSS utility classes
5. **Testing**: Write unit tests for complex components

### Naming Conventions

- **Components**: PascalCase (e.g., `BlogPost.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth.ts`)
- **Utilities**: camelCase (e.g., `sanitize.ts`)
- **Types**: PascalCase (e.g., `Post`, `Comment`)

### File Organization

```
src/components/
├── common/          # Reusable components
├── blog/            # Blog-specific components
├── comments/        # Comment system components
└── [Feature].tsx    # Feature-specific components
```

---

## Testing Components

All components should have corresponding test files:

```tsx
// Card.test.tsx
import { render, screen } from '@testing-library/react';
import Card from './Card';

test('renders post title', () => {
  render(<Card post={mockPost} />);
  expect(screen.getByText('Test Title')).toBeInTheDocument();
});
```

See `docs/TESTING.md` for comprehensive testing guide.
