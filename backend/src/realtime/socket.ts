import { Server as HttpServer } from 'http';
import { Socket, Server as SocketIOServer } from 'socket.io';

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

let io: SocketIOServer<ServerToClientEvents, ClientToServerEvents>;
const spectatorCounts: Record<string, number> = {};

export function initSocket(server: HttpServer) {
    io = new SocketIOServer(server, {
        cors: {
            origin: process.env.CLIENT_URL,
            credentials: true,
        },
    });

    io.on('connection', (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
        let currentPuzzle: string | null = null;
        // Join/leave puzzle rooms for targeted updates
        socket.on('joinPuzzle', ({ puzzleId }) => {
            socket.join(`puzzle:${puzzleId}`);
            currentPuzzle = puzzleId;
            spectatorCounts[puzzleId] = (spectatorCounts[puzzleId] || 0) + 1;
            io.to(`puzzle:${puzzleId}`).emit('spectatorCount', { puzzleId, count: spectatorCounts[puzzleId] });
        });
        socket.on('leavePuzzle', ({ puzzleId }) => {
            socket.leave(`puzzle:${puzzleId}`);
            if (spectatorCounts[puzzleId]) {
                spectatorCounts[puzzleId]--;
                io.to(`puzzle:${puzzleId}`).emit('spectatorCount', { puzzleId, count: spectatorCounts[puzzleId] });
            }
        });
        // Board updates for live solving
        socket.on('boardUpdate', ({ puzzleId, board }) => {
            socket.to(`puzzle:${puzzleId}`).emit('boardUpdate', { puzzleId, board, userId: socket.id });
        });
        // Chat messages
        socket.on('chat', ({ puzzleId, message }) => {
            const user = socket.handshake.auth?.user || 'Spectator';
            const timestamp = new Date().toISOString();
            io.to(`puzzle:${puzzleId}`).emit('chat', { puzzleId, user, message, timestamp });
        });
        socket.on('disconnect', () => {
            if (currentPuzzle && spectatorCounts[currentPuzzle]) {
                spectatorCounts[currentPuzzle]--;
                io.to(`puzzle:${currentPuzzle}`).emit('spectatorCount', { puzzleId: currentPuzzle, count: spectatorCounts[currentPuzzle] });
            }
        });
    });
}

export function emitComment(puzzleId: string, comment: any) {
    io.to(`puzzle:${puzzleId}`).emit('comment', { puzzleId, comment });
}

export function emitLike(puzzleId: string, userId: string) {
    io.to(`puzzle:${puzzleId}`).emit('like', { puzzleId, userId });
}
