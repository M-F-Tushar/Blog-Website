export const generateBlogPostSchema = (post: any, authorName: string) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: authorName
    },
    publisher: {
      '@type': 'Person',
      name: authorName
    }
  };
};

export const generateWebsiteSchema = (siteName: string, siteDescription: string) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    description: siteDescription,
    url: 'https://m-f-tushar.github.io/Blog-Website/'
  };
};
