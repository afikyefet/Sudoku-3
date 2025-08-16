import dotenv from 'dotenv';
dotenv.config();

function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) throw new Error(`Missing required env var: ${name}`);
    return value;
}

export const MONGODB_URI = requireEnv('MONGODB_URI');
export const JWT_SECRET = requireEnv('JWT_SECRET');
export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
export const CORS_ORIGINS = (process.env.CORS_ORIGINS || CLIENT_URL).split(',');
export const SOCKET_IO_URL = process.env.SOCKET_IO_URL || `http://localhost:${process.env.PORT || 5000}`;
export const PORT = parseInt(process.env.PORT || '5000', 10);
