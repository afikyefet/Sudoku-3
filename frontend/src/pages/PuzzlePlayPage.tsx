import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Meta from '../components/Meta';
import { useAuth } from '../context/AuthContext';
import { connectSocket, getSocket } from '../realtime/socket';

const GRID_SIZE = 9;

type Cell = {
    value: number;
    fixed: boolean;
};

const getBoxIndex = (row: number, col: number) => {
    return Math.floor(row / 3) * 3 + Math.floor(col / 3);
};

const AUTO_SAVE_INTERVAL = 5000; // 5 seconds

const PuzzlePlayPage: React.FC = () => {
    const { id } = useParams();
    const { token, user } = useAuth();
    const [grid, setGrid] = useState<Cell[][]>([]);
    const [selected, setSelected] = useState<[number, number] | null>(null);
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(0);
    const [timerActive, setTimerActive] = useState(true);
    const [likeCount, setLikeCount] = useState(0);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState<{ user: string; content: string; createdAt: string }[]>([]);
    const [newComments, setNewComments] = useState(0);
    const [live, setLive] = useState(false);
    const [spectators, setSpectators] = useState(1);
    const [chat, setChat] = useState<{ user: string; message: string; timestamp: string }[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [viewingLive, setViewingLive] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const commentsEndRef = useRef<HTMLDivElement>(null);
    // Add state for drag selection
    const [dragging, setDragging] = useState(false);
    const [showChallenge, setShowChallenge] = useState(false);
    const [challengeLink, setChallengeLink] = useState<string | null>(null);
    const [leaderboard, setLeaderboard] = useState<any[]>([]);

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

    // Restore saved progress on mount
    useEffect(() => {
        if (!id || !user?._id) return;
        const saved = localStorage.getItem(`sudoku-progress-${user._id}-${id}`);
        if (saved) {
            try {
                const { grid: savedGrid, timer: savedTimer } = JSON.parse(saved);
                if (savedGrid) setGrid(savedGrid);
                if (typeof savedTimer === 'number') setTimer(savedTimer);
            } catch { }
        }
    }, [id, user?._id]);

    // Auto-save progress every 5s
    useEffect(() => {
        if (!id || !user?._id) return;
        const interval = setInterval(() => {
            localStorage.setItem(
                `sudoku-progress-${user._id}-${id}`,
                JSON.stringify({ grid, timer })
            );
        }, AUTO_SAVE_INTERVAL);
        return () => clearInterval(interval);
    }, [grid, timer, id, user?._id]);

    // Save on every input
    useEffect(() => {
        if (!id || !user?._id) return;
        localStorage.setItem(
            `sudoku-progress-${user._id}-${id}`,
            JSON.stringify({ grid, timer })
        );
    }, [grid, id, user?._id]);

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

    // Socket.IO real-time updates
    useEffect(() => {
        if (!token || !id) return;
        const socket = connectSocket(token, user?.username);
        socket.emit('joinPuzzle', { puzzleId: id });
        socket.on('comment', ({ puzzleId, comment }) => {
            if (puzzleId === id) {
                setComments(prev => [comment, ...prev]);
                if (commentsEndRef.current &&
                    commentsEndRef.current.getBoundingClientRect().bottom < window.innerHeight - 100) {
                    setNewComments(n => n + 1);
                }
            }
        });
        socket.on('like', ({ puzzleId }) => {
            if (puzzleId === id) setLikeCount(likeCount => likeCount + 1);
        });
        socket.on('boardUpdate', ({ puzzleId, board, userId }) => {
            if (puzzleId === id && !live) {
                // Only update if not the broadcaster
                setGrid(board.map(row => row.map(val => ({ value: val, fixed: val !== 0 }))));
                setViewingLive(true);
            }
        });
        socket.on('spectatorCount', ({ puzzleId, count }) => {
            if (puzzleId === id) setSpectators(count);
        });
        socket.on('chat', ({ puzzleId, user, message, timestamp }) => {
            if (puzzleId === id) setChat(prev => [...prev, { user, message, timestamp }]);
        });
        return () => {
            socket.emit('leavePuzzle', { puzzleId: id });
            socket.off('comment');
            socket.off('like');
            socket.off('boardUpdate');
            socket.off('spectatorCount');
            socket.off('chat');
        };
    }, [token, id, live, user?.username]);

    // Broadcast board state if live
    useEffect(() => {
        if (!live || !token || !id) return;
        const socket = getSocket();
        if (!socket) return;
        socket.emit('boardUpdate', { puzzleId: id, board: grid.map(row => row.map(cell => cell.value)) });
    }, [grid, live, token, id]);

    // Handle cell input
    const handleInput = (row: number, col: number, val: number) => {
        if (grid[row][col].fixed || viewingLive) return;
        if (val < 0 || val > 9) return;
        const newGrid = grid.map(r => r.map(cell => ({ ...cell })));
        newGrid[row][col].value = val;
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

    // Chat send
    const handleChat = (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim() || !id) return;
        const socket = getSocket();
        if (socket) {
            socket.emit('chat', { puzzleId: id, message: chatInput });
            setChatInput('');
        }
    };

    // Share URL
    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        alert('Puzzle URL copied!');
    };

    // Scroll to comments end
    const handleShowNewComments = () => {
        commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        setNewComments(0);
    };

    // Update handleInput and cell rendering for tap/drag
    const handleCellTouchStart = (row: number, col: number) => {
        setSelected([row, col]);
        setDragging(true);
    };
    const handleCellTouchMove = (e: React.TouchEvent<HTMLTableRowElement>, row: number) => {
        const touch = e.touches[0];
        const cell = document.elementFromPoint(touch.clientX, touch.clientY);
        if (cell && cell instanceof HTMLTableCellElement) {
            const cIdx = Array.from(cell.parentElement!.children).indexOf(cell);
            setSelected([row, cIdx]);
        }
    };
    const handleCellTouchEnd = () => {
        setDragging(false);
    };

    const handleChallenge = async () => {
        if (!id || !token) return;
        await axios.post(`/api/challenge/${id}/start`, {}, { headers: { Authorization: `Bearer ${token}` } });
        setChallengeLink(`${window.location.origin}/puzzle/${id}?challenge=1`);
        // Fetch leaderboard
        const res = await axios.get(`/api/challenge/${id}/leaderboard`);
        setLeaderboard(res.data);
        setShowChallenge(true);
    };

    return (
        <>
            <Meta
                title={puzzleTitle ? `${puzzleTitle} | Sudoku Live` : 'Sudoku Live'}
                description={puzzleOwner ? `Watch or solve this Sudoku puzzle by ${puzzleOwner}` : 'Play and watch Sudoku puzzles live!'}
                image={puzzleImageUrl || '/sudoku-preview.png'}
            />
            <div className="p-4 max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                    <h1 className="text-2xl font-bold mb-2">Sudoku Game {live && <span className="ml-2 text-green-500">● Live</span>}</h1>
                    <div className="mb-2 text-gray-600">Timer: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</div>
                    <div className="mb-2 text-gray-600">Spectators: {spectators}</div>
                    <button
                        aria-label="Go live or stop live"
                        onClick={() => { setLive(l => !l); setViewingLive(false); }}
                        className={`mb-4 px-4 py-2 rounded ${live ? 'bg-red-500 text-white' : 'bg-green-500 text-white'} mr-2`}
                    >
                        {live ? 'Stop Live' : 'Go Live'}
                    </button>
                    {viewingLive && <span className="ml-2 text-blue-500">Viewing live board</span>}
                    {error && <div className="mb-2 text-red-500">{error}</div>}
                    <div className="overflow-x-auto">
                        <table className="border-collapse mx-auto w-full max-w-xs sm:max-w-lg md:max-w-2xl">
                            <tbody>
                                {grid.map((row, rIdx) => (
                                    <tr
                                        key={rIdx}
                                        onTouchMove={e => dragging && handleCellTouchMove(e, rIdx)}
                                        onTouchEnd={handleCellTouchEnd}
                                    >
                                        {row.map((cell, cIdx) => {
                                            const isSelected = selected && selected[0] === rIdx && selected[1] === cIdx;
                                            const inRow = selected && selected[0] === rIdx;
                                            const inCol = selected && selected[1] === cIdx;
                                            const inBox = selected && getBoxIndex(selected[0], selected[1]) === getBoxIndex(rIdx, cIdx);
                                            return (
                                                <td
                                                    key={cIdx}
                                                    className={`w-12 h-12 sm:w-10 sm:h-10 border text-center align-middle cursor-pointer select-none
                          ${cell.fixed ? 'bg-gray-200 font-bold' : 'bg-white'}
                          ${isSelected ? 'bg-blue-200' : ''}
                          ${!isSelected && (inRow || inCol || inBox) ? 'bg-blue-50' : ''}
                          ${cIdx % 3 === 2 && cIdx !== 8 ? 'border-r-4 border-gray-400' : ''}
                          ${rIdx % 3 === 2 && rIdx !== 8 ? 'border-b-4 border-gray-400' : ''}
                        `}
                                                    onClick={() => setSelected([rIdx, cIdx])}
                                                    onTouchStart={() => handleCellTouchStart(rIdx, cIdx)}
                                                    aria-label={`Cell ${rIdx + 1}, ${cIdx + 1}`}
                                                >
                                                    {cell.fixed || viewingLive ? (
                                                        cell.value || ''
                                                    ) : (
                                                        <input
                                                            type="number"
                                                            min={0}
                                                            max={9}
                                                            inputMode="numeric"
                                                            pattern="[0-9]*"
                                                            value={cell.value || ''}
                                                            onChange={e => handleInput(rIdx, cIdx, Number(e.target.value))}
                                                            className="w-10 h-10 sm:w-8 sm:h-8 text-center bg-transparent outline-none"
                                                            aria-label={`Input for cell ${rIdx + 1}, ${cIdx + 1}`}
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
                        <button
                            aria-label="Like this puzzle"
                            onClick={handleLike}
                            className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
                        >
                            Like ({likeCount})
                        </button>
                        <button
                            aria-label="Share puzzle URL"
                            onClick={handleShare}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                            Share
                        </button>
                        <button
                            aria-label="Pause or resume timer"
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
                    {newComments > 0 && (
                        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded shadow cursor-pointer z-50" onClick={handleShowNewComments}>
                            💬 {newComments} new comment{newComments > 1 ? 's' : ''} - Show
                        </div>
                    )}
                    <div ref={commentsEndRef}></div>
                </div>
                {/* Chat sidebar */}
                <aside className="w-full md:w-80 bg-gray-50 dark:bg-gray-800 rounded-xl shadow p-4 flex flex-col h-[600px] max-h-[80vh]">
                    <div className="font-bold mb-2 text-gray-900 dark:text-gray-100">Live Chat</div>
                    <div className="flex-1 overflow-y-auto space-y-2 mb-2">
                        {chat.length === 0 ? (
                            <div className="text-gray-500">No chat yet.</div>
                        ) : (
                            chat.map((msg, i) => (
                                <div key={i} className="bg-gray-200 dark:bg-gray-700 p-2 rounded">
                                    <span className="font-bold mr-2">{msg.user}</span>
                                    <span>{msg.message}</span>
                                    <span className="text-xs text-gray-400 ml-2">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                                </div>
                            ))
                        )}
                    </div>
                    <form onSubmit={handleChat} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                            value={chatInput}
                            onChange={e => setChatInput(e.target.value)}
                        />
                        <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Send</button>
                    </form>
                </aside>
            </div>
            {!showChallenge && (
                <button
                    aria-label="Challenge friends"
                    onClick={handleChallenge}
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 mt-4"
                >
                    Challenge friends
                </button>
            )}
            {showChallenge && challengeLink && (
                <div className="mt-6 bg-purple-100 dark:bg-purple-900 p-4 rounded-xl">
                    <div className="mb-2 font-semibold">Share this challenge:</div>
                    <input
                        type="text"
                        value={challengeLink}
                        readOnly
                        className="w-full p-2 mb-2 border rounded bg-gray-50 dark:bg-gray-800"
                        aria-label="Challenge link"
                        onFocus={e => e.target.select()}
                    />
                    <button
                        aria-label="Copy challenge link"
                        onClick={() => { navigator.clipboard.writeText(challengeLink); }}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                        Copy Link
                    </button>
                    <div className="mt-4">
                        <div className="font-semibold mb-2">Leaderboard</div>
                        {leaderboard.length === 0 ? (
                            <div>No one has solved this challenge yet.</div>
                        ) : (
                            <ol className="list-decimal ml-6">
                                {leaderboard.map((entry, i) => (
                                    <li key={i}>{entry.username} - {entry.time}s</li>
                                ))}
                            </ol>
                        )}
                    </div>
                    {/* Open Graph meta for share */}
                    <Meta
                        title="Sudoku Challenge!"
                        description="Can you solve this puzzle faster than your friend? Join the leaderboard!"
                        image="/sudoku-preview.png"
                    />
                </div>
            )}
        </>
    );
};

export default PuzzlePlayPage;
