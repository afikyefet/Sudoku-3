import React from 'react';
import { Link } from 'react-router-dom';

const Error500: React.FC = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-center">
        <h1 className="text-5xl font-bold text-red-600 mb-4">500</h1>
        <p className="text-xl mb-6">Something went wrong. Please try again later.</p>
        <Link to="/" className="text-blue-500 underline">Go to Home</Link>
    </div>
);

export default Error500;
