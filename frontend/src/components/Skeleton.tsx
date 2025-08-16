import React from 'react';

interface SkeletonProps {
    width?: string;
    height?: string;
    className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ width = 'w-full', height = 'h-6', className = '' }) => (
    <div
        className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${width} ${height} ${className}`}
    />
);

export default Skeleton;
