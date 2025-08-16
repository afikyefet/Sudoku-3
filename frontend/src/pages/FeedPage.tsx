import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../components/Avatar';
import Skeleton from '../components/Skeleton';
import { useAuth } from '../context/AuthContext';

interface FeedPuzzle {
    _id: string;
    title: string;
    user: { _id: string; username: string };
    likes: string[];
    comments: { user: string; content: string; createdAt: string }[];
    createdAt: string;
}

const FeedPage: React.FC = () => {
    const { token } = useAuth();
    const [feed, setFeed] = useState<FeedPuzzle[]>([]);
    const [commentInputs, setCommentInputs] = useState<{ [id: string]: string }>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFeed = async () => {
            setLoading(true);
            try {
                const res = await axios.get('/api/sudoku/feed', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setFeed(res.data);
            } catch {
                setError('Failed to load feed');
            } finally {
                setLoading(false);
            }
        };
        fetchFeed();
    }, [token]);

    const handleLike = async (id: string) => {
        try {
            await axios.post(`/api/sudoku/${id}/like`, {}, { headers: { Authorization: `Bearer ${token}` } });
            setFeed(feed => feed.map(p => p._id === id ? { ...p, likes: [...p.likes, 'me'] } : p));
        } catch { }
    };

    const handleComment = async (id: string) => {
        const content = commentInputs[id];
        if (!content?.trim()) return;
        try {
            const res = await axios.post(
                `/api/sudoku/${id}/comment`,
                { content },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setFeed(feed => feed.map(p => p._id === id ? { ...p, comments: [res.data, ...p.comments] } : p));
            setCommentInputs(inputs => ({ ...inputs, [id]: '' }));
        } catch { }
    };

    return (
        <div className="p-4 sm:p-8 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">Feed</h1>
            {error && <div className="mb-4 text-red-500">{error}</div>}
            {loading ? (
                <div className="space-y-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <Skeleton width="w-10" height="h-10" />
                                <Skeleton width="w-32" />
                            </div>
                            <Skeleton width="w-1/2" />
                            <Skeleton width="w-full" height="h-8" />
                        </div>
                    ))}
                </div>
            ) : feed.length === 0 ? (
                <div className="text-gray-500 dark:text-gray-400">No recent puzzles from followed users.</div>
            ) : (
                <ul className="space-y-6">
                    {feed.map(puzzle => (
                        <li key={puzzle._id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow flex flex-col gap-2 sm:gap-4">
                            <div className="flex items-center mb-2 gap-3">
                                <Avatar username={puzzle.user.username} />
                                <div>
                                    <div className="font-semibold text-gray-900 dark:text-gray-100">{puzzle.user.username}</div>
                                    <div className="text-xs text-gray-500">{new Date(puzzle.createdAt).toLocaleString()}</div>
                                </div>
                            </div>
                            <div
                                className="cursor-pointer text-lg font-bold mb-2 hover:underline text-gray-800 dark:text-gray-100"
                                onClick={() => navigate(`/puzzle/${puzzle._id}`)}
                            >
                                {puzzle.title}
                            </div>
                            <div className="flex gap-4 mb-2">
                                <button
                                    onClick={() => handleLike(puzzle._id)}
                                    className="bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-600"
                                >
                                    Like ({puzzle.likes.length})
                                </button>
                            </div>
                            <form
                                onSubmit={e => {
                                    e.preventDefault();
                                    handleComment(puzzle._id);
                                }}
                                className="flex gap-2 mb-2"
                            >
                                <input
                                    type="text"
                                    placeholder="Add a comment..."
                                    className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                                    value={commentInputs[puzzle._id] || ''}
                                    onChange={e => setCommentInputs(inputs => ({ ...inputs, [puzzle._id]: e.target.value }))}
                                />
                                <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Comment</button>
                            </form>
                            <div>
                                <h3 className="font-semibold mb-1 text-gray-900 dark:text-gray-100">Comments</h3>
                                {puzzle.comments.length === 0 ? (
                                    <div className="text-gray-500 dark:text-gray-400">No comments yet.</div>
                                ) : (
                                    <ul className="space-y-1">
                                        {puzzle.comments.slice(0, 3).map((c, i) => (
                                            <li key={i} className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                                                <span className="font-bold mr-2">{c.user}</span>
                                                <span>{c.content}</span>
                                                <span className="text-xs text-gray-400 ml-2">{new Date(c.createdAt).toLocaleString()}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FeedPage;
