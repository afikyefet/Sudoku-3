import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

    // Fetch feed puzzles
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

    // Like a puzzle
    const handleLike = async (id: string) => {
        try {
            await axios.post(`/api/sudoku/${id}/like`, {}, { headers: { Authorization: `Bearer ${token}` } });
            setFeed(feed => feed.map(p => p._id === id ? { ...p, likes: [...p.likes, 'me'] } : p));
        } catch { }
    };

    // Comment on a puzzle
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
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Feed</h1>
            {error && <div className="mb-4 text-red-500">{error}</div>}
            {loading ? (
                <div>Loading...</div>
            ) : feed.length === 0 ? (
                <div>No recent puzzles from followed users.</div>
            ) : (
                <ul className="space-y-6">
                    {feed.map(puzzle => (
                        <li key={puzzle._id} className="bg-white p-4 rounded shadow">
                            <div className="flex items-center mb-2">
                                {/* Placeholder avatar */}
                                <div className="w-10 h-10 rounded-full bg-blue-300 flex items-center justify-center text-white font-bold mr-3">
                                    {puzzle.user.username[0].toUpperCase()}
                                </div>
                                <div>
                                    <div className="font-semibold">{puzzle.user.username}</div>
                                    <div className="text-xs text-gray-500">{new Date(puzzle.createdAt).toLocaleString()}</div>
                                </div>
                            </div>
                            <div
                                className="cursor-pointer text-lg font-bold mb-2 hover:underline"
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
                                    className="flex-1 p-2 border rounded"
                                    value={commentInputs[puzzle._id] || ''}
                                    onChange={e => setCommentInputs(inputs => ({ ...inputs, [puzzle._id]: e.target.value }))}
                                />
                                <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Comment</button>
                            </form>
                            <div>
                                <h3 className="font-semibold mb-1">Comments</h3>
                                {puzzle.comments.length === 0 ? (
                                    <div className="text-gray-500">No comments yet.</div>
                                ) : (
                                    <ul className="space-y-1">
                                        {puzzle.comments.slice(0, 3).map((c, i) => (
                                            <li key={i} className="bg-gray-100 p-2 rounded">
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
