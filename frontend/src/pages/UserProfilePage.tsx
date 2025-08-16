import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Avatar from '../components/Avatar';
import Meta from '../components/Meta';
import Skeleton from '../components/Skeleton';
import { useAuth } from '../context/AuthContext';

interface Profile {
    _id: string;
    username: string;
    bio?: string;
    followers: string[];
    following: string[];
    referralCount?: number;
    referralPoints?: number;
    referralFlair?: string;
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
    const navigate = useNavigate();

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
        <>
            <Meta
                title={profile ? `${profile.username} | Sudoku Profile` : 'Sudoku Profile'}
                description={profile ? `View ${profile.username}'s Sudoku profile and puzzles` : 'Sudoku social profile'}
                image={'/avatar-placeholder.png'}
            />
            <div className="p-4 sm:p-8 max-w-3xl mx-auto">
                {error && <div className="mb-4 text-red-500">{error}</div>}
                {loading || !profile ? (
                    <div>
                        <div className="flex items-center mb-6 gap-4">
                            <Skeleton width="w-16" height="h-16" />
                            <div className="flex-1 space-y-2">
                                <Skeleton width="w-32" />
                                <Skeleton width="w-24" />
                                <Skeleton width="w-40" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            {[...Array(3)].map((_, i) => <Skeleton key={i} height="h-12" />)}
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center mb-6 gap-4">
                            <Avatar username={profile.username} size="w-16 h-16" />
                            <div>
                                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{profile.username}</div>
                                <div className="text-gray-600 dark:text-gray-300">{profile.bio || 'No bio yet.'}</div>
                                <div className="flex gap-4 mt-2 text-sm">
                                    <span>{profile.followers.length} Followers</span>
                                    <span>{profile.following.length} Following</span>
                                    {profile.referralCount !== undefined && (
                                        <span>{profile.referralCount} Referrals</span>
                                    )}
                                    {profile.referralPoints !== undefined && (
                                        <span>{profile.referralPoints} Points</span>
                                    )}
                                    {profile.referralFlair && (
                                        <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded">{profile.referralFlair}</span>
                                    )}
                                </div>
                            </div>
                            {user && user._id !== profile._id && (
                                <button
                                    aria-label={isFollowing ? 'Unfollow user' : 'Follow user'}
                                    onClick={handleFollow}
                                    disabled={followLoading}
                                    className={`ml-auto px-4 py-2 rounded text-white ${isFollowing ? 'bg-gray-500 hover:bg-gray-600' : 'bg-blue-500 hover:bg-blue-600'}`}
                                >
                                    {isFollowing ? 'Unfollow' : 'Follow'}
                                </button>
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Puzzles by {profile.username}</h2>
                            {puzzles.length === 0 ? (
                                <div className="text-gray-500 dark:text-gray-400">No puzzles yet.</div>
                            ) : (
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {puzzles.map(p => (
                                        <li
                                            key={p._id}
                                            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow flex flex-col justify-between cursor-pointer hover:ring-2 hover:ring-blue-400 transition"
                                            onClick={() => navigate(`/puzzle/${p._id}`)}
                                        >
                                            <span className="font-semibold text-gray-900 dark:text-gray-100">{p.title}</span>
                                            <span className="text-xs text-gray-500">{new Date(p.createdAt).toLocaleString()}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default UserProfilePage;
