import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../components/Avatar';
import Meta from '../components/Meta';
import Skeleton from '../components/Skeleton';
import { useAuth } from '../context/AuthContext';

interface Puzzle {
    _id: string;
    title: string;
    puzzleData: number[][];
    createdAt: string;
}

const DashboardPage: React.FC = () => {
    const { token, user } = useAuth();
    const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
    const [title, setTitle] = useState('');
    const [jsonInput, setJsonInput] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [resumePuzzleId, setResumePuzzleId] = useState<string | null>(null);

    // Check for saved progress on mount
    useEffect(() => {
        if (!user?._id) return;
        const keys = Object.keys(localStorage).filter(k => k.startsWith(`sudoku-progress-${user._id}-`));
        if (keys.length > 0) {
            // Use the most recent (or just the first)
            const lastKey = keys[0];
            const match = lastKey.match(/sudoku-progress-[^-]+-(.+)/);
            if (match) setResumePuzzleId(match[1]);
        }
    }, [user?._id]);

    useEffect(() => {
        const fetchPuzzles = async () => {
            setLoading(true);
            try {
                const res = await axios.get('/api/sudoku', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPuzzles(res.data);
            } catch (err: any) {
                setError('Failed to load puzzles');
            } finally {
                setLoading(false);
            }
        };
        fetchPuzzles();
    }, [token]);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        let puzzleData: number[][] = [];
        try {
            puzzleData = JSON.parse(jsonInput);
            if (!Array.isArray(puzzleData) || !Array.isArray(puzzleData[0])) {
                throw new Error('Invalid grid format');
            }
        } catch {
            setError('Invalid JSON for puzzle grid');
            return;
        }
        try {
            const res = await axios.post(
                '/api/sudoku',
                { title, puzzleData },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPuzzles([res.data, ...puzzles]);
            setTitle('');
            setJsonInput('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to upload puzzle');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this puzzle?')) return;
        try {
            await axios.delete(`/api/sudoku/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPuzzles(puzzles.filter(p => p._id !== id));
        } catch {
            setError('Failed to delete puzzle');
        }
    };

    return (
        <>
            <Meta
                title="Dashboard | Sudoku Live"
                description="Manage your Sudoku puzzles, resume games, and see your stats."
                image="/sudoku-preview.png"
            />
            <div className="p-4 sm:p-8 max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">Your Sudoku Puzzles</h1>
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
                ) : (
                    <>
                        {resumePuzzleId && (
                            <div className="mb-6 bg-yellow-100 dark:bg-yellow-900 p-4 rounded-xl flex items-center justify-between">
                                <span className="font-semibold">You have an unfinished puzzle. </span>
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-4"
                                    onClick={() => navigate(`/puzzle/${resumePuzzleId}`)}
                                >
                                    Resume Last Game
                                </button>
                            </div>
                        )}
                        {puzzles.length >= 20 ? (
                            <div className="mb-6 text-yellow-600 font-semibold">You have reached the maximum of 20 uploaded puzzles.</div>
                        ) : (
                            <form onSubmit={handleUpload} className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
                                <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Upload New Puzzle</h2>
                                <input
                                    type="text"
                                    placeholder="Puzzle Title"
                                    className="w-full p-2 mb-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    required
                                />
                                <textarea
                                    placeholder="Paste puzzle grid as JSON (e.g. [[0,0,...],[...],...])"
                                    className="w-full p-2 mb-2 border rounded font-mono dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                                    value={jsonInput}
                                    onChange={e => setJsonInput(e.target.value)}
                                    rows={4}
                                    required
                                />
                                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Upload</button>
                            </form>
                        )}
                        <div>
                            {puzzles.length === 0 ? (
                                <div className="text-gray-500 dark:text-gray-400">No puzzles uploaded yet.</div>
                            ) : (
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {puzzles.map(puzzle => (
                                        <li
                                            key={puzzle._id}
                                            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow flex flex-col justify-between cursor-pointer hover:ring-2 hover:ring-blue-400 transition"
                                        >
                                            <div className="flex items-center gap-3 mb-2">
                                                <Avatar username={user?.username || 'U'} />
                                                <span className="font-semibold text-gray-900 dark:text-gray-100" onClick={() => navigate(`/puzzle/${puzzle._id}`)}>{puzzle.title}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-500">{new Date(puzzle.createdAt).toLocaleString()}</span>
                                                <button
                                                    aria-label="Delete this puzzle"
                                                    onClick={() => handleDelete(puzzle._id)}
                                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                                >
                                                    Delete
                                                </button>
                                            </div>
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

export default DashboardPage;
