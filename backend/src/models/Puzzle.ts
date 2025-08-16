import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IChallengeEntry {
    user: Types.ObjectId;
    time: number;
    date: Date;
}

// Puzzle document interface
export interface IPuzzle extends Document {
    owner: Types.ObjectId;
    grid: number[][];
    createdAt: Date;
    difficulty: string;
    isChallenge?: boolean;
    challengeLeaderboard?: IChallengeEntry[];
}

// Puzzle schema definition
const PuzzleSchema: Schema = new Schema<IPuzzle>({
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    grid: { type: [[Number]], required: true }, // 2D array for Sudoku grid
    createdAt: { type: Date, default: Date.now },
    difficulty: { type: String, required: true },
    isChallenge: { type: Boolean, default: false },
    challengeLeaderboard: [
        {
            user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
            time: { type: Number, required: true },
            date: { type: Date, default: Date.now },
        },
    ],
});

export default mongoose.model<IPuzzle>('Puzzle', PuzzleSchema);
