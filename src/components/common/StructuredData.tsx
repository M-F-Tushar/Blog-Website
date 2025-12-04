import React from 'react';

interface StructuredDataProps {
  /**
   * The JSON-LD schema data
   */
  data: object;
}

/**
 * Component to inject JSON-LD structured data into the page
 * Renders a <script type="application/ld+json"> tag
 */
const StructuredData: React.FC<StructuredDataProps> = ({ data }) => {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
};

export default StructuredData;
