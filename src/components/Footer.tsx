import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, Rss, Mail, Github, Linkedin, Send } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { usePosts } from '../hooks/usePosts';
import { PostStatus } from '../types/types';

interface FooterProps {
  id?: string;
}

const Footer: React.FC<FooterProps> = ({ id }) => {
  const { authorName, socialLinks, siteName, uiText } = useSiteSettings();
  const { posts } = usePosts();
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Safe defaults for uiText.footer
  const footerText = uiText?.footer ?? {
    tagline: 'Exploring ideas through code and creativity.',
    exploreTitle: 'Explore',
    latestTitle: 'Latest Posts',
    stayConnectedTitle: 'Stay Connected',
    newsletterDescription: 'Subscribe to get notified about new posts.',
    subscribeButton: 'Subscribe',
    copyrightText: 'Made with Heart in React',
  };

  // Get popular posts (most recent 3)
  const popularPosts = useMemo(() => {
    return posts
      .filter((p) => p.status === PostStatus.PUBLISHED)
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

    // TODO: Integrate with actual newsletter service
    setSubscribeStatus('success');
    setEmail('');
    setTimeout(() => setSubscribeStatus('idle'), 3000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer
      id={id}
      className="bg-secondary-900 text-secondary-300 border-t border-secondary-800"
      role="contentinfo"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="text-2xl font-bold font-serif text-white tracking-tight hover:opacity-90 transition-opacity">
              {siteName}
            </Link>
            <p className="text-secondary-400 leading-relaxed max-w-sm">
              {footerText.tagline}
            </p>
            <div className="flex items-center gap-4">
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-secondary-800 hover:bg-primary-600 text-secondary-400 hover:text-white rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary-600/20"
                aria-label="Visit GitHub profile"
              >
                <Github size={20} />
              </a>
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-secondary-800 hover:bg-primary-600 text-secondary-400 hover:text-white rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary-600/20"
                aria-label="Visit LinkedIn profile"
              >
                <Linkedin size={20} />
              </a>
              <a
                href={`mailto:${socialLinks.email}`}
                className="p-2.5 bg-secondary-800 hover:bg-primary-600 text-secondary-400 hover:text-white rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary-600/20"
                aria-label="Send email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-semibold text-lg mb-6">{footerText.exploreTitle}</h3>
            <nav className="space-y-3" aria-label="Footer navigation">
              {[
                { path: '/', label: 'Home' },
                { path: '/about', label: 'About' },
                { path: '/blog', label: 'Blog' },
                { path: '/recommendations', label: 'Recommendations' },
                { path: '/contact', label: 'Contact' },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block text-secondary-400 hover:text-primary-400 hover:translate-x-1 transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Popular Posts */}
          <div className="lg:col-span-3">
            <h3 className="text-white font-semibold text-lg mb-6">{footerText.latestTitle}</h3>
            <div className="space-y-4">
              {popularPosts.length > 0 ? (
                popularPosts.map((post) => (
                  <Link key={post.id} to={`/blog/${post.id}`} className="group block">
                    <h4 className="text-secondary-200 group-hover:text-primary-400 transition-colors line-clamp-2 font-medium">
                      {post.title}
                    </h4>
                    <p className="text-xs text-secondary-500 mt-1">
                      {new Date(post.date).toLocaleDateString(undefined, {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-secondary-500">No posts yet</p>
              )}
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3">
            <h3 className="text-white font-semibold text-lg mb-6">{footerText.stayConnectedTitle}</h3>
            <p className="text-sm text-secondary-400 mb-4">
              {footerText.newsletterDescription}
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-500"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-secondary-800 border border-secondary-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-secondary-500 transition-all hover:bg-secondary-700/50"
                  aria-label="Email for newsletter"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-primary-900/20 hover:shadow-primary-600/30 hover:-translate-y-0.5 active:translate-y-0"
              >
                <Send size={16} />
                {footerText.subscribeButton}
              </button>
              {subscribeStatus === 'success' && (
                <p className="text-xs text-green-400 animate-fade-in">✓ Subscribed successfully!</p>
              )}
              {subscribeStatus === 'error' && (
                <p className="text-xs text-red-400 animate-fade-in">✗ Please enter a valid email</p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-secondary-500 flex items-center gap-1">
            © {currentYear} {authorName}. {footerText.copyrightText || 'Made with Heart in React'}
            {/* Fallback to hardcoded if empty, but keeping the heart icon logic separate requires parsing. 
                 Simplifying to text for now as per plan, or I can re-add the icon if needed.
                 The user asked for dynamic. Let's assume copyrightText contains the whole 'Made with Heart...' string. 
                 For now, I'll append the dynamic text. 
             */}
          </p>

          <div className="flex items-center gap-6">
            <a
              href="/rss.xml"
              className="text-sm text-secondary-500 hover:text-primary-400 transition-colors flex items-center gap-2 hover:scale-105"
            >
              <Rss size={14} />
              <span>RSS</span>
            </a>
            <button
              onClick={scrollToTop}
              className="text-sm text-secondary-500 hover:text-primary-400 transition-colors flex items-center gap-2 hover:scale-105"
            >
              <ArrowUp size={14} />
              <span>Back to Top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
