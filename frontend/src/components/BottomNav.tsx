import React from 'react';
import { NavLink } from 'react-router-dom';

const BottomNav: React.FC = () => (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-around items-center h-14 z-50 sm:hidden">
        <NavLink to="/" aria-label="Dashboard" className={({ isActive }) => isActive ? 'text-blue-600' : 'text-gray-500'}>
            <span role="img" aria-label="Dashboard">🏠</span>
        </NavLink>
        <NavLink to="/feed" aria-label="Feed" className={({ isActive }) => isActive ? 'text-blue-600' : 'text-gray-500'}>
            <span role="img" aria-label="Feed">📰</span>
        </NavLink>
        <NavLink to="/profile/me" aria-label="Profile" className={({ isActive }) => isActive ? 'text-blue-600' : 'text-gray-500'}>
            <span role="img" aria-label="Profile">👤</span>
        </NavLink>
    </nav>
);

export default BottomNav;
