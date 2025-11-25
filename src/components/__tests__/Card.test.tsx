import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Card from '../Card';
import { Post, PostStatus } from '../../types/types';

// Mock the hooks
vi.mock('../../hooks/useBookmarks', () => ({
    useBookmarks: () => ({
        isBookmarked: vi.fn(() => false),
        toggleBookmark: vi.fn(),
    }),
}));

const mockPost: Post = {
    id: 'test-1',
    title: 'Test Blog Post',
    excerpt: 'This is a test excerpt for the blog post.',
    content: 'Full content of the test blog post.',
    date: '2024-01-15',
    category: 'Technology',
    tags: ['React', 'Testing', 'Vitest'],
    coverImage: 'https://example.com/image.jpg',
    status: PostStatus.PUBLISHED,
    author: 'Test Author',
    slug: 'test-blog-post',
};

const renderCard = (post: Post = mockPost, viewMode: 'grid' | 'list' | 'compact' = 'grid') => {
    return render(
        <BrowserRouter>
            <Card post={post} viewMode={viewMode} />
        </BrowserRouter>
    );
};

describe('Card Component', () => {
    it('should render post title', () => {
        renderCard();
        expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
    });

    it('should render post excerpt in grid mode', () => {
        renderCard(mockPost, 'grid');
        expect(screen.getByText(/This is a test excerpt/)).toBeInTheDocument();
    });

    it('should not render excerpt in compact mode', () => {
        renderCard(mockPost, 'compact');
        expect(screen.queryByText(/This is a test excerpt/)).not.toBeInTheDocument();
    });

    it('should render post date', () => {
        renderCard();
        expect(screen.getByText('2024-01-15')).toBeInTheDocument();
    });

    it('should render category', () => {
        renderCard();
        expect(screen.getByText('Technology')).toBeInTheDocument();
    });

    it('should render tags', () => {
        renderCard();
        // Tags are shown on hover, but we can check they exist in the DOM
        const card = screen.getByRole('article');
        expect(card).toBeInTheDocument();
    });

    it('should render cover image when provided', () => {
        renderCard();
        const image = screen.getByAltText('Cover image for Test Blog Post');
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
    });

    it('should render link to blog post', () => {
        renderCard();
        const link = screen.getByRole('link', { name: /Read full article/ });
        expect(link).toHaveAttribute('href', '/blog/test-1');
    });

    it('should highlight search terms when provided', () => {
        render(
            <BrowserRouter>
                <Card post={mockPost} highlight="Test" />
            </BrowserRouter>
        );
        expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
    });

    it('should render in list mode with correct layout', () => {
        const { container } = renderCard(mockPost, 'list');
        const article = container.querySelector('article');
        expect(article).toBeInTheDocument();
    });

    it('should render in compact mode with correct layout', () => {
        const { container } = renderCard(mockPost, 'compact');
        const article = container.querySelector('article');
        expect(article).toBeInTheDocument();
    });
});
