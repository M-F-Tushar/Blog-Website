import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, Rss, Mail, Github, Linkedin, Send } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { usePosts } from '../hooks/usePosts';
import { PostStatus } from '../types/types';

const Footer: React.FC = () => {
    const { authorName, socialLinks } = useSiteSettings();
    const { posts } = usePosts();
    const [email, setEmail] = useState('');
    const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'success' | 'error'>('idle');

    // Get popular posts (most recent 3)
    const popularPosts = useMemo(() => {
        return posts
            .filter(p => p.status === PostStatus.PUBLISHED)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 3);
    }, [posts]);

    const handleNewsletterSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setSubscribeStatus('error');
            setTimeout(() => setSubscribeStatus('idle'), 3000);
            return;
        }

        // TODO: Integrate with actual newsletter service (Mailchimp, ConvertKit, etc.)
        console.log('Newsletter signup:', email);
        setSubscribeStatus('success');
        setEmail('');
        setTimeout(() => setSubscribeStatus('idle'), 3000);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const currentYear = new Date().getFullYear();
    const lastUpdated = useMemo(() => {
        if (posts.length === 0) return new Date().toLocaleDateString();
        const latestPost = posts
            .filter(p => p.status === PostStatus.PUBLISHED)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
        return latestPost ? new Date(latestPost.date).toLocaleDateString() : new Date().toLocaleDateString();
    }, [posts]);

    return (
        <footer className="bg-gray-900 dark:bg-black text-gray-300 border-t border-gray-800" role="contentinfo">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">

                    {/* Column 1: About & Sitemap */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">Navigation</h3>
                        <nav className="space-y-2" aria-label="Footer navigation">
                            <Link to="/" className="block hover:text-accent transition-colors">
                                Home
                            </Link>
                            <Link to="/about" className="block hover:text-accent transition-colors">
                                About
                            </Link>
                            <Link to="/blog" className="block hover:text-accent transition-colors">
                                Blog
                            </Link>
                            <Link to="/recommendations" className="block hover:text-accent transition-colors">
                                Recommendations
                            </Link>
                            <Link to="/contact" className="block hover:text-accent transition-colors">
                                Contact
                            </Link>
                        </nav>
                    </div>

                    {/* Column 2: Popular Posts */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">Popular Posts</h3>
                        <div className="space-y-3">
                            {popularPosts.length > 0 ? (
                                popularPosts.map(post => (
                                    <Link
                                        key={post.id}
                                        to={`/blog/${post.id}`}
                                        className="block group"
                                    >
                                        <p className="text-sm hover:text-accent transition-colors line-clamp-2 group-hover:underline">
                                            {post.title}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(post.date).toLocaleDateString()}
                                        </p>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">No posts yet</p>
                            )}
                        </div>
                    </div>

                    {/* Column 3: Resources */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">Resources</h3>
                        <div className="space-y-2">
                            <a
                                href="/rss.xml"
                                className="flex items-center gap-2 hover:text-accent transition-colors"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Rss size={16} />
                                <span>RSS Feed</span>
                            </a>
                            <button
                                onClick={scrollToTop}
                                className="flex items-center gap-2 hover:text-accent transition-colors"
                            >
                                <ArrowUp size={16} />
                                <span>Back to Top</span>
                            </button>
                            <div className="pt-2">
                                <p className="text-xs text-gray-500">
                                    Last updated: {lastUpdated}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Column 4: Newsletter */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">Stay Updated</h3>
                        <p className="text-sm mb-4 text-gray-400">
                            Subscribe to get notified about new posts
                        </p>
                        <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                            <div className="relative">
                                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-white placeholder-gray-500"
                                    aria-label="Email for newsletter"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-accent hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <Send size={16} />
                                Subscribe
                            </button>
                            {subscribeStatus === 'success' && (
                                <p className="text-xs text-green-400">✓ Subscribed successfully!</p>
                            )}
                            {subscribeStatus === 'error' && (
                                <p className="text-xs text-red-400">✗ Please enter a valid email</p>
                            )}
                        </form>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-800 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                        {/* Copyright */}
                        <div className="text-center md:text-left">
                            <p className="text-sm text-gray-400">
                                © {currentYear} {authorName}. All Rights Reserved.
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                                Built with React, TypeScript & Tailwind CSS
                            </p>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center gap-4">
                            <a
                                href={socialLinks.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors group"
                                aria-label="Visit GitHub profile"
                            >
                                <Github size={20} className="text-gray-400 group-hover:text-white transition-colors" />
                            </a>
                            <a
                                href={socialLinks.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors group"
                                aria-label="Visit LinkedIn profile"
                            >
                                <Linkedin size={20} className="text-gray-400 group-hover:text-white transition-colors" />
                            </a>
                            <a
                                href={`mailto:${socialLinks.email}`}
                                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors group"
                                aria-label="Send email"
                            >
                                <Mail size={20} className="text-gray-400 group-hover:text-white transition-colors" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;