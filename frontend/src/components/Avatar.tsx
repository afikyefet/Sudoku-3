import React from 'react';

interface AvatarProps {
    username: string;
    size?: string; // e.g. 'w-10 h-10'
    imageUrl?: string;
}

const Avatar: React.FC<AvatarProps> = ({ username, size = 'w-10 h-10', imageUrl }) => {
    return imageUrl ? (
        <img
            src={imageUrl}
            alt={username}
            className={`${size} rounded-full object-cover border-2 border-gray-300 dark:border-gray-600`}
        />
    ) : (
        <div
            className={`${size} rounded-full flex items-center justify-center bg-blue-400 text-white font-bold text-xl border-2 border-gray-300 dark:border-gray-600`}
        >
            {username[0].toUpperCase()}
        </div>
    );
};

export default Avatar;
