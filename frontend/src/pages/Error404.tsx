import React from 'react';
import { Link } from 'react-router-dom';

const Error404: React.FC = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-center">
        <h1 className="text-5xl font-bold text-blue-600 mb-4">404</h1>
        <p className="text-xl mb-6">Page not found.</p>
        <Link to="/" className="text-blue-500 underline">Go to Home</Link>
    </div>
);

export default Error404;
