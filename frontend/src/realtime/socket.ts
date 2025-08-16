import { io, Socket } from 'socket.io-client';

export interface ServerToClientEvents {
    comment: { puzzleId: string; comment: any };
    like: { puzzleId: string; userId: string };
    boardUpdate: { puzzleId: string; board: number[][]; userId: string };
    spectatorCount: { puzzleId: string; count: number };
    chat: { puzzleId: string; user: string; message: string; timestamp: string };
}

export interface ClientToServerEvents {
    joinPuzzle: { puzzleId: string };
    leavePuzzle: { puzzleId: string };
    boardUpdate: { puzzleId: string; board: number[][] };
    chat: { puzzleId: string; message: string };
}

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

export function connectSocket(token: string, user?: string) {
    if (!socket) {
        socket = io(SOCKET_URL, {
            auth: { token, user },
            withCredentials: true,
        });
    }
    return socket;
}

export function getSocket() {
    return socket;
}
