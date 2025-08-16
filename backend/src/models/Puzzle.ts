import mongoose, { Document, Schema, Types } from 'mongoose';

// Puzzle document interface
export interface IPuzzle extends Document {
    owner: Types.ObjectId;
    grid: number[][];
    createdAt: Date;
    difficulty: string;
}

// Puzzle schema definition
const PuzzleSchema: Schema = new Schema<IPuzzle>({
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    grid: { type: [[Number]], required: true }, // 2D array for Sudoku grid
    createdAt: { type: Date, default: Date.now },
    difficulty: { type: String, required: true },
});

export default mongoose.model<IPuzzle>('Puzzle', PuzzleSchema);
