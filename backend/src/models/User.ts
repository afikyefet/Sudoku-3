import mongoose, { Document, Schema } from 'mongoose';

// User document interface
export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    followers: mongoose.Types.ObjectId[];
    following: mongoose.Types.ObjectId[];
}

// User schema definition
const UserSchema: Schema = new Schema<IUser>({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    followers: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }], // Users who follow this user
    following: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }], // Users this user follows
});

export default mongoose.model<IUser>('User', UserSchema);
