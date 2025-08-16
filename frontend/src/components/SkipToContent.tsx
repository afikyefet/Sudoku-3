import React from 'react';

const SkipToContent: React.FC = () => (
    <a
        href="#main-content"
        className="absolute left-0 top-0 m-2 p-2 bg-blue-600 text-white rounded z-50 focus:block focus:outline-none focus:ring-2 focus:ring-blue-400 sr-only focus:not-sr-only"
    >
        Skip to main content
    </a>
);

export default SkipToContent;
