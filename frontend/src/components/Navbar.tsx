import React from 'react';
import logo from '../assets/logo.svg';
import { branding } from '../branding';

const Navbar: React.FC = () => (
    <nav className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <img src={logo} alt="Sudokami logo" className="w-10 h-10" />
        <span style={{ fontFamily: branding.font, color: branding.colors.primary, fontWeight: 700, fontSize: 24 }}>
            {branding.name}
        </span>
    </nav>
);

export default Navbar;
