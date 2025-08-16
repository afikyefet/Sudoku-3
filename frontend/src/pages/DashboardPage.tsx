import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface Puzzle {
    _id: string;
    title: string;
    puzzleData: number[][];
    createdAt: string;
}

const DashboardPage: React.FC = () => {
    const { token } = useAuth();
    const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
    const [title, setTitle] = useState('');
    const [jsonInput, setJsonInput] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Fetch user's puzzles
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

    // Handle puzzle upload
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

    // Handle puzzle delete
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
        <div className="p-8 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Your Sudoku Puzzles</h1>
            {error && <div className="mb-4 text-red-500">{error}</div>}
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    {puzzles.length >= 20 ? (
                        <div className="mb-6 text-yellow-600 font-semibold">You have reached the maximum of 20 uploaded puzzles.</div>
                    ) : (
                        <form onSubmit={handleUpload} className="mb-8 bg-white p-6 rounded shadow">
                            <h2 className="text-xl font-semibold mb-2">Upload New Puzzle</h2>
                            <input
                                type="text"
                                placeholder="Puzzle Title"
                                className="w-full p-2 mb-2 border rounded"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                required
                            />
                            <textarea
                                placeholder="Paste puzzle grid as JSON (e.g. [[0,0,...],[...],...])"
                                className="w-full p-2 mb-2 border rounded font-mono"
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
                            <div>No puzzles uploaded yet.</div>
                        ) : (
                            <ul className="space-y-4">
                                {puzzles.map(puzzle => (
                                    <li key={puzzle._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                                        <div>
                                            <div className="font-semibold">{puzzle.title}</div>
                                            <div className="text-xs text-gray-500">Uploaded: {new Date(puzzle.createdAt).toLocaleString()}</div>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(puzzle._id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
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

export default DashboardPage;
