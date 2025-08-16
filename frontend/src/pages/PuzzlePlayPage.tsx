import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GRID_SIZE = 9;

type Cell = {
    value: number;
    fixed: boolean;
};

const getBoxIndex = (row: number, col: number) => {
    return Math.floor(row / 3) * 3 + Math.floor(col / 3);
};

const PuzzlePlayPage: React.FC = () => {
    const { id } = useParams();
    const { token } = useAuth();
    const [grid, setGrid] = useState<Cell[][]>([]);
    const [solution, setSolution] = useState<number[][] | null>(null);
    const [selected, setSelected] = useState<[number, number] | null>(null);
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(0);
    const [timerActive, setTimerActive] = useState(true);
    const [likeCount, setLikeCount] = useState(0);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState<{ user: string; content: string; createdAt: string }[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Fetch puzzle data
    useEffect(() => {
        const fetchPuzzle = async () => {
            try {
                const res = await axios.get(`/api/sudoku/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const puzzleData: number[][] = res.data.puzzleData;
                setGrid(
                    puzzleData.map(row =>
                        row.map(val => ({ value: val, fixed: val !== 0 }))
                    )
                );
                setLikeCount(res.data.likes?.length || 0);
                setComments(res.data.comments || []);
            } catch {
                setError('Failed to load puzzle');
            }
        };
        fetchPuzzle();
    }, [id, token]);

    // Timer logic
    useEffect(() => {
        if (timerActive) {
            timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
        } else if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [timerActive]);

    // Validate move
    const isValid = (row: number, col: number, val: number) => {
        if (val === 0) return true;
        // Row
        for (let c = 0; c < GRID_SIZE; c++) {
            if (c !== col && grid[row][c].value === val) return false;
        }
        // Col
        for (let r = 0; r < GRID_SIZE; r++) {
            if (r !== row && grid[r][col].value === val) return false;
        }
        // Box
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        for (let r = boxRow; r < boxRow + 3; r++) {
            for (let c = boxCol; c < boxCol + 3; c++) {
                if ((r !== row || c !== col) && grid[r][c].value === val) return false;
            }
        }
        return true;
    };

    // Handle cell input
    const handleInput = (row: number, col: number, val: number) => {
        if (grid[row][col].fixed) return;
        if (val < 0 || val > 9) return;
        const newGrid = grid.map(r => r.map(cell => ({ ...cell })));
        newGrid[row][col].value = val;
        if (!isValid(row, col, val)) {
            setError('Invalid move!');
            setTimeout(() => setError(''), 1000);
            return;
        }
        setGrid(newGrid);
    };

    // Like puzzle
    const handleLike = async () => {
        try {
            await axios.post(`/api/sudoku/${id}/like`, {}, { headers: { Authorization: `Bearer ${token}` } });
            setLikeCount(likeCount + 1);
        } catch { }
    };

    // Comment on puzzle
    const handleComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) return;
        try {
            const res = await axios.post(
                `/api/sudoku/${id}/comment`,
                { content: comment },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setComments([res.data, ...comments]);
            setComment('');
        } catch { }
    };

    // Share URL
    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        alert('Puzzle URL copied!');
    };

    // Render Sudoku grid
    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-2">Sudoku Game</h1>
            <div className="mb-2 text-gray-600">Timer: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</div>
            {error && <div className="mb-2 text-red-500">{error}</div>}
            <div className="overflow-x-auto">
                <table className="border-collapse mx-auto">
                    <tbody>
                        {grid.map((row, rIdx) => (
                            <tr key={rIdx}>
                                {row.map((cell, cIdx) => {
                                    const isSelected = selected && selected[0] === rIdx && selected[1] === cIdx;
                                    const inRow = selected && selected[0] === rIdx;
                                    const inCol = selected && selected[1] === cIdx;
                                    const inBox = selected && getBoxIndex(selected[0], selected[1]) === getBoxIndex(rIdx, cIdx);
                                    return (
                                        <td
                                            key={cIdx}
                                            className={`w-10 h-10 border text-center align-middle cursor-pointer select-none
                        ${cell.fixed ? 'bg-gray-200 font-bold' : 'bg-white'}
                        ${isSelected ? 'bg-blue-200' : ''}
                        ${!isSelected && (inRow || inCol || inBox) ? 'bg-blue-50' : ''}
                        ${cIdx % 3 === 2 && cIdx !== 8 ? 'border-r-4 border-gray-400' : ''}
                        ${rIdx % 3 === 2 && rIdx !== 8 ? 'border-b-4 border-gray-400' : ''}
                      `}
                                            onClick={() => setSelected([rIdx, cIdx])}
                                        >
                                            {cell.fixed ? (
                                                cell.value || ''
                                            ) : (
                                                <input
                                                    type="number"
                                                    min={0}
                                                    max={9}
                                                    value={cell.value || ''}
                                                    onChange={e => handleInput(rIdx, cIdx, Number(e.target.value))}
                                                    className="w-8 h-8 text-center bg-transparent outline-none"
                                                />
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex gap-4 mt-4">
                <button onClick={handleLike} className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600">Like ({likeCount})</button>
                <button onClick={handleShare} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Share</button>
                <button
                    onClick={() => setTimerActive(!timerActive)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    {timerActive ? 'Pause' : 'Resume'} Timer
                </button>
            </div>
            <form onSubmit={handleComment} className="mt-6 flex gap-2">
                <input
                    type="text"
                    placeholder="Add a comment..."
                    className="flex-1 p-2 border rounded"
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                />
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Comment</button>
            </form>
            <div className="mt-4">
                <h2 className="font-semibold mb-2">Comments</h2>
                {comments.length === 0 ? (
                    <div className="text-gray-500">No comments yet.</div>
                ) : (
                    <ul className="space-y-2">
                        {comments.map((c, i) => (
                            <li key={i} className="bg-gray-100 p-2 rounded">
                                <span className="font-bold mr-2">{c.user}</span>
                                <span>{c.content}</span>
                                <span className="text-xs text-gray-400 ml-2">{new Date(c.createdAt).toLocaleString()}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default PuzzlePlayPage;
