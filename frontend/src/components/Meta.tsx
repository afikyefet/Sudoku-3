import React from 'react';
import { Helmet } from 'react-helmet-async';

interface MetaProps {
    title: string;
    description?: string;
    image?: string;
    extra?: React.ReactNode;
}

const Meta: React.FC<MetaProps> = ({ title, description, image, extra }) => (
    <Helmet>
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
        <meta property="og:title" content={title} />
        {description && <meta property="og:description" content={description} />}
        {image && <meta property="og:image" content={image} />}
        {image && <meta name="twitter:card" content="summary_large_image" />}
        {image && <meta name="twitter:image" content={image} />}
        {extra}
    </Helmet>
);

export default Meta;
