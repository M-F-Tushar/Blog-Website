import React from 'react';

interface StructuredDataProps {
  /**
   * The JSON-LD schema data
   */
  data: object;
}

/**
 * Sanitize JSON for safe injection in script tags
 * Escapes characters that could break out of the script context
 */
const sanitizeJson = (jsonString: string): string => {
  return jsonString
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/'/g, '\\u0027');
};

/**
 * Component to inject JSON-LD structured data into the page
 * Renders a <script type="application/ld+json"> tag
 */
const StructuredData: React.FC<StructuredDataProps> = ({ data }) => {
  const sanitizedJson = sanitizeJson(JSON.stringify(data));
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: sanitizedJson }} />
  );
};

export default StructuredData;
