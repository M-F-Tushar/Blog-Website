import React from 'react';
import { Helmet } from 'react-helmet-async';
import { siteConfig } from '../../utils/seo';

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article';
    publishedTime?: string;
    modifiedTime?: string;
    tags?: string[];
}

const SEO: React.FC<SEOProps> = ({
    title,
    description,
    image,
    url,
    type = 'website',
    publishedTime,
    modifiedTime,
    tags,
}) => {
    const metaTitle = title ? `${title} | ${siteConfig.title}` : siteConfig.title;
    const metaDescription = description || siteConfig.description;
    const metaImage = image || siteConfig.author.image;
    const metaUrl = url ? `${siteConfig.url}${url}` : siteConfig.url;

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{metaTitle}</title>
            <meta name="description" content={metaDescription} />
            <link rel="canonical" href={metaUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={metaTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:url" content={metaUrl} />
            <meta property="og:image" content={metaImage} />
            <meta property="og:site_name" content={siteConfig.title} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:creator" content={siteConfig.author.twitter} />
            <meta name="twitter:title" content={metaTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={metaImage} />

            {/* Article Specific Tags */}
            {publishedTime && <meta property="article:published_time" content={publishedTime} />}
            {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
            {tags && tags.map((tag) => <meta property="article:tag" content={tag} key={tag} />)}
        </Helmet>
    );
};

export default SEO;
