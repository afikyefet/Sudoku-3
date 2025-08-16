import mongoose, { Document, Schema, Types } from 'mongoose';

// Comment subdocument interface
interface IComment {
    user: Types.ObjectId;
    content: string;
    createdAt: Date;
}

// Sudoku document interface
export interface ISudoku extends Document {
    user: Types.ObjectId;
    title: string;
    puzzleData: number[][];
    isPublic: boolean;
    likes: Types.ObjectId[];
    comments: IComment[];
    createdAt: Date;
}

// Comment schema
const CommentSchema = new Schema<IComment>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

// Sudoku schema
const SudokuSchema = new Schema<ISudoku>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    puzzleData: { type: [[Number]], required: true },
    isPublic: { type: Boolean, default: false },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comments: [CommentSchema],
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ISudoku>('Sudoku', SudokuSchema);
