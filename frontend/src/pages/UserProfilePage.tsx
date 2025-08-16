import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Profile {
    _id: string;
    username: string;
    bio?: string;
    followers: string[];
    following: string[];
}

interface Puzzle {
    _id: string;
    title: string;
    createdAt: string;
}

const UserProfilePage: React.FC = () => {
    const { id } = useParams();
    const { user, token } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isFollowing, setIsFollowing] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);

    // Fetch profile and puzzles
    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`/api/users/${id}/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProfile(res.data.user);
                setPuzzles(res.data.puzzles);
                setIsFollowing(res.data.user.followers.includes(user?._id || ''));
            } catch {
                setError('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id, token, user?._id]);

    // Follow/unfollow logic
    const handleFollow = async () => {
        if (!profile) return;
        setFollowLoading(true);
        try {
            if (isFollowing) {
                await axios.post(`/api/users/${profile._id}/unfollow`, {}, { headers: { Authorization: `Bearer ${token}` } });
                setProfile({ ...profile, followers: profile.followers.filter(f => f !== (user?._id || '')) });
                setIsFollowing(false);
            } else {
                await axios.post(`/api/users/${profile._id}/follow`, {}, { headers: { Authorization: `Bearer ${token}` } });
                setProfile({ ...profile, followers: [...profile.followers, user?._id || ''] });
                setIsFollowing(true);
            }
        } catch {
            setError('Failed to update follow status');
        } finally {
            setFollowLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            {error && <div className="mb-4 text-red-500">{error}</div>}
            {loading || !profile ? (
                <div>Loading...</div>
            ) : (
                <>
                    <div className="flex items-center mb-6">
                        {/* Avatar placeholder */}
                        <div className="w-16 h-16 rounded-full bg-blue-400 flex items-center justify-center text-white text-3xl font-bold mr-4">
                            {profile.username[0].toUpperCase()}
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{profile.username}</div>
                            <div className="text-gray-600">{profile.bio || 'No bio yet.'}</div>
                            <div className="flex gap-4 mt-2 text-sm">
                                <span>{profile.followers.length} Followers</span>
                                <span>{profile.following.length} Following</span>
                            </div>
                        </div>
                        {user && user._id !== profile._id && (
                            <button
                                onClick={handleFollow}
                                disabled={followLoading}
                                className={`ml-auto px-4 py-2 rounded text-white ${isFollowing ? 'bg-gray-500 hover:bg-gray-600' : 'bg-blue-500 hover:bg-blue-600'}`}
                            >
                                {isFollowing ? 'Unfollow' : 'Follow'}
                            </button>
                        )}
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold mb-2">Puzzles by {profile.username}</h2>
                        {puzzles.length === 0 ? (
                            <div className="text-gray-500">No puzzles yet.</div>
                        ) : (
                            <ul className="space-y-3">
                                {puzzles.map(p => (
                                    <li key={p._id} className="bg-white p-3 rounded shadow flex justify-between items-center">
                                        <span className="font-semibold">{p.title}</span>
                                        <span className="text-xs text-gray-500">{new Date(p.createdAt).toLocaleString()}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default UserProfilePage;
